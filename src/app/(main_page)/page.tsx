import { Button } from "@/components/ui/button";
import { api } from "@/trpc/server";
import Image from "next/image";
import Link from "next/link";
import { RecipeCard } from "./_components/RecipeCard";
import { RecipeInformation } from "./_components/RecipeInformation";
import { SideBar } from "./_components/SideBar";

export default async function () {
	return <Recipes />;
}

async function Recipes() {
	const recipes = await api.recipe.getRecipes();

	const featuredRecipe = recipes[11];

	return (
		<>
			<div className="grow max-xl:px-[3vw] xl:pr-8">
				{recipes ? (
					<>
						<h3 className="max-lg:text-xl lg:text-2xl font-semibold mb-4 bg-primary max-lg:py-2 lg:py-3 max-lg:px-4 lg:px-6 italic text-white">
							Latest recipes
						</h3>
						<div className="sm:flex mb-4 rounded-lg overflow-hidden shadow">
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
							<div className="bg-white grow max-sm:p-4 sm:p-6 flex flex-col">
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
						<div className="gap-4 max-lg:flex max-lg:overflow-auto max-lg:pb-2 max-lg:-mb-2 lg:grid lg:grid-cols-[repeat(auto-fill,_minmax(225px,_1fr))]">
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
			<SideBar />
		</>
	);
}
