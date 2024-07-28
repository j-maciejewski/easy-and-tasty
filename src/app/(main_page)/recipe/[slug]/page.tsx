import { api } from "@/trpc/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { RecipeInformation } from "../../_components/RecipeInformation";

export default async function ({ params }: { params: { slug: string } }) {
	const recipe = await api.recipe.getRecipeBySlug(params.slug);

	if (!recipe) {
		notFound();
	}

	const ingredientsGroups = JSON.parse(recipe.ingredients);

	return (
		<div className="pt-6 xl:max-w-[calc(75%_-_2rem)] xl:pr-8 overflow-hidden max-xl:px-[3vw]">
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
			{ingredientsGroups.length > 0 && (
				<div className="shadow bg-white rounded-lg p-8 mb-6">
					<h6 className="text-xl font-semibold mb-4">Ingredients</h6>
					{/* @ts-ignore */}
					{ingredientsGroups.map(({ label, ingredients }) => (
						<div key={label} className="mb-3 last:mb-0">
							{ingredientsGroups.length > 1 && (
								<p className="mb-2 text-lg">{label}</p>
							)}
							<ul>
								{/* @ts-ignore */}
								{ingredients.map((ingredient, idx) => (
									<li
										// @ts-ignore
										key={idx}
										className="mx-3 flex items-center mb-[.125rem] last:mb-0"
									>
										<input
											type="checkbox"
											className="accent-primary mr-3 size-4"
										/>
										<span>{ingredient}</span>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			)}
			<p className="text-gray-600">
				<q>content</q>
			</p>
		</div>
	);
}
