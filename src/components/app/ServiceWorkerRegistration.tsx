"use client";

import { useEffect } from "react";

// Registers the service worker in production only. In development, removes any
// worker left over from a production build so it can't serve stale pages.
export const ServiceWorkerRegistration = () => {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) registration.unregister();
      });
      return;
    }

    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .catch((error) =>
        console.error("Service worker registration failed", error),
      );
  }, []);

  return null;
};
