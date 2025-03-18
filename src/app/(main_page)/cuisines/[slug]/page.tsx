import { Separator } from "@/components/ui";
import { APP_NAME } from "@/consts";
import { api } from "@/trpc/server";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Breadcrumbs, RecipeCard } from "../../_components";

const fetchCuisine = cache((slug: string) => {
  return api.public.cuisine.getCuisineBySlug(slug);
});

export async function generateMetadata({
  params,
}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const cuisine = await fetchCuisine((await params).slug);

  if (!cuisine) return {};

  return {
    title: `${cuisine.name} | ${APP_NAME}`,
  };
}

export default async function ({
  params,
}: { params: Promise<{ slug: string }> }) {
  const cuisine = await fetchCuisine((await params).slug);
  const recipes = await api.public.recipe.getRecipesByCuisine({
    slug: (await params).slug,
  });

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
      <div className="~gap-4/6 grid grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))]">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
