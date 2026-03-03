import { toast } from "sonner";
import { z } from "zod";

import { pageFormSchema } from "@/constants";
import { api } from "@/trpc/react";

export const usePagesActions = () => {
  const addPage = api.authorized.page.addPage.useMutation();
  const editPage = api.authorized.page.editPage.useMutation();
  const deletePage = api.authorized.page.deletePage.useMutation();
  const publishPage = api.authorized.page.publishPage.useMutation();
  const unpublishPage = api.authorized.page.unpublishPage.useMutation();

  async function handleCreatePage(
    values: z.infer<typeof pageFormSchema>,
    onSuccess?: () => void,
  ) {
    try {
      await addPage.mutateAsync(values);

      toast.success("Page was added.");

      onSuccess?.();
    } catch (error) {
      toast.error(
        (error as Error)?.message ??
          "There was an error while adding the page.",
      );
    }
  }

  async function handleUpdatePage(
    pageId: number,
    values: z.infer<typeof pageFormSchema>,
    onSuccess?: () => void,
  ) {
    try {
      await editPage.mutateAsync({ id: pageId, ...values });

      toast.success("Page was modified.");

      onSuccess?.();
    } catch (error) {
      toast.error(
        (error as Error)?.message ??
          "There was an error while modifying the page.",
      );
    }
  }

  async function handleDeletePage(id: number) {
    try {
      await deletePage.mutateAsync(id);

      toast.success("Page was deleted.");
    } catch (error) {
      toast.error(
        (error as Error)?.message ??
          "There was an error while deleting the page.",
      );
    }
  }

  async function handlePublishPage(id: number) {
    try {
      await publishPage.mutateAsync(id);

      toast.success("Page was published.");
    } catch (error) {
      toast.error(
        (error as Error)?.message ??
          "There was an error while publishing the page.",
      );
    }
  }

  async function handleUnpublishPage(id: number) {
    try {
      await unpublishPage.mutateAsync(id);

      toast.success("Page was unpublished.");
    } catch (error) {
      toast.error(
        (error as Error)?.message ??
          "There was an error while unpublishing the page.",
      );
    }
  }

  return {
    handleCreatePage,
    handleUpdatePage,
    handleDeletePage,
    handlePublishPage,
    handleUnpublishPage,
  };
};
