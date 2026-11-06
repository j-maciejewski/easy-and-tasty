"use client";

import { ArrowLeft, ChefHat, History, Search, Timer, X } from "lucide-react";
import Link from "next/link";
import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import { Button } from "@/components/ui";
import { Path } from "@/config";
import { useSearchTracking } from "@/hooks";
import { api } from "@/trpc/react";

import { RetryImage } from "../RetryImage";

const MIN_QUERY_LENGTH = 3;
const RECENT_SEARCHES_KEY = "recent-searches";
const MAX_RECENT_SEARCHES = 6;

const readRecentSearches = (): string[] => {
  try {
    const stored = JSON.parse(
      localStorage.getItem(RECENT_SEARCHES_KEY) ?? "[]",
    );
    return Array.isArray(stored)
      ? stored.filter((s) => typeof s === "string")
      : [];
  } catch {
    return [];
  }
};

const writeRecentSearches = (searches: string[]) => {
  try {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
  } catch {
    // Storage can be unavailable (private mode); recents are a convenience.
  }
};

// Wraps the first case-insensitive match of the query so readers can see why
// a recipe showed up.
const highlightMatch = (text: string, query: string): ReactNode => {
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (!query || index === -1) return text;

  return (
    <>
      {text.slice(0, index)}
      <mark className="text-primary bg-transparent font-semibold">
        {text.slice(index, index + query.length)}
      </mark>
      {text.slice(index + query.length)}
    </>
  );
};

interface SectionProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}

const Section = ({ title, action, children }: SectionProps) => (
  <section className="px-4 pt-5">
    <div className="mb-2 flex min-h-8 items-center justify-between">
      <h2 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
        {title}
      </h2>
      {action}
    </div>
    {children}
  </section>
);

interface BrowseChipsProps {
  handleClose: () => void;
}

const BrowseChips = ({ handleClose }: BrowseChipsProps) => {
  const { data: categories } = api.public.category.getCategories.useQuery();
  const { data: cuisines } = api.public.cuisine.getCuisines.useQuery();

  const rows = [
    { title: "Categories", basePath: Path.CATEGORIES, items: categories },
    { title: "Cuisines", basePath: Path.CUISINES, items: cuisines },
  ];

  return (
    <>
      {rows.map(
        (row) =>
          !!row.items?.length && (
            <Section key={row.title} title={row.title}>
              {/* One swipeable row per taxonomy instead of a wall of chips */}
              <ul className="-mx-4 flex snap-x scroll-px-4 [scrollbar-width:none] gap-2 overflow-x-auto px-4 pb-1 [&::-webkit-scrollbar]:hidden">
                {row.items.map((item) => (
                  <li key={item.slug} className="shrink-0 snap-start">
                    <Link
                      href={`${row.basePath}/${item.slug}`}
                      onClick={handleClose}
                      className="bg-muted hover:bg-accent active:bg-accent focus-visible:ring-ring/50 inline-flex h-10 items-center rounded-full px-4 text-sm font-medium whitespace-nowrap outline-none focus-visible:ring-[3px]"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </Section>
          ),
      )}
    </>
  );
};

const ResultSkeleton = () => (
  <ul aria-hidden className="px-2 pt-3">
    {[...Array(5)].map((_, i) => (
      <li key={i} className="flex items-center gap-3 px-2 py-2">
        <div className="bg-muted size-14 shrink-0 animate-pulse rounded-xl" />
        <div className="flex grow flex-col gap-2">
          <div className="bg-muted h-4 w-3/4 animate-pulse rounded-full" />
          <div className="bg-muted h-3 w-1/3 animate-pulse rounded-full" />
        </div>
      </li>
    ))}
  </ul>
);

interface MobileSearchProps {
  handleClose: () => void;
}

export const MobileSearch = ({ handleClose }: MobileSearchProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [debouncedValue, setDebouncedValue] = useState(query);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const trimmedQuery = query.trim();
  const trimmedDebounced = debouncedValue.trim();
  const isSearchable = trimmedQuery.length >= MIN_QUERY_LENGTH;

  useEffect(() => {
    setRecentSearches(readRecentSearches());
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(query), 300);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    const controller = new AbortController();
    window.addEventListener(
      "keydown",
      (evt) => {
        if (evt.key === "Escape") handleClose();
      },
      { signal: controller.signal },
    );
    return () => controller.abort();
  }, [handleClose]);

  const { data, error, isFetching } =
    api.public.recipe.getRecipesByQuery.useQuery(trimmedDebounced, {
      enabled: trimmedDebounced.length >= MIN_QUERY_LENGTH,
    });

  useSearchTracking(trimmedDebounced, data?.length);

  const isPending =
    isSearchable &&
    (trimmedQuery !== trimmedDebounced || (isFetching && !data));

  const saveRecentSearch = (term: string) => {
    const next = [
      term,
      ...recentSearches.filter((s) => s.toLowerCase() !== term.toLowerCase()),
    ].slice(0, MAX_RECENT_SEARCHES);
    setRecentSearches(next);
    writeRecentSearches(next);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    writeRecentSearches([]);
  };

  const fillQuery = (term: string) => {
    setQuery(term);
    setDebouncedValue(term);
    inputRef.current?.focus();
  };

  const clearQuery = () => {
    setQuery("");
    setDebouncedValue("");
    inputRef.current?.focus();
  };

  // "Search" on the keyboard just dismisses it so the results are visible.
  const handleSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    if (isSearchable) saveRecentSearch(trimmedQuery);
    inputRef.current?.blur();
  };

  // Scrolling the results means the reader is browsing, so get the keyboard
  // out of the way.
  const dismissKeyboard = () => {
    if (document.activeElement === inputRef.current) inputRef.current?.blur();
  };

  const renderBody = () => {
    if (!isSearchable) {
      return (
        <>
          {trimmedQuery.length > 0 && (
            <p className="text-muted-foreground px-4 pt-5 text-sm">
              Keep typing, we search from {MIN_QUERY_LENGTH} letters.
            </p>
          )}
          {recentSearches.length > 0 && (
            <Section
              title="Recent searches"
              action={
                <button
                  type="button"
                  onClick={clearRecentSearches}
                  className="text-primary -mr-2 h-8 rounded-full px-2 text-sm font-medium"
                >
                  Clear
                </button>
              }
            >
              <ul className="-mx-2">
                {recentSearches.map((term) => (
                  <li key={term}>
                    <button
                      type="button"
                      onClick={() => fillQuery(term)}
                      className="hover:bg-muted active:bg-muted flex min-h-12 w-full items-center gap-3 rounded-xl px-2 text-left text-base"
                    >
                      <History className="text-muted-foreground size-5 shrink-0" />
                      <span className="truncate">{term}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </Section>
          )}
          <BrowseChips handleClose={handleClose} />
        </>
      );
    }

    if (isPending) return <ResultSkeleton />;

    if (error) {
      return (
        <p className="text-destructive px-4 pt-5 text-sm">
          Search isn't available right now. Try again in a moment.
        </p>
      );
    }

    if (!data || data.length === 0) {
      return (
        <>
          <div className="flex flex-col items-center px-6 pt-10 text-center">
            <div className="bg-muted mb-4 flex size-14 items-center justify-center rounded-full">
              <Search className="text-muted-foreground size-6" />
            </div>
            <p className="font-display text-lg font-semibold">
              No recipes for "{trimmedQuery}"
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              Try a single ingredient, like "chicken".
            </p>
          </div>
          <BrowseChips handleClose={handleClose} />
        </>
      );
    }

    return (
      <>
        <p
          className="text-muted-foreground px-4 pt-4 pb-1 text-xs font-semibold tracking-wider uppercase"
          aria-live="polite"
        >
          {data.length === 1 ? "1 recipe" : `${data.length} recipes`}
        </p>
        <ul className="px-2">
          {data.map((recipe) => (
            <li key={recipe.id}>
              <Link
                href={`/recipe/${recipe.slug}`}
                onClick={() => {
                  saveRecentSearch(trimmedQuery);
                  handleClose();
                }}
                className="hover:bg-muted active:bg-muted focus-visible:ring-ring/50 flex items-center gap-3 rounded-2xl px-2 py-2 outline-none focus-visible:ring-[3px]"
              >
                <RetryImage
                  src={recipe.image}
                  alt=""
                  width={112}
                  height={112}
                  className="bg-muted size-14 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0 grow">
                  <p className="line-clamp-2 text-base leading-snug font-medium">
                    {highlightMatch(recipe.title, trimmedQuery)}
                  </p>
                  <p className="text-muted-foreground mt-0.5 flex items-center gap-3 text-sm">
                    <span className="flex items-center gap-1">
                      <Timer className="size-3.5" aria-hidden />
                      {recipe.time} min
                    </span>
                    <span className="flex items-center gap-1 capitalize">
                      <ChefHat className="size-3.5" aria-hidden />
                      {recipe.difficulty}
                    </span>
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </>
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search recipes"
      className="animate-in fade-in slide-in-from-bottom-4 bg-card fixed inset-0 z-100 flex h-dvh flex-col duration-200 motion-reduce:animate-none"
    >
      <form
        role="search"
        onSubmit={handleSubmit}
        className="border-border/70 flex h-16 min-h-16 items-center gap-1 border-b px-2"
      >
        <Button
          onClick={handleClose}
          type="button"
          variant="ghost"
          className="relative size-11 shrink-0 rounded-full p-0"
          aria-label="Close search"
        >
          <ArrowLeft className="absolute size-5" />
        </Button>
        <div className="relative grow">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2" />
          <input
            ref={inputRef}
            // biome-ignore lint/a11y/noAutofocus: the overlay exists only to type a search
            autoFocus
            type="search"
            enterKeyHint="search"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            aria-label="Search recipes"
            placeholder="Search recipes"
            value={query}
            onChange={(evt) => setQuery(evt.target.value)}
            className="bg-muted focus-visible:ring-primary/30 h-11 w-full rounded-full pr-11 pl-10 text-base outline-none focus-visible:ring-[3px] [&::-webkit-search-cancel-button]:hidden"
          />
          {query.length > 0 && (
            <button
              type="button"
              onClick={clearQuery}
              aria-label="Clear search"
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-1 flex size-9 -translate-y-1/2 items-center justify-center rounded-full"
            >
              <X className="size-4.5" />
            </button>
          )}
        </div>
      </form>
      <div
        className="grow overflow-y-auto overscroll-contain pb-[max(1.5rem,env(safe-area-inset-bottom))]"
        onTouchMove={dismissKeyboard}
      >
        {renderBody()}
      </div>
    </div>
  );
};
