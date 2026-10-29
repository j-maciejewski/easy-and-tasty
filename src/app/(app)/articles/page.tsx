import { Metadata } from "next";
import { Suspense } from "react";

import {
  Breadcrumbs,
  EmptyState,
  InfiniteArticleList,
  PageHeading,
} from "@/components/app";
import { getSeo, getTotalArticlesCount } from "@/lib/data";
import { parseMetadata } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeo("articles");

  if (!seo) return {};

  return parseMetadata(
    seo.title ?? "Articles",
    seo.description,
    "/articles",
    seo.image,
  );
}

export default async function () {
  const articlesCount = await getTotalArticlesCount();

  return (
    <div className="w-full">
      <Breadcrumbs paths={[{ label: "Articles", active: true }]} />
      <PageHeading
        title="Articles"
        description="Kitchen know-how, ingredient guides and the stories behind our recipes."
      />
      {articlesCount !== 0 ? (
        <Suspense>
          <InfiniteArticleList />
        </Suspense>
      ) : (
        <EmptyState
          title="No articles yet"
          description="We're writing the first ones now. Find something to cook in the meantime."
          action={{ label: "Browse all recipes", href: "/all-recipes" }}
        />
      )}
    </div>
  );
}
