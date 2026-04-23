"use client";

import { useEffect, useState } from "react";

export const useSearchQuery = () => {
  const [query, setQuery] = useState("");

  const clearQuery = () => setQuery("");

  return { query, setQuery, clearQuery };
};

export const useDebouncedSearchQuery = (onChange?: () => void) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  const clearQuery = () => {
    setQuery("");
    setDebouncedQuery("");
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: explanation
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
      onChange?.();
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  return { query, setQuery, debouncedQuery, clearQuery };
};
