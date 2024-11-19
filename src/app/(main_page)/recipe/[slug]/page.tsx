import { APP_NAME } from "@/consts";
import { env } from "@/env";
import { api } from "@/trpc/server";
import Markdown from "markdown-to-jsx";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Breadcrumbs, RecipeInformation, SideBar } from "../../_components";
import { recipeImageSrcParser } from "../../_utils";

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
		description: recipe.description,
		openGraph: {
			type: "article",
			siteName: "Easy and Tasty",
			url: `${env.APP_URL}/recipe/${recipe.slug}`,
			...(recipe.image ? { images: [{ url: recipe.image }] } : {}),
		},
	};
}

export default async function ({ params }: { params: { slug: string } }) {
	const recipe = await fetchRecipe(params.slug);

	if (!recipe) {
		notFound();
	}

	return (
		<>
			<div className="grow overflow-hidden pt-6 max-xl:px-[3vw] xl:pr-8">
				<Breadcrumbs
					paths={[{ label: "Recipe" }, { label: recipe.title, active: true }]}
					shareConfig={{
						path: `/recipe/${recipe.slug}`,
						text: "Check out this awesome recipe!",
						type: "recipe",
					}}
				/>
				<h2 className="mb-6 text-center font-semibold text-3xl">
					{recipe.title}
				</h2>
				<RecipeInformation recipe={recipe} withText withServings />
				<div className="mt-8 mb-6 max-h-[700px] lg:px-12">
					<Image
						src={recipeImageSrcParser(recipe.image)}
						width={400}
						height={600}
						alt={recipe.title}
						loading="lazy"
						className="mx-auto max-h-[700px] min-h-full w-full rounded-lg object-cover max-sm:w-full"
					/>
				</div>
				<article className="prose prose-slate mt-6 max-w-full">
					<Markdown>{recipe.content}</Markdown>
				</article>
				<div className="mt-6 flex flex-wrap gap-4 font-bold text-sm text-white">
					{recipe.categories.map((category) => (
						<Link key={category.name} href={`/categories/${category.slug}`}>
							<div className="select-none bg-primary px-3 py-2 hover:bg-primary/75">
								{category.name}
							</div>
						</Link>
					))}
					{recipe.cuisines.map((cuisine) => (
						<Link key={cuisine.name} href={`/categories/${cuisine.slug}`}>
							<div className="select-none bg-primary px-3 py-2 hover:bg-primary/75">
								{cuisine.name}
							</div>
						</Link>
					))}
				</div>
			</div>
			<SideBar />
		</>
	);
}
