import { authedProcedure, createTRPCRouter } from "@/server/api/trpc";
import {
	categories,
	cuisines,
	recipe_categories,
	recipe_cuisines,
	recipes,
	users,
} from "@/server/db/schema";
import {
	CATEGORIES,
	CUISINES,
	RECIPES,
	RECIPE_CATEGORIES,
	RECIPE_CUISINES,
	USERS,
} from "drizzle/seed/data";

export const seedRouter = createTRPCRouter({
	seedUsers: authedProcedure.mutation(({ ctx }) => {
		return ctx.db.insert(users).values(USERS);
	}),

	seedCuisines: authedProcedure.mutation(({ ctx }) => {
		return ctx.db.insert(cuisines).values(CUISINES);
	}),

	seedCategories: authedProcedure.mutation(({ ctx }) => {
		return ctx.db.insert(categories).values(CATEGORIES);
	}),

	seedRecipes: authedProcedure.mutation(({ ctx }) => {
		// @ts-ignore
		return ctx.db.insert(recipes).values(RECIPES);
	}),

	seedRecipeCuisines: authedProcedure.mutation(({ ctx }) => {
		return ctx.db.insert(recipe_cuisines).values(RECIPE_CUISINES);
	}),

	seedRecipeCategories: authedProcedure.mutation(({ ctx }) => {
		return ctx.db.insert(recipe_categories).values(RECIPE_CATEGORIES);
	}),
});
