import { UTApi } from "uploadthing/server";
import { z } from "zod";

import { env } from "@/env";
import { authorizedProcedure, createTRPCRouter } from "@/server/api/trpc";
import type { db as database } from "@/server/db";
import { articles, config, recipes, seo as seoTable } from "@/server/db/schema";

const LIST_FILES_PAGE_SIZE = 500;

type MediaUsage =
  | { type: "recipe" | "article"; id: number; title: string }
  | { type: "seo" | "config"; id: string; title: string };

const getAppId = () => {
  try {
    const { appId } = JSON.parse(
      Buffer.from(
        env.UPLOADTHING_TOKEN.replace(/^['"]|['"]$/g, ""),
        "base64",
      ).toString("utf8"),
    ) as { appId?: string };

    return appId ?? null;
  } catch {
    return null;
  }
};

const getFileUrl = (key: string, appId: string | null) =>
  appId ? `https://${appId}.ufs.sh/f/${key}` : `https://utfs.io/f/${key}`;

const listAllFiles = async (utapi: UTApi) => {
  const files: Awaited<ReturnType<UTApi["listFiles"]>>["files"][number][] = [];

  for (let offset = 0; ; offset += LIST_FILES_PAGE_SIZE) {
    const response = await utapi.listFiles({
      limit: LIST_FILES_PAGE_SIZE,
      offset,
    });

    files.push(...response.files);

    if (!response.hasMore || response.files.length === 0) break;
  }

  return files.filter(({ status }) => status === "Uploaded");
};

const getUsageSources = async (db: typeof database) => {
  const [recipeRows, articleRows, seoRows, configRows] = await Promise.all([
    db
      .select({
        id: recipes.id,
        title: recipes.title,
        image: recipes.image,
        content: recipes.content,
      })
      .from(recipes),
    db
      .select({
        id: articles.id,
        title: articles.title,
        image: articles.image,
        content: articles.content,
      })
      .from(articles),
    db
      .select({ pageType: seoTable.pageType, image: seoTable.image })
      .from(seoTable),
    db
      .select({ configType: config.configType, data: config.data })
      .from(config),
  ]);

  const sources: { usage: MediaUsage; text: string }[] = [
    ...recipeRows.map(({ id, title, image, content }) => ({
      usage: { type: "recipe" as const, id, title },
      text: `${image}\n${content}`,
    })),
    ...articleRows.map(({ id, title, image, content }) => ({
      usage: { type: "article" as const, id, title },
      text: `${image ?? ""}\n${content}`,
    })),
    ...seoRows.map(({ pageType, image }) => ({
      usage: {
        type: "seo" as const,
        id: pageType,
        title: `SEO: ${pageType} page`,
      },
      text: image ?? "",
    })),
    ...configRows.map(({ configType, data }) => ({
      usage: {
        type: "config" as const,
        id: configType,
        title: configType === "home_page" ? "Home page sections" : "Navigation",
      },
      text: JSON.stringify(data),
    })),
  ].filter(({ text }) => text.trim());

  const haystack = sources.map(({ text }) => text).join("\n");

  return (key: string): MediaUsage[] =>
    haystack.includes(key)
      ? sources
          .filter(({ text }) => text.includes(key))
          .map(({ usage }) => usage)
      : [];
};

const deleteMediaInput = z.union([
  z.object({ keys: z.array(z.string().min(1)).min(1) }),
  z.object({ allUnused: z.literal(true) }),
]);

export const authorizedMediaRouter = createTRPCRouter({
  getMedia: authorizedProcedure
    .input(
      z.object({
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(500).default(20),
        filter: z.enum(["all", "used", "unused"]).default("all"),
        query: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input: { page, limit, filter, query } }) => {
      const utapi = new UTApi();
      const [files, findUsages] = await Promise.all([
        listAllFiles(utapi),
        getUsageSources(ctx.db),
      ]);
      const appId = getAppId();

      const media = files
        .map(({ key, name, size, uploadedAt }) => ({
          key,
          name,
          size,
          uploadedAt: new Date(uploadedAt),
          url: getFileUrl(key, appId),
          usages: findUsages(key),
        }))
        .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());

      const usedCount = media.filter(({ usages }) => usages.length).length;
      const normalizedQuery = query?.trim().toLowerCase();

      const filtered = media.filter(
        ({ name, usages }) =>
          (!normalizedQuery || name.toLowerCase().includes(normalizedQuery)) &&
          (filter === "all" || (filter === "used") === usages.length > 0),
      );

      return {
        items: filtered.slice((page - 1) * limit, page * limit),
        total: filtered.length,
        counts: {
          all: media.length,
          used: usedCount,
          unused: media.length - usedCount,
        },
      };
    }),

  deleteMedia: authorizedProcedure
    .input(deleteMediaInput)
    .mutation(async ({ ctx, input }) => {
      const utapi = new UTApi();
      const [files, findUsages] = await Promise.all([
        listAllFiles(utapi),
        getUsageSources(ctx.db),
      ]);

      const existingKeys = new Set(files.map(({ key }) => key));
      const requestedKeys =
        "keys" in input
          ? [...new Set(input.keys)]
          : files.map(({ key }) => key);

      const deletableKeys = requestedKeys.filter(
        (key) => existingKeys.has(key) && findUsages(key).length === 0,
      );
      const skipped =
        "keys" in input ? requestedKeys.length - deletableKeys.length : 0;

      if (!deletableKeys.length) return { deleted: 0, skipped };

      const { deletedCount } = await utapi.deleteFiles(deletableKeys);

      return {
        deleted: deletedCount,
        skipped: skipped + deletableKeys.length - deletedCount,
      };
    }),
});
