import { GaugeHigh, GaugeLow, GaugeMedium } from "@/components/icons";
import { Separator } from "@/components/ui";
import clsx from "clsx";
import { Drumstick, Timer } from "lucide-react";
import { HTMLAttributes, forwardRef } from "react";
import { Rating } from "./Rating";

export namespace RecipeInformation {
  export interface Props {
    recipe: Pick<Recipe, "difficulty" | "servings" | "time"> &
      RecipeRatingOptions;
  }
}

const getDifficultyIcon = (difficulty: string) => {
  if (difficulty === "easy") return <GaugeLow className="text-green-600" />;
  if (difficulty === "medium")
    return <GaugeMedium className="text-yellow-600" />;
  return <GaugeHigh className="text-red-600" />;
};

export const RecipeInformation = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & RecipeInformation.Props
>(({ className, recipe, ...props }, ref) => {
  return (
    <div
      className={clsx(
        "flex flex-wrap items-center justify-center gap-y-2 text-gray-600 text-sm",
        className,
      )}
      ref={ref}
      {...props}
    >
      <Drumstick />
      <span className="ml-2 whitespace-nowrap tracking-normal">
        {`${recipe.servings} servings`}
      </span>
      <Separator orientation="vertical" className="mx-2 h-4" />
      <div className="contents">
        <Timer className="mr-1" />
        <span className="whitespace-nowrap">{recipe.time} minutes</span>
      </div>
      <Separator orientation="vertical" className="mx-2 h-4" />
      {getDifficultyIcon(recipe.difficulty)}
      <span className="ml-2 capitalize tracking-normal">
        {recipe.difficulty}
      </span>
      <Separator orientation="vertical" className="mx-2 h-4" />
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
});
