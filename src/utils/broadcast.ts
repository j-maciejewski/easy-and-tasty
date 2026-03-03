"use client";

import { useEffect, useRef } from "react";

export function useCategoriesChannel(
  onUpdate: (categories: Category[]) => void,
): (categories: Category[]) => void {
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") {
      return;
    }

    const channel = new BroadcastChannel("categories-sync");
    channelRef.current = channel;

    channel.onmessage = (event) => {
      if (event.data.type === "CATEGORIES_UPDATED") {
        onUpdate(event.data.categories);
      }
    };

    return () => {
      channel.close();
      channelRef.current = null;
    };
  }, [onUpdate]);

  const broadcast = (categories: Category[]) => {
    if (channelRef.current) {
      channelRef.current.postMessage({
        type: "CATEGORIES_UPDATED",
        categories,
      });
    }
  };

  return broadcast;
}
