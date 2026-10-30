"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useReplaceSearchParams } from "./useReplaceSearchParams";

const QUERY_PARAM = "q";

export const useSearchQuery = () => {
  const [query, setQuery] = useState("");

  const clearQuery = () => setQuery("");

  return { query, setQuery, clearQuery };
};

export const useDebouncedSearchQuery = (onChange?: () => void) => {
  const searchParams = useSearchParams();
  const replaceSearchParams = useReplaceSearchParams();

  const debouncedQuery = searchParams.get(QUERY_PARAM) ?? "";
  const [query, setQuery] = useState(debouncedQuery);
  const lastSyncedQuery = useRef(debouncedQuery);

  useEffect(() => {
    if (debouncedQuery === lastSyncedQuery.current) return;

    lastSyncedQuery.current = debouncedQuery;
    setQuery(debouncedQuery);
  }, [debouncedQuery]);

  const commitQuery = (value: string) => {
    lastSyncedQuery.current = value;

    replaceSearchParams((params) => {
      params.delete("page");
      if (value) params.set(QUERY_PARAM, value);
      else params.delete(QUERY_PARAM);
    });

    onChange?.();
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: explanation
  useEffect(() => {
    if (query === lastSyncedQuery.current) return;

    const handler = setTimeout(() => commitQuery(query), 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  const clearQuery = () => {
    setQuery("");
    if (lastSyncedQuery.current !== "") commitQuery("");
  };

  return { query, setQuery, debouncedQuery, clearQuery };
};
