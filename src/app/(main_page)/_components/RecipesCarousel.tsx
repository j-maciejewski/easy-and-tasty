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
import { RecipeInformation } from "./RecipeInformation";

namespace RecipesCarousel {
	export interface Props {
		recipes: {
			id: number;
			description: string;
			title: string;
			rating: number;
			time: number;
			difficulty: string;
			image: string;
			servings: number;
			slug: string;
		}[];
	}
}

export const RecipesCarousel = ({ recipes }: RecipesCarousel.Props) => {
	return (
		<Carousel
			opts={{ duration: 50 }}
			className="rounded-lg"
			plugins={[
				Autoplay({
					delay: 5000,
				}),
			]}
		>
			<CarouselContent className="m-0 gap-6 rounded-lg">
				{recipes.map((recipe) => (
					<CarouselItem key={recipe.id} className="ml-0 py-1 px-3">
						<div className="sm:flex rounded-lg overflow-hidden shadow ">
							<div className="max-sm:w-full sm:min-w-[40%] sm:w-2/5">
								<Image
									src={`/mock/meals/${recipe.image}`}
									width={400}
									height={600}
									alt="recipe"
									loading="lazy"
									className="max-sm:w-full min-h-full max-h-[400px] object-cover w-full"
								/>
							</div>
							<div className="grow max-sm:p-4 sm:p-6 lg:p-8 xl:p-10 flex flex-col text-center justify-center bg-primary">
								<h3 className="font-semibold tracking-tight text-lg md:text-2xl xl:text-4xl mb-6 max-sm:text-center">
									{recipe.title}
								</h3>
								<RecipeInformation recipe={recipe} />
								<Button
									type="button"
									className="block ml-auto rounded-full w-fit text-center max-sm:w-full mt-10 font-bold mx-auto bg-secondary text-white uppercase tracking-wider cursor-pointer hover:bg-accent"
									variant="outline"
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
			<CarouselPrevious className="bg-white hover:bg-secondary" />
			<CarouselNext className="bg-white hover:bg-secondary" />
		</Carousel>
	);
};
