import { Separator } from "@/components/ui";
import { APP_NAME } from "@/consts";
import { api } from "@/trpc/server";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Breadcrumbs, RecipeCard } from "../../_components";

const fetchCategory = cache((slug: string) => {
  return api.public.category.getCategoryBySlug(slug);
});

export async function generateMetadata({
  params,
}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const category = await fetchCategory((await params).slug);

  if (!category) return {};

  return {
    title: `${category.name} | ${APP_NAME}`,
  };
}

export async function generateStaticParams() {
  return await api.public.category.getCategoriesSlugs();
}

export default async function ({
  params,
}: { params: Promise<{ slug: string }> }) {
  const category = await fetchCategory((await params).slug);
  const recipes = await api.public.recipe.getRecipesByCategory({
    slug: (await params).slug,
  });

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
      <h6 className="~mb-4/6 text-gray-800 text-md">{category.description}</h6>
      <Separator className="~my-4/6" />
      <div className="~gap-4/6 grid grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))]">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
