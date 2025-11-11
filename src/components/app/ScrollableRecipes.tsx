import clsx from "clsx";

import { RecipeCard } from "./RecipeCards/RecipeCard";

interface ScrollableRecipesProps {
  recipes: (Omit<Recipe, "content" | "createdAt" | "updatedAt"> &
    RecipeRatingOptions)[];
  className?: string;
  heading: string;
  subheading?: string;
}

export const ScrollableRecipes = ({
  recipes,
  className,
  heading,
  subheading,
}: ScrollableRecipesProps) => {
  return (
    <div className={clsx("flex flex-col", className)}>
      <h3 className="font-semibold text-xl">{heading}</h3>
      {subheading && <p className="mt-2 text-sm">{subheading}</p>}
      <div className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="w-[calc(33.333%-0.67rem)] min-w-[16rem] flex-none snap-start"
          >
            <RecipeCard recipe={recipe} />
          </div>
        ))}
      </div>
    </div>
  );
};
