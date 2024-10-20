import { Card, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/server";
import Image from "next/image";
import Link from "next/link";
import { recipeImageSrcParser } from "../_utils";

export const SideBar = async () => {
	const recipes = await api.public.recipe.getRandomRecipes(5);

	return (
		<div className="pt-6 text-gray-600 text-sm max-xl:px-[3vw] xl:w-1/4 xl:min-w-[25%]">
			<Separator className="my-4 xl:hidden" />
			<div>
				<h6 className="mb-6 font-semibold text-base">
					Try out our other recipes!
				</h6>
				<div className="flex flex-col gap-2">
					{recipes.map((recipe) => (
						<Link key={recipe.id} href={`/recipe/${recipe.slug}`}>
							<Card className="shadow transition ease-in-out hover:bg-primary/50">
								<div className="hover:-translate-x-1 hover:-translate-y-1 flex items-center gap-2 rounded-lg border bg-card transition ease-in-out">
									<Image
										src={recipeImageSrcParser(recipe.image)}
										width={200}
										height={200}
										alt={recipe.title}
										loading="lazy"
										className="size-20 min-w-20 rounded-lg object-cover"
									/>
									<CardHeader className="grow px-2 font-medium text-sm">
										{recipe.title}
									</CardHeader>
								</div>
							</Card>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};
