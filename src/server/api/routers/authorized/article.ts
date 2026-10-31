import { TRPCError } from "@trpc/server";
import {
  and,
  type Column,
  desc,
  eq,
  gte,
  ilike,
  inArray,
  isNull,
  sql,
} from "drizzle-orm";
import { z } from "zod";

import { pageSectionsSchema, stringifyPageSections } from "@/constants";
import {
  createPreviewToken,
  getPreviewPath,
  PREVIEW_TTL_SECONDS,
} from "@/lib/preview";
import { authorizedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { db } from "@/server/db";
import {
  article_comment_likes,
  article_comments,
  articles,
  events,
  users,
} from "@/server/db/schema";

type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

const deleteArticlesWithRelations = async (tx: Transaction, ids: number[]) => {
  await tx
    .delete(article_comment_likes)
    .where(
      inArray(
        article_comment_likes.articleCommentId,
        tx
          .select({ id: article_comments.id })
          .from(article_comments)
          .where(inArray(article_comments.articleId, ids)),
      ),
    );
  await tx
    .delete(article_comments)
    .where(inArray(article_comments.articleId, ids));
  await tx
    .delete(events)
    .where(
      and(eq(events.entityType, "article"), inArray(events.entityId, ids)),
    );
  await tx.delete(articles).where(inArray(articles.id, ids));
};

export const authorizedArticleRouter = createTRPCRouter({
  getSummaryStats: authorizedProcedure.query(async ({ ctx }) => {
    const formatDayKey = (value: Date) => {
      const year = value.getFullYear();
      const month = `${value.getMonth() + 1}`.padStart(2, "0");
      const day = `${value.getDate()}`.padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const now = new Date();
    const daysAgo = (days: number) =>
      new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    const ts = (value: Date) => sql`${value.toISOString()}::timestamptz`;
    const last24h = daysAgo(1);
    const last7d = daysAgo(7);
    const last30d = daysAgo(30);
    const last60d = daysAgo(60);

    const windowCounts = (column: Column) => ({
      last24h: sql<number>`CAST(COUNT(*) FILTER (WHERE ${column} >= ${ts(last24h)}) as int)`,
      last7d: sql<number>`CAST(COUNT(*) FILTER (WHERE ${column} >= ${ts(last7d)}) as int)`,
      last30d: sql<number>`CAST(COUNT(*) FILTER (WHERE ${column} >= ${ts(last30d)}) as int)`,
      prev30d: sql<number>`CAST(COUNT(*) FILTER (WHERE ${column} >= ${ts(last60d)} AND ${column} < ${ts(last30d)}) as int)`,
    });
    const emptyCounts = { last24h: 0, last7d: 0, last30d: 0, prev30d: 0 };
    const viewCount = sql<number>`CAST(COUNT(*) as int)`;
    const isEntityView = and(
      eq(events.type, "view"),
      eq(events.entityType, "article"),
    );

    const [
      [content],
      [viewTotals],
      [commentTotals],
      viewsByDay,
      commentsByDay,
      topViewed,
      recentComments,
    ] = await Promise.all([
      ctx.db
        .select({
          total: sql<number>`CAST(COUNT(*) as int)`,
          published: sql<number>`CAST(COUNT(*) FILTER (WHERE ${articles.publishedAt} IS NOT NULL) as int)`,
        })
        .from(articles),
      ctx.db
        .select(windowCounts(events.createdAt))
        .from(events)
        .where(and(isEntityView, gte(events.createdAt, last60d))),
      ctx.db
        .select(windowCounts(article_comments.createdAt))
        .from(article_comments)
        .where(gte(article_comments.createdAt, last60d)),
      ctx.db
        .select({
          day: sql<string>`TO_CHAR(${events.createdAt}, 'YYYY-MM-DD')`,
          count: sql<number>`CAST(COUNT(*) as int)`,
        })
        .from(events)
        .where(and(isEntityView, gte(events.createdAt, last30d)))
        .groupBy(sql`TO_CHAR(${events.createdAt}, 'YYYY-MM-DD')`),
      ctx.db
        .select({
          day: sql<string>`TO_CHAR(${article_comments.createdAt}, 'YYYY-MM-DD')`,
          count: sql<number>`CAST(COUNT(*) as int)`,
        })
        .from(article_comments)
        .where(gte(article_comments.createdAt, last30d))
        .groupBy(sql`TO_CHAR(${article_comments.createdAt}, 'YYYY-MM-DD')`),
      ctx.db
        .select({
          id: articles.id,
          title: articles.title,
          slug: articles.slug,
          views: viewCount,
        })
        .from(events)
        .innerJoin(articles, eq(events.entityId, articles.id))
        .where(and(isEntityView, gte(events.createdAt, last30d)))
        .groupBy(articles.id)
        .orderBy(desc(viewCount))
        .limit(5),
      ctx.db
        .select({
          id: article_comments.id,
          text: article_comments.text,
          createdAt: article_comments.createdAt,
          article: {
            id: articles.id,
            title: articles.title,
            slug: articles.slug,
          },
          user: { name: users.name },
        })
        .from(article_comments)
        .innerJoin(articles, eq(article_comments.articleId, articles.id))
        .leftJoin(users, eq(article_comments.userId, users.id))
        .orderBy(desc(article_comments.createdAt))
        .limit(6),
    ]);

    const viewsMap = new Map(viewsByDay.map((e) => [e.day, e.count]));
    const commentsMap = new Map(commentsByDay.map((e) => [e.day, e.count]));

    const trend = Array.from({ length: 30 }, (_, idx) => {
      const day = new Date(now);
      day.setDate(now.getDate() - (29 - idx));
      const key = formatDayKey(day);
      return {
        day: key,
        views: viewsMap.get(key) ?? 0,
        comments: commentsMap.get(key) ?? 0,
      };
    });

    const total = content?.total ?? 0;
    const published = content?.published ?? 0;

    return {
      content: { total, published, drafts: total - published },
      totals: {
        views: viewTotals ?? emptyCounts,
        comments: commentTotals ?? emptyCounts,
      },
      trend,
      topViewed,
      recentComments,
    };
  }),

  getArticles: authorizedProcedure.query(({ ctx }) => {
    return ctx.db.query.articles.findMany({
      orderBy: (articles, { desc }) => [desc(articles.createdAt)],
    });
  }),

  getPreviewLink: authorizedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const item = await ctx.db.query.articles.findFirst({
        columns: { slug: true },
        where: eq(articles.id, input.id),
      });

      if (!item) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Article not found",
        });
      }

      const token = createPreviewToken({ type: "article", id: input.id });

      return {
        url: getPreviewPath("article", item.slug, token),
        expiresAt: new Date(Date.now() + PREVIEW_TTL_SECONDS * 1000),
      };
    }),

  getArticle: authorizedProcedure
    .input(z.string())
    .query(({ ctx, input: articleSlug }) => {
      return ctx.db.query.articles.findFirst({
        orderBy: (articles, { desc }) => [desc(articles.createdAt)],
        where: ilike(articles.slug, articleSlug),
      });
    }),

  getArticleById: authorizedProcedure
    .input(z.number().positive())
    .query(({ ctx, input: articleId }) => {
      return ctx.db.query.articles.findFirst({
        where: eq(articles.id, articleId),
      });
    }),

  addArticle: authorizedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        image: z.string(),
        slug: z.string().min(1),
        description: z.string().min(1),
        sections: pageSectionsSchema,
        published: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [inserted] = await ctx.db
        .insert(articles)
        .values({
          title: input.title,
          image: input.image,
          slug: input.slug,
          description: input.description,
          content: stringifyPageSections(input.sections),
          publishedAt: input.published ? new Date() : null,
        })
        .returning({ id: articles.id });

      return { id: inserted?.id };
    }),

  editArticle: authorizedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1),
        image: z.string(),
        slug: z.string().min(1),
        description: z.string().min(1),
        sections: pageSectionsSchema,
        published: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(articles)
        .set({
          title: input.title,
          image: input.image,
          slug: input.slug,
          description: input.description,
          content: stringifyPageSections(input.sections),
          publishedAt: input.published ? new Date() : null,
        })
        .where(eq(articles.id, input.id));
    }),

  publishArticle: authorizedProcedure
    .input(z.number().positive())
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(articles)
        .set({
          publishedAt: new Date(),
        })
        .where(eq(articles.id, input));
    }),

  unpublishArticle: authorizedProcedure
    .input(z.number().positive())
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(articles)
        .set({
          publishedAt: null,
        })
        .where(eq(articles.id, input));
    }),

  deleteArticle: authorizedProcedure
    .input(z.number().positive())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction((tx) =>
        deleteArticlesWithRelations(tx, [input]),
      );
    }),

  bulkSetPublished: authorizedProcedure
    .input(
      z.object({
        ids: z.number().positive().array().min(1),
        published: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(articles)
        .set({ publishedAt: input.published ? new Date() : null })
        .where(
          and(
            inArray(articles.id, input.ids),
            input.published ? isNull(articles.publishedAt) : undefined,
          ),
        );
    }),

  bulkDelete: authorizedProcedure
    .input(z.object({ ids: z.number().positive().array().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction((tx) =>
        deleteArticlesWithRelations(tx, input.ids),
      );
    }),
});
