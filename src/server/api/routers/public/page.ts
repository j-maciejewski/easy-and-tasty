import {
  and,
  count,
  desc,
  gt,
  ilike,
  inArray,
  isNotNull,
  lt,
} from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { pages } from "@/server/db/schema";

export const publicPageRouter = createTRPCRouter({
  getPage: publicProcedure
    .input(z.string())
    .query(({ ctx, input: pageSlug }) => {
      return ctx.db.query.pages.findFirst({
        orderBy: (pages, { desc }) => [desc(pages.createdAt)],
        where: and(ilike(pages.slug, pageSlug), isNotNull(pages.publishedAt)),
      });
    }),

  getPages: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.pages.findMany({
      orderBy: (pages, { desc }) => [desc(pages.createdAt)],
      where: isNotNull(pages.publishedAt),
    });
  }),

  getPagesSlugs: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.pages.findMany({
      columns: {
        slug: true,
      },
      where: isNotNull(pages.publishedAt),
    });
  }),

  getArticlesForSection: publicProcedure
    .input(
      z.object({
        mode: z.enum(["most_recent", "specific"]).default("most_recent"),
        articleIds: z.array(z.number().int().positive()).default([]),
        limit: z.number().int().min(1).max(24).default(6),
      }),
    )
    .query(({ ctx, input }) => {
      if (input.mode === "specific") {
        if (!input.articleIds.length) {
          return [];
        }

        return ctx.db.query.pages.findMany({
          where: and(
            isNotNull(pages.publishedAt),
            inArray(pages.id, input.articleIds),
          ),
          orderBy: [desc(pages.createdAt)],
          limit: input.limit,
        });
      }

      return ctx.db.query.pages.findMany({
        where: isNotNull(pages.publishedAt),
        orderBy: [desc(pages.createdAt)],
        limit: input.limit,
      });
    }),

  getTotalPagesCount: publicProcedure.query(async ({ ctx }) => {
    return (
      (
        await ctx.db
          .select({
            count: count(),
          })
          .from(pages)
          .where(isNotNull(pages.publishedAt))
      )[0]?.count ?? 0
    );
  }),

  getInfinitePages: publicProcedure
    .input(
      z.object({
        limit: z.number().default(12),
        cursor: z.string().optional(),
        sortBy: z.enum(["title", "createdAt"]).default("createdAt"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const query = ctx.db.query.pages.findMany({
        columns: {
          id: true,
          title: true,
          description: true,
          image: true,
          slug: true,
          createdAt: true,
          publishedAt: true,
        },
        where: and(
          isNotNull(pages.publishedAt),
          input.cursor
            ? input.sortBy === "createdAt"
              ? lt(pages[input.sortBy], new Date(input.cursor))
              : input.sortBy === "title"
                ? gt(pages.title, input.cursor)
                : undefined
            : undefined,
        ),
        orderBy:
          input.sortBy === "createdAt"
            ? (pages, { desc }) => [desc(pages.createdAt)]
            : (pages, { asc }) => [asc(pages.title)],
        limit: input.limit,
      });

      const results = await query;

      const lastResult =
        results.length > 0
          ? (results[results.length - 1] as (typeof results)[number])
          : null;

      const nextCursor = lastResult
        ? input.sortBy === "createdAt"
          ? (lastResult.createdAt?.toISOString() ?? null)
          : lastResult.title
        : null;

      return {
        pages: results,
        nextCursor,
      };
    }),
});
