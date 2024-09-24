import { recipes } from "@/server/db/schema";

declare global {
	type Prettify<T> = {
		[K in keyof T]: T[K];
	} & {};

	type Recipe = typeof recipes.$inferSelect;
	type RecipeRatingOptions = {
		avgRating: number;
		ratingsCount: number;
	};
}
