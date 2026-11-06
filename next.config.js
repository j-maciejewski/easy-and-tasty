/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "*.ufs.sh",
      },
    ],
    // Uploaded files are immutable, so keep optimized variants cached for 30 days
    minimumCacheTTL: 2592000,
  },
  headers: async () => {
    return [
      {
        // The browser checks for a new service worker on every navigation
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
        ],
      },
      {
        source: "/api/trpc/public/category",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=15, max-age=15",
          },
        ],
      },
    ];
  },
};

export default config;
