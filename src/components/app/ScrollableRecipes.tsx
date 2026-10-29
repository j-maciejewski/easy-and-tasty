import clsx from "clsx";

import { RecipeCard } from "./RecipeCards/RecipeCard";
import { SectionHeading } from "./SectionHeading";

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
      <SectionHeading heading={heading} subheading={subheading} />
      <div className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-5 overflow-x-auto px-4 pb-3">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="w-[calc(25%-0.95rem)] min-w-60 flex-none snap-start"
          >
            <RecipeCard recipe={recipe} />
          </div>
        ))}
      </div>
    </div>
  );
};
