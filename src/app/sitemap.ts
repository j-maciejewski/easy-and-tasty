import type { MetadataRoute } from "next";

import { api } from "@/trpc/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

  const [recipesSlugs, categoriesSlugs, cuisinesSlugs, pagesSlugs] =
    await Promise.all([
      api.public.recipe.getRecipesSlugs(),
      api.public.category.getCategoriesSlugs(),
      api.public.cuisine.getCuisinesSlugs(),
      api.public.article.getArticlesSlugs(),
    ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/articles`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/all-recipes`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/cuisines`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const recipeRoutes: MetadataRoute.Sitemap = recipesSlugs.map(({ slug }) => ({
    url: `${baseUrl}/recipe/${slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categoriesSlugs.map(
    ({ slug }) => ({
      url: `${baseUrl}/categories/${slug}`,
      changeFrequency: "weekly",
      priority: 0.6,
    }),
  );

  const cuisineRoutes: MetadataRoute.Sitemap = cuisinesSlugs.map(
    ({ slug }) => ({
      url: `${baseUrl}/cuisines/${slug}`,
      changeFrequency: "weekly",
      priority: 0.6,
    }),
  );

  const pageRoutes: MetadataRoute.Sitemap = pagesSlugs.map(({ slug }) => ({
    url: `${baseUrl}/${slug}`,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [
    ...staticRoutes,
    ...recipeRoutes,
    ...categoryRoutes,
    ...cuisineRoutes,
    ...pageRoutes,
  ];
}
