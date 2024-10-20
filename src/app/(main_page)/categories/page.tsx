import { Separator } from "@/components/ui/separator";
import { APP_NAME } from "@/consts";
import { api } from "@/trpc/server";
import { Breadcrumbs, RecipeTypeCard } from "../_components";

export function generateMetadata() {
	return {
		title: `Categories | ${APP_NAME}`,
	};
}

export default async function () {
	const categories = await api.public.category.getCategories();

	return (
		<div className="w-full pt-6 max-xl:px-[3vw]">
			<Breadcrumbs paths={[{ label: "Categories", active: true }]} />

			<h2 className="mb-6 text-center font-semibold text-3xl tracking-normal">
				Browse all categories
			</h2>
			<Separator className="my-6" />

			<div className="grid grid-cols-[repeat(auto-fill,_minmax(225px,_1fr))] gap-4">
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
