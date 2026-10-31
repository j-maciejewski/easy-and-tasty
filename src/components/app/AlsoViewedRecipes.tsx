"use client";

import { api } from "@/trpc/react";

import { RecipesList } from "./RecipesList";

interface AlsoViewedRecipesProps {
  recipeId: number;
  className?: string;
}

export const AlsoViewedRecipes = ({
  recipeId,
  className,
}: AlsoViewedRecipesProps) => {
  const { data: recipes } = api.public.recipe.getAlsoViewed.useQuery(recipeId);

  if (!recipes?.length) return null;

  return (
    <RecipesList
      heading="People also viewed"
      recipes={recipes}
      className={className}
    />
  );
};
