import { api } from "@/trpc/server";
import { RecipeCard } from "./_components/RecipeCard";
import { SideBar } from "./_components/SideBar";

export default async function () {
	return (
		<div className="w-full max-w-[1200px] mx-auto flex flex-col lg:flex-row pt-12 pb-6">
			<Recipes />
			<SideBar />
		</div>
	);
}

async function Recipes() {
	const recipes = await api.recipe.getRecipes();

	return (
		<div className="grow mx-4">
			{recipes ? (
				<>
					<h3 className="text-3xl font-semibold dark:text-white text-center mb-6">
						Newest recipes
					</h3>
					<div className="grid gap-4 grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))]">
						{/* @ts-ignore */}
						{recipes.slice(3).map((recipe) => (
							<RecipeCard key={recipe.id} recipe={recipe} />
						))}
					</div>
				</>
			) : (
				<p>no results</p>
			)}
		</div>
	);
}
