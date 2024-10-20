import { Separator } from "@/components/ui/separator";
import { APP_NAME } from "@/consts";
import { api } from "@/trpc/server";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Breadcrumbs, RecipeCard } from "../../_components";

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
		<div className="w-full pt-6 max-xl:px-[3vw]">
			<Breadcrumbs
				paths={[
					{ label: "Categories", href: "/categories" },
					{ label: category.name, active: true },
				]}
			/>
			<h2 className="mb-4 text-center font-semibold text-3xl tracking-normal">
				{category.name}
			</h2>
			<h6 className="mb-6 text-center font-medium text-gray-800 text-md">
				{category.description}
			</h6>
			<Separator className="my-6" />
			<div className="grid grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))] gap-4">
				{recipes.map((recipe) => (
					<RecipeCard key={recipe.id} recipe={recipe} />
				))}
			</div>
		</div>
	);
}
