"use client";

import { useEffect } from "react";

export const useUnsavedChangesWarning = (
  isDirty: boolean,
  onLinkNavigation?: (href: string) => void,
) => {
  useEffect(() => {
    if (!isDirty) return;

    const handleBeforeUnload = (evt: BeforeUnloadEvent) => {
      evt.preventDefault();
      evt.returnValue = "";
    };

    // Runs in the capture phase so it fires before next/link's click handler.
    const handleClick = (evt: MouseEvent) => {
      if (!onLinkNavigation) return;
      if (evt.defaultPrevented || evt.button !== 0) return;
      if (evt.metaKey || evt.ctrlKey || evt.shiftKey || evt.altKey) return;

      const anchor = (evt.target as Element | null)?.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search
      )
        return;

      evt.preventDefault();
      evt.stopPropagation();
      onLinkNavigation(`${url.pathname}${url.search}${url.hash}`);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("click", handleClick, true);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", handleClick, true);
    };
  }, [isDirty, onLinkNavigation]);
};
