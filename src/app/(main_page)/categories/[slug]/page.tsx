import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/server";
import { Breadcrumbs, RecipeCard } from "../../_components";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Metadata } from "next";
import { APP_NAME } from "@/consts";

const fetchCategory = cache((slug: string) => {
	return api.public.category.getCategoryBySlug(slug);
});

export async function generateMetadata({
	params,
}: { params: { slug: string } }): Promise<Metadata> {
	const category = await fetchCategory(params.slug);

	if (!category) return {};

	return {
		title: `${category.name} | ${APP_NAME}`,
	};
}

export default async function ({ params }: { params: { slug: string } }) {
	const category = await fetchCategory(params.slug);
	const recipes = await api.public.recipe.getRecipesByCategory({
		slug: params.slug,
	});

	if (!category) notFound();

	return (
		<div className="pt-6 max-xl:px-[3vw] w-full">
			<Breadcrumbs
				paths={[
					{ label: "Categories", href: "/categories" },
					{ label: category.name, active: true },
				]}
			/>
			<h2 className="font-semibold tracking-normal text-4xl text-center mb-4">
				{category.name}
			</h2>
			<h6 className="font-medium text-md text-center mb-6 text-gray-800">
				{category.description}
			</h6>
			<Separator className="my-6" />
			<div className="gap-4 grid grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))]">
				{recipes.map((recipe) => (
					<RecipeCard key={recipe.id} recipe={recipe} />
				))}
			</div>
		</div>
	);
}
