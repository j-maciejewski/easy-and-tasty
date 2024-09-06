import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/server";
import { Breadcrumbs, RecipeCard } from "../../_components";

export default async function ({ params }: { params: { slug: string } }) {
	const recipes = await api.recipe.getRecipesByCategory(params.slug);

	return (
		<div className="pt-6 max-xl:px-[3vw] w-full">
			<Breadcrumbs
				paths={[
					{ label: "All Recipes", href: "/recipes" },
					{ label: params.slug, active: true },
				]}
			/>
			<h2 className="font-semibold tracking-normal text-4xl text-center mb-4">
				Breakfast and Brunch
			</h2>
			<h6 className="font-medium text-md text-center mb-6 text-gray-800">
				Create a delicious everyday breakfast or pull together an amazing brunch
				with top-rated recipes for pancakes and waffles, bacon and eggs, brunch
				casseroles, coffee cakes, muffins, quiche, and so much more.
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
