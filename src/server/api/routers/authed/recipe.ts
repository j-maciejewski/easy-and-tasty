import { authedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { recipe_ratings, recipe_saves } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const authedRecipeRouter = createTRPCRouter({
  saveRecipe: authedProcedure
    .input(z.number().positive())
    .mutation(async ({ ctx, input: recipeId }) => {
      await ctx.db.insert(recipe_saves).values({
        recipeId: recipeId,
        userId: 1,
      });
    }),

  unsaveRecipe: authedProcedure
    .input(z.number().positive())
    .mutation(async ({ ctx, input: recipeId }) => {
      await ctx.db
        .delete(recipe_saves)
        .where(
          and(eq(recipe_saves.recipeId, recipeId), eq(recipe_saves.userId, 1)),
        );
    }),

  rateRecipe: authedProcedure
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
        userId: 1,
      });
    }),

  removeRatingFromRecipe: authedProcedure
    .input(z.number().positive())
    .mutation(async ({ ctx, input: recipeId }) => {
      await ctx.db
        .delete(recipe_ratings)
        .where(
          and(
            eq(recipe_ratings.recipeId, recipeId),
            eq(recipe_ratings.userId, 1),
          ),
        );
    }),
});
