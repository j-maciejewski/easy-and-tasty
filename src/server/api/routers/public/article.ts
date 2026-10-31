import {
  and,
  count,
  desc,
  eq,
  gt,
  ilike,
  inArray,
  isNotNull,
  lt,
} from "drizzle-orm";
import { z } from "zod";

import { verifyPreviewToken } from "@/lib/preview";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { articles } from "@/server/db/schema";

export const publicArticleRouter = createTRPCRouter({
  getArticle: publicProcedure
    .input(z.string())
    .query(({ ctx, input: articleSlug }) => {
      return ctx.db.query.articles.findFirst({
        orderBy: (articles, { desc }) => [desc(articles.createdAt)],
        where: and(
          ilike(articles.slug, articleSlug),
          isNotNull(articles.publishedAt),
        ),
      });
    }),

  getArticlePreview: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input: token }) => {
      const preview = verifyPreviewToken(token);

      if (preview?.type !== "article") return null;

      return (
        (await ctx.db.query.articles.findFirst({
          where: eq(articles.id, preview.id),
        })) ?? null
      );
    }),

  getArticles: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.articles.findMany({
      orderBy: (articles, { desc }) => [desc(articles.createdAt)],
      where: isNotNull(articles.publishedAt),
    });
  }),

  getArticlesSlugs: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.articles.findMany({
      columns: {
        slug: true,
      },
      where: isNotNull(articles.publishedAt),
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

        return ctx.db.query.articles.findMany({
          where: and(
            isNotNull(articles.publishedAt),
            inArray(articles.id, input.articleIds),
          ),
          orderBy: [desc(articles.createdAt)],
          limit: input.limit,
        });
      }

      return ctx.db.query.articles.findMany({
        where: isNotNull(articles.publishedAt),
        orderBy: [desc(articles.createdAt)],
        limit: input.limit,
      });
    }),

  getTotalArticlesCount: publicProcedure.query(async ({ ctx }) => {
    return (
      (
        await ctx.db
          .select({
            count: count(),
          })
          .from(articles)
          .where(isNotNull(articles.publishedAt))
      )[0]?.count ?? 0
    );
  }),

  getInfiniteArticles: publicProcedure
    .input(
      z.object({
        limit: z.number().default(12),
        cursor: z.string().optional(),
        sortBy: z.enum(["title", "createdAt"]).default("createdAt"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const query = ctx.db.query.articles.findMany({
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
          isNotNull(articles.publishedAt),
          input.cursor
            ? input.sortBy === "createdAt"
              ? lt(articles[input.sortBy], new Date(input.cursor))
              : input.sortBy === "title"
                ? gt(articles.title, input.cursor)
                : undefined
            : undefined,
        ),
        orderBy:
          input.sortBy === "createdAt"
            ? (articles, { desc }) => [desc(articles.createdAt)]
            : (articles, { asc }) => [asc(articles.title)],
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
        articles: results,
        nextCursor,
      };
    }),
});
