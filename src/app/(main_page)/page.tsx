import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/server";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { RecipeCard, RecipesCarousel } from "./_components";

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
						<div className="bg-primary text-white rounded-lg shadow flex justify-between max-lg:py-2 lg:py-3 max-lg:px-4 lg:px-6 items-center mb-6">
							<h3 className="max-lg:text-xl lg:text-2xl font-semibold italic">
								Breakfast
							</h3>
							<Link
								href="/categories/breakfast"
								className="font-semibold flex items-center hover:text-white/90"
							>
								View All <ChevronRight className="h-5 stroke-[3px]" />
							</Link>
						</div>
						<div className="gap-4 max-lg:flex max-lg:overflow-auto max-lg:pb-2 max-lg:-mb-2 lg:grid lg:grid-cols-[repeat(auto-fill,_minmax(350px,_1fr))]">
							{/* @ts-ignore */}
							{recipes.slice(0, 6).map((recipe) => (
								<RecipeCard key={recipe.id} recipe={recipe} />
							))}
						</div>
						<Separator className="my-6" />
						<div className="bg-primary text-white rounded-lg shadow flex justify-between max-lg:py-2 lg:py-3 max-lg:px-4 lg:px-6 items-center mb-6">
							<h3 className="max-lg:text-xl lg:text-2xl font-semibold italic">
								Pasta
							</h3>
							<Link
								href="/categories/pasta"
								className="font-semibold flex items-center hover:text-white/90"
							>
								View All <ChevronRight className="h-5 stroke-[3px]" />
							</Link>
						</div>
						<div className="gap-4 max-lg:flex max-lg:overflow-auto max-lg:pb-2 max-lg:-mb-2 lg:grid lg:grid-cols-[repeat(auto-fill,_minmax(350px,_1fr))]">
							{/* @ts-ignore */}
							{recipes.slice(6, 12).map((recipe) => (
								<RecipeCard key={recipe.id} recipe={recipe} />
							))}
						</div>
					</>
				) : (
					<p>no results</p>
				)}
			</div>
		</>
	);
}
