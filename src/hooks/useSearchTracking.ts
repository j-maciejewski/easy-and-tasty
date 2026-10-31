"use client";

import { useEffect } from "react";

import { useTrackEvent } from "./useTrackEvent";

const SETTLE_DELAY_MS = 1500;

// Logs a search only once the reader stops typing, so partial terms like
// "chi" and "chic" on the way to "chicken" aren't recorded.
export const useSearchTracking = (
  term: string,
  resultCount: number | undefined,
) => {
  const track = useTrackEvent();

  useEffect(() => {
    if (term.trim().length < 3 || resultCount === undefined) return;

    const handler = setTimeout(
      () => track({ type: "search", term, resultCount }),
      SETTLE_DELAY_MS,
    );

    return () => clearTimeout(handler);
  }, [track, term, resultCount]);
};
