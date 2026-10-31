import { and, desc, eq, isNotNull, sql } from "drizzle-orm";
import { z } from "zod";

import { authenticatedProcedure, createTRPCRouter } from "@/server/api/trpc";
import {
  events,
  recipe_bookmarks,
  recipe_ratings,
  recipes,
} from "@/server/db/schema";

const lastViewedAt = sql<Date>`MAX(${events.createdAt})`;

export const authenticatedRecipeRouter = createTRPCRouter({
  getRecentlyViewed: authenticatedProcedure.query(({ ctx }) => {
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
        // Subqueries, because joining ratings would multiply the view rows
        avgRating: sql<number>`CAST((SELECT ROUND(COALESCE(AVG(${recipe_ratings.score}), 0), 2) FROM ${recipe_ratings} WHERE ${recipe_ratings.recipeId} = ${recipes.id}) as float)`,
        ratingsCount: sql<number>`CAST((SELECT COUNT(*) FROM ${recipe_ratings} WHERE ${recipe_ratings.recipeId} = ${recipes.id}) as int)`,
        lastViewedAt,
      })
      .from(events)
      .innerJoin(recipes, eq(events.entityId, recipes.id))
      .where(
        and(
          eq(events.userId, ctx.user.id),
          eq(events.type, "view"),
          eq(events.entityType, "recipe"),
          isNotNull(recipes.publishedAt),
        ),
      )
      .groupBy(recipes.id)
      .orderBy(desc(lastViewedAt))
      .limit(12);
  }),

  // Detaches the reader's account from their tracked events instead of
  // deleting them, so site-wide view counts stay intact.
  clearViewHistory: authenticatedProcedure.mutation(async ({ ctx }) => {
    await ctx.db
      .update(events)
      .set({ userId: null })
      .where(eq(events.userId, ctx.user.id));
  }),

  bookmarkRecipe: authenticatedProcedure
    .input(z.number().positive())
    .mutation(async ({ ctx, input: recipeId }) => {
      await ctx.db.insert(recipe_bookmarks).values({
        recipeId: recipeId,
        userId: ctx.user.id,
      });
    }),

  unbookmarkRecipe: authenticatedProcedure
    .input(z.number().positive())
    .mutation(async ({ ctx, input: recipeId }) => {
      await ctx.db
        .delete(recipe_bookmarks)
        .where(
          and(
            eq(recipe_bookmarks.recipeId, recipeId),
            eq(recipe_bookmarks.userId, ctx.user.id),
          ),
        );
    }),

  getBookmarkedRecipes: authenticatedProcedure.query(async ({ ctx }) => {
    return await ctx.db
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
        ratingsCount: sql<number>`CAST(COUNT(DISTINCT ${recipe_ratings.id}) as int)`,
        bookmarkedAt: recipe_bookmarks.id,
      })
      .from(recipe_bookmarks)
      .innerJoin(recipes, eq(recipe_bookmarks.recipeId, recipes.id))
      .leftJoin(recipe_ratings, eq(recipe_ratings.recipeId, recipes.id))
      .where(
        and(
          eq(recipe_bookmarks.userId, ctx.user.id),
          isNotNull(recipes.publishedAt),
        ),
      )
      .groupBy(recipes.id, recipe_bookmarks.id)
      .orderBy(sql`${recipe_bookmarks.id} DESC`);
  }),

  getUserRating: authenticatedProcedure
    .input(z.number().positive())
    .query(async ({ ctx, input: recipeId }) => {
      const rating = await ctx.db
        .select({ score: recipe_ratings.score })
        .from(recipe_ratings)
        .where(
          and(
            eq(recipe_ratings.recipeId, recipeId),
            eq(recipe_ratings.userId, ctx.user.id),
          ),
        )
        .limit(1);

      return rating[0]?.score ?? null;
    }),

  rateRecipe: authenticatedProcedure
    .input(
      z.object({
        score: z.number().min(1).max(5),
        recipeId: z.number().positive(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user already rated this recipe
      const existingRating = await ctx.db
        .select()
        .from(recipe_ratings)
        .where(
          and(
            eq(recipe_ratings.recipeId, input.recipeId),
            eq(recipe_ratings.userId, ctx.user.id),
          ),
        )
        .limit(1);

      if (existingRating.length > 0) {
        // Update existing rating
        await ctx.db
          .update(recipe_ratings)
          .set({ score: input.score })
          .where(
            and(
              eq(recipe_ratings.recipeId, input.recipeId),
              eq(recipe_ratings.userId, ctx.user.id),
            ),
          );
      } else {
        // Insert new rating
        await ctx.db.insert(recipe_ratings).values({
          score: input.score,
          recipeId: input.recipeId,
          userId: ctx.user.id,
        });
      }
    }),

  unrateRecipe: authenticatedProcedure
    .input(z.number().positive())
    .mutation(async ({ ctx, input: recipeId }) => {
      await ctx.db
        .delete(recipe_ratings)
        .where(
          and(
            eq(recipe_ratings.recipeId, recipeId),
            eq(recipe_ratings.userId, ctx.user.id),
          ),
        );
    }),
});
