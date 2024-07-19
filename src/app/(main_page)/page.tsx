import { Button } from "@/components/ui/button";
import { api } from "@/trpc/server";
import Image from "next/image";
import Link from "next/link";
import { RecipeCard } from "./_components/RecipeCard";
import { RecipeInformation } from "./_components/RecipeInformation";
import { SideBar } from "./_components/SideBar";

export default async function () {
	return (
		<div className="w-full max-xl:max-w-[1000px] max-w-[1200px] mx-auto flex flex-col xl:flex-row">
			<Recipes />
			<SideBar />
		</div>
	);
}

async function Recipes() {
	const recipes = await api.recipe.getRecipes();

	const featuredRecipe = recipes[3];

	return (
		<div className="grow mx-4">
			{recipes ? (
				<>
					<h3 className="text-2xl font-semibold mb-4 bg-primary p-3 pl-6 italic text-white">
						Latest recipes
					</h3>
					<div className="sm:flex mb-4 rounded-lg overflow-hidden">
						<div className="max-sm:w-full sm:min-w-[40%] sm:w-2/5">
							<Image
								src={`/mock/meals/${featuredRecipe.image}`}
								width={400}
								height={600}
								alt="recipe"
								loading="lazy"
								className="max-sm:w-full min-h-full max-h-[325px] object-cover"
							/>
						</div>
						<div className="bg-white grow p-6 flex flex-col">
							<h3 className="font-semibold tracking-tight text-xl mb-3 max-sm:text-center">
								{featuredRecipe.title}
							</h3>
							<div className="mb-3 sm:hidden">
								<RecipeInformation recipe={featuredRecipe} />
							</div>
							<p className="text-gray-600 text-sm grow mb-3">
								{featuredRecipe.description}
							</p>
							<div className="flex justify-center items-center">
								<div className="max-sm:hidden">
									<RecipeInformation recipe={featuredRecipe} />
								</div>
								<Button
									type="button"
									className="block ml-auto rounded-full hover:bg-primary hover:text-white w-fit text-center max-sm:w-full font-semibold"
									variant="outline"
									asChild
								>
									<Link href={`/recipe/${featuredRecipe.slug}`}>
										See Recipe
									</Link>
								</Button>
							</div>
						</div>
					</div>
					<div className="gap-4 max-lg:flex max-lg:overflow-auto max-lg:pb-2 max-lg:-mb-2 lg:grid lg:grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] xl:grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))]">
						{/* @ts-ignore */}
						{recipes.slice(4).map((recipe) => (
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
