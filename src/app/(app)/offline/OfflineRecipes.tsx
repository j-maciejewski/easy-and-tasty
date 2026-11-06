"use client";

import { WifiOff } from "lucide-react";
import { useEffect, useState } from "react";

import { EmptyState } from "@/components/app";
import { Path } from "@/config";
import { APP_NAME } from "@/consts";
import { OFFLINE_PAGES_CACHE } from "@/lib/pwa";

type OfflineRecipe = { href: string; title: string };

const TITLE_SUFFIX = ` - ${APP_NAME}`;

const decodeHtml = (text: string) =>
  new DOMParser().parseFromString(text, "text/html").documentElement
    .textContent ?? text;

const readOfflineRecipes = async (): Promise<OfflineRecipe[]> => {
  if (!("caches" in window) || !(await caches.has(OFFLINE_PAGES_CACHE))) {
    return [];
  }

  const cache = await caches.open(OFFLINE_PAGES_CACHE);
  const requests = (await cache.keys()).filter((request) =>
    new URL(request.url).pathname.startsWith(`${Path.RECIPE}/`),
  );

  const recipes = await Promise.all(
    requests.map(async (request) => {
      const url = new URL(request.url);
      const html = (await (await cache.match(request))?.text()) ?? "";
      const rawTitle = html.match(/<title>([^<]*)<\/title>/)?.[1];
      const title = rawTitle
        ? decodeHtml(rawTitle).replace(TITLE_SUFFIX, "")
        : decodeURIComponent(url.pathname.split("/").pop() ?? "");
      return { href: url.pathname, title };
    }),
  );

  return recipes.reverse();
};

export const OfflineRecipes = () => {
  const [recipes, setRecipes] = useState<OfflineRecipe[] | null>(null);

  useEffect(() => {
    readOfflineRecipes()
      .then(setRecipes)
      .catch(() => setRecipes([]));
  }, []);

  if (recipes === null) return null;

  if (recipes.length === 0) {
    return (
      <EmptyState
        icon={WifiOff}
        title="Nothing saved on this device yet"
        description="Recipes you open while online, and your saved recipes, will be listed here for when you're offline."
        action={{ label: "Browse all recipes", href: "/all-recipes" }}
      />
    );
  }

  return (
    <ul className="bg-card divide-y rounded-3xl">
      {recipes.map((recipe) => (
        <li key={recipe.href}>
          {/* Plain links: a full page load lets the service worker serve the cached page */}
          <a
            href={recipe.href}
            className="hover:text-primary block px-6 py-4 font-medium transition-colors"
          >
            {recipe.title}
          </a>
        </li>
      ))}
    </ul>
  );
};
