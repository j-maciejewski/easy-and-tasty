// Service worker for Easy and Tasty.
// - Pages: network first, falling back to the last cached copy, then /offline.
// - Next.js build assets: cache first (their URLs are content hashed).
// - Optimized images: cache first, successful responses only.
// - Dashboard, auth and API requests are never cached.
// Bump VERSION to drop every cache on the next activation.

const VERSION = "v1";
const PAGES_CACHE = `pages-${VERSION}`;
const STATIC_CACHE = `static-${VERSION}`;
const IMAGES_CACHE = `images-${VERSION}`;
const CACHES = [PAGES_CACHE, STATIC_CACHE, IMAGES_CACHE];

const OFFLINE_URL = "/offline";
const MAX_PAGES = 80;
const MAX_IMAGES = 250;
const MAX_STATIC = 400;

const UNCACHED_PREFIXES = [
  "/api",
  "/dashboard",
  "/login",
  "/sign-up",
  "/reset-password",
  "/verify-email",
  "/post-login",
];

const isCacheablePage = (url) =>
  url.origin === self.location.origin &&
  !url.searchParams.has("preview") &&
  !UNCACHED_PREFIXES.some(
    (prefix) =>
      url.pathname === prefix || url.pathname.startsWith(`${prefix}/`),
  );

const isCacheableResponse = (response) =>
  response?.ok && response.type === "basic" && !response.redirected;

// Deletes the oldest entries. cache.put moves an updated entry to the end,
// so this evicts the least recently refreshed ones.
const trimCache = async (cacheName, maxEntries) => {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  await Promise.all(
    keys
      .slice(0, Math.max(0, keys.length - maxEntries))
      .map((key) => cache.delete(key)),
  );
};

const putInCache = async (cacheName, request, response, maxEntries) => {
  const cache = await caches.open(cacheName);
  await cache.put(request, response);
  await trimCache(cacheName, maxEntries);
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(PAGES_CACHE)
      .then((cache) => cache.add(new Request(OFFLINE_URL, { cache: "reload" })))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names
          .filter((name) => !CACHES.includes(name))
          .map((name) => caches.delete(name)),
      );
      if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable();
      }
      await self.clients.claim();
    })(),
  );
});

const handleNavigation = async (event) => {
  const { request } = event;
  const url = new URL(request.url);
  const cacheable = isCacheablePage(url);

  try {
    const response = (await event.preloadResponse) || (await fetch(request));
    if (cacheable && isCacheableResponse(response)) {
      event.waitUntil(
        putInCache(PAGES_CACHE, request, response.clone(), MAX_PAGES),
      );
    }
    return response;
  } catch {
    const cache = await caches.open(PAGES_CACHE);
    const cached = cacheable && (await cache.match(request));
    return cached || (await cache.match(OFFLINE_URL)) || Response.error();
  }
};

const cacheFirst = async (event, cacheName, maxEntries) => {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(event.request);
  if (cached) return cached;

  const response = await fetch(event.request);
  if (isCacheableResponse(response)) {
    event.waitUntil(
      putInCache(cacheName, event.request, response.clone(), maxEntries),
    );
  }
  return response;
};

const staleWhileRevalidate = async (event, cacheName, maxEntries) => {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(event.request);
  const network = fetch(event.request).then((response) => {
    if (isCacheableResponse(response)) {
      return putInCache(
        cacheName,
        event.request,
        response.clone(),
        maxEntries,
      ).then(() => response);
    }
    return response;
  });

  if (cached) {
    event.waitUntil(network.catch(() => undefined));
    return cached;
  }
  return network;
};

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(handleNavigation(event));
    return;
  }

  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(event, STATIC_CACHE, MAX_STATIC));
    return;
  }

  if (url.pathname.startsWith("/_next/image")) {
    event.respondWith(cacheFirst(event, IMAGES_CACHE, MAX_IMAGES));
    return;
  }

  if (
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/mock/") ||
    /^\/(favicon|logo|404-image)\.png$/.test(url.pathname)
  ) {
    event.respondWith(staleWhileRevalidate(event, STATIC_CACHE, MAX_STATIC));
  }
});

// The app sends { type: "CACHE_PAGES", urls } to keep pages (for example the
// user's saved recipes) available offline before they have been opened.
self.addEventListener("message", (event) => {
  if (event.data?.type !== "CACHE_PAGES" || !Array.isArray(event.data.urls)) {
    return;
  }

  event.waitUntil(
    (async () => {
      const cache = await caches.open(PAGES_CACHE);
      for (const href of event.data.urls.slice(0, MAX_PAGES)) {
        const url = new URL(href, self.location.origin);
        if (!isCacheablePage(url) || (await cache.match(url.href))) continue;
        try {
          const response = await fetch(url.href, {
            credentials: "same-origin",
          });
          if (isCacheableResponse(response))
            await cache.put(url.href, response);
        } catch {
          // Offline or failed; it will be cached when the page is next opened.
        }
      }
      await trimCache(PAGES_CACHE, MAX_PAGES);
    })(),
  );
});
