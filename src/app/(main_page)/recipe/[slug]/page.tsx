import { api } from "@/trpc/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs, RecipeInformation, SideBar } from "../../_components";
import Markdown from "markdown-to-jsx";
import SampleImage from "@/public/mock/meals/sample-image.jpg";
import { Metadata } from "next";
import { cache } from "react";
import { APP_NAME } from "@/consts";
import Link from "next/link";

const fetchRecipe = cache(async (slug: string) => {
	const [recipe] = await api.public.recipe.getRecipeBySlug(slug);

	return recipe;
});

export async function generateMetadata({
	params,
}: { params: { slug: string } }): Promise<Metadata> {
	const recipe = await fetchRecipe(params.slug);

	if (!recipe) return {};

	return {
		title: `${recipe.title} | ${APP_NAME}`,
	};
}

export default async function ({ params }: { params: { slug: string } }) {
	const recipe = await fetchRecipe(params.slug);

	if (!recipe) {
		notFound();
	}

	return (
		<>
			<div className="pt-6 xl:pr-8 overflow-hidden max-xl:px-[3vw] grow">
				<Breadcrumbs
					paths={[{ label: "Recipe" }, { label: recipe.title, active: true }]}
				/>
				<h2 className="text-3xl font-semibold text-center">{recipe.title}</h2>
				<div className="max-h-[700px] my-6 lg:px-12">
					<Image
						src={recipe.image ? `/mock/meals/${recipe.image}` : SampleImage}
						width={400}
						height={600}
						alt={recipe.title}
						loading="lazy"
						className="rounded-lg max-sm:w-full min-h-full object-cover max-h-[700px] mx-auto w-full"
					/>
				</div>
				<RecipeInformation recipe={recipe} withText withServings />
				<article className="mt-6 prose prose-slate max-w-full">
					<Markdown>{recipe.content}</Markdown>
				</article>
				<div className="flex flex-wrap gap-4 mt-6 text-white text-sm font-bold">
					{recipe.categories.map((category) => (
						<Link
							key={category.name}
							href={`/categories/${category.name.toLowerCase()}`}
						>
							<div className="py-2 px-3 bg-primary select-none hover:bg-primary/75">
								{category.name}
							</div>
						</Link>
					))}
				</div>
			</div>
			<SideBar />
		</>
	);
}
