import { ChevronRight, Timer } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button, Separator } from "@/components/ui";

import { Rating } from "../Rating";

interface RecipeCardFullProps {
  recipe: Omit<Recipe, "content" | "createdAt" | "updatedAt"> &
    RecipeRatingOptions;
}
export const RecipeCardFull = ({ recipe }: RecipeCardFullProps) => {
  return (
    <div className="card m-px flex overflow-hidden">
      <div className="max-md:w-full md:w-2/5 md:min-w-[40%]">
        <Image
          src={recipe.image}
          width={400}
          height={300}
          alt={recipe.title}
          loading="lazy"
          className="max-h-[300px] min-h-[300px] w-full object-cover max-sm:w-full md:max-h-64"
        />
      </div>
      <div className="flex grow flex-col justify-center text-center max-md:w-full max-md:p-3 max-md:px-4 lg:p-8 xl:p-10">
        <h3 className="mb-4 text-center font-medium text-base text-foreground tracking-wide max-md:mb-2 md:text-2xl xl:text-4xl">
          {recipe.title}
        </h3>
        <p className="mb-4 text-gray-600 text-sm">{recipe.description}</p>
        <div className="flex justify-center gap-4 text-gray-600 text-sm">
          <Rating rating={recipe.avgRating} />
          {recipe.ratingsCount !== 0 && (
            <>
              <Separator orientation="vertical" />
              <p className="whitespace-nowrap font-semibold">
                {recipe.ratingsCount} Ratings
              </p>
            </>
          )}
          <div className="flex items-center">
            <Timer className="mr-1 size-4" />
            <span className="whitespace-nowrap">{recipe.time} minutes</span>
          </div>
        </div>
        <div className="mx-auto mt-10 ml-auto">
          <Link href={`/recipe/${recipe.slug}`}>
            <Button
              type="button"
              className="pointer-events-auto block w-fit cursor-pointer rounded-full text-center font-semibold"
              asChild
            >
              <span className="flex">
                See Recipe
                <ChevronRight className="h-5 stroke-[3px]" />
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
