import { Separator } from "@/components/ui";
import { getCuisine, getCuisineRecipesCount } from "@/lib/data";
import { parseMetadata } from "@/lib/utils";
import { api } from "@/trpc/server";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumbs, InfiniteRecipeList, SortSelect } from "../../_components";

export async function generateMetadata({
  params,
}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const cuisine = await getCuisine((await params).slug);

  if (!cuisine) return {};

  return parseMetadata(
    cuisine.name,
    cuisine.description,
    `/cuisines/${cuisine.slug}`,
  );
}

export async function generateStaticParams() {
  return await api.public.cuisine.getCuisinesSlugs();
}

export default async function ({
  params,
}: { params: Promise<{ slug: string }> }) {
  const cuisineSlug = (await params).slug;

  const [cuisine, recipesCount] = await Promise.all([
    getCuisine(cuisineSlug),
    getCuisineRecipesCount(cuisineSlug),
  ]);

  if (!cuisine) notFound();

  return (
    <div className="w-full">
      <Breadcrumbs
        paths={[
          { label: "Cuisines", href: "/cuisines" },
          { label: cuisine.name, active: true },
        ]}
      />
      <h2 className="~mb-4/6 ~text-2xl/4xl font-semibold tracking-normal">
        {cuisine.name}
      </h2>
      <h6 className="text-gray-800 text-md">{cuisine.description}</h6>
      <Separator className="~my-4/6" />
      {recipesCount !== 0 ? (
        <>
          <h4 className="~mb-2/3 ~text-xl/3xl text-center font-semibold tracking-normal">
            Explore {cuisine.name} recipes
          </h4>
          <div className="~mb-4/6 flex justify-between">
            <p className="content-center text-md">
              {recipesCount && `Recipes: ${recipesCount}`}
            </p>
            <Suspense>
              <SortSelect />
            </Suspense>
          </div>
          <Suspense>
            <InfiniteRecipeList slug={cuisineSlug} type="cuisine" />
          </Suspense>
        </>
      ) : (
        "No recipes found"
      )}
    </div>
  );
}
