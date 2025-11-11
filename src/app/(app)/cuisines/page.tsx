import { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/app";
import { getCuisines, getSeo } from "@/lib/data";
import { parseMetadata } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeo("cuisines");

  if (!seo) return {};

  return parseMetadata(
    seo.title ?? "Cuisines",
    seo.description,
    "/cuisines",
    seo.image
  );
}

export default async function () {
  const cuisines = await getCuisines();

  return (
    <div className="w-full">
      <Breadcrumbs paths={[{ label: "Cuisines", active: true }]} />

      <h2 className="my-4 text-center font-semibold text-xl tracking-normal">
        Browse all cuisines
      </h2>

      <div className="mt-6 flex select-none flex-wrap gap-3 rounded bg-primary/50 p-4 font-bold text-primary text-sm">
        {cuisines.map(({ name, slug }) => (
          <Link key={name} href={`/cuisines/${slug}`}>
            <div className="rounded bg-white px-2 py-1 hover:bg-slate-100">
              {name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
