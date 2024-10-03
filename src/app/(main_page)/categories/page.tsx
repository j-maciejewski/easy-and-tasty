import { api } from "@/trpc/server";
import { Breadcrumbs, RecipeTypeCard } from "../_components";
import { APP_NAME } from "@/consts";
import { Separator } from "@/components/ui/separator";

export function generateMetadata() {
	return {
		title: `Categories | ${APP_NAME}`,
	};
}

export default async function () {
	const categories = await api.public.category.getCategories();

	return (
		<div className="pt-6 max-xl:px-[3vw] w-full">
			<Breadcrumbs paths={[{ label: "Categories", active: true }]} />

			<h2 className="font-semibold tracking-normal text-3xl text-center mb-6">
				Browse all categories
			</h2>
			<Separator className="my-6" />

			<div className="gap-4 grid grid-cols-[repeat(auto-fill,_minmax(225px,_1fr))]">
				{categories.map((category) => (
					<RecipeTypeCard
						key={category.id}
						name={category.name}
						href={`/categories/${category.name.toLowerCase()}`}
					/>
				))}
			</div>
		</div>
	);
}
