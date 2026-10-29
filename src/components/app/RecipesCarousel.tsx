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
      className="overflow-hidden rounded-3xl"
      opts={{ duration: 75, loop: true }}
      plugins={[
        Autoplay({
          delay: 5000,
        }),
      ]}
    >
      <CarouselContent>
        {recipes.map((recipe) => (
          <CarouselItem key={recipe.id} className="md:py-1">
            <RecipeCardFull recipe={recipe} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4 max-md:hidden" />
      <CarouselNext className="right-4 max-md:hidden" />
    </Carousel>
  );
};
