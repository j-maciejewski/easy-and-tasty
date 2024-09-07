import { env } from "@/env";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { categories } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const publicCategoryRouter = createTRPCRouter({
	getCategories: publicProcedure.query(({ ctx }) => {
		if (env.MOCK_MODE) return GET_CATEGORIES_MOCK;

		return ctx.db.query.categories.findMany({
			orderBy: (categories, { desc }) => [desc(categories.name)],
		});
	}),

	getCategoryBySlug: publicProcedure
		.input(z.string())
		.query(({ ctx, input: categorySlug }) => {
			if (env.MOCK_MODE)
				return GET_CATEGORIES_MOCK.find(
					(category) => category.slug === categorySlug,
				);

			return ctx.db.query.categories.findFirst({
				where: eq(categories.slug, categorySlug),
			});
		}),
});

/* ======== MOCKS ======== */

const GET_CATEGORIES_MOCK = [
	{
		id: 1,
		name: "Breakfast",
		description:
			"Meals typically eaten in the morning, like eggs and pancakes.",
		slug: "breakfast",
	},
	{
		id: 2,
		name: "Brunch",
		description:
			"A mid-morning meal combining elements of breakfast and lunch.",
		slug: "brunch",
	},
	{
		id: 3,
		name: "Lunch",
		description: "A midday meal, usually lighter than dinner.",
		slug: "lunch",
	},
	{
		id: 4,
		name: "Dinner",
		description: "The main meal of the day, often eaten in the evening.",
		slug: "dinner",
	},
	{
		id: 5,
		name: "Pancakes",
		description: "Flat cakes made from batter, often served with syrup.",
		slug: "pancakes",
	},
	{
		id: 6,
		name: "Sandwiches, Wraps and Rolls",
		description:
			"Quick, handheld meals with fillings like meat, cheese, or veggies.",
		slug: "sandwiches-wraps-and-rolls",
	},
	{
		id: 7,
		name: "Appetisers",
		description:
			"Small dishes served before the main course to stimulate appetite.",
		slug: "appetisers",
	},
	{
		id: 8,
		name: "Soups",
		description:
			"Liquid-based dishes, often served hot and made from broth or vegetables.",
		slug: "soups",
	},
	{
		id: 9,
		name: "Salads",
		description:
			"Cold dishes made with raw or cooked vegetables, often with dressings.",
		slug: "salads",
	},
	{
		id: 10,
		name: "Sides",
		description: "Complementary dishes served alongside main courses.",
		slug: "sides",
	},
	{
		id: 11,
		name: "Snacks",
		description: "Small, light foods eaten between meals for quick energy.",
		slug: "snacks",
	},
	{
		id: 12,
		name: "Burgers",
		description:
			"Sandwiches with a patty, typically beef, served with various toppings.",
		slug: "burgers",
	},
	{
		id: 13,
		name: "Pizza",
		description:
			"Flatbreads topped with sauce, cheese, and various toppings, baked to perfection.",
		slug: "pizza",
	},
	{
		id: 14,
		name: "Pies",
		description:
			"Savory or sweet dishes baked with a pastry crust, filled with meat or fruit.",
		slug: "pies",
	},
	{
		id: 15,
		name: "Quiches and Savoury Tarts",
		description: "Baked dishes with a savory filling inside a pastry crust.",
		slug: "quiches-and-savoury-tarts",
	},
	{
		id: 16,
		name: "Mince",
		description: "Ground meat dishes, often used in a variety of recipes.",
		slug: "mince",
	},
	{
		id: 17,
		name: "Lamb",
		description: "Dishes made from lamb meat, often roasted or grilled.",
		slug: "lamb",
	},
	{
		id: 18,
		name: "Chicken",
		description:
			"Poultry-based dishes, versatile and used in many global cuisines.",
		slug: "chicken",
	},
	{
		id: 19,
		name: "Seafood",
		description: "Dishes made with fish, shrimp, or other oceanic ingredients.",
		slug: "seafood",
	},
	{
		id: 20,
		name: "Rice",
		description:
			"Dishes centered around cooked rice, a staple in many cultures.",
		slug: "rice",
	},
	{
		id: 21,
		name: "Noodles",
		description:
			"Pasta-like dishes made with wheat, rice, or other types of noodles.",
		slug: "noodles",
	},
	{
		id: 22,
		name: "Pasta",
		description:
			"Italian-style dishes made with pasta and sauces, often tomato-based.",
		slug: "pasta",
	},
	{
		id: 23,
		name: "Sausages",
		description: "Ground meat encased in skin, often grilled or fried.",
		slug: "sausages",
	},
	{
		id: 24,
		name: "Beef",
		description:
			"Dishes made with cuts of beef, often roasted, grilled, or stewed.",
		slug: "beef",
	},
	{
		id: 25,
		name: "Stir Fry",
		description:
			"Quick-cooked dishes with vegetables and proteins, often Asian-inspired.",
		slug: "stir-fry",
	},
	{
		id: 26,
		name: "Pork",
		description: "Dishes made from pork, including roasts, ribs, and bacon.",
		slug: "pork",
	},
	{
		id: 27,
		name: "Sauces",
		description: "Liquid or semi-liquid accompaniments for enhancing dishes.",
		slug: "sauces",
	},
	{
		id: 28,
		name: "Bread",
		description: "Baked goods made from dough, a staple in many meals.",
		slug: "bread",
	},
	{
		id: 29,
		name: "Biscuits and Cookies",
		description: "Sweet, baked treats, often crunchy or soft.",
		slug: "biscuits-and-cookies",
	},
	{
		id: 30,
		name: "Desserts",
		description: "Sweet dishes served after meals, like cakes or ice cream.",
		slug: "desserts",
	},
];
