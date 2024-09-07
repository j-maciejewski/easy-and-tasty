import { authedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { recipe_likes, recipe_ratings } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const authedRecipeRouter = createTRPCRouter({
	likeRecipe: authedProcedure
		.input(z.number().positive())
		.mutation(async ({ ctx, input: recipeId }) => {
			await ctx.db.insert(recipe_likes).values({
				recipeId: recipeId,
				userId: 1,
			});
		}),

	unlikeRecipe: authedProcedure
		.input(z.number().positive())
		.mutation(async ({ ctx, input: recipeId }) => {
			await ctx.db
				.delete(recipe_likes)
				.where(
					and(eq(recipe_likes.recipeId, recipeId), eq(recipe_likes.userId, 1)),
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
