"use client";

import { useSearchParams } from "next/navigation";

import { useReplaceSearchParams } from "./useReplaceSearchParams";

export type MediaFilter = "all" | "used" | "unused";

const FILTER_PARAM = "usage";

const parseFilter = (value: string | null): MediaFilter =>
  value === "used" || value === "unused" ? value : "all";

export const useMediaFilter = () => {
  const searchParams = useSearchParams();
  const replaceSearchParams = useReplaceSearchParams();

  const filter = parseFilter(searchParams.get(FILTER_PARAM));

  const setFilter = (value: MediaFilter) => {
    if (value === filter) return;

    replaceSearchParams((params) => {
      params.delete("page");
      if (value !== "all") params.set(FILTER_PARAM, value);
      else params.delete(FILTER_PARAM);
    });
  };

  const clearFilter = () => setFilter("all");

  return { filter, setFilter, clearFilter };
};
