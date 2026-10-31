"use client";

import { History } from "lucide-react";
import { useSession } from "next-auth/react";

import { EmptyState, PageHeading, RecipeCard } from "@/components/app";
import { Button } from "@/components/ui";
import { Path } from "@/config";
import { api } from "@/trpc/react";

const recipeGridClassName =
  "grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3";

export default function RecentlyViewedPage() {
  const { data: session, status } = useSession();
  const utils = api.useUtils();
  const { data: recentRecipes, isLoading } =
    api.authenticated.recipe.getRecentlyViewed.useQuery(undefined, {
      enabled: !!session,
    });
  const clearHistory = api.authenticated.recipe.clearViewHistory.useMutation({
    onSuccess: () => utils.authenticated.recipe.getRecentlyViewed.invalidate(),
  });

  const heading = (
    <PageHeading
      title="Recently viewed"
      description="Recipes you've opened lately, so you can pick up where you left off."
    />
  );

  if (status === "loading" || isLoading) {
    return (
      <div className="w-full">
        {heading}
        <div className={recipeGridClassName}>
          {[...Array(6)].map((_, i) => (
            <div key={i}>
              <div className="bg-muted aspect-4/3 animate-pulse rounded-2xl" />
              <div className="bg-muted mt-3 h-5 w-3/4 animate-pulse rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="w-full">
        {heading}
        <EmptyState
          icon={History}
          title="Sign in to see your recently viewed recipes"
          description="Recipes you open while signed in will show up here."
          action={{ label: "Sign in", href: Path.LOGIN }}
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      {heading}

      {!recentRecipes || recentRecipes.length === 0 ? (
        <EmptyState
          icon={History}
          title="Nothing here yet"
          description="Open a recipe and it will show up here."
          action={{ label: "Browse all recipes", href: "/all-recipes" }}
        />
      ) : (
        <>
          <div className={recipeGridClassName}>
            {recentRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <Button
              variant="outline"
              disabled={clearHistory.isPending}
              onClick={() => clearHistory.mutate()}
            >
              Clear history
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
