"use client";

import { Bookmark } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";

interface BookmarkButtonProps {
  recipeId: number;
  className?: string;
}

export const BookmarkButton = ({
  recipeId,
  className,
}: BookmarkButtonProps) => {
  const { data: session } = useSession();

  const { data: isBookmarked = false } =
    api.public.recipe.isRecipeBookmarked.useQuery({
      recipeId,
      userId: session?.user?.id,
    });

  const utils = api.useUtils();

  const bookmarkRecipe = api.authenticated.recipe.bookmarkRecipe.useMutation({
    onSuccess: () => {
      toast.success("Recipe bookmarked!");
      void utils.public.recipe.isRecipeBookmarked.invalidate({
        recipeId,
        userId: session?.user?.id,
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to bookmark recipe");
    },
  });

  const unbookmarkRecipe =
    api.authenticated.recipe.unbookmarkRecipe.useMutation({
      onSuccess: () => {
        toast.success("Bookmark removed");
        void utils.public.recipe.isRecipeBookmarked.invalidate({
          recipeId,
          userId: session?.user?.id,
        });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to remove bookmark");
      },
    });

  const handleBookmarkToggle = () => {
    if (!session) {
      toast.error("Please sign in to bookmark recipes");
      return;
    }

    if (isBookmarked) {
      unbookmarkRecipe.mutate(recipeId);
    } else {
      bookmarkRecipe.mutate(recipeId);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          className={cn("size-6", className)}
          onClick={handleBookmarkToggle}
          disabled={bookmarkRecipe.isPending || unbookmarkRecipe.isPending}
        >
          <Bookmark
            className={cn("absolute size-4", isBookmarked && "fill-current")}
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {session
          ? isBookmarked
            ? "Remove bookmark"
            : "Bookmark recipe"
          : "Sign in to bookmark"}
      </TooltipContent>
    </Tooltip>
  );
};
