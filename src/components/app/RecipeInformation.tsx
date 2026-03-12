import clsx from "clsx";
import { Drumstick, Timer } from "lucide-react";

import { getDifficultyIcon } from "@/utils";

import { Rating } from "./Rating";

interface RecipeInformationProps {
  recipe: Pick<Recipe, "difficulty" | "servings" | "time"> &
    RecipeRatingOptions;
  className?: string;
}

export const RecipeInformation = ({
  className,
  recipe,
}: RecipeInformationProps) => {
  return (
    <div
      className={clsx(
        "flex flex-wrap items-center justify-center gap-y-2 text-gray-600 text-xs",
        className,
      )}
    >
      <Drumstick className="w-5" />
      <span className="ml-2 whitespace-nowrap tracking-normal">
        {`${recipe.servings} servings`}
      </span>
      <div className="mx-2 h-4 w-px bg-gray-400" />
      <div className="contents">
        <Timer className="mr-1 w-5" />
        <span className="whitespace-nowrap">{recipe.time} minutes</span>
      </div>
      <div className="mx-2 h-4 w-px bg-gray-400" />
      {getDifficultyIcon(recipe.difficulty)}
      <span className="ml-2 capitalize tracking-normal">
        {recipe.difficulty}
      </span>
      <div className="mx-2 h-4 w-px bg-gray-400" />
      <div className="flex items-center justify-center">
        <Rating rating={recipe.avgRating} />
        <span className="ml-2 whitespace-nowrap tracking-normal">
          {recipe.ratingsCount === 0
            ? "Not rated"
            : `${recipe.avgRating} / 5 (${recipe.ratingsCount} reviews)`}
        </span>
      </div>
    </div>
  );
};
