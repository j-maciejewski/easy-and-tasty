import { Separator } from "@/components/ui";
import { getCategory, getCategoryRecipesCount } from "@/lib/data";
import { parseMetadata } from "@/lib/utils";
import { api } from "@/trpc/server";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumbs, InfiniteRecipeList, SortSelect } from "../../_components";

export async function generateMetadata({
  params,
}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const category = await getCategory((await params).slug);

  if (!category) return {};

  return parseMetadata(
    category.name,
    category.description,
    `/categories/${category.slug}`,
  );
}

export async function generateStaticParams() {
  return await api.public.category.getCategoriesSlugs();
}

export default async function ({
  params,
}: { params: Promise<{ slug: string }> }) {
  const categorySlug = (await params).slug;

  const [category, recipesCount] = await Promise.all([
    getCategory(categorySlug),
    getCategoryRecipesCount(categorySlug),
  ]);

  if (!category) notFound();

  return (
    <div className="w-full">
      <Breadcrumbs
        paths={[
          { label: "Categories", href: "/categories" },
          { label: category.name, active: true },
        ]}
      />
      <h2 className="~mb-4/6 ~text-2xl/4xl font-semibold tracking-normal">
        {category.name}
      </h2>
      <h6 className="text-gray-800 text-md">{category.description}</h6>
      <Separator className="~my-4/6" />
      {recipesCount !== 0 ? (
        <>
          <h4 className="~mb-2/3 ~text-xl/3xl text-center font-semibold tracking-normal">
            Explore {category.name} recipes
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
            <InfiniteRecipeList slug={categorySlug} type="category" />
          </Suspense>
        </>
      ) : (
        "No recipes found"
      )}
    </div>
  );
}
