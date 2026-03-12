"use client";

import { Bookmark } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

import { RecipeCard } from "@/components/app";
import { api } from "@/trpc/react";

export default function BookmarksPage() {
  const { data: session, status } = useSession();
  const { data: bookmarkedRecipes, isLoading } =
    api.authenticated.recipe.getBookmarkedRecipes.useQuery(undefined, {
      enabled: !!session,
    });

  if (status === "loading" || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-4 font-semibold text-2xl">My Bookmarks</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-96 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-4 font-semibold text-2xl">My Bookmarks</h1>
        <div className="rounded-lg border bg-card p-8 text-center">
          <p className="mb-4 text-muted-foreground">
            Please sign in to view your bookmarked recipes
          </p>
          <Link
            href="/api/auth/signin"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 font-semibold text-2xl">My Bookmarks</h1>

      {!bookmarkedRecipes || bookmarkedRecipes.length === 0 ? (
        <div className="rounded-lg border bg-card p-8 text-center">
          <Bookmark className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <p className="mb-2 font-medium text-lg">No bookmarks yet</p>
          <p className="mb-4 text-muted-foreground">
            Start bookmarking your favorite recipes to see them here
          </p>
          <Link
            href="/all-recipes"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Browse Recipes
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {bookmarkedRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}
