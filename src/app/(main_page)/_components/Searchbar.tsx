"use client";

import clsx from "clsx";
import { LoaderCircle, Search } from "lucide-react";
import Link from "next/link";
import {
  ChangeEvent,
  forwardRef,
  HTMLAttributes,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Input } from "@/components/ui";
import { api } from "@/trpc/react";

export const Searchbar = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
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
        <LoaderCircle className="mx-auto my-2 animate-spin text-gray-500" />
      );
    }

    if (data !== undefined && data.length === 0) {
      return <div className="px-4 py-2 italic">No results</div>;
    }

    if (error) {
      return <div className="px-4 py-2 italic">An error occured</div>;
    }

    return (
      <>
        {data?.map((recipe) => (
          <Link
            key={recipe.id}
            href={`/recipe/${recipe.slug}`}
            className="text-sm hover:bg-gray-50 [&:not(:last-child)>div]:border-b"
          >
            <div className="p-3 hover:bg-gray-100">{recipe.title}</div>
          </Link>
        ))}
      </>
    );
  }, [isLoading, data, error, query, debouncedValue]);

  return (
    <div
      className={clsx("relative mr-4 max-sm:w-full", className)}
      {...props}
      ref={ref}
    >
      <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search recipes..."
        className="peer/input h-fit w-full rounded-lg bg-background py-2 pl-8 focus-visible:ring-primary/75 md:w-[300px] lg:w-[360px]"
        value={query}
        onChange={handleChange}
      />
      {query.length >= 3 && (
        <div className="absolute top-full z-50 hidden w-full hover:block peer-focus/input:block">
          <div className="mt-2 max-h-64 overflow-auto rounded-lg border bg-white shadow-inner">
            {SearchResults}
          </div>
        </div>
      )}
    </div>
  );
});
