"use client";

import { Bookmark } from "lucide-react";
import { useSession } from "next-auth/react";

import { EmptyState, PageHeading, RecipeCard } from "@/components/app";
import { Path } from "@/config";
import { api } from "@/trpc/react";

const recipeGridClassName =
  "grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3";

export default function BookmarksPage() {
  const { data: session, status } = useSession();
  const { data: bookmarkedRecipes, isLoading } =
    api.authenticated.recipe.getBookmarkedRecipes.useQuery(undefined, {
      enabled: !!session,
    });

  const heading = (
    <PageHeading
      title="Saved recipes"
      description="Everything you've bookmarked, ready for your next shop."
    />
  );

  if (status === "loading" || isLoading) {
    return (
      <div className="w-full">
        {heading}
        <div className={recipeGridClassName}>
          {[...Array(6)].map((_, i) => (
            <div key={i}>
              <div className="aspect-4/3 animate-pulse rounded-2xl bg-muted" />
              <div className="mt-3 h-5 w-3/4 animate-pulse rounded-full bg-muted" />
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
          icon={Bookmark}
          title="Sign in to see your saved recipes"
          description="Bookmark recipes as you browse and they'll be waiting for you here."
          action={{ label: "Sign in", href: Path.LOGIN }}
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      {heading}

      {!bookmarkedRecipes || bookmarkedRecipes.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved recipes yet"
          description="Tap the bookmark icon on any recipe to keep it here."
          action={{ label: "Browse all recipes", href: "/all-recipes" }}
        />
      ) : (
        <div className={recipeGridClassName}>
          {bookmarkedRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}
