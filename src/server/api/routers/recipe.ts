import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { recipes } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const recipeRouter = createTRPCRouter({
	getRecipe: publicProcedure.input(z.number()).query(({ ctx, input }) => {
		return ctx.db.query.recipes.findFirst({
			where: eq(recipes.id, input),
		});
	}),

	getRecipes: publicProcedure.query(({ ctx }) => {
		return ctx.db.query.recipes.findMany({
			orderBy: (recipes, { desc }) => [desc(recipes.createdAt)],
		});
	}),

	addRecipe: publicProcedure
		.input(
			z.object({
				title: z.string().min(1),
				description: z.string().min(1),
				ingredients: z.string(),
				recipe: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			await ctx.db.insert(recipes).values({
				title: input.title,
				description: input.description,
				userId: 1,
				ingredients: input.ingredients,
				recipe: input.recipe,
			});
		}),
});
