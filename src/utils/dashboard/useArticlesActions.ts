import { toast } from "sonner";
import { z } from "zod";

import { pageFormSchema } from "@/constants";
import { api } from "@/trpc/react";

export const useArticlesActions = () => {
  const utils = api.useUtils();

  const addArticle = api.authorized.article.addArticle.useMutation();
  const editArticle = api.authorized.article.editArticle.useMutation();
  const deleteArticle = api.authorized.article.deleteArticle.useMutation();
  const publishArticle = api.authorized.article.publishArticle.useMutation();
  const unpublishArticle =
    api.authorized.article.unpublishArticle.useMutation();

  async function invalidateArticleQueries() {
    await Promise.all([
      utils.authorized.article.getArticles.invalidate(),
      utils.authorized.article.getArticle.invalidate(),
      utils.authorized.article.getArticleById.invalidate(),
      utils.authorized.article.getSummaryStats.invalidate(),
      utils.public.article.getArticles.invalidate(),
      utils.public.article.getArticle.invalidate(),
      utils.public.article.getArticlesSlugs.invalidate(),
    ]);
  }

  async function handleCreateArticle(
    values: z.infer<typeof pageFormSchema>,
    onSuccess?: () => void,
  ) {
    try {
      await addArticle.mutateAsync(values);
      await invalidateArticleQueries();

      toast.success("Article was added.");

      onSuccess?.();
    } catch (error) {
      toast.error(
        (error as Error)?.message ??
          "There was an error while adding the article.",
      );
    }
  }

  async function handleUpdateArticle(
    articleId: number,
    values: z.infer<typeof pageFormSchema>,
    onSuccess?: () => void,
  ) {
    try {
      await editArticle.mutateAsync({ id: articleId, ...values });
      await invalidateArticleQueries();

      toast.success("Article was modified.");

      onSuccess?.();
    } catch (error) {
      toast.error(
        (error as Error)?.message ??
          "There was an error while modifying the article.",
      );
    }
  }

  async function handleDeleteArticle(
    articleId: number,
    onSuccess?: () => void,
  ) {
    try {
      await deleteArticle.mutateAsync(articleId);
      await invalidateArticleQueries();

      toast.success("Article was deleted.");

      onSuccess?.();
    } catch (error) {
      toast.error(
        (error as Error)?.message ??
          "There was an error while deleting the article.",
      );
    }
  }

  async function handlePublishArticle(
    articleId: number,
    onSuccess?: () => void,
  ) {
    try {
      await publishArticle.mutateAsync(articleId);
      await invalidateArticleQueries();

      toast.success("Article was published.");

      onSuccess?.();
    } catch (error) {
      toast.error(
        (error as Error)?.message ??
          "There was an error while publishing the article.",
      );
    }
  }

  async function handleUnpublishArticle(
    articleId: number,
    onSuccess?: () => void,
  ) {
    try {
      await unpublishArticle.mutateAsync(articleId);
      await invalidateArticleQueries();

      toast.success("Article was unpublished.");

      onSuccess?.();
    } catch (error) {
      toast.error(
        (error as Error)?.message ??
          "There was an error while unpublishing the article.",
      );
    }
  }

  return {
    handleCreateArticle,
    handleUpdateArticle,
    handleDeleteArticle,
    handlePublishArticle,
    handleUnpublishArticle,
  };
};
