import { Metadata } from "next";
import { Suspense } from "react";

import { Breadcrumbs, InfiniteArticleList } from "@/components/app";
import { Separator } from "@/components/ui";
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
      <h2 className="mb-4 font-semibold text-2xl tracking-normal">
        Explore the latest articles
      </h2>
      <Separator />
      {articlesCount !== 0 ? (
        <Suspense>
          <InfiniteArticleList />
        </Suspense>
      ) : (
        "No articles found"
      )}
    </div>
  );
}
