import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { recipe_likes } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const recipeLikeRouter = createTRPCRouter({
	likeRecipe: publicProcedure
		.input(z.number().positive())
		.mutation(async ({ ctx, input: recipeId }) => {
			await ctx.db.insert(recipe_likes).values({
				recipeId: recipeId,
				userId: 1,
			});
		}),

	unlikeRecipe: publicProcedure
		.input(z.number().positive())
		.mutation(async ({ ctx, input: recipeId }) => {
			await ctx.db
				.delete(recipe_likes)
				.where(
					and(eq(recipe_likes.recipeId, recipeId), eq(recipe_likes.userId, 1)),
				);
		}),
});
