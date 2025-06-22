import {
  CATEGORIES,
  CUISINES,
  RECIPE_CATEGORIES,
  RECIPE_CUISINES,
  RECIPES,
  USERS,
} from "drizzle/seed/data";

import { authenticatedProcedure, createTRPCRouter } from "@/server/api/trpc";
import {
  categories,
  cuisines,
  recipe_categories,
  recipe_cuisines,
  recipes,
  users,
} from "@/server/db/schema";

export const seedRouter = createTRPCRouter({
  seedUsers: authenticatedProcedure.mutation(({ ctx }) => {
    return ctx.db.insert(users).values(USERS);
  }),

  seedCuisines: authenticatedProcedure.mutation(({ ctx }) => {
    return ctx.db.insert(cuisines).values(CUISINES);
  }),

  seedCategories: authenticatedProcedure.mutation(({ ctx }) => {
    return ctx.db.insert(categories).values(CATEGORIES);
  }),

  seedRecipes: authenticatedProcedure.mutation(({ ctx }) => {
    // @ts-ignore
    return ctx.db.insert(recipes).values(RECIPES);
  }),

  seedRecipeCuisines: authenticatedProcedure.mutation(({ ctx }) => {
    return ctx.db.insert(recipe_cuisines).values(RECIPE_CUISINES);
  }),

  seedRecipeCategories: authenticatedProcedure.mutation(({ ctx }) => {
    return ctx.db.insert(recipe_categories).values(RECIPE_CATEGORIES);
  }),
});
