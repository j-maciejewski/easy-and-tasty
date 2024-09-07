import { Separator } from "@/components/ui/separator";
import hana from "@/public/hana.jpg";
import { api } from "@/trpc/server";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const SideBar = async () => {
	const recipes = await api.public.recipe.getRecipes();

	return (
		<div className="xl:min-w-[25%] xl:w-1/4 text-gray-600 text-sm max-xl:px-[3vw]">
			<Separator className="my-4 xl:hidden" />
			<div className="flex xl:flex-col items-center">
				<div className="max-xl:mr-6 xl:mx-6 xl:mb-4">
					<Image
						src={hana}
						alt="Hana"
						className="rounded-full max-xl:min-w-[min(25vw,_175px)] max-xl:size-[min(25vw,_175px)]"
					/>
				</div>
				<div className="flex flex-col justify-center">
					<p className="text-justify">
						I warmly welcome to my blog! Here you will find only proven recipes,
						the preparation of which I describe step by step. Here you will
						find, among others, recipes for cakes, breakfasts and dinners. Don't
						wait and try the recipes loved by millions of readers!{" "}
					</p>
					<Link
						href="/about-me"
						className="hover:underline flex justify-end items-center text-green-500 font-semibold mt-2"
					>
						More about me <ChevronRight className="h-4" />
					</Link>
				</div>
			</div>
			<Separator className="my-4" />
			<div className="sticky top-4">
				<h6 className="text-base font-semibold mb-3">Popular recipes</h6>
				<div className="flex flex-col gap-2">
					{/* @ts-ignore */}
					{recipes.slice(0, 3).map((recipe) => (
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
