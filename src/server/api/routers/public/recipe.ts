import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  categories,
  cuisines,
  recipe_categories,
  recipe_cuisines,
  recipe_ratings,
  recipes,
} from "@/server/db/schema";
import { eq, ilike, sql } from "drizzle-orm";
import { z } from "zod";

export const publicRecipeRouter = createTRPCRouter({
  getRecipeBySlug: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db
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
        avgRating: sql<number>`CAST(ROUND(COALESCE(AVG(${recipe_ratings.score}), 0), 2) as float)`,
        ratingsCount: sql<number>`CAST(COUNT(${recipe_ratings.id}) as int)`,
        categories: sql<{ name: string; slug: string }[]>`
				COALESCE(
					jsonb_agg(DISTINCT jsonb_build_object('name', ${categories.name}, 'slug', ${categories.slug}))
					FILTER (WHERE ${categories.name} IS NOT NULL AND ${categories.slug} IS NOT NULL),
					'[]'::jsonb
				)
				`.as("categories"),
        cuisines: sql<{ name: string; slug: string }[]>`
				COALESCE(
					jsonb_agg(DISTINCT jsonb_build_object('name', ${cuisines.name}, 'slug', ${cuisines.slug}))
					FILTER (WHERE ${cuisines.name} IS NOT NULL AND ${cuisines.slug} IS NOT NULL),
					'[]'::jsonb
				)
				`.as("cuisines"),
      })
      .from(recipes)
      .where(eq(recipes.slug, input))
      .leftJoin(recipe_ratings, eq(recipe_ratings.recipeId, recipes.id))
      .leftJoin(recipe_categories, eq(recipe_categories.recipeId, recipes.id))
      .leftJoin(categories, eq(categories.id, recipe_categories.categoryId))
      .leftJoin(recipe_cuisines, eq(recipe_cuisines.recipeId, recipes.id))
      .leftJoin(cuisines, eq(cuisines.id, recipe_cuisines.cuisineId))

      .groupBy(recipes.id)
      .limit(1);
  }),

  getRecipesSlugs: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.recipes.findMany({
      columns: {
        slug: true,
      },
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
          avgRating: sql<number>`CAST(ROUND(COALESCE(AVG(${recipe_ratings.score}), 0), 2) as float)`,
          ratingsCount: sql<number>`CAST(COUNT(${recipe_ratings.id}) as int)`,
        })
        .from(recipes)
        .leftJoin(recipe_ratings, eq(recipe_ratings.recipeId, recipes.id))
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
        where: ilike(recipes.title, `%${searchQuery}%`),
        orderBy: (recipes, { desc }) => [desc(recipes.createdAt)],
        limit: 10,
      });
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
        .where(eq(categories.slug, input.slug))
        .groupBy(recipes.id)
        .offset(input.offset)
        .limit(input.limit);
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
        .where(eq(cuisines.slug, input.slug))
        .groupBy(recipes.id)
        .offset(input.offset)
        .limit(input.limit);
    }),
});
