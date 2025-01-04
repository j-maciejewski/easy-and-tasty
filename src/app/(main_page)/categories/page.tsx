import { APP_NAME } from "@/consts";
import { api } from "@/trpc/server";
import Link from "next/link";
import { Breadcrumbs } from "../_components";

export function generateMetadata() {
  return {
    title: `Categories | ${APP_NAME}`,
  };
}

export default async function () {
  const categories = await api.public.category.getCategories();

  return (
    <div className="w-full">
      <Breadcrumbs paths={[{ label: "Categories", active: true }]} />

      <h2 className="~/xl:~my-4/8 ~/lg:~text-xl/3xl text-center font-semibold tracking-normal">
        Browse all categories
      </h2>

      <div className="mt-6 flex flex-wrap gap-3 rounded bg-primary/50 p-4 font-bold text-sm uppercase">
        {categories.map((category) => (
          <Link key={category.name} href={`/categories/${category.slug}`}>
            <div className="select-none rounded bg-white px-2 py-1 text-primary hover:bg-slate-100">
              {category.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
