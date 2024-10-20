import { api } from "@/trpc/server";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { RecipeCard } from "./RecipeCard";

interface CategoryPreview {
	category: {
		name: string;
		slug: string;
	};
}

interface CuisinePreview {
	cuisine: {
		name: string;
		slug: string;
	};
}

namespace RecipesGroupPreview {
	export type Props = CategoryPreview | CuisinePreview;
}

export const RecipesGroupPreview = async (props: RecipesGroupPreview.Props) => {
	const { name, slug, type, href } = (() => {
		if ("cuisine" in props) {
			return {
				name: props.cuisine.name,
				href: `/cuisines/${props.cuisine.slug}`,
				slug: props.cuisine.slug,
				type: "cuisine",
			};
		}

		return {
			name: props.category.name,
			href: `/categories/${props.category.slug}`,
			slug: props.category.slug,
			type: "category",
		};
	})();

	const recipes = await (type === "cuisine"
		? api.public.recipe.getRecipesByCuisine({ slug, limit: 6 })
		: api.public.recipe.getRecipesByCategory({ slug, limit: 6 }));

	return (
		<>
			<div className="mb-6 flex items-center justify-between rounded-lg bg-primary text-white shadow max-lg:px-4 max-lg:py-2 lg:px-6 lg:py-3">
				<h3 className="font-semibold italic max-lg:text-xl lg:text-2xl">
					{name}
				</h3>
				<Link
					href={href}
					className="flex items-center font-semibold hover:text-white/90"
				>
					View All <ChevronRight className="h-5 stroke-[3px]" />
				</Link>
			</div>
			<div className="max-lg:-mb-2 gap-4 max-lg:flex max-lg:overflow-auto max-lg:pb-2 lg:grid lg:grid-cols-[repeat(auto-fill,_minmax(350px,_1fr))]">
				{recipes.map((recipe) => (
					<RecipeCard key={recipe.id} recipe={recipe} />
				))}
			</div>
		</>
	);
};
