import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/server";
import { Breadcrumbs, RecipeCard } from "../../_components";
import { notFound } from "next/navigation";

export default async function ({ params }: { params: { slug: string } }) {
	const cuisine = await api.public.cuisine.getCuisineBySlug(params.slug);
	const recipes = await api.public.recipe.getRecipesByCuisine({
		slug: params.slug,
	});

	if (!cuisine) notFound();

	return (
		<div className="pt-6 max-xl:px-[3vw] w-full">
			<Breadcrumbs
				paths={[
					{ label: "Cuisines", href: "/cuisines" },
					{ label: cuisine.name, active: true },
				]}
			/>
			<h2 className="font-semibold tracking-normal text-4xl text-center mb-4">
				{cuisine.name}
			</h2>
			<h6 className="font-medium text-md text-center mb-6 text-gray-800">
				{cuisine.description}
			</h6>
			<Separator className="my-6" />
			<div className="gap-4 grid grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))]">
				{/* @ts-ignore */}
				{recipes.map((recipe) => (
					<RecipeCard key={recipe.id} recipe={recipe} />
				))}
			</div>
		</div>
	);
}
