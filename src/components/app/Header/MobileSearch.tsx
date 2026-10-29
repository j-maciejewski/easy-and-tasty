"use client";

import { LoaderCircle, Search, X } from "lucide-react";
import Link from "next/link";
import { ChangeEvent, useEffect, useMemo, useState } from "react";

import { Button, Input } from "@/components/ui";
import { api } from "@/trpc/react";

interface MobileSearchProps {
  handleClose: () => void;
}

export const MobileSearch = ({ handleClose }: MobileSearchProps) => {
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
        <div className="flex h-full w-full items-center justify-center">
          <LoaderCircle className="animate-spin text-muted-foreground" />
        </div>
      );
    }

    if (data !== undefined && data.length === 0) {
      return (
        <div className="px-4 py-3 text-muted-foreground text-sm">
          No recipes match that. Try a single ingredient, like "chicken".
        </div>
      );
    }

    if (error) {
      return (
        <div className="px-4 py-3 text-destructive text-sm">
          Search isn't available right now. Try again in a moment.
        </div>
      );
    }

    return (
      <ul>
        {data?.map((recipe) => (
          <li
            key={recipe.id}
            className="relative border-t hover:bg-accent [&:last-child]:border-b"
          >
            <Link
              href={`/recipe/${recipe.slug}`}
              className="block h-full w-full px-4 py-3"
              onClick={handleClose}
            >
              {recipe.title}
            </Link>
          </li>
        ))}
      </ul>
    );
  }, [isLoading, data, error, query, debouncedValue, handleClose]);

  return (
    <div className="slide-in-from-right fixed top-0 right-0 left-0 z-[100] flex h-full w-full animate-in flex-col bg-card duration-300">
      <div className="relative flex h-16 min-h-16 items-center justify-between">
        <Search className="absolute top-[50%] left-5 size-5 translate-y-[-50%] text-muted-foreground" />
        <Input
          aria-label="Search recipes"
          placeholder="Search recipes"
          className="peer/input h-full w-full rounded-none border-0 border-b bg-card pr-4 pl-14 font-medium text-lg shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          value={query}
          onChange={handleChange}
        />
        <Button
          onClick={handleClose}
          type="button"
          variant="ghost"
          className="absolute top-[50%] right-3 aspect-square h-10 translate-y-[-50%] p-0"
          aria-label="Close search"
        >
          <X className="absolute size-5" />
        </Button>
      </div>
      <div className="flex grow flex-col overflow-auto">
        {query.length >= 3 && (
          <div className="h-full overflow-auto bg-card">{SearchResults}</div>
        )}
      </div>
    </div>
  );
};
