import {
  and,
  count,
  desc,
  eq,
  gt,
  gte,
  ilike,
  inArray,
  isNotNull,
  lt,
  sql,
} from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { article_views, articles } from "@/server/db/schema";

export const publicArticleRouter = createTRPCRouter({
  addArticleView: publicProcedure
    .input(
      z.object({
        articleId: z.number().positive(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const dedupeWindowMinutes = 30;
      const dedupeSince = new Date(
        Date.now() - dedupeWindowMinutes * 60 * 1000,
      );

      const ipAddress =
        ctx.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        ctx.headers.get("x-real-ip")?.trim() ??
        null;
      const userAgent = ctx.headers.get("user-agent") ?? null;

      const recentView = await ctx.db
        .select({ id: article_views.id })
        .from(article_views)
        .where(
          and(
            eq(article_views.articleId, input.articleId),
            gte(article_views.viewedAt, dedupeSince),
            sql`${article_views.ipAddress} IS NOT DISTINCT FROM ${ipAddress}`,
            sql`${article_views.userAgent} IS NOT DISTINCT FROM ${userAgent}`,
          ),
        )
        .limit(1);

      if (recentView.length > 0) {
        return;
      }

      await ctx.db.insert(article_views).values({
        articleId: input.articleId,
        ipAddress,
        userAgent,
      });
    }),

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
