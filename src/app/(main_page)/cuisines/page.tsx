import { APP_NAME } from "@/consts";
import { api } from "@/trpc/server";
import Link from "next/link";
import { Breadcrumbs } from "../_components";

export function generateMetadata() {
  return {
    title: `Cuisines | ${APP_NAME}`,
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

      <div className="mt-6 flex flex-wrap gap-3 rounded bg-primary/50 p-4 font-bold text-sm uppercase">
        {cuisines.map((cuisine) => (
          <Link key={cuisine.name} href={`/cuisines/${cuisine.slug}`}>
            <div className="select-none rounded bg-white px-2 py-1 text-primary hover:bg-slate-100">
              {cuisine.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
