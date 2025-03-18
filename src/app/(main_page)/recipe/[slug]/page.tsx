import { Separator } from "@/components/ui";
import { APP_NAME } from "@/consts";
import { env } from "@/env";
import { api } from "@/trpc/server";
import Markdown from "markdown-to-jsx";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import {
  Breadcrumbs,
  RecipeInformation,
  RecipesList,
  ScrollableRecipes,
} from "../../_components";
import { recipeImageSrcParser } from "../../_utils";

const fetchRecipe = cache(async (slug: string) => {
  return (await api.public.recipe.getRecipeBySlug(slug))[0];
});

export async function generateMetadata({
  params,
}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const recipe = await fetchRecipe((await params).slug);

  if (!recipe) return {};

  return {
    title: `${recipe.title} | ${APP_NAME}`,
    description: recipe.description,
    openGraph: {
      type: "article",
      siteName: "Easy and Tasty",
      url: `${env.APP_URL}/recipe/${recipe.slug}`,
      ...(recipe.image ? { images: { url: recipe.image } } : {}),
    },
    twitter: {
      card: recipe.image ? "summary_large_image" : "summary",
    },
  };
}

export async function generateStaticParams() {
  return await api.public.recipe.getRecipesSlugs();
}

export default async function ({
  params,
}: { params: Promise<{ slug: string }> }) {
  const recipe = await fetchRecipe((await params).slug);

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
            src={recipeImageSrcParser(recipe.image)}
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
        <div className="mt-6 flex flex-wrap gap-4 font-bold text-sm text-white">
          {recipe.categories.map((category) => (
            <Link key={category.name} href={`/categories/${category.slug}`}>
              <div className="select-none bg-primary px-3 py-2 hover:bg-primary/75">
                {category.name}
              </div>
            </Link>
          ))}
          {recipe.cuisines.map((cuisine) => (
            <Link key={cuisine.name} href={`/categories/${cuisine.slug}`}>
              <div className="select-none bg-primary px-3 py-2 hover:bg-primary/75">
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
