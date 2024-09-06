import { api } from "@/trpc/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs, RecipeInformation } from "../../_components";
import { Ingredients } from "./_components/Ingredients";

export default async function ({ params }: { params: { slug: string } }) {
	const recipe = await api.recipe.getRecipeBySlug(params.slug);

	if (!recipe) {
		notFound();
	}

	const ingredientsGroups = JSON.parse(recipe.ingredients);

	return (
		<>
			<div className="pt-6 xl:pr-8 overflow-hidden max-xl:px-[3vw] grow">
				<Breadcrumbs
					paths={[{ label: "Recipe" }, { label: recipe.title, active: true }]}
				/>
				<h2 className="text-3xl font-semibold text-center">{recipe.title}</h2>
				<div className="max-h-[700px] my-6 lg:px-12">
					<Image
						src={`/mock/meals/${recipe.image}`}
						width={400}
						height={600}
						alt="recipe"
						loading="lazy"
						className="rounded-lg max-sm:w-full min-h-full object-cover max-h-[700px] mx-auto w-full"
					/>
				</div>
				<RecipeInformation recipe={recipe} withText withServings />
				<p className="text-base mt-6 mb-6">{recipe.description}</p>
				<p className="text-gray-600">
					<q>content</q>
				</p>
			</div>
			<div className="xl:min-w-[30%] xl:w-[30%] text-gray-600 text-sm max-xl:px-[3vw] pt-6">
				{ingredientsGroups.length > 0 && (
					<Ingredients ingredientsGroups={ingredientsGroups} />
				)}
			</div>
		</>
	);
}
