import type { MetadataRoute } from "next";

import { Path } from "@/config/paths";
import { api } from "@/trpc/server";

// Regenerate hourly so newly published content shows up without a rebuild.
export const revalidate = 3600;

const lastModifiedOf = ({
  updatedAt,
  publishedAt,
}: {
  updatedAt: Date | null;
  publishedAt: Date | null;
}) => updatedAt ?? publishedAt ?? undefined;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

  const [recipesSlugs, categoriesSlugs, cuisinesSlugs, articlesSlugs] =
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
      url: `${baseUrl}${Path.ARTICLES}`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}${Path.ALL_RECIPES}`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}${Path.CATEGORIES}`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}${Path.CUISINES}`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...[Path.FAQ, Path.CONTACT, Path.PRIVACY_POLICY].map((path) => ({
      url: `${baseUrl}${path}`,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];

  const recipeRoutes: MetadataRoute.Sitemap = recipesSlugs.map((recipe) => ({
    url: `${baseUrl}${Path.RECIPE}/${recipe.slug}`,
    lastModified: lastModifiedOf(recipe),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categoriesSlugs.map(
    ({ slug }) => ({
      url: `${baseUrl}${Path.CATEGORIES}/${slug}`,
      changeFrequency: "weekly",
      priority: 0.6,
    }),
  );

  const cuisineRoutes: MetadataRoute.Sitemap = cuisinesSlugs.map(
    ({ slug }) => ({
      url: `${baseUrl}${Path.CUISINES}/${slug}`,
      changeFrequency: "weekly",
      priority: 0.6,
    }),
  );

  const articleRoutes: MetadataRoute.Sitemap = articlesSlugs.map((article) => ({
    url: `${baseUrl}/${article.slug}`,
    lastModified: lastModifiedOf(article),
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [
    ...staticRoutes,
    ...recipeRoutes,
    ...categoryRoutes,
    ...cuisineRoutes,
    ...articleRoutes,
  ];
}
