import {
  and,
  count,
  desc,
  eq,
  gt,
  ilike,
  isNotNull,
  lt,
  sql,
} from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  categories,
  cuisines,
  recipe_categories,
  recipe_cuisines,
  recipe_ratings,
  recipes,
} from "@/server/db/schema";

export const publicRecipeRouter = createTRPCRouter({
  getRecipeBySlug: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return (
        (
          await ctx.db
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
              publishedAt: recipes.publishedAt,
              avgRating: sql<number>`CAST(ROUND(COALESCE(AVG(${recipe_ratings.score}), 0), 2) as float)`,
              ratingsCount: sql<number>`CAST(COUNT(${recipe_ratings.id}) as int)`,
              categories: sql<{ name: string; slug: string }[]>`
				COALESCE(
					jsonb_agg(DISTINCT jsonb_build_object('name', ${categories.name}, 'slug', ${categories.slug}))
          FILTER (WHERE ${categories.name} IS NOT NULL AND ${categories.slug} IS NOT NULL AND ${categories.publishedAt} IS NOT NULL),
					'[]'::jsonb
				)
				`.as("categories"),
              cuisines: sql<{ name: string; slug: string }[]>`
				COALESCE(
					jsonb_agg(DISTINCT jsonb_build_object('name', ${cuisines.name}, 'slug', ${cuisines.slug}))
          FILTER (WHERE ${cuisines.name} IS NOT NULL AND ${cuisines.slug} IS NOT NULL AND ${cuisines.publishedAt} IS NOT NULL),
					'[]'::jsonb
				)
				`.as("cuisines"),
            })
            .from(recipes)
            .where(and(eq(recipes.slug, input), isNotNull(recipes.publishedAt)))
            .leftJoin(recipe_ratings, eq(recipe_ratings.recipeId, recipes.id))
            .leftJoin(
              recipe_categories,
              eq(recipe_categories.recipeId, recipes.id),
            )
            .leftJoin(
              categories,
              eq(categories.id, recipe_categories.categoryId),
            )
            .leftJoin(recipe_cuisines, eq(recipe_cuisines.recipeId, recipes.id))
            .leftJoin(cuisines, eq(cuisines.id, recipe_cuisines.cuisineId))

            .groupBy(recipes.id)
            .limit(1)
        )?.[0] ?? null
      );
    }),

  getRecipesSlugs: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.recipes.findMany({
      columns: {
        slug: true,
      },
      where: isNotNull(recipes.publishedAt),
      orderBy: (recipes, { desc }) => [desc(recipes.createdAt)],
    });
  }),

  getRandomRecipes: publicProcedure
    .input(z.number())
    .query(({ ctx, input: recipesCount }) => {
      return ctx.db
        .select({
          id: recipes.id,
          title: recipes.title,
          description: recipes.description,
          image: recipes.image,
          difficulty: recipes.difficulty,
          servings: recipes.servings,
          slug: recipes.slug,
          time: recipes.time,
          publishedAt: recipes.publishedAt,
          avgRating: sql<number>`CAST(ROUND(COALESCE(AVG(${recipe_ratings.score}), 0), 2) as float)`,
          ratingsCount: sql<number>`CAST(COUNT(${recipe_ratings.id}) as int)`,
        })
        .from(recipes)
        .leftJoin(recipe_ratings, eq(recipe_ratings.recipeId, recipes.id))
        .where(isNotNull(recipes.publishedAt))
        .groupBy(recipes.id)
        .orderBy(sql`RANDOM()`)
        .limit(recipesCount);
    }),

  getRecipesByQuery: publicProcedure
    .input(z.string().min(3))
    .query(({ ctx, input: searchQuery }) => {
      return ctx.db.query.recipes.findMany({
        columns: {
          id: true,
          title: true,
          slug: true,
        },
        where: and(
          ilike(recipes.title, `%${searchQuery}%`),
          isNotNull(recipes.publishedAt),
        ),
        orderBy: (recipes, { desc }) => [desc(recipes.createdAt)],
        limit: 10,
      });
    }),

  getInfiniteAllRecipes: publicProcedure
    .input(
      z.object({
        limit: z.number().default(12),
        cursor: z.string().optional(),
        sortBy: z.enum(["title", "createdAt"]).default("createdAt"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const query = ctx.db
        .select({
          id: recipes.id,
          title: recipes.title,
          description: recipes.description,
          image: recipes.image,
          createdAt: recipes.createdAt,
          slug: recipes.slug,
          time: recipes.time,
          difficulty: recipes.difficulty,
          servings: recipes.servings,
          avgRating: sql<number>`CAST(ROUND(COALESCE(AVG(${recipe_ratings.score}), 0), 2) as float)`,
          ratingsCount: sql<number>`CAST(COUNT(${recipe_ratings.id}) as int)`,
        })
        .from(recipes)
        .leftJoin(recipe_ratings, eq(recipe_ratings.recipeId, recipes.id))
        .innerJoin(
          recipe_categories,
          eq(recipes.id, recipe_categories.recipeId),
        )
        .innerJoin(categories, eq(recipe_categories.categoryId, categories.id))
        .where(
          and(
            isNotNull(recipes.publishedAt),
            isNotNull(categories.publishedAt),
            input.cursor
              ? input.sortBy === "createdAt"
                ? lt(recipes[input.sortBy], new Date(input.cursor))
                : input.sortBy === "title"
                  ? gt(recipes.title, input.cursor)
                  : undefined
              : undefined,
          ),
        )
        .groupBy(recipes.id)
        .orderBy(
          input.sortBy === "createdAt"
            ? desc(recipes.createdAt)
            : recipes.title,
        )
        .limit(input.limit);

      const results = await query.execute();

      const lastResult =
        results.length > 0
          ? (results[results.length - 1] as (typeof results)[number])
          : null;

      const nextCursor = lastResult
        ? input.sortBy === "createdAt"
          ? lastResult.createdAt.toISOString()
          : lastResult.title
        : null;

      return {
        recipes: results,
        nextCursor,
      };
    }),

  getTotalRecipesCount: publicProcedure.query(async ({ ctx }) => {
    return (
      (
        await ctx.db
          .select({
            count: count(),
          })
          .from(recipes)
          .where(isNotNull(recipes.publishedAt))
      )[0]?.count ?? 0
    );
  }),

  getRecipesByCategory: publicProcedure
    .input(
      z.object({
        slug: z.string(),
        limit: z.number().default(12),
        offset: z.number().default(0),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db
        .select({
          id: recipes.id,
          title: recipes.title,
          description: recipes.description,
          image: recipes.image,
          createdAt: recipes.createdAt,
          slug: recipes.slug,
          time: recipes.time,
          difficulty: recipes.difficulty,
          servings: recipes.servings,
          avgRating: sql<number>`CAST(ROUND(COALESCE(AVG(${recipe_ratings.score}), 0), 2) as float)`,
          ratingsCount: sql<number>`CAST(COUNT(${recipe_ratings.id}) as int)`,
        })
        .from(recipes)
        .leftJoin(recipe_ratings, eq(recipe_ratings.recipeId, recipes.id))
        .innerJoin(
          recipe_categories,
          eq(recipes.id, recipe_categories.recipeId),
        )
        .innerJoin(categories, eq(recipe_categories.categoryId, categories.id))
        .where(
          and(
            eq(categories.slug, input.slug),
            isNotNull(recipes.publishedAt),
            isNotNull(categories.publishedAt),
          ),
        )
        .groupBy(recipes.id)
        .offset(input.offset)
        .limit(input.limit);
    }),

  getInfiniteRecipesByCategory: publicProcedure
    .input(
      z.object({
        slug: z.string(),
        limit: z.number().default(12),
        cursor: z.string().optional(),
        sortBy: z.enum(["title", "createdAt"]).default("createdAt"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const query = ctx.db
        .select({
          id: recipes.id,
          title: recipes.title,
          description: recipes.description,
          image: recipes.image,
          createdAt: recipes.createdAt,
          slug: recipes.slug,
          time: recipes.time,
          difficulty: recipes.difficulty,
          servings: recipes.servings,
          avgRating: sql<number>`CAST(ROUND(COALESCE(AVG(${recipe_ratings.score}), 0), 2) as float)`,
          ratingsCount: sql<number>`CAST(COUNT(${recipe_ratings.id}) as int)`,
        })
        .from(recipes)
        .leftJoin(recipe_ratings, eq(recipe_ratings.recipeId, recipes.id))
        .innerJoin(
          recipe_categories,
          eq(recipes.id, recipe_categories.recipeId),
        )
        .innerJoin(categories, eq(recipe_categories.categoryId, categories.id))
        .where(
          and(
            eq(categories.slug, input.slug),
            isNotNull(recipes.publishedAt),
            isNotNull(categories.publishedAt),
            input.cursor
              ? input.sortBy === "createdAt"
                ? lt(recipes[input.sortBy], new Date(input.cursor))
                : input.sortBy === "title"
                  ? gt(recipes.title, input.cursor)
                  : undefined
              : undefined,
          ),
        )
        .groupBy(recipes.id)
        .orderBy(
          input.sortBy === "createdAt"
            ? desc(recipes.createdAt)
            : recipes.title,
        )
        .limit(input.limit);

      const results = await query.execute();

      const lastResult =
        results.length > 0
          ? (results[results.length - 1] as (typeof results)[number])
          : null;

      const nextCursor = lastResult
        ? input.sortBy === "createdAt"
          ? lastResult.createdAt.toISOString()
          : lastResult.title
        : null;

      return {
        recipes: results,
        nextCursor,
      };
    }),

  getRecipesByCategoryCount: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return (
        (
          await ctx.db
            .select({
              count: count(),
            })
            .from(recipes)
            .innerJoin(
              recipe_categories,
              eq(recipes.id, recipe_categories.recipeId),
            )
            .innerJoin(
              categories,
              eq(recipe_categories.categoryId, categories.id),
            )
            .where(
              and(
                eq(categories.slug, input),
                isNotNull(recipes.publishedAt),
                isNotNull(categories.publishedAt),
              ),
            )
        )[0]?.count ?? 0
      );
    }),

  getRecipesByCuisine: publicProcedure
    .input(
      z.object({
        slug: z.string(),
        limit: z.number().default(12),
        offset: z.number().default(0),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db
        .select({
          id: recipes.id,
          title: recipes.title,
          description: recipes.description,
          image: recipes.image,
          createdAt: recipes.createdAt,
          slug: recipes.slug,
          time: recipes.time,
          difficulty: recipes.difficulty,
          servings: recipes.servings,
          avgRating: sql<number>`CAST(ROUND(COALESCE(AVG(${recipe_ratings.score}), 0), 2) as float)`,
          ratingsCount: sql<number>`CAST(COUNT(${recipe_ratings.id}) as int)`,
        })
        .from(recipes)
        .leftJoin(recipe_ratings, eq(recipe_ratings.recipeId, recipes.id))
        .innerJoin(recipe_cuisines, eq(recipes.id, recipe_cuisines.recipeId))
        .innerJoin(cuisines, eq(recipe_cuisines.cuisineId, cuisines.id))
        .where(
          and(
            eq(cuisines.slug, input.slug),
            isNotNull(recipes.publishedAt),
            isNotNull(cuisines.publishedAt),
          ),
        )
        .groupBy(recipes.id)
        .offset(input.offset)
        .limit(input.limit);
    }),

  getInfiniteRecipesByCuisine: publicProcedure
    .input(
      z.object({
        slug: z.string(),
        limit: z.number().default(12),
        cursor: z.string().optional(),
        sortBy: z.enum(["title", "createdAt"]).default("createdAt"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const query = ctx.db
        .select({
          id: recipes.id,
          title: recipes.title,
          description: recipes.description,
          image: recipes.image,
          createdAt: recipes.createdAt,
          slug: recipes.slug,
          time: recipes.time,
          difficulty: recipes.difficulty,
          servings: recipes.servings,
          avgRating: sql<number>`CAST(ROUND(COALESCE(AVG(${recipe_ratings.score}), 0), 2) as float)`,
          ratingsCount: sql<number>`CAST(COUNT(${recipe_ratings.id}) as int)`,
        })
        .from(recipes)
        .leftJoin(recipe_ratings, eq(recipe_ratings.recipeId, recipes.id))
        .innerJoin(recipe_cuisines, eq(recipes.id, recipe_cuisines.recipeId))
        .innerJoin(cuisines, eq(recipe_cuisines.cuisineId, cuisines.id))
        .where(
          and(
            eq(cuisines.slug, input.slug),
            isNotNull(recipes.publishedAt),
            isNotNull(cuisines.publishedAt),
            input.cursor
              ? input.sortBy === "createdAt"
                ? lt(recipes[input.sortBy], new Date(input.cursor))
                : input.sortBy === "title"
                  ? gt(recipes.title, input.cursor)
                  : undefined
              : undefined,
          ),
        )
        .groupBy(recipes.id)
        .orderBy(
          input.sortBy === "createdAt"
            ? desc(recipes.createdAt)
            : recipes.title,
        )
        .limit(input.limit);

      const results = await query.execute();

      const lastResult =
        results.length > 0
          ? (results[results.length - 1] as (typeof results)[number])
          : null;

      const nextCursor = lastResult
        ? input.sortBy === "createdAt"
          ? lastResult.createdAt.toISOString()
          : lastResult.title
        : null;

      return {
        recipes: results,
        nextCursor,
      };
    }),

  getRecipesByCuisineCount: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return (
        (
          await ctx.db
            .select({
              count: count(),
            })
            .from(recipes)
            .innerJoin(
              recipe_cuisines,
              eq(recipes.id, recipe_cuisines.recipeId),
            )
            .innerJoin(cuisines, eq(recipe_cuisines.cuisineId, cuisines.id))
            .where(
              and(
                eq(cuisines.slug, input),
                isNotNull(recipes.publishedAt),
                isNotNull(cuisines.publishedAt),
              ),
            )
        )[0]?.count ?? 0
      );
    }),
});
