import { APP_NAME } from "@/consts";
import { api } from "@/trpc/server";
import { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "../_components";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await api.public.seo.getSeo("cuisines");

  return {
    title: `${seo?.title ?? "Cuisines"} | ${APP_NAME}`,
    description: seo?.description,
    openGraph: {
      ...(seo?.image ? { images: { url: seo.image } } : {}),
    },
    twitter: {
      card: seo?.image ? "summary_large_image" : "summary",
    },
  };
}

export default async function () {
  const cuisines = await api.public.cuisine.getCuisines();

  return (
    <div className="w-full">
      <Breadcrumbs paths={[{ label: "Cuisines", active: true }]} />

      <h2 className="~/xl:~my-4/8 ~/lg:~text-xl/3xl text-center font-semibold tracking-normal">
        Browse all cuisines
      </h2>

      <div className="mt-6 flex select-none flex-wrap gap-3 rounded bg-primary/50 p-4 font-bold text-primary text-sm">
        {cuisines.map((cuisine) => (
          <Link key={cuisine.name} href={`/cuisines/${cuisine.slug}`}>
            <div className="rounded bg-white px-2 py-1 hover:bg-slate-100">
              {cuisine.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
