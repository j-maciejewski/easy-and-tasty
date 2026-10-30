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
  const bulkSetPublished = api.authorized.recipe.bulkSetPublished.useMutation();
  const bulkDelete = api.authorized.recipe.bulkDelete.useMutation();
  const bulkAddCategory = api.authorized.recipe.bulkAddCategory.useMutation();
  const bulkAddCuisine = api.authorized.recipe.bulkAddCuisine.useMutation();

  async function invalidateRecipeQueries() {
    await Promise.all([
      utils.authorized.recipe.getRecipes.invalidate(),
      utils.authorized.recipe.getRecipe.invalidate(),
      utils.authorized.recipe.getSummaryStats.invalidate(),
      utils.public.recipe.getRecipesSlugs.invalidate(),
      utils.public.recipe.getRecipeBySlug.invalidate(),
      utils.public.recipe.getRandomRecipes.invalidate(),
      utils.public.comment.getCommentsByRecipeId.invalidate(),
    ]);
  }

  async function handleCreateRecipe(
    values: RecipePayload,
    onSuccess?: (id?: number) => void,
  ) {
    try {
      const created = await addRecipe.mutateAsync(values);
      await invalidateRecipeQueries();

      toast.success("Recipe was added.");
      onSuccess?.(created?.id);
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

  const countRecipes = (count: number) =>
    `${count} ${count === 1 ? "recipe" : "recipes"}`;

  async function handleBulkSetPublishedRecipes(
    ids: number[],
    published: boolean,
    onSuccess?: () => void,
  ) {
    try {
      await bulkSetPublished.mutateAsync({ ids, published });
      await invalidateRecipeQueries();

      toast.success(
        `${countRecipes(ids.length)} ${published ? "published" : "unpublished"}.`,
      );
      onSuccess?.();
    } catch (error) {
      toast.error(
        (error as Error)?.message ??
          `There was an error while ${published ? "publishing" : "unpublishing"} the recipes.`,
      );
    }
  }

  async function handleBulkDeleteRecipes(
    ids: number[],
    onSuccess?: () => void,
  ) {
    try {
      await bulkDelete.mutateAsync({ ids });
      await invalidateRecipeQueries();

      toast.success(`${countRecipes(ids.length)} deleted.`);
      onSuccess?.();
    } catch (error) {
      toast.error(
        (error as Error)?.message ??
          "There was an error while deleting the recipes.",
      );
    }
  }

  async function handleBulkAddCategory(
    ids: number[],
    categoryId: number,
    onSuccess?: () => void,
  ) {
    try {
      await bulkAddCategory.mutateAsync({ ids, categoryId });
      await invalidateRecipeQueries();

      toast.success(`Category added to ${countRecipes(ids.length)}.`);
      onSuccess?.();
    } catch (error) {
      toast.error(
        (error as Error)?.message ??
          "There was an error while assigning the category.",
      );
    }
  }

  async function handleBulkAddCuisine(
    ids: number[],
    cuisineId: number,
    onSuccess?: () => void,
  ) {
    try {
      await bulkAddCuisine.mutateAsync({ ids, cuisineId });
      await invalidateRecipeQueries();

      toast.success(`Cuisine added to ${countRecipes(ids.length)}.`);
      onSuccess?.();
    } catch (error) {
      toast.error(
        (error as Error)?.message ??
          "There was an error while assigning the cuisine.",
      );
    }
  }

  return {
    handleCreateRecipe,
    handleUpdateRecipe,
    handleDeleteRecipe,
    handlePublishRecipe,
    handleUnpublishRecipe,
    handleBulkSetPublishedRecipes,
    handleBulkDeleteRecipes,
    handleBulkAddCategory,
    handleBulkAddCuisine,
  };
};
