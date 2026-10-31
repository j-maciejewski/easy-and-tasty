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

import {
  createPreviewToken,
  getPreviewPath,
  PREVIEW_TTL_SECONDS,
} from "@/lib/preview";
import { authorizedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { db } from "@/server/db";
import {
  comment_likes,
  comments,
  difficultyEnum,
  events,
  recipe_bookmarks,
  recipe_categories,
  recipe_cuisines,
  recipe_ratings,
  recipes,
  users,
} from "@/server/db/schema";
import { parseSlug } from "@/utils";

type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

const deleteRecipesWithRelations = async (tx: Transaction, ids: number[]) => {
  await tx.delete(recipe_ratings).where(inArray(recipe_ratings.recipeId, ids));
  await tx
    .delete(comment_likes)
    .where(
      inArray(
        comment_likes.commentId,
        tx
          .select({ id: comments.id })
          .from(comments)
          .where(inArray(comments.recipeId, ids)),
      ),
    );
  await tx.delete(comments).where(inArray(comments.recipeId, ids));
  await tx
    .delete(recipe_bookmarks)
    .where(inArray(recipe_bookmarks.recipeId, ids));
  await tx
    .delete(events)
    .where(and(eq(events.entityType, "recipe"), inArray(events.entityId, ids)));
  await tx
    .delete(recipe_categories)
    .where(inArray(recipe_categories.recipeId, ids));
  await tx
    .delete(recipe_cuisines)
    .where(inArray(recipe_cuisines.recipeId, ids));
  await tx.delete(recipes).where(inArray(recipes.id, ids));
};

export const authorizedRecipeRouter = createTRPCRouter({
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
      eq(events.entityType, "recipe"),
    );
    const ratingAvg = sql<number>`CAST(ROUND(AVG(${recipe_ratings.score}), 2) as float)`;

    const [
      [content],
      [commentTotals],
      [bookmarkTotals],
      [viewTotals],
      commentsByDay,
      bookmarksByDay,
      viewsByDay,
      topViewed,
      recentComments,
      recentBookmarks,
      [ratingTotals],
      ratingDistribution,
      lowestRated,
      mostDiscussed,
    ] = await Promise.all([
      ctx.db
        .select({
          total: sql<number>`CAST(COUNT(*) as int)`,
          published: sql<number>`CAST(COUNT(*) FILTER (WHERE ${recipes.publishedAt} IS NOT NULL) as int)`,
        })
        .from(recipes),
      ctx.db
        .select(windowCounts(comments.createdAt))
        .from(comments)
        .where(gte(comments.createdAt, last60d)),
      ctx.db
        .select(windowCounts(recipe_bookmarks.createdAt))
        .from(recipe_bookmarks)
        .where(gte(recipe_bookmarks.createdAt, last60d)),
      ctx.db
        .select(windowCounts(events.createdAt))
        .from(events)
        .where(and(isEntityView, gte(events.createdAt, last60d))),
      ctx.db
        .select({
          day: sql<string>`TO_CHAR(${comments.createdAt}, 'YYYY-MM-DD')`,
          count: sql<number>`CAST(COUNT(*) as int)`,
        })
        .from(comments)
        .where(gte(comments.createdAt, last30d))
        .groupBy(sql`TO_CHAR(${comments.createdAt}, 'YYYY-MM-DD')`),
      ctx.db
        .select({
          day: sql<string>`TO_CHAR(${recipe_bookmarks.createdAt}, 'YYYY-MM-DD')`,
          count: sql<number>`CAST(COUNT(*) as int)`,
        })
        .from(recipe_bookmarks)
        .where(gte(recipe_bookmarks.createdAt, last30d))
        .groupBy(sql`TO_CHAR(${recipe_bookmarks.createdAt}, 'YYYY-MM-DD')`),
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
          id: recipes.id,
          title: recipes.title,
          slug: recipes.slug,
          views: viewCount,
        })
        .from(events)
        .innerJoin(recipes, eq(events.entityId, recipes.id))
        .where(and(isEntityView, gte(events.createdAt, last30d)))
        .groupBy(recipes.id)
        .orderBy(desc(viewCount))
        .limit(5),
      ctx.db
        .select({
          id: comments.id,
          text: comments.text,
          createdAt: comments.createdAt,
          recipe: {
            id: recipes.id,
            title: recipes.title,
            slug: recipes.slug,
          },
          user: { name: users.name },
        })
        .from(comments)
        .innerJoin(recipes, eq(comments.recipeId, recipes.id))
        .leftJoin(users, eq(comments.userId, users.id))
        .orderBy(desc(comments.createdAt))
        .limit(6),
      ctx.db
        .select({
          id: recipe_bookmarks.id,
          createdAt: recipe_bookmarks.createdAt,
          recipe: {
            id: recipes.id,
            title: recipes.title,
            slug: recipes.slug,
          },
          user: { name: users.name },
        })
        .from(recipe_bookmarks)
        .innerJoin(recipes, eq(recipe_bookmarks.recipeId, recipes.id))
        .leftJoin(users, eq(recipe_bookmarks.userId, users.id))
        .orderBy(desc(recipe_bookmarks.createdAt))
        .limit(6),
      ctx.db
        .select({
          count: viewCount,
          average: sql<number>`CAST(COALESCE(ROUND(AVG(${recipe_ratings.score}), 2), 0) as float)`,
        })
        .from(recipe_ratings),
      ctx.db
        .select({ score: recipe_ratings.score, count: viewCount })
        .from(recipe_ratings)
        .groupBy(recipe_ratings.score),
      ctx.db
        .select({
          id: recipes.id,
          title: recipes.title,
          slug: recipes.slug,
          average: ratingAvg,
          count: viewCount,
        })
        .from(recipe_ratings)
        .innerJoin(recipes, eq(recipe_ratings.recipeId, recipes.id))
        .groupBy(recipes.id)
        .having(sql`COUNT(*) >= 3 AND AVG(${recipe_ratings.score}) <= 3`)
        .orderBy(ratingAvg, desc(viewCount))
        .limit(5),
      ctx.db
        .select({
          id: recipes.id,
          title: recipes.title,
          slug: recipes.slug,
          comments: viewCount,
        })
        .from(comments)
        .innerJoin(recipes, eq(comments.recipeId, recipes.id))
        .where(gte(comments.createdAt, last30d))
        .groupBy(recipes.id)
        .orderBy(desc(viewCount))
        .limit(5),
    ]);

    const commentsMap = new Map(
      commentsByDay.map((entry) => [entry.day, entry.count]),
    );
    const bookmarksMap = new Map(
      bookmarksByDay.map((entry) => [entry.day, entry.count]),
    );
    const viewsMap = new Map(
      viewsByDay.map((entry) => [entry.day, entry.count]),
    );

    const trend = Array.from({ length: 30 }, (_, idx) => {
      const day = new Date(now);
      day.setDate(now.getDate() - (29 - idx));
      const key = formatDayKey(day);

      return {
        day: key,
        comments: commentsMap.get(key) ?? 0,
        bookmarks: bookmarksMap.get(key) ?? 0,
        views: viewsMap.get(key) ?? 0,
      };
    });

    const total = content?.total ?? 0;
    const published = content?.published ?? 0;

    return {
      content: { total, published, drafts: total - published },
      totals: {
        comments: commentTotals ?? emptyCounts,
        bookmarks: bookmarkTotals ?? emptyCounts,
        views: viewTotals ?? emptyCounts,
      },
      trend,
      topViewed,
      recentComments,
      recentBookmarks,
      ratings: {
        count: ratingTotals?.count ?? 0,
        average: ratingTotals?.average ?? 0,
        distribution: [5, 4, 3, 2, 1].map((score) => ({
          score,
          count:
            ratingDistribution.find((entry) => entry.score === score)?.count ??
            0,
        })),
        lowestRated,
        mostDiscussed,
      },
    };
  }),

  getPreviewLink: authorizedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const item = await ctx.db.query.recipes.findFirst({
        columns: { slug: true },
        where: eq(recipes.id, input.id),
      });

      if (!item) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Recipe not found" });
      }

      const token = createPreviewToken({ type: "recipe", id: input.id });

      return {
        url: getPreviewPath("recipe", item.slug, token),
        expiresAt: new Date(Date.now() + PREVIEW_TTL_SECONDS * 1000),
      };
    }),

  getRecipe: authorizedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const results = await ctx.db
        .select({
          id: recipes.id,
          title: recipes.title,
          description: recipes.description,
          image: recipes.image,
          difficulty: recipes.difficulty,
          content: recipes.content,
          servings: recipes.servings,
          slug: recipes.slug,
          time: recipes.time,
          createdAt: recipes.createdAt,
          updatedAt: recipes.updatedAt,
          publishedAt: recipes.publishedAt,
          categoryIds: sql<
            number[]
          >`COALESCE(json_agg(DISTINCT ${recipe_categories.categoryId} ORDER BY ${recipe_categories.categoryId} NULLS LAST) FILTER (WHERE ${recipe_categories.categoryId} IS NOT NULL), '[]')`.as(
            "category_ids",
          ),
          cuisineIds: sql<
            number[]
          >`COALESCE(json_agg(DISTINCT ${recipe_cuisines.cuisineId} ORDER BY ${recipe_cuisines.cuisineId} NULLS LAST) FILTER (WHERE ${recipe_cuisines.cuisineId} IS NOT NULL), '[]')`.as(
            "cuisine_ids",
          ),
        })
        .from(recipes)
        .where(eq(recipes.id, input))
        .leftJoin(recipe_categories, eq(recipe_categories.recipeId, recipes.id))
        .leftJoin(recipe_cuisines, eq(recipe_cuisines.recipeId, recipes.id))
        .groupBy(recipes.id);

      return results[0];
    }),

  getRecipes: authorizedProcedure
    .input(
      z.object({
        title: z.string().optional(),
        orderBy: z.string().optional().default("createdAt"),
        orderDir: z.enum(["desc", "asc"]).optional().default("desc"),
        page: z.number().optional().default(1),
        limit: z.number().optional().default(10),
        status: z.enum(["published", "draft"]).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where = and(
        ilike(recipes.title, `%${input.title ?? ""}%`),
        input.status === "published"
          ? sql`${recipes.publishedAt} IS NOT NULL`
          : input.status === "draft"
            ? sql`${recipes.publishedAt} IS NULL`
            : undefined,
      );

      const results = await ctx.db
        .select({
          id: recipes.id,
          title: recipes.title,
          description: recipes.description,
          image: recipes.image,
          difficulty: recipes.difficulty,
          content: recipes.content,
          servings: recipes.servings,
          slug: recipes.slug,
          time: recipes.time,
          createdAt: recipes.createdAt,
          updatedAt: recipes.updatedAt,
          publishedAt: recipes.publishedAt,
          avgRating:
            sql<number>`CAST(ROUND(COALESCE(AVG(${recipe_ratings.score}), 0), 2) as float)`.as(
              "avg_rating",
            ),
          ratingsCount:
            sql<number>`CAST(COUNT(${recipe_ratings.id}) as int)`.as(
              "ratings_count",
            ),
          commentsCount:
            sql<number>`CAST(COUNT(DISTINCT ${comments.id}) as int)`.as(
              "comments_count",
            ),
          bookmarksCount:
            sql<number>`CAST(COUNT(DISTINCT ${recipe_bookmarks.userId}) as int)`.as(
              "bookmarks_count",
            ),
          categoryIds: sql<
            number[]
          >`COALESCE(json_agg(DISTINCT ${recipe_categories.categoryId} ORDER BY ${recipe_categories.categoryId} NULLS LAST) FILTER (WHERE ${recipe_categories.categoryId} IS NOT NULL), '[]')`.as(
            "category_ids",
          ),
          cuisineIds: sql<
            number[]
          >`COALESCE(json_agg(DISTINCT ${recipe_cuisines.cuisineId} ORDER BY ${recipe_cuisines.cuisineId} NULLS LAST) FILTER (WHERE ${recipe_cuisines.cuisineId} IS NOT NULL), '[]')`.as(
            "cuisine_ids",
          ),
        })
        .from(recipes)
        .where(where)
        .leftJoin(recipe_ratings, eq(recipe_ratings.recipeId, recipes.id))
        .leftJoin(comments, eq(comments.recipeId, recipes.id))
        .leftJoin(recipe_bookmarks, eq(recipe_bookmarks.recipeId, recipes.id))
        .leftJoin(recipe_categories, eq(recipe_categories.recipeId, recipes.id))
        .leftJoin(recipe_cuisines, eq(recipe_cuisines.recipeId, recipes.id))
        .groupBy(recipes.id)
        .orderBy(
          (() => {
            if (input.orderBy === "avg_rating") {
              if (input.orderDir === "desc") return sql`avg_rating DESC`;
              return sql`avg_rating ASC`;
            }

            if (input.orderBy === "ratings_count") {
              if (input.orderDir === "desc") return sql`ratings_count DESC`;
              return sql`ratings_count ASC`;
            }

            if (input.orderBy === "comments_count") {
              if (input.orderDir === "desc") return sql`comments_count DESC`;
              return sql`comments_count ASC`;
            }

            if (input.orderBy === "bookmarks_count") {
              if (input.orderDir === "desc") return sql`bookmarks_count DESC`;
              return sql`bookmarks_count ASC`;
            }

            return input.orderDir === "desc"
              ? // @ts-ignore
                desc(recipes[input.orderBy])
              : // @ts-ignore
                recipes[input.orderBy];
          })(),
        )
        .offset((input.page - 1) * input.limit)
        .limit(input.limit);

      const totalResults = await ctx.db
        .select({
          total: sql<number>`CAST(COUNT(*) as float)`,
        })
        .from(recipes)
        .where(where);

      const pagination = totalResults?.[0]?.total
        ? {
            hitsCount: totalResults[0].total,
            currentPage: input.page,
            pagesCount: Math.ceil(totalResults[0].total / input.limit),
          }
        : null;

      return { results, pagination };
    }),

  addRecipe: authorizedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        image: z.string(),
        description: z.string(),
        content: z.string(),
        categories: z.number().array().min(1),
        cuisines: z.number().array().min(1),
        difficulty: z.enum(difficultyEnum.enumValues),
        time: z.number(),
        servings: z.number(),
        published: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.transaction(async (tx) => {
        const result = await tx
          .insert(recipes)
          .values({
            title: input.title,
            slug: parseSlug(input.title),
            image: input.image,
            description: input.description,
            content: input.content,
            difficulty: input.difficulty,
            servings: input.servings,
            time: input.time,
            publishedAt: input.published ? new Date() : null,
          })
          .returning({ insertedId: recipes.id });

        const insertedRecipeId = result[0]?.insertedId;

        if (insertedRecipeId) {
          await tx.execute(sql`
            SELECT setval(
              pg_get_serial_sequence('"easy-and-tasty_recipe_cuisine"', 'id'),
              COALESCE((SELECT MAX(id) FROM "easy-and-tasty_recipe_cuisine"), 0) + 1,
              false
            )
          `);

          await tx.execute(sql`
            SELECT setval(
              pg_get_serial_sequence('"easy-and-tasty_recipe_category"', 'id'),
              COALESCE((SELECT MAX(id) FROM "easy-and-tasty_recipe_category"), 0) + 1,
              false
            )
          `);

          await tx.insert(recipe_cuisines).values(
            input.cuisines.map((cuisineId) => ({
              recipeId: insertedRecipeId,
              cuisineId,
            })),
          );

          await tx.insert(recipe_categories).values(
            input.categories.map((categoryId) => ({
              recipeId: insertedRecipeId,
              categoryId,
            })),
          );
        }

        return { id: insertedRecipeId };
      });
    }),

  editRecipe: authorizedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1),
        image: z.string(),
        description: z.string(),
        content: z.string(),
        categories: z.number().array().min(1),
        cuisines: z.number().array().min(1),
        difficulty: z.enum(difficultyEnum.enumValues),
        time: z.number(),
        servings: z.number(),
        published: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        await tx
          .update(recipes)
          .set({
            title: input.title,
            slug: parseSlug(input.title),
            image: input.image,
            description: input.description,
            content: input.content,
            difficulty: input.difficulty,
            servings: input.servings,
            time: input.time,
            publishedAt: input.published ? new Date() : null,
          })
          .where(eq(recipes.id, input.id))
          .returning({ insertedId: recipes.id });

        const results = await tx
          .select({
            id: recipes.id,
            categoryIds: sql<
              number[]
            >`COALESCE(json_agg(DISTINCT ${recipe_categories.categoryId} ORDER BY ${recipe_categories.categoryId} NULLS LAST) FILTER (WHERE ${recipe_categories.categoryId} IS NOT NULL), '[]')`.as(
              "category_ids",
            ),
            cuisineIds: sql<
              number[]
            >`COALESCE(json_agg(DISTINCT ${recipe_cuisines.cuisineId} ORDER BY ${recipe_cuisines.cuisineId} NULLS LAST) FILTER (WHERE ${recipe_cuisines.cuisineId} IS NOT NULL), '[]')`.as(
              "cuisine_ids",
            ),
          })
          .from(recipes)
          .where(eq(recipes.id, input.id))
          .leftJoin(
            recipe_categories,
            eq(recipe_categories.recipeId, recipes.id),
          )
          .leftJoin(recipe_cuisines, eq(recipe_cuisines.recipeId, recipes.id))
          .groupBy(recipes.id);

        if (results[0]) {
          await tx.execute(sql`
            SELECT setval(
              pg_get_serial_sequence('"easy-and-tasty_recipe_cuisine"', 'id'),
              COALESCE((SELECT MAX(id) FROM "easy-and-tasty_recipe_cuisine"), 0) + 1,
              false
            )
          `);

          await tx.execute(sql`
            SELECT setval(
              pg_get_serial_sequence('"easy-and-tasty_recipe_category"', 'id'),
              COALESCE((SELECT MAX(id) FROM "easy-and-tasty_recipe_category"), 0) + 1,
              false
            )
          `);

          for (const categoryId of input.categories) {
            if (!results[0].categoryIds.includes(categoryId)) {
              await tx.insert(recipe_categories).values({
                recipeId: input.id,
                categoryId,
              });
            }
          }

          for (const categoryId of results[0].categoryIds) {
            if (!input.categories.includes(categoryId)) {
              await tx
                .delete(recipe_categories)
                .where(
                  and(
                    eq(recipe_categories.recipeId, input.id),
                    eq(recipe_categories.categoryId, categoryId),
                  ),
                );
            }
          }

          for (const cuisineId of input.cuisines) {
            if (!results[0].cuisineIds.includes(cuisineId)) {
              await tx.insert(recipe_cuisines).values({
                recipeId: input.id,
                cuisineId,
              });
            }
          }

          for (const cuisineId of results[0].cuisineIds) {
            if (!input.cuisines.includes(cuisineId)) {
              await tx
                .delete(recipe_cuisines)
                .where(
                  and(
                    eq(recipe_cuisines.recipeId, input.id),
                    eq(recipe_cuisines.cuisineId, cuisineId),
                  ),
                );
            }
          }
        }
      });
    }),

  publishRecipe: authorizedProcedure
    .input(z.number().positive())
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(recipes)
        .set({
          publishedAt: new Date(),
        })
        .where(eq(recipes.id, input));
    }),

  unpublishRecipe: authorizedProcedure
    .input(z.number().positive())
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(recipes)
        .set({
          publishedAt: null,
        })
        .where(eq(recipes.id, input));
    }),

  deleteRecipe: authorizedProcedure
    .input(z.number().positive())
    .mutation(async ({ ctx, input: recipeId }) => {
      await ctx.db.transaction((tx) =>
        deleteRecipesWithRelations(tx, [recipeId]),
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
        .update(recipes)
        .set({ publishedAt: input.published ? new Date() : null })
        .where(
          and(
            inArray(recipes.id, input.ids),
            input.published ? isNull(recipes.publishedAt) : undefined,
          ),
        );
    }),

  bulkDelete: authorizedProcedure
    .input(z.object({ ids: z.number().positive().array().min(1) }))
    .mutation(async ({ ctx, input: { ids } }) => {
      await ctx.db.transaction((tx) => deleteRecipesWithRelations(tx, ids));
    }),

  bulkAddCategory: authorizedProcedure
    .input(
      z.object({
        ids: z.number().positive().array().min(1),
        categoryId: z.number().positive(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const existing = await tx
          .select({ recipeId: recipe_categories.recipeId })
          .from(recipe_categories)
          .where(
            and(
              inArray(recipe_categories.recipeId, input.ids),
              eq(recipe_categories.categoryId, input.categoryId),
            ),
          );
        const existingIds = new Set(existing.map(({ recipeId }) => recipeId));
        const missingIds = input.ids.filter((id) => !existingIds.has(id));

        if (missingIds.length === 0) return;

        await tx.execute(sql`
          SELECT setval(
            pg_get_serial_sequence('"easy-and-tasty_recipe_category"', 'id'),
            COALESCE((SELECT MAX(id) FROM "easy-and-tasty_recipe_category"), 0) + 1,
            false
          )
        `);

        await tx.insert(recipe_categories).values(
          missingIds.map((recipeId) => ({
            recipeId,
            categoryId: input.categoryId,
          })),
        );
      });
    }),

  bulkAddCuisine: authorizedProcedure
    .input(
      z.object({
        ids: z.number().positive().array().min(1),
        cuisineId: z.number().positive(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const existing = await tx
          .select({ recipeId: recipe_cuisines.recipeId })
          .from(recipe_cuisines)
          .where(
            and(
              inArray(recipe_cuisines.recipeId, input.ids),
              eq(recipe_cuisines.cuisineId, input.cuisineId),
            ),
          );
        const existingIds = new Set(existing.map(({ recipeId }) => recipeId));
        const missingIds = input.ids.filter((id) => !existingIds.has(id));

        if (missingIds.length === 0) return;

        await tx.execute(sql`
          SELECT setval(
            pg_get_serial_sequence('"easy-and-tasty_recipe_cuisine"', 'id'),
            COALESCE((SELECT MAX(id) FROM "easy-and-tasty_recipe_cuisine"), 0) + 1,
            false
          )
        `);

        await tx.insert(recipe_cuisines).values(
          missingIds.map((recipeId) => ({
            recipeId,
            cuisineId: input.cuisineId,
          })),
        );
      });
    }),
});
