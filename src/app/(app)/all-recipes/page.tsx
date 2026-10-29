import { Metadata } from "next";
import { Suspense } from "react";

import {
  Breadcrumbs,
  EmptyState,
  InfiniteRecipeList,
  PageHeading,
  SortSelect,
} from "@/components/app";
import { getSeo, getTotalRecipesCount } from "@/lib/data";
import { parseMetadata } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeo("recipes");

  if (!seo) return {};

  return parseMetadata(
    seo.title ?? "All recipes",
    seo.description,
    "/all-recipes",
    seo.image,
  );
}

export default async function () {
  const recipesCount = await getTotalRecipesCount();

  return (
    <div className="w-full">
      <Breadcrumbs paths={[{ label: "All recipes", active: true }]} />
      <PageHeading
        title={"All recipes"}
        description={
          "Every recipe on the site, newest first. Sort them however suits you."
        }
      >
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
            <InfiniteRecipeList type="all" />
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
