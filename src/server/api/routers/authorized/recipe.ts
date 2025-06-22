import { and, desc, eq, ilike, sql } from "drizzle-orm";
import { z } from "zod";

import { authorizedProcedure, createTRPCRouter } from "@/server/api/trpc";
import {
  difficultyEnum,
  recipe_categories,
  recipe_cuisines,
  recipe_ratings,
  recipes,
} from "@/server/db/schema";
import { parseSlug } from "@/utils";

export const authorizedRecipeRouter = createTRPCRouter({
  // @ts-ignore
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

  // @ts-ignore
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
          avgRating:
            sql<number>`CAST(ROUND(COALESCE(AVG(${recipe_ratings.score}), 0), 2) as float)`.as(
              "avg_rating",
            ),
          ratingsCount:
            sql<number>`CAST(COUNT(${recipe_ratings.id}) as int)`.as(
              "ratings_count",
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
          })
          .returning({ insertedId: recipes.id });

        const insertedRecipeId = result[0]?.insertedId;

        if (insertedRecipeId) {
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

  // TODO: Add remaining recipe options
});
