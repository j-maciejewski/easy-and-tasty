import { env } from "@/env";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  categories,
  cuisines,
  recipe_categories,
  recipe_cuisines,
  recipe_ratings,
  recipes,
} from "@/server/db/schema";
import { eq, ilike, sql } from "drizzle-orm";
import { z } from "zod";

export const publicRecipeRouter = createTRPCRouter({
  getRecipeBySlug: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    // #region
    if (env.MOCK_MODE) {
      const recipe = GET_RECIPES_MOCK.find((recipe) => recipe.slug === input) as
        | Recipe
        | undefined;

      if (!recipe) return [];

      return [
        {
          ...recipe,
          avgRating: 1.5,
          ratingsCount: 2,
          categories: [],
          cuisines: [],
        },
      ];
    }
    // #endregion

    return ctx.db
      .select({
        id: recipes.id,
        title: recipes.title,
        description: recipes.description,
        image: recipes.image,
        difficulty: recipes.difficulty,
        content: recipes.content,
        servings: recipes.servings,
        slug: recipes.slug,
        time: recipes.time,
        avgRating: sql<number>`CAST(ROUND(COALESCE(AVG(${recipe_ratings.score}), 0), 2) as float)`,
        ratingsCount: sql<number>`CAST(COUNT(${recipe_ratings.id}) as int)`,
        categories: sql<{ name: string; slug: string }[]>`
				COALESCE(
					jsonb_agg(DISTINCT jsonb_build_object('name', ${categories.name}, 'slug', ${categories.slug}))
					FILTER (WHERE ${categories.name} IS NOT NULL AND ${categories.slug} IS NOT NULL),
					'[]'::jsonb
				)
				`.as("categories"),
        cuisines: sql<{ name: string; slug: string }[]>`
				COALESCE(
					jsonb_agg(DISTINCT jsonb_build_object('name', ${cuisines.name}, 'slug', ${cuisines.slug}))
					FILTER (WHERE ${cuisines.name} IS NOT NULL AND ${cuisines.slug} IS NOT NULL),
					'[]'::jsonb
				)
				`.as("cuisines"),
      })
      .from(recipes)
      .where(eq(recipes.slug, input))
      .leftJoin(recipe_ratings, eq(recipe_ratings.recipeId, recipes.id))
      .leftJoin(recipe_categories, eq(recipe_categories.recipeId, recipes.id))
      .leftJoin(categories, eq(categories.id, recipe_categories.categoryId))
      .leftJoin(recipe_cuisines, eq(recipe_cuisines.recipeId, recipes.id))
      .leftJoin(cuisines, eq(cuisines.id, recipe_cuisines.cuisineId))

      .groupBy(recipes.id)
      .limit(1);
  }),

  getRandomRecipes: publicProcedure
    .input(z.number())
    .query(({ ctx, input: recipesCount }) => {
      // #region
      if (env.MOCK_MODE)
        return GET_RECIPES_MOCK.slice(0, recipesCount).map((recipe) => ({
          ...recipe,
          avgRating: 1.5,
          ratingsCount: 2,
        })) as (Recipe & { avgRating: number; ratingsCount: number })[];
      // #endregion

      return ctx.db
        .select({
          id: recipes.id,
          title: recipes.title,
          description: recipes.description,
          image: recipes.image,
          difficulty: recipes.difficulty,
          servings: recipes.servings,
          slug: recipes.slug,
          time: recipes.time,
          avgRating: sql<number>`CAST(ROUND(COALESCE(AVG(${recipe_ratings.score}), 0), 2) as float)`,
          ratingsCount: sql<number>`CAST(COUNT(${recipe_ratings.id}) as int)`,
        })
        .from(recipes)
        .leftJoin(recipe_ratings, eq(recipe_ratings.recipeId, recipes.id))
        .groupBy(recipes.id)
        .orderBy(sql`RANDOM()`)
        .limit(recipesCount);
    }),

  getRecipesByQuery: publicProcedure
    .input(z.string().min(3))
    .query(({ ctx, input: searchQuery }) => {
      // #region
      if (env.MOCK_MODE)
        return GET_RECIPES_MOCK.filter((recipe) =>
          recipe.title.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      // #endregion

      return ctx.db.query.recipes.findMany({
        columns: {
          id: true,
          title: true,
          slug: true,
        },
        where: ilike(recipes.title, `%${searchQuery}%`),
        orderBy: (recipes, { desc }) => [desc(recipes.createdAt)],
        limit: 10,
      });
    }),

  getRecipesByCategory: publicProcedure
    .input(
      z.object({
        slug: z.string(),
        limit: z.number().default(12),
        offset: z.number().default(0),
      }),
    )
    .query(({ ctx, input }) => {
      // #region
      if (env.MOCK_MODE)
        return GET_RECIPES_MOCK.slice(
          input.offset,
          input.offset + input.limit,
        ).map((recipe) => ({
          ...recipe,
          avgRating: 1.5,
          ratingsCount: 2,
        })) as (Recipe & { avgRating: number; ratingsCount: number })[];
      // #endregion

      return ctx.db
        .select({
          id: recipes.id,
          title: recipes.title,
          description: recipes.description,
          image: recipes.image,
          createdAt: recipes.createdAt,
          slug: recipes.slug,
          time: recipes.time,
          difficulty: recipes.difficulty,
          servings: recipes.servings,
          avgRating: sql<number>`CAST(ROUND(COALESCE(AVG(${recipe_ratings.score}), 0), 2) as float)`,
          ratingsCount: sql<number>`CAST(COUNT(${recipe_ratings.id}) as int)`,
        })
        .from(recipes)
        .leftJoin(recipe_ratings, eq(recipe_ratings.recipeId, recipes.id))
        .innerJoin(
          recipe_categories,
          eq(recipes.id, recipe_categories.recipeId),
        )
        .innerJoin(categories, eq(recipe_categories.categoryId, categories.id))
        .where(eq(categories.slug, input.slug))
        .groupBy(recipes.id)
        .offset(input.offset)
        .limit(input.limit);
    }),

  getRecipesByCuisine: publicProcedure
    .input(
      z.object({
        slug: z.string(),
        limit: z.number().default(12),
        offset: z.number().default(0),
      }),
    )
    .query(({ ctx, input }) => {
      // #region
      if (env.MOCK_MODE)
        return GET_RECIPES_MOCK.slice(
          input.offset,
          input.offset + input.limit,
        ).map((recipe) => ({
          ...recipe,
          avgRating: 1.5,
          ratingsCount: 2,
        })) as (Recipe & { avgRating: number; ratingsCount: number })[];
      // #endregion

      return ctx.db
        .select({
          id: recipes.id,
          title: recipes.title,
          description: recipes.description,
          image: recipes.image,
          createdAt: recipes.createdAt,
          slug: recipes.slug,
          time: recipes.time,
          difficulty: recipes.difficulty,
          servings: recipes.servings,
          avgRating: sql<number>`CAST(ROUND(COALESCE(AVG(${recipe_ratings.score}), 0), 2) as float)`,
          ratingsCount: sql<number>`CAST(COUNT(${recipe_ratings.id}) as int)`,
        })
        .from(recipes)
        .leftJoin(recipe_ratings, eq(recipe_ratings.recipeId, recipes.id))
        .innerJoin(recipe_cuisines, eq(recipes.id, recipe_cuisines.recipeId))
        .innerJoin(cuisines, eq(recipe_cuisines.cuisineId, cuisines.id))
        .where(eq(cuisines.slug, input.slug))
        .groupBy(recipes.id)
        .offset(input.offset)
        .limit(input.limit);
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
    rating: 4.7,
    content: `
Swedish pancakes are light, thin, and delicious. They are slightly different from regular pancakes, with a delicate texture and a subtle sweetness.

## Ingredients

- 1 cup all-purpose flour
- 1 ½ cups milk
- 3 large eggs
- 2 tbsp granulated sugar
- ¼ tsp salt
- 3 tbsp unsalted butter, melted (plus extra for the pan)
- 1 tsp vanilla extract

## Instructions

### 1. Prepare the Batter
- In a large mixing bowl, whisk together the flour, sugar, and salt.
- In a separate bowl, beat the eggs and then add in the milk and vanilla extract.
- Gradually pour the wet ingredients into the dry ingredients, stirring until smooth and lump-free.
- Stir in the melted butter until fully combined. The batter should be thin and smooth.

### 2. Heat the Pan
- Heat a non-stick skillet or crepe pan over medium heat.
- Lightly butter the pan.

### 3. Cook the Pancakes
- Pour about ¼ cup of batter onto the pan, swirling it to spread the batter thinly across the surface.
- Cook for 1-2 minutes, or until the edges start to lift and the bottom is golden brown.
- Flip the pancake and cook the other side for about 30 seconds to 1 minute.
- Repeat with the remaining batter, buttering the pan as needed.

### 4. Serve
- Stack the pancakes and serve warm with your favorite toppings: fresh berries, whipped cream, powdered sugar, or a drizzle of syrup.

## Tips for Perfect Swedish Pancakes
- **Thin batter:** The batter should be thinner than traditional pancake batter, almost like crepe batter.
- **Pan heat:** Make sure the pan is properly heated, but not too hot. This ensures an even, golden color without burning.
- **Toppings:** Swedish pancakes are versatile. Try serving them with lingonberry jam, honey, or a sprinkle of cinnamon sugar.

Enjoy your light and fluffy Swedish pancakes!
		`,
    servings: 3,
    slug: "sweedish-pancakes",
    time: 90,
    createdAt: new Date("2024-06-28T20:13:58.522Z"),
    updatedAt: null,
  },
];
