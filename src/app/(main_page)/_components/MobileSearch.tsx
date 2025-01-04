"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { LoaderCircle, Search, X } from "lucide-react";
import Link from "next/link";
import {
  ChangeEvent,
  HTMLAttributes,
  Ref,
  useEffect,
  useMemo,
  useState,
} from "react";

export const MobileSearch = ({
  className,
  handleClose,
  ref,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  handleClose: () => void;
  ref?: Ref<HTMLDivElement>;
}) => {
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
          <LoaderCircle className="animate-spin text-gray-500" />
        </div>
      );
    }

    if (data !== undefined && data.length === 0) {
      return <div className="px-4 py-2 italic">No results</div>;
    }

    if (error) {
      return <div className="px-4 py-2 italic">An error occured</div>;
    }

    return (
      <ul>
        {data?.map((recipe) => (
          <li
            key={recipe.id}
            className="relative border-t hover:bg-gray-100 [&:last-child]:border-b"
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
    <div
      className="slide-in-from-right fixed top-0 right-0 left-0 z-10 flex h-full w-full animate-in flex-col bg-white duration-300"
      {...props}
      ref={ref}
    >
      <div className="relative flex h-16 min-h-16 items-center justify-between">
        <Search className="absolute top-[50%] left-5 size-5 translate-y-[-50%] text-muted-foreground" />
        <Input
          placeholder="Search recipes..."
          className="peer/input h-full w-full rounded-none border-none bg-background pr-4 pl-14 font-semibold text-lg shadow focus-visible:ring-0 focus-visible:ring-offset-0"
          value={query}
          onChange={handleChange}
        />
        <Button
          onClick={handleClose}
          type="button"
          variant="link"
          className="absolute top-[50%] right-3 aspect-square h-10 translate-y-[-50%] p-0"
        >
          <X className="size-5" />
        </Button>
      </div>
      <div className="flex grow flex-col overflow-auto">
        {query.length >= 3 && (
          <div className="h-full overflow-auto bg-white">{SearchResults}</div>
        )}
      </div>
    </div>
  );
};
