import { desc, eq, gte, ilike, sql } from "drizzle-orm";
import { z } from "zod";

import { pageSectionsSchema, stringifyPageSections } from "@/constants";
import { authorizedProcedure, createTRPCRouter } from "@/server/api/trpc";
import {
  article_comments,
  article_views,
  articles,
  users,
} from "@/server/db/schema";

export const authorizedArticleRouter = createTRPCRouter({
  getSummaryStats: authorizedProcedure.query(async ({ ctx }) => {
    const formatDayKey = (value: Date) => {
      const year = value.getFullYear();
      const month = `${value.getMonth() + 1}`.padStart(2, "0");
      const day = `${value.getDate()}`.padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [views24h, views7d, views30d] = await Promise.all([
      ctx.db
        .select({ count: sql<number>`CAST(COUNT(*) as int)` })
        .from(article_views)
        .where(gte(article_views.viewedAt, last24h)),
      ctx.db
        .select({ count: sql<number>`CAST(COUNT(*) as int)` })
        .from(article_views)
        .where(gte(article_views.viewedAt, last7d)),
      ctx.db
        .select({ count: sql<number>`CAST(COUNT(*) as int)` })
        .from(article_views)
        .where(gte(article_views.viewedAt, last30d)),
    ]);

    const [articleComments24h, articleComments7d, articleComments30d] =
      await Promise.all([
        ctx.db
          .select({ count: sql<number>`CAST(COUNT(*) as int)` })
          .from(article_comments)
          .where(gte(article_comments.createdAt, last24h)),
        ctx.db
          .select({ count: sql<number>`CAST(COUNT(*) as int)` })
          .from(article_comments)
          .where(gte(article_comments.createdAt, last7d)),
        ctx.db
          .select({ count: sql<number>`CAST(COUNT(*) as int)` })
          .from(article_comments)
          .where(gte(article_comments.createdAt, last30d)),
      ]);

    const [viewsByDay, commentsByDay] = await Promise.all([
      ctx.db
        .select({
          day: sql<string>`TO_CHAR(${article_views.viewedAt}, 'YYYY-MM-DD')`,
          count: sql<number>`CAST(COUNT(*) as int)`,
        })
        .from(article_views)
        .where(gte(article_views.viewedAt, last30d))
        .groupBy(sql`TO_CHAR(${article_views.viewedAt}, 'YYYY-MM-DD')`)
        .orderBy(sql`TO_CHAR(${article_views.viewedAt}, 'YYYY-MM-DD') ASC`),
      ctx.db
        .select({
          day: sql<string>`TO_CHAR(${article_comments.createdAt}, 'YYYY-MM-DD')`,
          count: sql<number>`CAST(COUNT(*) as int)`,
        })
        .from(article_comments)
        .where(gte(article_comments.createdAt, last30d))
        .groupBy(sql`TO_CHAR(${article_comments.createdAt}, 'YYYY-MM-DD')`)
        .orderBy(sql`TO_CHAR(${article_comments.createdAt}, 'YYYY-MM-DD') ASC`),
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

    const [recentViews, recentComments] = await Promise.all([
      ctx.db
        .select({
          id: article_views.id,
          viewedAt: article_views.viewedAt,
          ipAddress: article_views.ipAddress,
          article: {
            id: articles.id,
            title: articles.title,
            slug: articles.slug,
          },
          user: {
            id: users.id,
            name: users.name,
            email: users.email,
          },
        })
        .from(article_views)
        .innerJoin(articles, eq(article_views.articleId, articles.id))
        .leftJoin(users, eq(article_views.userId, users.id))
        .orderBy(desc(article_views.viewedAt))
        .limit(8),
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
          user: {
            id: users.id,
            name: users.name,
            email: users.email,
          },
        })
        .from(article_comments)
        .innerJoin(articles, eq(article_comments.articleId, articles.id))
        .leftJoin(users, eq(article_comments.userId, users.id))
        .orderBy(desc(article_comments.createdAt))
        .limit(8),
    ]);

    return {
      totals: {
        views: {
          last24h: views24h[0]?.count ?? 0,
          last7d: views7d[0]?.count ?? 0,
          last30d: views30d[0]?.count ?? 0,
        },
        comments: {
          last24h: articleComments24h[0]?.count ?? 0,
          last7d: articleComments7d[0]?.count ?? 0,
          last30d: articleComments30d[0]?.count ?? 0,
        },
      },
      trend,
      recentViews,
      recentComments,
    };
  }),

  getArticles: authorizedProcedure.query(({ ctx }) => {
    return ctx.db.query.articles.findMany({
      orderBy: (articles, { desc }) => [desc(articles.createdAt)],
    });
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
      await ctx.db.insert(articles).values({
        title: input.title,
        image: input.image,
        slug: input.slug,
        description: input.description,
        content: stringifyPageSections(input.sections),
        publishedAt: input.published ? new Date() : null,
      });
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
      await ctx.db.delete(articles).where(eq(articles.id, input));
    }),
});
