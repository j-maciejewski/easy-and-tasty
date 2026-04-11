"use client";

import { Heart, Pencil, Trash2, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Separator,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { api, type RouterOutputs } from "@/trpc/react";

type Comment =
  RouterOutputs["public"]["comment"]["getCommentsByArticleId"][number];

interface ArticleCommentsProps {
  articleId: number;
  initialComments?: Comment[];
}

export const ArticleComments = ({
  articleId,
  initialComments = [],
}: ArticleCommentsProps) => {
  const { data: session } = useSession();
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);

  const utils = api.useUtils();

  const { data: comments = initialComments } =
    api.public.comment.getCommentsByArticleId.useQuery({
      articleId,
      userId: session?.user?.id,
    });

  const addComment = api.authenticated.comment.addArticleComment.useMutation({
    onSuccess: () => {
      setCommentText("");
      toast.success("Comment added successfully!");
      void utils.public.comment.getCommentsByArticleId.invalidate({
        articleId,
        userId: session?.user?.id,
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add comment");
    },
  });

  const editComment = api.authenticated.comment.editArticleComment.useMutation({
    onSuccess: () => {
      setEditingCommentId(null);
      setEditText("");
      toast.success("Comment updated successfully!");
      void utils.public.comment.getCommentsByArticleId.invalidate({
        articleId,
        userId: session?.user?.id,
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update comment");
    },
  });

  const deleteComment =
    api.authenticated.comment.deleteArticleComment.useMutation({
      onSuccess: () => {
        toast.success("Comment deleted successfully!");
        void utils.public.comment.getCommentsByArticleId.invalidate({
          articleId,
          userId: session?.user?.id,
        });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete comment");
      },
    });

  const likeComment = api.authenticated.comment.likeArticleComment.useMutation({
    onSuccess: () => {
      void utils.public.comment.getCommentsByArticleId.invalidate({
        articleId,
        userId: session?.user?.id,
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to like comment");
    },
  });

  const unlikeComment =
    api.authenticated.comment.unlikeArticleComment.useMutation({
      onSuccess: () => {
        void utils.public.comment.getCommentsByArticleId.invalidate({
          articleId,
          userId: session?.user?.id,
        });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to unlike comment");
      },
    });

  const handleSubmitComment = () => {
    if (!session) {
      toast.error("Please sign in to comment");
      return;
    }

    if (!commentText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    if (commentText.length > 256) {
      toast.error("Comment is too long (max 256 characters)");
      return;
    }

    addComment.mutate({
      text: commentText.trim(),
      articleId,
    });
  };

  const handleEditComment = (commentId: number, currentText: string) => {
    setEditingCommentId(commentId);
    setEditText(currentText);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditText("");
  };

  const handleSaveEdit = (commentId: number) => {
    if (!editText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    if (editText.length > 256) {
      toast.error("Comment is too long (max 256 characters)");
      return;
    }

    editComment.mutate({
      commentId,
      text: editText.trim(),
    });
  };

  const handleDeleteComment = (commentId: number) => {
    if (!session) return;
    setCommentToDelete(commentId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (commentToDelete) {
      deleteComment.mutate(commentToDelete);
      setDeleteConfirmOpen(false);
      setCommentToDelete(null);
    }
  };

  const handleLikeToggle = (commentId: number, isLiked: boolean) => {
    if (!session) {
      toast.error("Please sign in to like comments");
      return;
    }

    if (isLiked) {
      unlikeComment.mutate(commentId);
    } else {
      likeComment.mutate(commentId);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  return (
    <div className="mt-8">
      <h3 className="mb-4 font-semibold text-xl">
        Comments ({comments.length})
      </h3>

      {session ? (
        <div className="mb-6">
          <Textarea
            placeholder="Share your thoughts about this article..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="mb-2 min-h-25"
            maxLength={256}
          />
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">
              {commentText.length}/256
            </span>
            <Button
              onClick={handleSubmitComment}
              disabled={addComment.isPending || !commentText.trim()}
            >
              {addComment.isPending ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="mb-6 rounded-lg border bg-muted/50 p-4 text-center">
          <p className="text-muted-foreground text-sm">
            Please sign in to leave a comment
          </p>
        </div>
      )}

      <Separator className="mb-6" />

      {comments.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground">
          No comments yet. Be the first to share your thoughts!
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => {
            const isOwner = session?.user?.id === comment.user?.id;
            const isLiked = comment.isLikedByUser;

            return (
              <div key={comment.id} className="rounded-lg border bg-card p-4">
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <p className="font-medium">
                      {comment.user?.name || "Anonymous"}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {formatDate(comment.createdAt)}
                      {comment.updatedAt &&
                        comment.updatedAt !== comment.createdAt &&
                        " (edited)"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isOwner ? (
                      comment.likesCount > 0 && (
                        <div className="flex h-8 items-center gap-1 px-2 text-gray-500">
                          <Heart className="h-4 w-4" />
                          <span className="text-xs">{comment.likesCount}</span>
                        </div>
                      )
                    ) : session ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "h-8 gap-1",
                          isLiked && "text-red-500 hover:text-red-600",
                        )}
                        onClick={() => handleLikeToggle(comment.id, isLiked)}
                      >
                        <Heart
                          className={cn("h-4 w-4", isLiked && "fill-current")}
                        />
                        <span className="text-xs">
                          {comment.likesCount > 0 ? comment.likesCount : ""}
                        </span>
                      </Button>
                    ) : (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 gap-1"
                              disabled
                            >
                              <Heart className="h-4 w-4" />
                              <span className="text-xs">
                                {comment.likesCount > 0
                                  ? comment.likesCount
                                  : ""}
                              </span>
                            </Button>
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Sign in to like this comment</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    {isOwner && editingCommentId !== comment.id && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            handleEditComment(comment.id, comment.text)
                          }
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDeleteComment(comment.id)}
                          disabled={deleteComment.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {editingCommentId === comment.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="min-h-20"
                      maxLength={256}
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">
                        {editText.length}/256
                      </span>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancelEdit}
                        >
                          <X className="mr-1 h-3 w-3" />
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSaveEdit(comment.id)}
                          disabled={editComment.isPending || !editText.trim()}
                        >
                          {editComment.isPending ? "Saving..." : "Save"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed">{comment.text}</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              comment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
