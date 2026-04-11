import { and, desc, eq, gte, ilike, sql } from "drizzle-orm";
import { z } from "zod";

import { authorizedProcedure, createTRPCRouter } from "@/server/api/trpc";
import {
  comments,
  difficultyEnum,
  recipe_bookmarks,
  recipe_categories,
  recipe_cuisines,
  recipe_ratings,
  recipe_views,
  recipes,
  users,
} from "@/server/db/schema";
import { parseSlug } from "@/utils";

export const authorizedRecipeRouter = createTRPCRouter({
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

    const [comments24h, comments7d, comments30d] = await Promise.all([
      ctx.db
        .select({ count: sql<number>`CAST(COUNT(*) as int)` })
        .from(comments)
        .where(gte(comments.createdAt, last24h)),
      ctx.db
        .select({ count: sql<number>`CAST(COUNT(*) as int)` })
        .from(comments)
        .where(gte(comments.createdAt, last7d)),
      ctx.db
        .select({ count: sql<number>`CAST(COUNT(*) as int)` })
        .from(comments)
        .where(gte(comments.createdAt, last30d)),
    ]);

    const [bookmarks24h, bookmarks7d, bookmarks30d] = await Promise.all([
      ctx.db
        .select({ count: sql<number>`CAST(COUNT(*) as int)` })
        .from(recipe_bookmarks)
        .where(gte(recipe_bookmarks.createdAt, last24h)),
      ctx.db
        .select({ count: sql<number>`CAST(COUNT(*) as int)` })
        .from(recipe_bookmarks)
        .where(gte(recipe_bookmarks.createdAt, last7d)),
      ctx.db
        .select({ count: sql<number>`CAST(COUNT(*) as int)` })
        .from(recipe_bookmarks)
        .where(gte(recipe_bookmarks.createdAt, last30d)),
    ]);

    const [views24h, views7d, views30d] = await Promise.all([
      ctx.db
        .select({ count: sql<number>`CAST(COUNT(*) as int)` })
        .from(recipe_views)
        .where(gte(recipe_views.viewedAt, last24h)),
      ctx.db
        .select({ count: sql<number>`CAST(COUNT(*) as int)` })
        .from(recipe_views)
        .where(gte(recipe_views.viewedAt, last7d)),
      ctx.db
        .select({ count: sql<number>`CAST(COUNT(*) as int)` })
        .from(recipe_views)
        .where(gte(recipe_views.viewedAt, last30d)),
    ]);

    const [commentsByDay, bookmarksByDay, viewsByDay] = await Promise.all([
      ctx.db
        .select({
          day: sql<string>`TO_CHAR(${comments.createdAt}, 'YYYY-MM-DD')`,
          count: sql<number>`CAST(COUNT(*) as int)`,
        })
        .from(comments)
        .where(gte(comments.createdAt, last30d))
        .groupBy(sql`TO_CHAR(${comments.createdAt}, 'YYYY-MM-DD')`)
        .orderBy(sql`TO_CHAR(${comments.createdAt}, 'YYYY-MM-DD') ASC`),
      ctx.db
        .select({
          day: sql<string>`TO_CHAR(${recipe_bookmarks.createdAt}, 'YYYY-MM-DD')`,
          count: sql<number>`CAST(COUNT(*) as int)`,
        })
        .from(recipe_bookmarks)
        .where(gte(recipe_bookmarks.createdAt, last30d))
        .groupBy(sql`TO_CHAR(${recipe_bookmarks.createdAt}, 'YYYY-MM-DD')`)
        .orderBy(sql`TO_CHAR(${recipe_bookmarks.createdAt}, 'YYYY-MM-DD') ASC`),
      ctx.db
        .select({
          day: sql<string>`TO_CHAR(${recipe_views.viewedAt}, 'YYYY-MM-DD')`,
          count: sql<number>`CAST(COUNT(*) as int)`,
        })
        .from(recipe_views)
        .where(gte(recipe_views.viewedAt, last30d))
        .groupBy(sql`TO_CHAR(${recipe_views.viewedAt}, 'YYYY-MM-DD')`)
        .orderBy(sql`TO_CHAR(${recipe_views.viewedAt}, 'YYYY-MM-DD') ASC`),
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

    const [recentComments, recentBookmarks, recentViews] = await Promise.all([
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
          user: {
            id: users.id,
            name: users.name,
            email: users.email,
          },
        })
        .from(comments)
        .innerJoin(recipes, eq(comments.recipeId, recipes.id))
        .leftJoin(users, eq(comments.userId, users.id))
        .orderBy(desc(comments.createdAt))
        .limit(8),
      ctx.db
        .select({
          id: recipe_bookmarks.id,
          createdAt: recipe_bookmarks.createdAt,
          recipe: {
            id: recipes.id,
            title: recipes.title,
            slug: recipes.slug,
          },
          user: {
            id: users.id,
            name: users.name,
            email: users.email,
          },
        })
        .from(recipe_bookmarks)
        .innerJoin(recipes, eq(recipe_bookmarks.recipeId, recipes.id))
        .leftJoin(users, eq(recipe_bookmarks.userId, users.id))
        .orderBy(desc(recipe_bookmarks.createdAt))
        .limit(8),
      ctx.db
        .select({
          id: recipe_views.id,
          viewedAt: recipe_views.viewedAt,
          ipAddress: recipe_views.ipAddress,
          recipe: {
            id: recipes.id,
            title: recipes.title,
            slug: recipes.slug,
          },
          user: {
            id: users.id,
            name: users.name,
            email: users.email,
          },
        })
        .from(recipe_views)
        .innerJoin(recipes, eq(recipe_views.recipeId, recipes.id))
        .leftJoin(users, eq(recipe_views.userId, users.id))
        .orderBy(desc(recipe_views.viewedAt))
        .limit(8),
    ]);

    return {
      totals: {
        comments: {
          last24h: comments24h[0]?.count ?? 0,
          last7d: comments7d[0]?.count ?? 0,
          last30d: comments30d[0]?.count ?? 0,
        },
        bookmarks: {
          last24h: bookmarks24h[0]?.count ?? 0,
          last7d: bookmarks7d[0]?.count ?? 0,
          last30d: bookmarks30d[0]?.count ?? 0,
        },
        views: {
          last24h: views24h[0]?.count ?? 0,
          last7d: views7d[0]?.count ?? 0,
          last30d: views30d[0]?.count ?? 0,
        },
      },
      trend,
      recentComments,
      recentBookmarks,
      recentViews,
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
      }),
    )
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
        .where(ilike(recipes.title, `%${input.title}%`))
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
        .where(ilike(recipes.title, `%${input.title}%`));

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
      await ctx.db.transaction(async (tx) => {
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
      await ctx.db.transaction(async (tx) => {
        await tx
          .delete(recipe_ratings)
          .where(eq(recipe_ratings.recipeId, recipeId));

        await tx.delete(comments).where(eq(comments.recipeId, recipeId));

        await tx
          .delete(recipe_bookmarks)
          .where(eq(recipe_bookmarks.recipeId, recipeId));

        await tx
          .delete(recipe_views)
          .where(eq(recipe_views.recipeId, recipeId));

        await tx
          .delete(recipe_categories)
          .where(eq(recipe_categories.recipeId, recipeId));

        await tx
          .delete(recipe_cuisines)
          .where(eq(recipe_cuisines.recipeId, recipeId));

        await tx.delete(recipes).where(eq(recipes.id, recipeId));
      });
    }),
});
