import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { recipe_tags } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const recipeTagRouter = createTRPCRouter({
	addRecipeTag: publicProcedure
		.input(
			z.object({
				recipeId: z.number().positive(),
				tagId: z.number().positive(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			await ctx.db.insert(recipe_tags).values({
				tagId: input.tagId,
				recipeId: input.recipeId,
			});
		}),

	removeRecipeTag: publicProcedure
		.input(
			z.object({
				recipeId: z.number().positive(),
				tagId: z.number().positive(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			await ctx.db
				.delete(recipe_tags)
				.where(
					and(
						eq(recipe_tags.recipeId, input.recipeId),
						eq(recipe_tags.tagId, input.tagId),
					),
				);
		}),
});
