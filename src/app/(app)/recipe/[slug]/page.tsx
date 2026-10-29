import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  Breadcrumbs,
  MarkdownContent,
  RateRecipe,
  RecipeComments,
  RecipeInformation,
  RecipesList,
  RecipeViewTracker,
} from "@/components/app";
import { RetryImage } from "@/components/app/RetryImage";
import { getRecipe, getSuggestedRecipes } from "@/lib/data";
import { parseMetadata } from "@/lib/utils";
import { api } from "@/trpc/server";

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
  const recipes = await getSuggestedRecipes("recipe-page");

  if (!recipe) {
    notFound();
  }

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14">
      <RecipeViewTracker recipeId={recipe.id} />
      <div className="min-w-0">
        <Breadcrumbs
          paths={[
            { label: "All recipes", href: "/all-recipes" },
            { label: recipe.title, active: true },
          ]}
          shareConfig={{
            path: `/recipe/${recipe.slug}`,
            text: "Check out this awesome recipe!",
            type: "recipe",
          }}
          recipeId={recipe.id}
        />
        <h1 className="max-w-3xl font-bold font-display text-4xl leading-[1.05] tracking-tight md:text-6xl">
          {recipe.title}
        </h1>
        {recipe.description && (
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            {recipe.description}
          </p>
        )}
        {recipe.createdAt && (
          <p className="mt-3 text-muted-foreground text-sm">
            Added {formatDate(recipe.createdAt)}
            {recipe.updatedAt &&
              recipe.updatedAt !== recipe.createdAt &&
              `, updated ${formatDate(recipe.updatedAt)}`}
          </p>
        )}
        <div className="mt-8 overflow-hidden rounded-3xl bg-muted">
          <RetryImage
            src={recipe.image}
            width={1200}
            height={800}
            alt={recipe.title}
            sizes="(max-width: 1024px) 100vw, 900px"
            priority
            className="aspect-3/2 w-full object-cover"
          />
        </div>
        <RecipeInformation recipe={recipe} className="mt-4" />
        <article className="prose prose-lg mt-10 max-w-[68ch] prose-headings:font-display prose-a:text-primary prose-headings:tracking-tight prose-li:marker:text-primary">
          <MarkdownContent>{recipe.content}</MarkdownContent>
        </article>
        {(recipe.categories.length > 0 || recipe.cuisines.length > 0) && (
          <ul
            aria-label="Categories and cuisines"
            className="mt-10 flex flex-wrap gap-2 text-sm"
          >
            {recipe.categories.map((category) => (
              <li key={category.name}>
                <Link
                  href={`/categories/${category.slug}`}
                  className="block rounded-full border border-basil/30 px-3.5 py-1.5 font-medium text-basil transition-colors hover:bg-basil hover:text-white"
                >
                  {category.name}
                </Link>
              </li>
            ))}
            {recipe.cuisines.map((cuisine) => (
              <li key={cuisine.name}>
                <Link
                  href={`/cuisines/${cuisine.slug}`}
                  className="block rounded-full border border-basil/30 px-3.5 py-1.5 font-medium text-basil transition-colors hover:bg-basil hover:text-white"
                >
                  {cuisine.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
        <RateRecipe recipeId={recipe.id} />
        <RecipeComments recipeId={recipe.id} />
      </div>
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <RecipesList heading="Cook this next" recipes={recipes} />
      </aside>
    </div>
  );
}
