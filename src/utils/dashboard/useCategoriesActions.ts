import { use } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { categoryFormSchema } from "@/constants";
import { CategoriesContext } from "@/context";
import { api } from "@/trpc/react";

export const useCategoriesActions = () => {
  const { refreshCategories } = use(CategoriesContext)!;

  const addCategory = api.authorized.category.addCategory.useMutation();
  const editCategory = api.authorized.category.editCategory.useMutation();
  const deleteCategory = api.authorized.category.deleteCategory.useMutation();
  const publishCategory = api.authorized.category.publishCategory.useMutation();
  const unpublishCategory =
    api.authorized.category.unpublishCategory.useMutation();
  const bulkSetPublished =
    api.authorized.category.bulkSetPublished.useMutation();
  const bulkDelete = api.authorized.category.bulkDelete.useMutation();

  async function handleCreateCategory(
    values: z.infer<typeof categoryFormSchema>,
    onSuccess?: () => void,
  ) {
    try {
      await addCategory.mutateAsync(values);

      refreshCategories();

      toast.success("Category was added.");

      onSuccess?.();
    } catch (error) {
      toast.error(
        (error as Error)?.message ??
          "There was an error while adding the category.",
      );
    }
  }

  async function handleUpdateCategory(
    categoryId: number,
    values: z.infer<typeof categoryFormSchema>,
    onSuccess?: () => void,
  ) {
    try {
      await editCategory.mutateAsync({ id: categoryId, ...values });

      refreshCategories();

      toast.success("Category was modified.");

      onSuccess?.();
    } catch (error) {
      toast.error(
        (error as Error)?.message ??
          "There was an error while modifying the category.",
      );
    }
  }

  async function handleDeleteCategory(id: number) {
    try {
      await deleteCategory.mutateAsync(id);

      refreshCategories();

      toast.success("Category was deleted.");
    } catch (error) {
      toast.error(
        (error as Error)?.message ??
          "There was an error while deleting the category.",
      );
    }
  }

  async function handlePublishCategory(id: number) {
    try {
      await publishCategory.mutateAsync(id);

      refreshCategories();

      toast.success("Category was published.");
    } catch (error) {
      toast.error(
        (error as Error)?.message ??
          "There was an error while publishing the category.",
      );
    }
  }

  async function handleUnpublishCategory(id: number) {
    try {
      await unpublishCategory.mutateAsync(id);

      refreshCategories();

      toast.success("Category was unpublished.");
    } catch (error) {
      toast.error(
        (error as Error)?.message ??
          "There was an error while unpublishing the category.",
      );
    }
  }

  const countCategories = (count: number) =>
    `${count} ${count === 1 ? "category" : "categories"}`;

  async function handleBulkSetPublishedCategories(
    ids: number[],
    published: boolean,
    onSuccess?: () => void,
  ) {
    try {
      await bulkSetPublished.mutateAsync({ ids, published });
      refreshCategories();

      toast.success(
        `${countCategories(ids.length)} ${published ? "published" : "unpublished"}.`,
      );
      onSuccess?.();
    } catch (error) {
      toast.error(
        (error as Error)?.message ??
          `There was an error while ${published ? "publishing" : "unpublishing"} the categories.`,
      );
    }
  }

  async function handleBulkDeleteCategories(
    ids: number[],
    onSuccess?: () => void,
  ) {
    try {
      await bulkDelete.mutateAsync({ ids });
      refreshCategories();

      toast.success(`${countCategories(ids.length)} deleted.`);
      onSuccess?.();
    } catch (error) {
      toast.error(
        (error as Error)?.message ??
          "There was an error while deleting the categories.",
      );
    }
  }

  return {
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    handlePublishCategory,
    handleUnpublishCategory,
    handleBulkSetPublishedCategories,
    handleBulkDeleteCategories,
  };
};
