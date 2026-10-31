"use client";

import { api, type RouterInputs } from "@/trpc/react";

export type TrackEventInput = RouterInputs["public"]["event"]["track"];

// Tracking is best-effort: failures are swallowed so they never surface to
// readers. The returned mutate function is stable across renders, so it is
// safe to list in effect dependencies.
export const useTrackEvent = () =>
  api.public.event.track.useMutation({ onError: () => {} }).mutate;
