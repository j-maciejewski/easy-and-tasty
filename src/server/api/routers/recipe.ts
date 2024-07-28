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
	getRecipeBySlug: publicProcedure.input(z.string()).query(({ ctx, input }) => {
		if (env.MOCK_MODE)
			return GET_RECIPES_MOCK.find((recipe) => recipe.slug === input) ?? null;

		return ctx.db.query.recipes.findFirst({
			// @ts-ignore
			where: eq(recipes.slug, input),
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
	{
		id: 2,
		title: "Lemon Basil Zucchini Pasta Alfredo",
		description: "Description",
		difficulty: "easy",
		image: "lemon-pasta.jpg",
		ingredients: "[]",
		recipe: "{}",
		servings: 3,
		slug: "lemon-pasta",
		time: 90,
		createdAt: new Date("2024-06-28T20:13:58.522Z"),
		updatedAt: null,
	},
	{
		id: 3,
		title: "Tajín Chicken Jalapeño Corn Caesar Salad",
		description: "Description",
		difficulty: "easy",
		image: "tajin-chicken.jpg",
		ingredients: "[]",
		recipe: "{}",
		servings: 3,
		slug: "tajin-chicken",
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
		image: "garlic.jpg",
		ingredients: "[]",
		rating: 5,
		recipe: "{}",
		servings: 3,
		slug: "garlic-butter",
		time: 90,
		createdAt: new Date("2024-06-28T20:13:58.522Z"),
		updatedAt: null,
	},
	{
		id: 5,
		title: "Greek Roasted Red Pepper Tomato Feta Orzo",
		description: "Description",
		difficulty: "medium",
		image: "greek.jpg",
		ingredients: "[]",
		rating: 2,
		recipe: "{}",
		servings: 3,
		slug: "greek",
		time: 90,
		createdAt: new Date("2024-06-28T20:13:58.522Z"),
		updatedAt: null,
	},
	{
		id: 6,
		title: "BBQ Salmon Curry with Mango Avocado Salsa",
		description: "Description",
		difficulty: "easy",
		image: "bbq.jpg",
		ingredients: "[]",
		rating: 4.5,
		recipe: "{}",
		servings: 3,
		slug: "bbq",
		time: 90,
		createdAt: new Date("2024-06-28T20:13:58.522Z"),
		updatedAt: null,
	},
	{
		id: 7,
		title: "Effortless Marinated Burrata",
		description: "Description",
		difficulty: "hard",
		image: "burrata.jpg",
		ingredients: "[]",
		rating: 2.6,
		recipe: "{}",
		servings: 3,
		slug: "burrata",
		time: 90,
		createdAt: new Date("2024-06-28T20:13:58.522Z"),
		updatedAt: null,
	},
	{
		id: 8,
		title: "Pull Apart Cheeseburger Sliders",
		description: "Description",
		difficulty: "medium",
		image: "cheeseburger.jpg",
		ingredients: "[]",
		rating: 1.8,
		recipe: "{}",
		servings: 3,
		slug: "cheeseburger",
		time: 90,
		createdAt: new Date("2024-06-28T20:13:58.522Z"),
		updatedAt: null,
	},
	{
		id: 9,
		title: "No Churn Creamy Strawberry Ice Cream",
		description: "Description",
		difficulty: "easy",
		image: "icecream.jpg",
		ingredients: "[]",
		recipe: "{}",
		servings: 3,
		slug: "icecream",
		time: 90,
		createdAt: new Date("2024-06-28T20:13:58.522Z"),
		updatedAt: null,
	},
	{
		id: 10,
		title: "Chipotle Chile Lime Chicken Quesadillas",
		description: "Description",
		difficulty: "medium",
		image: "chipotle.jpg",
		ingredients: "[]",
		rating: 2,
		recipe: "{}",
		servings: 3,
		slug: "chipotle",
		time: 90,
		createdAt: new Date("2024-06-28T20:13:58.522Z"),
		updatedAt: null,
	},
	{
		id: 11,
		title: "Tomato and Avocado Bruschetta",
		description:
			"Everything you love about avocado toast with everything you love about classic Italian bruschetta all together for one light and fresh appetizer recipe. ",
		difficulty: "medium",
		image: "bruschetta.jpg",
		ingredients: "[]",
		rating: 2,
		recipe: "{}",
		servings: 3,
		slug: "tomato-and-avocado-bruschetta",
		time: 90,
		createdAt: new Date("2024-06-28T20:13:58.522Z"),
		updatedAt: null,
	},
	{
		id: 12,
		title: "Light & Fluffy Sweedish Pancakes",
		description:
			"A simple recipe for Swedish pancakes that can be topped with powdered sugar, jam, or more.",
		difficulty: "easy",
		image: "sweedish-pancakes.jpg",
		ingredients:
			'[{"label":"test123","ingredients":["3 tablespoons unsalted butter, plus more for cooking","2 cups milk","1 cup all-purpose flour","3 large eggs","1 tablespoon granulated sugar","1/4 teaspoon kosher salt","For serving: fresh fruit or jam, whipped cream, powdered sugar, lemon juice, maple syrup, or yogurt"]},{"label":"Sauce","ingredients":["3 tablespoons unsalted butter, plus more for cooking","2 cups milk","For serving: fresh fruit or jam, whipped cream, powdered sugar, lemon juice, maple syrup, or yogurt"]}]',
		rating: 4.7,
		recipe: "{}",
		servings: 3,
		slug: "sweedish-pancakes",
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
