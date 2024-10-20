import { Separator } from "@/components/ui/separator";
import { APP_NAME } from "@/consts";
import { api } from "@/trpc/server";
import { Breadcrumbs, RecipeTypeCard } from "../_components";

export function generateMetadata() {
	return {
		title: `Cuisines | ${APP_NAME}`,
	};
}

export default async function () {
	const cuisines = await api.public.cuisine.getCuisines();

	return (
		<div className=" w-full pt-6 max-xl:px-[3vw]">
			<Breadcrumbs paths={[{ label: "Cuisines", active: true }]} />

			<h2 className="mb-6 text-center font-semibold text-3xl tracking-normal">
				Browse all cuisines
			</h2>
			<Separator className="my-6" />

			<div className="grid grid-cols-[repeat(auto-fill,_minmax(225px,_1fr))] gap-4">
				{cuisines.map((cuisine) => (
					<RecipeTypeCard
						key={cuisine.id}
						name={cuisine.name}
						href={`/cuisines/${cuisine.name.toLowerCase()}`}
					/>
				))}
			</div>
		</div>
	);
}
