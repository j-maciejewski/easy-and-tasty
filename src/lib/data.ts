import { staticPageTypeEnum } from "@/server/db/schema";
import { api } from "@/trpc/server";
import { unstable_cache as next_cache } from "next/cache";
import { cache } from "react";

const REVALIDATE_TIME = 30;

export const getSeo = cache(
  (type: (typeof staticPageTypeEnum.enumValues)[number]) =>
    next_cache(() => api.public.seo.getSeo(type), [`seo-${type}`], {
      revalidate: REVALIDATE_TIME,
      tags: ["seo"],
    })(),
);

export const getNavigation = cache(
  next_cache(() => api.public.navigation.getNavigation(), ["navigation"], {
    revalidate: REVALIDATE_TIME,
    tags: ["navigation"],
  }),
);

export const getRecipe = cache(
  next_cache((slug: string) => api.public.recipe.getRecipeBySlug(slug), [], {
    revalidate: REVALIDATE_TIME,
  }),
);

export const getPage = cache(
  next_cache((slug: string) => api.public.page.getPage(slug), [], {
    revalidate: REVALIDATE_TIME,
  }),
);

export const getSuggestedRecipes = cache((tag: string) =>
  next_cache(() => api.public.recipe.getRandomRecipes(5), [tag], {
    revalidate: REVALIDATE_TIME,
    tags: [tag],
  })(),
);

export const getRecipesByCuisine = cache((slug: string) =>
  next_cache(
    () => api.public.recipe.getRecipesByCuisine({ slug, limit: 6 }),
    [`${slug}-recipes`],
    {
      revalidate: REVALIDATE_TIME,
      tags: ["cuisines-recipes"],
    },
  )(),
);

export const getRecipesByCategory = cache((slug: string) =>
  next_cache(
    () => api.public.recipe.getRecipesByCategory({ slug, limit: 6 }),
    [`${slug}-recipes`],
    {
      revalidate: REVALIDATE_TIME,
      tags: ["categories-recipes"],
    },
  )(),
);

export const getCategory = cache((slug: string) =>
  next_cache(
    () => api.public.category.getCategoryBySlug(slug),
    [`${slug}-category`],
    {
      revalidate: REVALIDATE_TIME,
      tags: ["category"],
    },
  )(),
);

export const getCuisine = cache((slug: string) =>
  next_cache(
    () => api.public.cuisine.getCuisineBySlug(slug),
    [`${slug}-cuisine`],
    {
      revalidate: REVALIDATE_TIME,
      tags: ["cuisine"],
    },
  )(),
);

export const getTotalRecipesCount = cache(
  next_cache(() => api.public.recipe.getTotalRecipesCount(), [], {
    revalidate: REVALIDATE_TIME,
    tags: ["recipes-count"],
  }),
);

export const getCategoryRecipesCount = cache((slug: string) =>
  next_cache(
    () => api.public.recipe.getRecipesByCategoryCount(slug),
    [`${slug}-recipes-count`],
    {
      revalidate: REVALIDATE_TIME,
      tags: ["category-recipes-count"],
    },
  )(),
);

export const getCuisineRecipesCount = cache((slug: string) =>
  next_cache(
    () => api.public.recipe.getRecipesByCuisineCount(slug),
    [`${slug}-recipes-count`],
    {
      revalidate: REVALIDATE_TIME,
      tags: ["cuisine-recipes-count"],
    },
  )(),
);

export const getCategories = cache(
  next_cache(() => api.public.category.getCategories(), [], {
    revalidate: REVALIDATE_TIME,
    tags: ["categories"],
  }),
);

export const getCuisines = cache(
  next_cache(() => api.public.cuisine.getCuisines(), [], {
    revalidate: REVALIDATE_TIME,
    tags: ["cuisines"],
  }),
);
