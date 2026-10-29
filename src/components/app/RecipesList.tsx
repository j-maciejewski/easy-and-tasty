import clsx from "clsx";

import { RecipeListItem } from "./RecipeCards/RecipeListItem";
import { SectionHeading } from "./SectionHeading";

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
    return <div className={clsx("@container", className)} />;
  }

  return (
    <div className={clsx("@container", className)}>
      <SectionHeading heading={heading} subheading={subheading} />
      <div className="-mx-2 @max-lg:flex @lg:grid @lg:grid-cols-2 @max-lg:flex-col gap-1">
        {recipes.map((recipe) => (
          <RecipeListItem key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};
