"use client";

import { LoaderCircle, Search } from "lucide-react";
import Link from "next/link";
import { ChangeEvent, useEffect, useMemo, useState } from "react";

import { Input } from "@/components/ui";
import { api } from "@/trpc/react";

export const Searchbar = () => {
  const [query, setQuery] = useState("");
  const [debouncedValue, setDebouncedValue] = useState<string>(query);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(query);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setQuery(evt.target.value);
  };
  const { data, error, isLoading } =
    api.public.recipe.getRecipesByQuery.useQuery(debouncedValue, {
      enabled: debouncedValue.length >= 3,
    });

  const SearchResults = useMemo(() => {
    if (isLoading || query !== debouncedValue) {
      return (
        <LoaderCircle className="text-muted-foreground mx-auto my-3 animate-spin" />
      );
    }

    if (data !== undefined && data.length === 0) {
      return (
        <div className="text-muted-foreground px-4 py-3 text-sm">
          No recipes match that. Try a single ingredient, like "chicken".
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-destructive px-4 py-3 text-sm">
          Search isn't available right now. Try again in a moment.
        </div>
      );
    }

    return (
      <>
        {data?.map((recipe) => (
          <Link
            key={recipe.id}
            href={`/recipe/${recipe.slug}`}
            className="hover:bg-accent focus-visible:bg-accent block rounded-xl px-3 py-2.5 text-sm"
          >
            {recipe.title}
          </Link>
        ))}
      </>
    );
  }, [isLoading, data, error, query, debouncedValue]);

  return (
    <div className={"relative mx-6 max-sm:w-full"}>
      <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2" />
      <Input
        type="search"
        aria-label="Search recipes"
        placeholder="Search recipes, e.g. lasagne"
        className="peer/input bg-muted focus-visible:border-ring focus-visible:bg-card focus-visible:ring-primary/30 h-11 w-full rounded-full border-transparent pl-10 shadow-none md:w-80 lg:w-[28rem]"
        value={query}
        onChange={handleChange}
      />
      {query.length >= 3 && (
        <div className="absolute top-full z-50 hidden w-full peer-focus/input:block hover:block">
          <div className="bg-popover mt-2 max-h-80 overflow-auto rounded-2xl border p-1.5 shadow-lg">
            {SearchResults}
          </div>
        </div>
      )}
    </div>
  );
};
