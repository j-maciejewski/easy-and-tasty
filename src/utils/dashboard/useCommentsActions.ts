import { toast } from "sonner";

import { api } from "@/trpc/react";

import type { CommentType } from "./useCommentTypeFilter";

export const useCommentsActions = () => {
  const utils = api.useUtils();

  const deleteComments = api.authorized.comment.deleteComments.useMutation();
  const deleteCommentsByUser =
    api.authorized.comment.deleteCommentsByUser.useMutation();

  async function invalidateCommentQueries() {
    await Promise.all([
      utils.authorized.comment.getComments.invalidate(),
      utils.authorized.recipe.getSummaryStats.invalidate(),
      utils.authorized.recipe.getRecipes.invalidate(),
      utils.authorized.article.getSummaryStats.invalidate(),
      utils.public.comment.getCommentsByRecipeId.invalidate(),
      utils.public.comment.getCommentsByArticleId.invalidate(),
    ]);
  }

  async function handleDeleteComment(
    type: CommentType,
    id: number,
    onSuccess?: () => void,
  ) {
    try {
      await deleteComments.mutateAsync({ type, ids: [id] });
      await invalidateCommentQueries();

      toast.success("Comment was deleted.");
      onSuccess?.();
    } catch (error) {
      toast.error(
        (error as Error)?.message ??
          "There was an error while deleting the comment.",
      );
    }
  }

  async function handleDeleteCommentsByUser(
    type: CommentType,
    userId: string,
    onSuccess?: () => void,
  ) {
    try {
      const { count } = await deleteCommentsByUser.mutateAsync({
        type,
        userId,
      });
      await invalidateCommentQueries();

      toast.success(
        count === 1
          ? "1 comment was deleted."
          : `${count} comments were deleted.`,
      );
      onSuccess?.();
    } catch (error) {
      toast.error(
        (error as Error)?.message ??
          "There was an error while deleting the comments.",
      );
    }
  }

  return { handleDeleteComment, handleDeleteCommentsByUser };
};
