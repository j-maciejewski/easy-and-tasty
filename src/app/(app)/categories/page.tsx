import { Metadata } from "next";

import { Breadcrumbs, PageHeading, TaxonomyGrid } from "@/components/app";
import { getCategories, getSeo } from "@/lib/data";
import { parseMetadata } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeo("categories");

  if (!seo) return {};

  return parseMetadata(
    seo.title ?? "Categories",
    seo.description,
    "/categories",
    seo.image,
  );
}

export default async function () {
  const categories = await getCategories();

  return (
    <div className="w-full">
      <Breadcrumbs paths={[{ label: "Categories", active: true }]} />
      <PageHeading
        title="Categories"
        description="Pick a meal type or occasion to see every recipe that fits."
      />
      <TaxonomyGrid items={categories} basePath="/categories" />
    </div>
  );
}
