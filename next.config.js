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
        hostname: "mf7wcpsx4r.ufs.sh",
      },
    ],
  },
  experimental: {
    reactCompiler: true,
    viewTransition: true,
  },
  headers: async () => {
    return [
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
