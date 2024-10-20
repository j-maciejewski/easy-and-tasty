import { Separator } from "@/components/ui/separator";
import { APP_NAME } from "@/consts";
import { api } from "@/trpc/server";
import { RecipesCarousel, RecipesGroupPreview } from "./_components";

export function generateMetadata() {
	return {
		title: `Home | ${APP_NAME}`,
	};
}

export default async function () {
	const recipes = await api.public.recipe.getRandomRecipes(5);

	return (
		<>
			<div className="w-full grow pt-6 max-xl:px-[3vw]">
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
