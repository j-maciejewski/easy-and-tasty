import { api } from "@/trpc/server";
import { Breadcrumbs, RecipeTypeCard } from "../_components";
import { APP_NAME } from "@/consts";
import { Separator } from "@/components/ui/separator";

export function generateMetadata() {
	return {
		title: `Cuisines | ${APP_NAME}`,
	};
}

export default async function () {
	const cuisines = await api.public.cuisine.getCuisines();

	return (
		<div className="pt-6 max-xl:px-[3vw] w-full">
			<Breadcrumbs paths={[{ label: "Cuisines", active: true }]} />

			<h2 className="font-semibold tracking-normal text-3xl text-center mb-6">
				Browse all cuisines
			</h2>
			<Separator className="my-6" />

			<div className="gap-4 grid grid-cols-[repeat(auto-fill,_minmax(225px,_1fr))]">
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
