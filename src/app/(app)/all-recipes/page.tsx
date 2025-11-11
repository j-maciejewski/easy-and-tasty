import { Metadata } from "next";
import { Suspense } from "react";

import { Breadcrumbs, InfiniteRecipeList, SortSelect } from "@/components/app";
import { Separator } from "@/components/ui";
import { getSeo, getTotalRecipesCount } from "@/lib/data";
import { parseMetadata } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeo("recipes");

  if (!seo) return {};

  return parseMetadata(
    seo.title ?? "All recipes",
    seo.description,
    "/all-recipes",
    seo.image
  );
}

export default async function () {
  const recipesCount = await getTotalRecipesCount();

  return (
    <div className="w-full">
      <Breadcrumbs paths={[{ label: "All recipes", active: true }]} />
      <h2 className="mb-4 font-semibold text-2xl tracking-normal">
        All recipes
      </h2>
      <Separator className="my-4" />
      {recipesCount !== 0 ? (
        <>
          <h4 className="mb-2 text-center font-semibold text-xl tracking-normal">
            Explore all recipes
          </h4>
          <div className="mb-4 flex justify-between">
            <p className="content-center text-md">
              {recipesCount && `Recipes: ${recipesCount}`}
            </p>
            <Suspense>
              <SortSelect />
            </Suspense>
          </div>
          <Suspense>
            <InfiniteRecipeList type="all" />
          </Suspense>
        </>
      ) : (
        "No recipes found"
      )}
    </div>
  );
}
