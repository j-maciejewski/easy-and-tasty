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
import { getCategory, getCategoryRecipesCount } from "@/lib/data";
import { parseMetadata } from "@/lib/utils";
import { api } from "@/trpc/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const category = await getCategory((await params).slug);

  if (!category) return {};

  return parseMetadata(
    category.name,
    category.description,
    `/categories/${category.slug}`,
  );
}

export async function generateStaticParams() {
  return await api.public.category.getCategoriesSlugs();
}

export default async function ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const categorySlug = (await params).slug;

  const [category, recipesCount] = await Promise.all([
    getCategory(categorySlug),
    getCategoryRecipesCount(categorySlug),
  ]);

  if (!category) notFound();

  return (
    <div className="w-full">
      <Breadcrumbs
        paths={[
          { label: "Categories", href: "/categories" },
          { label: category.name, active: true },
        ]}
      />
      <PageHeading title={category.name} description={category.description}>
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
            <InfiniteRecipeList slug={categorySlug} type="category" />
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
