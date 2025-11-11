import { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/app";
import { getCategories, getSeo } from "@/lib/data";
import { parseMetadata } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeo("categories");

  if (!seo) return {};

  return parseMetadata(
    seo.title ?? "Categories",
    seo.description,
    "/categories",
    seo.image
  );
}

export default async function () {
  const categories = await getCategories();

  return (
    <div className="w-full">
      <Breadcrumbs paths={[{ label: "Categories", active: true }]} />

      <h2 className="text-center font-semibold text-base tracking-normal">
        Browse all categories
      </h2>

      <div className="mt-6 flex select-none flex-wrap gap-3 rounded bg-primary/50 p-4 font-bold text-primary text-sm">
        {categories.map(({ name, slug }) => (
          <Link key={name} href={`/categories/${slug}`}>
            <div className="rounded bg-white px-2 py-1 hover:bg-slate-100">
              {name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
