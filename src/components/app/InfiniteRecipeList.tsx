"use client";

import { LoaderCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { api } from "@/trpc/react";

import { RecipeCard } from "./RecipeCards/RecipeCard";

export type InfiniteRecipeListProps =
  | {
      type: "all";
    }
  | {
      slug: string;
      type: "cuisine" | "category";
    };

export const InfiniteRecipeList = (props: InfiniteRecipeListProps) => {
  const searchParams = useSearchParams();
  const sortBy = searchParams.get("sortBy") || "createdAt";

  const {
    data: recipes,
    error,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
  } = props.type === "all"
    ? api.public.recipe.getInfiniteAllRecipes.useInfiniteQuery(
        {
          sortBy: sortBy as "title" | "createdAt",
        },
        {
          getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
        },
      )
    : api.public.recipe[
        props.type === "category"
          ? "getInfiniteRecipesByCategory"
          : "getInfiniteRecipesByCuisine"
      ].useInfiniteQuery(
        {
          slug: props.slug,
          sortBy: sortBy as "title" | "createdAt",
        },
        {
          getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
        },
      );

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight &&
        hasNextPage
      ) {
        fetchNextPage();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <LoaderCircle className="text-muted-foreground mx-auto my-4 animate-spin" />
    );
  }

  if (error) {
    return (
      <p className="text-destructive">
        Recipes couldn't be loaded: {error.message}. Refresh the page to try
        again.
      </p>
    );
  }

  if (!recipes) {
    return <div>No recipes found.</div>;
  }

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-x-6 gap-y-10">
        {recipes.pages
          .flatMap((page) => page.recipes)
          .map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
      </div>
      {isFetching && (
        <LoaderCircle className="text-muted-foreground mx-auto my-4 animate-spin" />
      )}
    </>
  );
};
