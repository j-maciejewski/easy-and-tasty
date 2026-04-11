import {
  CATEGORIES,
  CUISINES,
  RECIPE_CATEGORIES,
  RECIPE_CUISINES,
  RECIPES,
  USERS,
} from "drizzle/seed/data";
import { sql } from "drizzle-orm";

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
    // @ts-expect-error
    return ctx.db.insert(recipes).values(RECIPES);
  }),

  seedRecipeCuisines: authenticatedProcedure.mutation(async ({ ctx }) => {
    await ctx.db
      .insert(recipe_cuisines)
      .values(RECIPE_CUISINES.map(({ id: _id, ...value }) => value));

    await ctx.db.execute(sql`
      SELECT setval(
        pg_get_serial_sequence('"easy-and-tasty_recipe_cuisine"', 'id'),
        COALESCE((SELECT MAX(id) FROM "easy-and-tasty_recipe_cuisine"), 1),
        true
      )
    `);
  }),

  seedRecipeCategories: authenticatedProcedure.mutation(async ({ ctx }) => {
    await ctx.db
      .insert(recipe_categories)
      .values(RECIPE_CATEGORIES.map(({ id: _id, ...value }) => value));

    await ctx.db.execute(sql`
      SELECT setval(
        pg_get_serial_sequence('"easy-and-tasty_recipe_category"', 'id'),
        COALESCE((SELECT MAX(id) FROM "easy-and-tasty_recipe_category"), 1),
        true
      )
    `);
  }),
});
