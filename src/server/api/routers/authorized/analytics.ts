import { TRPCError } from "@trpc/server";
import { and, desc, eq, gte, inArray, isNotNull, sql } from "drizzle-orm";
import { z } from "zod";

import { authorizedProcedure, createTRPCRouter } from "@/server/api/trpc";
import type { db as database } from "@/server/db";
import {
  article_comments,
  articles,
  categories,
  comments,
  cuisines,
  events,
  recipe_bookmarks,
  recipe_categories,
  recipe_cuisines,
  recipe_ratings,
  recipes,
} from "@/server/db/schema";

const entityTypeSchema = z.enum(["recipe", "article"]);

type EntityType = z.infer<typeof entityTypeSchema>;

const daysAgo = (days: number) =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000);
const ts = (value: Date) => sql`${value.toISOString()}::timestamptz`;
const countAll = sql<number>`CAST(COUNT(*) as int)`;
const countType = (type: (typeof events.type.enumValues)[number]) =>
  sql<number>`CAST(COUNT(*) FILTER (WHERE ${events.type} = ${type}) as int)`;

const eventTotals = {
  views: countType("view"),
  engaged: countType("engaged"),
  prints: countType("print"),
  shares: countType("share"),
  copies: countType("copy"),
};

const emptyEventTotals = {
  views: 0,
  engaged: 0,
  prints: 0,
  shares: 0,
  copies: 0,
};

const sourceLabel = sql<string>`COALESCE(${events.source}, 'Direct')`;

const getEntityTitles = async (
  db: typeof database,
  entityType: EntityType,
  ids: number[],
) => {
  if (!ids.length) return new Map<number, { title: string; slug: string }>();

  const rows =
    entityType === "recipe"
      ? await db
          .select({ id: recipes.id, title: recipes.title, slug: recipes.slug })
          .from(recipes)
          .where(inArray(recipes.id, ids))
      : await db
          .select({
            id: articles.id,
            title: articles.title,
            slug: articles.slug,
          })
          .from(articles)
          .where(inArray(articles.id, ids));

  return new Map(rows.map(({ id, ...rest }) => [id, rest]));
};

const getEntityPath = (entityType: EntityType, slug: string) =>
  entityType === "recipe" ? `/recipe/${slug}` : `/${slug}`;

const csvCell = (value: string | number) => {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

export const authorizedAnalyticsRouter = createTRPCRouter({
  getInsights: authorizedProcedure
    .input(z.object({ entityType: entityTypeSchema }))
    .query(async ({ ctx, input }) => {
      const { entityType } = input;
      const last7d = daysAgo(7);
      const last14d = daysAgo(14);
      const last30d = daysAgo(30);
      const isEntity = eq(events.entityType, entityType);
      const isRecent = gte(events.createdAt, last30d);
      const isView = and(eq(events.type, "view"), isEntity);
      const lastWeekViews = sql<number>`CAST(COUNT(*) FILTER (WHERE ${events.createdAt} >= ${ts(last7d)}) as int)`;
      const prevWeekViews = sql<number>`CAST(COUNT(*) FILTER (WHERE ${events.createdAt} < ${ts(last7d)}) as int)`;

      const [
        [totals],
        sources,
        trendingRows,
        [commentTotals],
        [bookmarkTotals],
        categoryViews,
        cuisineViews,
        topSearches,
        zeroResultSearches,
      ] = await Promise.all([
        ctx.db.select(eventTotals).from(events).where(and(isEntity, isRecent)),
        ctx.db
          .select({ source: sourceLabel, views: countAll })
          .from(events)
          .where(and(isView, isRecent))
          .groupBy(sourceLabel)
          .orderBy(desc(countAll))
          .limit(8),
        ctx.db
          .select({
            id: sql<number>`${events.entityId}`,
            views: lastWeekViews,
            previous: prevWeekViews,
          })
          .from(events)
          .where(and(isView, gte(events.createdAt, last14d)))
          .groupBy(events.entityId)
          .having(sql`${lastWeekViews} > ${prevWeekViews}`)
          .orderBy(desc(sql`${lastWeekViews} - ${prevWeekViews}`))
          .limit(5),
        entityType === "recipe"
          ? ctx.db
              .select({ count: countAll })
              .from(comments)
              .where(gte(comments.createdAt, last30d))
          : ctx.db
              .select({ count: countAll })
              .from(article_comments)
              .where(gte(article_comments.createdAt, last30d)),
        entityType === "recipe"
          ? ctx.db
              .select({ count: countAll })
              .from(recipe_bookmarks)
              .where(gte(recipe_bookmarks.createdAt, last30d))
          : Promise.resolve([{ count: 0 }]),
        entityType === "recipe"
          ? ctx.db
              .select({ name: categories.name, views: countAll })
              .from(events)
              .innerJoin(
                recipe_categories,
                eq(recipe_categories.recipeId, events.entityId),
              )
              .innerJoin(
                categories,
                eq(categories.id, recipe_categories.categoryId),
              )
              .where(and(isView, isRecent))
              .groupBy(categories.id)
              .orderBy(desc(countAll))
              .limit(8)
          : Promise.resolve([]),
        entityType === "recipe"
          ? ctx.db
              .select({ name: cuisines.name, views: countAll })
              .from(events)
              .innerJoin(
                recipe_cuisines,
                eq(recipe_cuisines.recipeId, events.entityId),
              )
              .innerJoin(cuisines, eq(cuisines.id, recipe_cuisines.cuisineId))
              .where(and(isView, isRecent))
              .groupBy(cuisines.id)
              .orderBy(desc(countAll))
              .limit(8)
          : Promise.resolve([]),
        entityType === "recipe"
          ? ctx.db
              .select({
                term: sql<string>`${events.meta}->>'term'`,
                count: countAll,
              })
              .from(events)
              .where(and(eq(events.type, "search"), isRecent))
              .groupBy(sql`${events.meta}->>'term'`)
              .orderBy(desc(countAll))
              .limit(8)
          : Promise.resolve([]),
        entityType === "recipe"
          ? ctx.db
              .select({
                term: sql<string>`${events.meta}->>'term'`,
                count: countAll,
              })
              .from(events)
              .where(
                and(
                  eq(events.type, "search"),
                  isRecent,
                  sql`(${events.meta}->>'resultCount')::int = 0`,
                ),
              )
              .groupBy(sql`${events.meta}->>'term'`)
              .orderBy(desc(countAll))
              .limit(8)
          : Promise.resolve([]),
      ]);

      const titles = await getEntityTitles(
        ctx.db,
        entityType,
        trendingRows.map((row) => row.id),
      );

      return {
        funnel: totals ?? emptyEventTotals,
        conversions: {
          comments: commentTotals?.count ?? 0,
          bookmarks: bookmarkTotals?.count ?? 0,
        },
        sources,
        trending: trendingRows.flatMap((row) => {
          const entity = titles.get(row.id);
          return entity
            ? [
                {
                  ...row,
                  title: entity.title,
                  href: getEntityPath(entityType, entity.slug),
                },
              ]
            : [];
        }),
        categoryViews,
        cuisineViews,
        topSearches,
        zeroResultSearches,
      };
    }),

  getEntityStats: authorizedProcedure
    .input(
      z.object({
        entityType: entityTypeSchema,
        id: z.number().int().positive(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { entityType, id } = input;
      const entity = (await getEntityTitles(ctx.db, entityType, [id])).get(id);

      if (!entity) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Not found" });
      }

      const last30d = daysAgo(30);
      const isThisEntity = and(
        eq(events.entityType, entityType),
        eq(events.entityId, id),
      );
      const isRecent = gte(events.createdAt, last30d);
      const day = sql<string>`TO_CHAR(${events.createdAt}, 'YYYY-MM-DD')`;
      const shareChannel = sql<string>`${events.meta}->>'channel'`;

      const [
        [allTime],
        [recent],
        byDay,
        sources,
        shareChannels,
        [bookmarkTotals],
        [ratingTotals],
        [commentTotals],
      ] = await Promise.all([
        ctx.db.select(eventTotals).from(events).where(isThisEntity),
        ctx.db
          .select(eventTotals)
          .from(events)
          .where(and(isThisEntity, isRecent)),
        ctx.db
          .select({
            day,
            views: countType("view"),
            engaged: countType("engaged"),
          })
          .from(events)
          .where(and(isThisEntity, isRecent))
          .groupBy(day),
        ctx.db
          .select({ source: sourceLabel, views: countAll })
          .from(events)
          .where(and(isThisEntity, isRecent, eq(events.type, "view")))
          .groupBy(sourceLabel)
          .orderBy(desc(countAll))
          .limit(8),
        ctx.db
          .select({ channel: shareChannel, count: countAll })
          .from(events)
          .where(and(isThisEntity, isRecent, eq(events.type, "share")))
          .groupBy(shareChannel)
          .orderBy(desc(countAll)),
        entityType === "recipe"
          ? ctx.db
              .select({ count: countAll })
              .from(recipe_bookmarks)
              .where(eq(recipe_bookmarks.recipeId, id))
          : Promise.resolve([{ count: 0 }]),
        entityType === "recipe"
          ? ctx.db
              .select({
                count: countAll,
                average: sql<number>`CAST(COALESCE(ROUND(AVG(${recipe_ratings.score}), 2), 0) as float)`,
              })
              .from(recipe_ratings)
              .where(eq(recipe_ratings.recipeId, id))
          : Promise.resolve([{ count: 0, average: 0 }]),
        entityType === "recipe"
          ? ctx.db
              .select({ count: countAll })
              .from(comments)
              .where(eq(comments.recipeId, id))
          : ctx.db
              .select({ count: countAll })
              .from(article_comments)
              .where(eq(article_comments.articleId, id)),
      ]);

      const dayMap = new Map(byDay.map((row) => [row.day, row]));
      const trend = Array.from({ length: 30 }, (_, idx) => {
        const date = daysAgo(29 - idx);
        const key = date.toISOString().slice(0, 10);
        return {
          day: key,
          views: dayMap.get(key)?.views ?? 0,
          engaged: dayMap.get(key)?.engaged ?? 0,
        };
      });

      return {
        title: entity.title,
        href: getEntityPath(entityType, entity.slug),
        allTime: allTime ?? emptyEventTotals,
        recent: recent ?? emptyEventTotals,
        trend,
        sources,
        shareChannels,
        comments: commentTotals?.count ?? 0,
        bookmarks: bookmarkTotals?.count ?? 0,
        ratings: {
          count: ratingTotals?.count ?? 0,
          average: ratingTotals?.average ?? 0,
        },
      };
    }),

  exportCsv: authorizedProcedure
    .input(
      z.object({
        entityType: entityTypeSchema,
        days: z.union([z.literal(7), z.literal(30), z.literal(90)]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const rows = await ctx.db
        .select({ id: sql<number>`${events.entityId}`, ...eventTotals })
        .from(events)
        .where(
          and(
            eq(events.entityType, input.entityType),
            isNotNull(events.entityId),
            gte(events.createdAt, daysAgo(input.days)),
          ),
        )
        .groupBy(events.entityId)
        .orderBy(desc(eventTotals.views));

      const titles = await getEntityTitles(
        ctx.db,
        input.entityType,
        rows.map((row) => row.id),
      );

      const header = [
        "id",
        "title",
        "path",
        "views",
        "engaged",
        "prints",
        "shares",
        "copies",
      ];
      const lines = rows.flatMap((row) => {
        const entity = titles.get(row.id);
        if (!entity) return [];

        return [
          [
            row.id,
            entity.title,
            getEntityPath(input.entityType, entity.slug),
            row.views,
            row.engaged,
            row.prints,
            row.shares,
            row.copies,
          ]
            .map(csvCell)
            .join(","),
        ];
      });

      return [header.join(","), ...lines].join("\n");
    }),
});
