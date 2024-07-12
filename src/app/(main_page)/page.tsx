import { api } from "@/trpc/server";
import { RecipeCard } from "./_components/RecipeCard";

export default async function () {
	return (
		<>
			<Recipes />
		</>
	);
}

async function Recipes() {
	const recipes = await api.recipe.getRecipes();

	return (
		<div className="w-full max-w-[1000px] mx-auto">
			{recipes ? (
				<div className="grid m-4 gap-4 grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))]">
					{/* @ts-ignore */}
					{recipes.map((recipe) => (
						<RecipeCard key={recipe.id} recipe={recipe} />
					))}
				</div>
			) : (
				<p>no results</p>
			)}
		</div>
	);
}

// async function Recipes() {
// 	const results = await api.recipe.getRecipe(3);

// 	console.log({ results });

// 	return (
// 		<div className="w-full max-w-xs">
// 			{results ? (
// 				<p className="truncate">results: {JSON.stringify(results)}</p>
// 			) : (
// 				<p>no results</p>
// 			)}

// 			{/* <DevInput /> */}
// 		</div>
// 	);
// }
