"use client";

import { Star } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";

interface RateRecipeProps {
  recipeId: number;
  className?: string;
}

export const RateRecipe = ({ recipeId, className }: RateRecipeProps) => {
  const { data: session } = useSession();
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  const { data: userRating } = api.authenticated.recipe.getUserRating.useQuery(
    recipeId,
    { enabled: !!session },
  );

  const utils = api.useUtils();

  const rateRecipe = api.authenticated.recipe.rateRecipe.useMutation({
    onSuccess: () => {
      toast.success("Rating submitted!");
      void utils.authenticated.recipe.getUserRating.invalidate(recipeId);
      void utils.public.recipe.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit rating");
    },
  });

  const unrateRecipe = api.authenticated.recipe.unrateRecipe.useMutation({
    onSuccess: () => {
      toast.success("Rating removed");
      void utils.authenticated.recipe.getUserRating.invalidate(recipeId);
      void utils.public.recipe.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to remove rating");
    },
  });

  const handleRating = (score: number) => {
    if (!session) {
      toast.error("Please sign in to rate recipes");
      return;
    }

    if (userRating === score) {
      // If clicking the same star, remove the rating
      unrateRecipe.mutate(recipeId);
    } else {
      // Otherwise, submit the new rating
      rateRecipe.mutate({ recipeId, score });
    }
  };

  const displayRating = hoveredStar ?? userRating ?? 0;

  if (!session) {
    return null;
  }

  return (
    <div
      className={cn(
        "mt-10 flex flex-col gap-2 rounded-2xl bg-card p-5",
        className,
      )}
    >
      <p className="font-display font-semibold text-lg">Cooked it? Rate it</p>
      <div className="flex items-center gap-0">
        {[1, 2, 3, 4, 5].map((star) => (
          <Button
            key={star}
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0 hover:bg-transparent"
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(null)}
            onClick={() => handleRating(star)}
            disabled={rateRecipe.isPending || unrateRecipe.isPending}
            aria-label={`Rate ${star} out of 5`}
          >
            <Star
              className={cn(
                "h-6 w-6 transition-colors",
                star <= displayRating
                  ? "fill-saffron text-saffron"
                  : "text-muted-foreground/50",
              )}
            />
          </Button>
        ))}
        {userRating && (
          <span className="ml-2 text-muted-foreground text-sm">
            Your rating: {userRating}/5
          </span>
        )}
      </div>
    </div>
  );
};
