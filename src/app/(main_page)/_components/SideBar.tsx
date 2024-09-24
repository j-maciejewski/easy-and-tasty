import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/server";
import Image from "next/image";
import Link from "next/link";
import SampleImage from "@/public/mock/meals/sample-image.jpg";
import { Card, CardHeader } from "@/components/ui/card";

export const SideBar = async () => {
	const recipes = await api.public.recipe.getRandomRecipes(5);

	return (
		<div className="pt-6 xl:min-w-[25%] xl:w-1/4 text-gray-600 text-sm max-xl:px-[3vw]">
			<Separator className="my-4 xl:hidden" />
			<div className="sticky top-4">
				<h6 className="text-base font-semibold mb-6">
					Try out our other recipes!
				</h6>
				<div className="flex flex-col gap-2">
					{recipes.map((recipe) => (
						<Link key={recipe.id} href={`/recipe/${recipe.slug}`}>
							<Card className="shadow hover:bg-primary/50 transition ease-in-out">
								<div className="bg-card border rounded-lg flex items-center gap-2 transition ease-in-out hover:-translate-x-1 hover:-translate-y-1">
									<Image
										src={
											recipe.image ? `/mock/meals/${recipe.image}` : SampleImage
										}
										width={200}
										height={200}
										alt={recipe.title}
										loading="lazy"
										className="rounded-lg object-cover size-20 min-w-20"
									/>
									<CardHeader className="grow font-medium px-2 text-sm">
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
