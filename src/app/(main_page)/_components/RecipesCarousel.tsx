"use client";

import { Button } from "@/components/ui/button";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { recipeImageSrcParser } from "../_utils";
import { RecipeInformation } from "./RecipeInformation";

namespace RecipesCarousel {
	export interface Props {
		recipes: (Omit<Recipe, "content" | "createdAt" | "updatedAt"> &
			RecipeRatingOptions)[];
	}
}

export const RecipesCarousel = ({ recipes }: RecipesCarousel.Props) => {
	return (
		<Carousel
			opts={{ duration: 50, loop: true }}
			className="rounded-lg"
			plugins={[
				Autoplay({
					delay: 4000,
				}),
			]}
		>
			<CarouselContent className="m-0 gap-6 rounded-lg">
				{recipes.map((recipe) => (
					<CarouselItem key={recipe.id} className="ml-0 px-3 py-1">
						<div className="overflow-hidden rounded-lg shadow sm:flex ">
							<div className="max-sm:w-full sm:w-2/5 sm:min-w-[40%]">
								<Image
									src={recipeImageSrcParser(recipe.image)}
									width={400}
									height={600}
									alt={recipe.title}
									loading="lazy"
									className="max-h-[400px] min-h-full w-full object-cover max-sm:w-full"
								/>
							</div>
							<div className="flex grow flex-col justify-center bg-secondary text-center max-sm:p-4 sm:p-6 lg:p-8 xl:p-10">
								<h3 className="mb-6 font-semibold text-lg tracking-tight max-sm:text-center md:text-2xl xl:text-4xl">
									{recipe.title}
								</h3>
								<RecipeInformation recipe={recipe} />
								<Button
									type="button"
									className="mx-auto mt-10 ml-auto block w-fit cursor-pointer rounded-full text-center font-bold uppercase tracking-wider max-sm:w-full"
									asChild
								>
									<span className="flex">
										<Link href={`/recipe/${recipe.slug}`}>See Recipe</Link>
										<ChevronRight className="h-5 stroke-[3px]" />
									</span>
								</Button>
							</div>
						</div>
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious className="bg-white hover:bg-primary" />
			<CarouselNext className="bg-white hover:bg-primary" />
		</Carousel>
	);
};
