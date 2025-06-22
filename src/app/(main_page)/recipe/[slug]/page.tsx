import Markdown from "markdown-to-jsx";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Separator } from "@/components/ui";
import { getRecipe } from "@/lib/data";
import { parseMetadata } from "@/lib/utils";
import { api } from "@/trpc/server";

import {
  Breadcrumbs,
  RecipeInformation,
  RecipesList,
  ScrollableRecipes,
} from "../../_components";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const recipe = await getRecipe((await params).slug);

  if (!recipe) return {};

  return parseMetadata(
    recipe.title,
    recipe.description,
    `/recipe/${recipe.slug}`,
    recipe.image,
    "article",
  );
}

export async function generateStaticParams() {
  return await api.public.recipe.getRecipesSlugs();
}

export default async function ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const recipe = await getRecipe((await params).slug);

  if (!recipe) {
    notFound();
  }

  return (
    <div className="~gap-4/6 flex max-lg:flex-col">
      <div className="grow">
        <Breadcrumbs
          paths={[{ label: "Recipe" }, { label: recipe.title, active: true }]}
          shareConfig={{
            path: `/recipe/${recipe.slug}`,
            text: "Check out this awesome recipe!",
            type: "recipe",
          }}
        />
        <h2 className="~mb-4/6 ~text-2xl/4xl font-semibold">{recipe.title}</h2>
        <RecipeInformation recipe={recipe} className="!justify-start ~mb-4/6" />
        <div className="~mb-4/6 max-h-[700px] overflow-hidden rounded-lg">
          <Image
            src={recipe.image}
            width={400}
            height={600}
            alt={recipe.title}
            loading="lazy"
            className="mx-auto max-h-[700px] min-h-full w-full object-cover max-sm:w-full"
          />
        </div>
        <article className="prose prose-slate mt-6 max-w-full">
          <Markdown>{recipe.content}</Markdown>
        </article>
        <div className="mt-6 flex select-none flex-wrap gap-4 font-bold text-sm text-white">
          {recipe.categories.map((category) => (
            <Link key={category.name} href={`/categories/${category.slug}`}>
              <div className="rounded bg-primary px-2 py-1 hover:bg-primary/75">
                {category.name}
              </div>
            </Link>
          ))}
          {recipe.cuisines.map((cuisine) => (
            <Link key={cuisine.name} href={`/cuisines/${cuisine.slug}`}>
              <div className="rounded bg-primary px-2 py-1 hover:bg-primary/75">
                {cuisine.name}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <RecipesList
        heading="Try out our other recipes!"
        className="~mb-4/6 ~pt-4/6 min-w-[20rem] max-lg:hidden"
      />
      <Separator orientation="horizontal" className="lg:hidden" />
      <ScrollableRecipes
        heading="Try out our other recipes!"
        className="text-gray-600 lg:hidden [&>*:first-child]:text-lg"
      />
    </div>
  );
}
