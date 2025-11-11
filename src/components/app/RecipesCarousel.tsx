"use client";

import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui";

import { RecipeCardFull } from "./RecipeCards/RecipeCardFull";

export interface RecipesCarouselProps {
  recipes: (Omit<Recipe, "content" | "createdAt" | "updatedAt"> &
    RecipeRatingOptions)[];
}

export const RecipesCarousel = ({ recipes }: RecipesCarouselProps) => {
  return (
    <Carousel
      opts={{ duration: 75, loop: true }}
      plugins={[
        Autoplay({
          delay: 5000,
        }),
      ]}
    >
      <CarouselContent className="m-0">
        {recipes.map((recipe) => (
          <CarouselItem
            key={recipe.id}
            className="ml-0 px-0 max-md:pl-0 md:py-1"
          >
            <RecipeCardFull recipe={recipe} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4 max-md:hidden" />
      <CarouselNext className="right-4 max-md:hidden" />
    </Carousel>
  );
};
