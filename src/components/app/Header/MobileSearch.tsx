"use client";

import { LoaderCircle, Search, X } from "lucide-react";
import Link from "next/link";
import { ChangeEvent, useEffect, useMemo, useState } from "react";

import { Button, Input } from "@/components/ui";
import { useSearchTracking } from "@/hooks";
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

  useSearchTracking(debouncedValue, data?.length);

  const SearchResults = useMemo(() => {
    if (isLoading || query !== debouncedValue) {
      return (
        <div className="flex h-full w-full items-center justify-center">
          <LoaderCircle className="text-muted-foreground animate-spin" />
        </div>
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
      <ul>
        {data?.map((recipe) => (
          <li
            key={recipe.id}
            className="hover:bg-accent relative border-t [&:last-child]:border-b"
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
    <div className="slide-in-from-right animate-in bg-card fixed top-0 right-0 left-0 z-[100] flex h-full w-full flex-col duration-300">
      <div className="relative flex h-16 min-h-16 items-center justify-between">
        <Search className="text-muted-foreground absolute top-[50%] left-5 size-5 translate-y-[-50%]" />
        <Input
          aria-label="Search recipes"
          placeholder="Search recipes"
          className="peer/input bg-card h-full w-full rounded-none border-0 border-b pr-4 pl-14 text-lg font-medium shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
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
          <div className="bg-card h-full overflow-auto">{SearchResults}</div>
        )}
      </div>
    </div>
  );
};
