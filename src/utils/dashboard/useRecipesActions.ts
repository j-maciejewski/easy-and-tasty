import { toast } from "sonner";
import { z } from "zod";

import { recipeFormSchema } from "@/constants";
import { api } from "@/trpc/react";

type RecipePayload = z.infer<typeof recipeFormSchema>;

export const useRecipesActions = () => {
  const utils = api.useUtils();

  const addRecipe = api.authorized.recipe.addRecipe.useMutation();
  const editRecipe = api.authorized.recipe.editRecipe.useMutation();
  const deleteRecipe = api.authorized.recipe.deleteRecipe.useMutation();
  const publishRecipe = api.authorized.recipe.publishRecipe.useMutation();
  const unpublishRecipe = api.authorized.recipe.unpublishRecipe.useMutation();

  async function invalidateRecipeQueries() {
    await Promise.all([
      utils.authorized.recipe.getRecipes.invalidate(),
      utils.authorized.recipe.getRecipe.invalidate(),
      utils.authorized.recipe.getSummaryStats.invalidate(),
      utils.public.recipe.getRecipes.invalidate(),
      utils.public.recipe.getRecipe.invalidate(),
      utils.public.recipe.getRecipePaths.invalidate(),
      utils.public.comment.getCommentsByRecipeId.invalidate(),
    ]);
  }

  async function handleCreateRecipe(
    values: RecipePayload,
    onSuccess?: () => void,
  ) {
    try {
      await addRecipe.mutateAsync(values);
      await invalidateRecipeQueries();

      toast.success("Recipe was added.");
      onSuccess?.();
    } catch (error) {
      toast.error(
        (error as Error)?.message ??
          "There was an error while adding the recipe.",
      );
    }
  }

  async function handleUpdateRecipe(
    recipeId: number,
    values: RecipePayload,
    onSuccess?: () => void,
  ) {
    try {
      await editRecipe.mutateAsync({ id: recipeId, ...values });
      await invalidateRecipeQueries();

      toast.success("Recipe was modified.");
      onSuccess?.();
    } catch (error) {
      toast.error(
        (error as Error)?.message ??
          "There was an error while modifying the recipe.",
      );
    }
  }

  async function handleDeleteRecipe(id: number, onSuccess?: () => void) {
    try {
      await deleteRecipe.mutateAsync(id);
      await invalidateRecipeQueries();

      toast.success("Recipe was deleted.");
      onSuccess?.();
    } catch (error) {
      toast.error(
        (error as Error)?.message ??
          "There was an error while deleting the recipe.",
      );
    }
  }

  async function handlePublishRecipe(id: number, onSuccess?: () => void) {
    try {
      await publishRecipe.mutateAsync(id);
      await invalidateRecipeQueries();

      toast.success("Recipe was published.");
      onSuccess?.();
    } catch (error) {
      toast.error(
        (error as Error)?.message ??
          "There was an error while publishing the recipe.",
      );
    }
  }

  async function handleUnpublishRecipe(id: number, onSuccess?: () => void) {
    try {
      await unpublishRecipe.mutateAsync(id);
      await invalidateRecipeQueries();

      toast.success("Recipe was unpublished.");
      onSuccess?.();
    } catch (error) {
      toast.error(
        (error as Error)?.message ??
          "There was an error while unpublishing the recipe.",
      );
    }
  }

  return {
    handleCreateRecipe,
    handleUpdateRecipe,
    handleDeleteRecipe,
    handlePublishRecipe,
    handleUnpublishRecipe,
  };
};
