"use client";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import Autoplay from "embla-carousel-autoplay";
import { ChevronRight, Timer } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { recipeImageSrcParser } from "../_utils";
import { Rating } from "./Rating";

namespace RecipesCarousel {
  export interface Props {
    recipes: (Omit<Recipe, "content" | "createdAt" | "updatedAt"> &
      RecipeRatingOptions)[];
  }
}

export const RecipesCarousel = ({ recipes }: RecipesCarousel.Props) => {
  return (
    <Carousel
      opts={{ duration: 75, loop: true }}
      plugins={[
        Autoplay({
          delay: 5000,
        }),
      ]}
    >
      <CarouselContent className="~gap-4/6 m-0">
        {recipes.map((recipe) => (
          <CarouselItem
            key={recipe.id}
            className="ml-0 px-0 max-md:pl-0 md:py-1"
          >
            <Link
              href={`/recipe/${recipe.slug}`}
              className="md:pointer-events-none"
            >
              <div className="m-[1px] flex overflow-hidden shadow max-md:flex-col">
                <div className="max-md:w-full md:w-2/5 md:min-w-[40%]">
                  <Image
                    src={recipeImageSrcParser(recipe.image)}
                    width={400}
                    height={600}
                    alt={recipe.title}
                    loading="lazy"
                    className="max-h-[300px] min-h-[300px] w-full object-cover max-sm:w-full md:max-h-64"
                  />
                </div>
                <div className="flex grow flex-col justify-center bg-card text-center max-md:bottom-0 max-md:w-full max-md:items-start max-md:p-3 max-md:px-4 lg:p-8 xl:p-10">
                  <h3 className="~mb-4/6 font-medium text-base tracking-wide max-sm:text-center max-md:mb-2 md:text-2xl xl:text-4xl">
                    {recipe.title}
                  </h3>
                  <p className="~mb-4/6 text-gray-600 text-sm max-md:hidden">
                    {recipe.description}
                  </p>
                  <div className="flex justify-center gap-2 text-gray-600 text-sm">
                    <Rating rating={recipe.avgRating} />
                    {recipe.ratingsCount !== 0 && (
                      <>
                        <Separator orientation="vertical" />
                        <p className="font-semiboldwhitespace-nowrap">
                          {recipe.ratingsCount} Ratings
                        </p>
                      </>
                    )}
                    <Separator
                      orientation="vertical"
                      className="h-auto bg-gray-500/90"
                    />
                    <div className="flex items-center">
                      <Timer className="mr-1 size-4" />
                      <span className="whitespace-nowrap">
                        {recipe.time} minutes
                      </span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    className="pointer-events-auto mx-auto mt-10 ml-auto block w-fit cursor-pointer rounded-full text-center font-bold uppercase tracking-wider max-sm:w-full max-md:hidden"
                    asChild
                  >
                    <span className="flex">
                      <Link href={`/recipe/${recipe.slug}`}>See Recipe</Link>
                      <ChevronRight className="h-5 stroke-[3px]" />
                    </span>
                  </Button>
                </div>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4 max-md:hidden" />
      <CarouselNext className="right-4 max-md:hidden" />
    </Carousel>
  );
};
