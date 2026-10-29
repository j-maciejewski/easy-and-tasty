import { Metadata } from "next";

import { Breadcrumbs, PageHeading, TaxonomyGrid } from "@/components/app";
import { getCuisines, getSeo } from "@/lib/data";
import { parseMetadata } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeo("cuisines");

  if (!seo) return {};

  return parseMetadata(
    seo.title ?? "Cuisines",
    seo.description,
    "/cuisines",
    seo.image,
  );
}

export default async function () {
  const cuisines = await getCuisines();

  return (
    <div className="w-full">
      <Breadcrumbs paths={[{ label: "Cuisines", active: true }]} />
      <PageHeading
        title="Cuisines"
        description="Cook your way around the world, one cuisine at a time."
      />
      <TaxonomyGrid items={cuisines} basePath="/cuisines" />
    </div>
  );
}
