import { env } from "@/env";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { recipes } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const recipeRouter = createTRPCRouter({
	// @ts-ignore
	getRecipe: publicProcedure.input(z.number()).query(({ ctx, input }) => {
		if (env.MOCK_MODE) return GET_RECIPE_MOCK;

		return ctx.db.query.recipes.findFirst({
			where: eq(recipes.id, input),
		});
	}),

	// @ts-ignore
	getRecipes: publicProcedure.query(({ ctx }) => {
		if (env.MOCK_MODE) return GET_RECIPES_MOCK;

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
			// @ts-ignore
			await ctx.db.insert(recipes).values({
				title: input.title,
				description: input.description,

				ingredients: input.ingredients,
				recipe: input.recipe,
			});
		}),
});

/* ======== MOCKS ======== */

const GET_RECIPES_MOCK = [
	{
		id: 1,
		title: "Chicken Caesar Salad Pizza",
		description: "trest",
		difficulty: "easy",
		image: "chicken-caesar-1.jpg",
		ingredients: "{}",
		recipe: "{}",
		slug: "garlic-butter",
		time: 90,
		createdAt: new Date("2024-06-28T20:13:58.522Z"),
		updatedAt: null,
	},
	{
		id: 2,
		title: "Lemon Basil Zucchini Pasta Alfredo",
		description: "trest",
		difficulty: "easy",
		image: "lemon-pasta-1.jpg",
		ingredients: "{}",
		recipe: "{}",
		slug: "garlic-butter",
		time: 90,
		createdAt: new Date("2024-06-28T20:13:58.522Z"),
		updatedAt: null,
	},
	{
		id: 3,
		title: "Tajín Chicken Jalapeño Corn Caesar Salad",
		description: "trest",
		difficulty: "easy",
		image: "tajin-chicken-1.jpg",
		ingredients: "{}",
		recipe: "{}",
		slug: "garlic-butter",
		time: 90,
		createdAt: new Date("2024-06-28T20:13:58.522Z"),
		updatedAt: null,
	},
	{
		id: 4,
		title: "Garlic Butter Creamed Corn Pork Chops",
		description:
			"Garlic Butter Creamed Corn Pork Chops. Pan-fried pork chops in a garlicky creamed corn sauce that’s truly delicious. Made with bone-in pork chops, fresh corn, herbs, and parmesan cheese, these creamed corn pork chops are topped with crispy prosciutto and fresh herbs. This dish is totally delicious. Especially with a great summery house salad and warm bread on the side to soak up all that creamy corn sauce. It’s a quintessential summer dinner that everyone will love!",
		difficulty: "easy",
		image: "garlic-1.jpg",
		ingredients: "{}",
		rating: 5,
		recipe: "{}",
		slug: "garlic-butter",
		time: 90,
		createdAt: new Date("2024-06-28T20:13:58.522Z"),
		updatedAt: null,
	},
	{
		id: 5,
		title: "Greek Roasted Red Pepper Tomato Feta Orzo",
		description: "trest",
		difficulty: "medium",
		image: "greek-1.jpg",
		ingredients: "{}",
		rating: 2,
		recipe: "{}",
		slug: "garlic-butter",
		time: 90,
		createdAt: new Date("2024-06-28T20:13:58.522Z"),
		updatedAt: null,
	},
	{
		id: 6,
		title: "BBQ Salmon Curry with Mango Avocado Salsa",
		description: "trest",
		difficulty: "easy",
		image: "bbq-1.jpg",
		ingredients: "{}",
		rating: 4.5,
		recipe: "{}",
		slug: "garlic-butter",
		time: 90,
		createdAt: new Date("2024-06-28T20:13:58.522Z"),
		updatedAt: null,
	},
	{
		id: 7,
		title: "Effortless Marinated Burrata",
		description: "trest",
		difficulty: "hard",
		image: "burrata-1.jpg",
		ingredients: "{}",
		rating: 2.6,
		recipe: "{}",
		slug: "garlic-butter",
		time: 90,
		createdAt: new Date("2024-06-28T20:13:58.522Z"),
		updatedAt: null,
	},
	{
		id: 8,
		title: "Pull Apart Cheeseburger Sliders",
		description: "trest",
		difficulty: "medium",
		image: "cheeseburger-1.jpg",
		ingredients: "{}",
		rating: 1.8,
		recipe: "{}",
		slug: "garlic-butter",
		time: 90,
		createdAt: new Date("2024-06-28T20:13:58.522Z"),
		updatedAt: null,
	},
	{
		id: 9,
		title: "No Churn Creamy Strawberry Ice Cream",
		description: "trest",
		difficulty: "easy",
		image: "icecream-1.jpg",
		ingredients: "{}",
		recipe: "{}",
		slug: "garlic-butter",
		time: 90,
		createdAt: new Date("2024-06-28T20:13:58.522Z"),
		updatedAt: null,
	},
	{
		id: 10,
		title: "Chipotle Chile Lime Chicken Quesadillas",
		description: "trest",
		difficulty: "medium",
		image: "chipotle-1.jpg",
		ingredients: "{}",
		rating: 2,
		recipe: "{}",
		slug: "garlic-butter",
		time: 90,
		createdAt: new Date("2024-06-28T20:13:58.522Z"),
		updatedAt: null,
	},
];

const GET_RECIPE_MOCK = {
	id: 3,
	title: "mock",
	description: "trest",
	difficulty: "easy",
	image: null,
	ingredients: "{}",
	recipe: "{}",
	time: 90,
	createdAt: new Date("2024-06-28T20:13:58.522Z"),
	updatedAt: null,
};
