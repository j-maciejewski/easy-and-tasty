import clsx from "clsx";

import { RecipeListItem } from "./RecipeCards/RecipeListItem";

interface RecipesListProps {
  recipes: (Omit<Recipe, "content" | "createdAt" | "updatedAt"> &
    RecipeRatingOptions)[];
  heading: string;
  subheading?: string;
  className?: string;
}

export const RecipesList = ({
  recipes,
  className,
  heading,
  subheading,
}: RecipesListProps) => {
  if (!recipes.length) {
    return <div className={clsx("@container text-sm", className)} />;
  }

  return (
    <div className={clsx("@container text-sm", className)}>
      <h3 className="font-semibold text-xl">{heading}</h3>
      {subheading && <p className="mt-2 text-sm">{subheading}</p>}
      <div
        className={
          "mt-4 @max-lg:flex @lg:grid @lg:grid-cols-2 @max-lg:flex-col gap-2"
        }
      >
        {recipes.map((recipe) => (
          <RecipeListItem key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};
