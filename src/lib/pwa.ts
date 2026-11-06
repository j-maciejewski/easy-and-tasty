// Must match PAGES_CACHE in public/sw.js
export const OFFLINE_PAGES_CACHE = "pages-v1";

export const cachePagesForOffline = async (urls: string[]) => {
  if (!("serviceWorker" in navigator) || urls.length === 0) return;

  const registration = await navigator.serviceWorker.ready;
  registration.active?.postMessage({ type: "CACHE_PAGES", urls });
};
