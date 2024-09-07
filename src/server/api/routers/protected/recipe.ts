import { env } from "@/env";
import { authedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { recipes } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const protectedRecipeRouter = createTRPCRouter({
	// @ts-ignore
	getRecipe: authedProcedure.input(z.number()).query(({ ctx, input }) => {
		if (env.MOCK_MODE) return GET_RECIPE_MOCK;

		return ctx.db.query.recipes.findFirst({
			where: eq(recipes.id, input),
		});
	}),

	// @ts-ignore
	getRecipes: authedProcedure.query(({ ctx }) => {
		if (env.MOCK_MODE) return GET_RECIPES_MOCK;

		return ctx.db.query.recipes.findMany({
			orderBy: (recipes, { desc }) => [desc(recipes.createdAt)],
		});
	}),

	addRecipe: authedProcedure
		.input(
			z.object({
				title: z.string().min(1),
				description: z.string().min(1),
				ingredients: z.string(),
				recipe: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			// @ts-ignore
			await ctx.db.insert(recipes).values({
				title: input.title,
				description: input.description,

				ingredients: input.ingredients,
				recipe: input.recipe,
			});
		}),

	// TODO: Add remaining recipe options
});

/* ======== MOCKS ======== */

const GET_RECIPES_MOCK = [
	{
		id: 1,
		title: "Chicken Caesar Salad Pizza",
		description: "Description",
		difficulty: "easy",
		image: "chicken-caesar.jpg",
		ingredients: "[]",
		recipe: "{}",
		servings: 3,
		slug: "chicken-caesar",
		time: 90,
		createdAt: new Date("2024-06-28T20:13:58.522Z"),
		updatedAt: null,
	},
];

const GET_RECIPE_MOCK = {
	id: 3,
	title: "mock",
	description: "Description",
	difficulty: "easy",
	image: null,
	ingredients: "[]",
	recipe: "{}",
	time: 90,
	createdAt: new Date("2024-06-28T20:13:58.522Z"),
	updatedAt: null,
};
