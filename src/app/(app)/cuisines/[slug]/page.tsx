import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import {
  Breadcrumbs,
  EmptyState,
  InfiniteRecipeList,
  PageHeading,
  SortSelect,
} from "@/components/app";
import { getCuisine, getCuisineRecipesCount } from "@/lib/data";
import { parseMetadata } from "@/lib/utils";
import { api } from "@/trpc/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const cuisine = await getCuisine((await params).slug);

  if (!cuisine) return {};

  return parseMetadata(
    cuisine.name,
    cuisine.description,
    `/cuisines/${cuisine.slug}`,
  );
}

export async function generateStaticParams() {
  return await api.public.cuisine.getCuisinesSlugs();
}

export default async function ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const cuisineSlug = (await params).slug;

  const [cuisine, recipesCount] = await Promise.all([
    getCuisine(cuisineSlug),
    getCuisineRecipesCount(cuisineSlug),
  ]);

  if (!cuisine) notFound();

  return (
    <div className="w-full">
      <Breadcrumbs
        paths={[
          { label: "Cuisines", href: "/cuisines" },
          { label: cuisine.name, active: true },
        ]}
      />
      <PageHeading title={cuisine.name} description={cuisine.description}>
        {recipesCount !== 0 && (
          <Suspense>
            <SortSelect />
          </Suspense>
        )}
      </PageHeading>
      {recipesCount !== 0 ? (
        <>
          <p className="mb-6 text-muted-foreground text-sm">
            {recipesCount} {recipesCount === 1 ? "recipe" : "recipes"}
          </p>
          <Suspense>
            <InfiniteRecipeList slug={cuisineSlug} type="cuisine" />
          </Suspense>
        </>
      ) : (
        <EmptyState
          title="No recipes here yet"
          description="New recipes are added regularly. Browse everything we have in the meantime."
          action={{ label: "Browse all recipes", href: "/all-recipes" }}
        />
      )}
    </div>
  );
}
