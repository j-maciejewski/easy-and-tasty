import { use } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { cuisineFormSchema } from "@/constants";
import { CuisinesContext } from "@/context";
import { api } from "@/trpc/react";

export const useCuisinesActions = () => {
  const { refreshCuisines } = use(CuisinesContext)!;

  const addCuisine = api.authorized.cuisine.addCuisine.useMutation();
  const editCuisine = api.authorized.cuisine.editCuisine.useMutation();
  const deleteCuisine = api.authorized.cuisine.deleteCuisine.useMutation();
  const publishCuisine = api.authorized.cuisine.publishCuisine.useMutation();
  const unpublishCuisine =
    api.authorized.cuisine.unpublishCuisine.useMutation();
  const bulkSetPublished =
    api.authorized.cuisine.bulkSetPublished.useMutation();
  const bulkDelete = api.authorized.cuisine.bulkDelete.useMutation();

  async function handleCreateCuisine(
    values: z.infer<typeof cuisineFormSchema>,
    onSuccess?: () => void,
  ) {
    try {
      await addCuisine.mutateAsync(values);

      refreshCuisines();

      toast.success("Cuisine was added.");

      onSuccess?.();
    } catch (error) {
      toast.error(
        (error as Error)?.message ??
          "There was an error while adding the cuisine.",
      );
    }
  }

  async function handleUpdateCuisine(
    cuisineId: number,
    values: z.infer<typeof cuisineFormSchema>,
    onSuccess?: () => void,
  ) {
    try {
      await editCuisine.mutateAsync({ id: cuisineId, ...values });

      refreshCuisines();

      toast.success("Cuisine was modified.");

      onSuccess?.();
    } catch (error) {
      toast.error(
        (error as Error)?.message ??
          "There was an error while modifying the cuisine.",
      );
    }
  }

  async function handleDeleteCuisine(id: number) {
    try {
      await deleteCuisine.mutateAsync(id);

      refreshCuisines();

      toast.success("Cuisine was deleted.");
    } catch (error) {
      toast.error(
        (error as Error)?.message ??
          "There was an error while deleting the cuisine.",
      );
    }
  }

  async function handlePublishCuisine(id: number) {
    try {
      await publishCuisine.mutateAsync(id);

      refreshCuisines();

      toast.success("Cuisine was published.");
    } catch (error) {
      toast.error(
        (error as Error)?.message ??
          "There was an error while publishing the cuisine.",
      );
    }
  }

  async function handleUnpublishCuisine(id: number) {
    try {
      await unpublishCuisine.mutateAsync(id);

      refreshCuisines();

      toast.success("Cuisine was unpublished.");
    } catch (error) {
      toast.error(
        (error as Error)?.message ??
          "There was an error while unpublishing the cuisine.",
      );
    }
  }

  const countCuisines = (count: number) =>
    `${count} ${count === 1 ? "cuisine" : "cuisines"}`;

  async function handleBulkSetPublishedCuisines(
    ids: number[],
    published: boolean,
    onSuccess?: () => void,
  ) {
    try {
      await bulkSetPublished.mutateAsync({ ids, published });
      refreshCuisines();

      toast.success(
        `${countCuisines(ids.length)} ${published ? "published" : "unpublished"}.`,
      );
      onSuccess?.();
    } catch (error) {
      toast.error(
        (error as Error)?.message ??
          `There was an error while ${published ? "publishing" : "unpublishing"} the cuisines.`,
      );
    }
  }

  async function handleBulkDeleteCuisines(
    ids: number[],
    onSuccess?: () => void,
  ) {
    try {
      await bulkDelete.mutateAsync({ ids });
      refreshCuisines();

      toast.success(`${countCuisines(ids.length)} deleted.`);
      onSuccess?.();
    } catch (error) {
      toast.error(
        (error as Error)?.message ??
          "There was an error while deleting the cuisines.",
      );
    }
  }

  return {
    handleCreateCuisine,
    handleUpdateCuisine,
    handleDeleteCuisine,
    handlePublishCuisine,
    handleUnpublishCuisine,
    handleBulkSetPublishedCuisines,
    handleBulkDeleteCuisines,
  };
};
