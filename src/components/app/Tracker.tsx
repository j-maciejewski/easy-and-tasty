"use client";

import { useEffect, useRef } from "react";

import { useTrackEvent } from "@/hooks";

const ENGAGED_VISIBLE_SECONDS = 30;
const ENGAGED_SCROLL_DEPTH = 0.75;

interface TrackerProps {
  entityType: "recipe" | "article";
  entityId: number;
}

export const Tracker = ({ entityType, entityId }: TrackerProps) => {
  const track = useTrackEvent();
  const hasTrackedViewRef = useRef(false);
  const hasTrackedEngagedRef = useRef(false);

  useEffect(() => {
    if (hasTrackedViewRef.current) return;

    hasTrackedViewRef.current = true;

    const params = new URLSearchParams(window.location.search);

    track({
      type: "view",
      entityType,
      entityId,
      referrer: document.referrer || undefined,
      utmSource: params.get("utm_source") ?? undefined,
      utmMedium: params.get("utm_medium") ?? undefined,
      utmCampaign: params.get("utm_campaign") ?? undefined,
    });
  }, [track, entityType, entityId]);

  // Counts as engaged after 30s of visible time or scrolling 75% of the page
  useEffect(() => {
    let visibleSeconds = 0;

    const markEngaged = () => {
      if (hasTrackedEngagedRef.current) return;

      hasTrackedEngagedRef.current = true;
      track({ type: "engaged", entityType, entityId });
      cleanup();
    };

    const interval = setInterval(() => {
      if (document.visibilityState !== "visible") return;

      visibleSeconds += 1;
      if (visibleSeconds >= ENGAGED_VISIBLE_SECONDS) markEngaged();
    }, 1000);

    const handleScroll = () => {
      const { scrollHeight } = document.documentElement;
      const depth = (window.scrollY + window.innerHeight) / scrollHeight;

      if (depth >= ENGAGED_SCROLL_DEPTH) markEngaged();
    };

    const cleanup = () => {
      clearInterval(interval);
      window.removeEventListener("scroll", handleScroll);
    };

    if (hasTrackedEngagedRef.current) {
      cleanup();
      return;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    return cleanup;
  }, [track, entityType, entityId]);

  // beforeprint also catches Ctrl+P, not just the print button
  useEffect(() => {
    const handlePrint = () => track({ type: "print", entityType, entityId });
    const handleCopy = () => track({ type: "copy", entityType, entityId });

    window.addEventListener("beforeprint", handlePrint);
    document.addEventListener("copy", handleCopy);

    return () => {
      window.removeEventListener("beforeprint", handlePrint);
      document.removeEventListener("copy", handleCopy);
    };
  }, [track, entityType, entityId]);

  return null;
};
