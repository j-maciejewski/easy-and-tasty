"use client";

import { useEffect, useRef } from "react";

export function useBroadcastChannel<T>(
  channelName: string,
  onUpdate: (data: T[]) => void,
): (data: T[]) => void {
  const channelRef = useRef<BroadcastChannel | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: explanation
  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") {
      return;
    }

    const channel = new BroadcastChannel(channelName);
    channelRef.current = channel;

    channel.onmessage = (event) => {
      if (event.data.type === "DATA_UPDATED") {
        onUpdate(event.data.data);
      }
    };

    return () => {
      channel.close();
      channelRef.current = null;
    };
  }, [onUpdate]);

  const broadcast = (data: T[]) => {
    if (channelRef.current) {
      channelRef.current.postMessage({
        type: "DATA_UPDATED",
        data,
      });
    }
  };

  return broadcast;
}
