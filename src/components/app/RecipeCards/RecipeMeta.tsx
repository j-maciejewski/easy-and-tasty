import clsx from "clsx";
import { Timer } from "lucide-react";

import { Rating } from "../Rating";

interface RecipeMetaProps {
  recipe: Pick<Recipe, "time"> & RecipeRatingOptions;
  className?: string;
}

export const RecipeMeta = ({ recipe, className }: RecipeMetaProps) => {
  return (
    <div
      className={clsx(
        "flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground text-sm",
        className,
      )}
    >
      <span className="flex items-center gap-1.5">
        <Rating rating={recipe.avgRating} />
        {recipe.ratingsCount !== 0 && (
          <span className="whitespace-nowrap">({recipe.ratingsCount})</span>
        )}
      </span>
      <span className="flex items-center gap-1 whitespace-nowrap">
        <Timer className="size-4" aria-hidden />
        {recipe.time} min
      </span>
    </div>
  );
};
