"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

let pendingParams: URLSearchParams | null = null;

export const useReplaceSearchParams = () => {
  const router = useRouter();
  const pathname = usePathname();

  return useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      if (!pendingParams) {
        const params = new URLSearchParams(window.location.search);
        pendingParams = params;

        queueMicrotask(() => {
          pendingParams = null;
          const search = params.toString();
          router.replace(search ? `${pathname}?${search}` : pathname, {
            scroll: false,
          });
        });
      }

      mutate(pendingParams);
    },
    [router, pathname],
  );
};
