import { env } from "@/env";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
	recipe_categories,
	recipe_cuisines,
	recipe_ratings,
	recipes,
} from "@/server/db/schema";
import { desc, eq, ilike, sql } from "drizzle-orm";
import { z } from "zod";

export const protectedRecipeRouter = createTRPCRouter({
	// @ts-ignore
	getRecipe: protectedProcedure.input(z.number()).query(({ ctx, input }) => {
		if (env.MOCK_MODE) return GET_RECIPE_MOCK;

		return ctx.db.query.recipes.findFirst({
			where: eq(recipes.id, input),
		});
	}),

	// @ts-ignore
	getRecipes: protectedProcedure
		.input(
			z.object({
				title: z.string().optional(),
				orderBy: z.string().optional().default("createdAt"),
				orderDir: z.enum(["desc", "asc"]).optional().default("desc"),
				page: z.number().optional().default(1),
				limit: z.number().optional().default(10),
			}),
		)
		.query(async ({ ctx, input }) => {
			const results = await ctx.db
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
					createdAt: recipes.createdAt,
					updatedAt: recipes.updatedAt,
					avgRating:
						sql<number>`CAST(ROUND(COALESCE(AVG(${recipe_ratings.score}), 0), 2) as float)`.as(
							"avg_rating",
						),
					ratingsCount:
						sql<number>`CAST(COUNT(${recipe_ratings.id}) as int)`.as(
							"ratings_count",
						),
					categoryIds: sql<
						number[]
					>`COALESCE(json_agg(DISTINCT ${recipe_categories.categoryId} ORDER BY ${recipe_categories.categoryId} NULLS LAST) FILTER (WHERE ${recipe_categories.categoryId} IS NOT NULL), '[]')`.as(
						"category_ids",
					),
					cuisineIds: sql<
						number[]
					>`COALESCE(json_agg(DISTINCT ${recipe_cuisines.cuisineId} ORDER BY ${recipe_cuisines.cuisineId} NULLS LAST) FILTER (WHERE ${recipe_cuisines.cuisineId} IS NOT NULL), '[]')`.as(
						"cuisine_ids",
					),
				})
				.from(recipes)
				.where(ilike(recipes.title, `%${input.title}%`))
				.leftJoin(recipe_ratings, eq(recipe_ratings.recipeId, recipes.id))
				.leftJoin(recipe_categories, eq(recipe_categories.recipeId, recipes.id))
				.leftJoin(recipe_cuisines, eq(recipe_cuisines.recipeId, recipes.id))
				.groupBy(recipes.id)
				.orderBy(
					(() => {
						if (input.orderBy === "avg_rating") {
							if (input.orderDir === "desc") return sql`avg_rating DESC`;
							return sql`avg_rating ASC`;
						}

						if (input.orderBy === "ratings_count") {
							if (input.orderDir === "desc") return sql`ratings_count DESC`;
							return sql`ratings_count ASC`;
						}

						return input.orderDir === "desc"
							? // @ts-ignore
								desc(recipes[input.orderBy])
							: // @ts-ignore
								recipes[input.orderBy];
					})(),
				)
				.offset((input.page - 1) * input.limit)
				.limit(input.limit);

			const totalResults = await ctx.db
				.select({
					total: sql<number>`CAST(COUNT(*) as float)`,
				})
				.from(recipes)
				.where(ilike(recipes.title, `%${input.title}%`));

			const pagination = totalResults?.[0]?.total
				? {
						hitsCount: totalResults[0].total,
						currentPage: input.page,
						pagesCount: Math.ceil(totalResults[0].total / input.limit),
					}
				: null;

			return { results, pagination };
		}),

	addRecipe: protectedProcedure
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
