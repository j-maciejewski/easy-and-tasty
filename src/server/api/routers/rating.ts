import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { ratings } from "@/server/db/schema";
import { z } from "zod";

export const ratingRouter = createTRPCRouter({
	rateRecipe: publicProcedure
		.input(
			z.object({
				score: z.number().min(1).max(5),
				recipeId: z.number().positive(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			await ctx.db.insert(ratings).values({
				score: input.score,
				recipeId: input.recipeId,
				userId: 1,
			});
		}),
});
