"use client";

import { LoaderCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { api } from "@/trpc/react";

import { RecipeCard } from "./RecipeCard";

export namespace InfiniteRecipeList {
  export type Props =
    | {
        type: "all";
      }
    | {
        slug: string;
        type: "cuisine" | "category";
      };
}

export const InfiniteRecipeList = (props: InfiniteRecipeList.Props) => {
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
    ? // biome-ignore lint/correctness/useHookAtTopLevel: explanation
      api.public.recipe.getInfiniteAllRecipes.useInfiniteQuery(
        {
          sortBy: sortBy as "title" | "createdAt",
        },
        {
          getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
        },
      )
    : // biome-ignore lint/correctness/useHookAtTopLevel: explanation
      api.public.recipe[
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
    return <LoaderCircle className="mx-auto my-4 animate-spin text-gray-500" />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!recipes) {
    return <div>No recipes found.</div>;
  }

  return (
    <>
      <div className="~gap-4/6 grid grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))]">
        {recipes.pages
          .flatMap((page) => page.recipes)
          .map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
      </div>
      {isFetching && (
        <LoaderCircle className="mx-auto my-4 animate-spin text-gray-500" />
      )}
    </>
  );
};
