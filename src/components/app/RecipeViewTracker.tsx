"use client";

import { useEffect, useRef } from "react";

import { api } from "@/trpc/react";

interface RecipeViewTrackerProps {
  recipeId: number;
}

export const RecipeViewTracker = ({ recipeId }: RecipeViewTrackerProps) => {
  const hasTrackedRef = useRef(false);
  const addRecipeView = api.public.recipe.addRecipeView.useMutation();

  useEffect(() => {
    if (hasTrackedRef.current) return;

    hasTrackedRef.current = true;

    addRecipeView.mutate({ recipeId });
  }, [addRecipeView, recipeId]);

  return null;
};
