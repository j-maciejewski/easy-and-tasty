"use client";

import { LoaderCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { api } from "@/trpc/react";

import { ArticlesList } from "./ArticlesList";

export const InfiniteArticleList = () => {
  const searchParams = useSearchParams();
  const sortBy = searchParams.get("sortBy") || "createdAt";

  const { data, error, isLoading, isFetching, fetchNextPage, hasNextPage } =
    api.public.page.getInfinitePages.useInfiniteQuery(
      {
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
        hasNextPage &&
        !isFetching
      ) {
        fetchNextPage();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasNextPage, isFetching, fetchNextPage]);

  if (isLoading) {
    return <LoaderCircle className="mx-auto my-4 animate-spin text-gray-500" />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>No articles found.</div>;
  }

  return (
    <>
      <ArticlesList
        articles={data.pages.flatMap((page) => page.pages)}
        variant="cards"
      />
      {isFetching && (
        <LoaderCircle className="mx-auto my-4 animate-spin text-gray-500" />
      )}
    </>
  );
};
