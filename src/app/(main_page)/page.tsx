import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/server";
import { RecipesCarousel, RecipesGroupPreview } from "./_components";
import { APP_NAME } from "@/consts";

export function generateMetadata() {
	return {
		title: `Home | ${APP_NAME}`,
	};
}

export default async function () {
	const recipes = await api.public.recipe.getRandomRecipes(5);

	return (
		<>
			<div className="grow max-xl:px-[3vw] w-full pt-6">
				{recipes ? (
					<>
						<RecipesCarousel recipes={recipes} />
						<Separator className="my-6" />
						<RecipesGroupPreview
							category={{ name: "Breakfast", slug: "breakfast" }}
						/>
						<Separator className="my-6" />
						<RecipesGroupPreview
							cuisine={{ name: "Italian", slug: "italian" }}
						/>
					</>
				) : (
					<p>no results</p>
				)}
			</div>
		</>
	);
}
