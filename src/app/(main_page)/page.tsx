import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/server";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import {
	RecipeCard,
	RecipesCarousel,
	RecipesGroupPreview,
} from "./_components";

export default async function () {
	return <Recipes />;
}

async function Recipes() {
	const recipes = await api.public.recipe.getRecipes();

	return (
		<>
			<div className="grow max-xl:px-[3vw] w-full pt-6">
				{recipes ? (
					<>
						<RecipesCarousel recipes={recipes.slice(0, 5)} />
						<Separator className="my-6" />
						<RecipesGroupPreview
							category={{ name: "Breakfast", slug: "breakfast" }}
						/>
						<Separator className="my-6" />
						<RecipesGroupPreview
							cuisine={{ name: "Italian", slug: "italian" }}
						/>
					</>
				) : (
					<p>no results</p>
				)}
			</div>
		</>
	);
}
