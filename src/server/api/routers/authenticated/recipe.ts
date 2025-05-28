import { authenticatedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { recipe_bookmarks, recipe_ratings } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const authenticatedRecipeRouter = createTRPCRouter({
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

  rateRecipe: authenticatedProcedure
    .input(
      z.object({
        score: z.number().min(1).max(5),
        recipeId: z.number().positive(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(recipe_ratings).values({
        score: input.score,
        recipeId: input.recipeId,
        userId: ctx.user.id,
      });
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
