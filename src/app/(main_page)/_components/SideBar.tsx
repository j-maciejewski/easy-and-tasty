import { Separator } from "@/components/ui/separator";
import hana from "@/public/hana.jpg";
import { api } from "@/trpc/server";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const SideBar = async () => {
	const recipes = await api.public.recipe.getRecipes();

	return (
		<div className="pt-6 xl:min-w-[25%] xl:w-1/4 text-gray-600 text-sm max-xl:px-[3vw]">
			<Separator className="my-4 xl:hidden" />
			<div className="sticky top-4">
				<h6 className="text-base font-semibold mb-3">
					Try out our other recipes!
				</h6>
				<div className="flex flex-col gap-2">
					{/* @ts-ignore */}
					{recipes.slice(0, 5).map((recipe) => (
						<div key={recipe.id} className="flex items-center gap-2">
							<Link href={`/recipe/${recipe.slug}`}>
								<Image
									src={`/mock/meals/${recipe.image}`}
									width={200}
									height={200}
									alt="recipe"
									loading="lazy"
									className="rounded-lg object-cover size-20 min-w-20 transition ease-in-out hover:scale-[1.05]"
								/>
							</Link>
							<Link
								href={`/recipe/${recipe.slug}`}
								className="grow font-semibold hover:text-green-600 contents"
							>
								{recipe.title}
							</Link>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
