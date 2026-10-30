import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ViewTransition } from "react";

import {
  Breadcrumbs,
  MarkdownContent,
  PreviewBanner,
  RateRecipe,
  RecipeComments,
  RecipeInformation,
  RecipesList,
  RecipeViewTracker,
} from "@/components/app";
import { RetryImage } from "@/components/app/RetryImage";
import { getRecipe, getSuggestedRecipes } from "@/lib/data";
import { getPagePreview, getPreviewPath } from "@/lib/preview";
import { getImageTransitionName, parseMetadata } from "@/lib/utils";
import { api } from "@/trpc/server";

type RecipePageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const loadRecipe = async ({ params, searchParams }: RecipePageProps) => {
  const preview = await getPagePreview(searchParams, "recipe");
  const recipe = preview
    ? await api.public.recipe.getRecipePreview(preview.token)
    : null;

  if (preview && recipe) return { recipe, preview };

  return { recipe: await getRecipe((await params).slug), preview: null };
};

export async function generateMetadata(
  props: RecipePageProps,
): Promise<Metadata> {
  const { recipe, preview } = await loadRecipe(props);

  if (!recipe) return {};

  const metadata = parseMetadata(
    recipe.title,
    recipe.description,
    `/recipe/${recipe.slug}`,
    recipe.image,
    "article",
  );

  return preview
    ? { ...metadata, robots: { index: false, follow: false } }
    : metadata;
}

export async function generateStaticParams() {
  return await api.public.recipe.getRecipesSlugs();
}

export default async function (props: RecipePageProps) {
  const { recipe, preview } = await loadRecipe(props);
  const recipes = await getSuggestedRecipes("recipe-page");

  if (!recipe) {
    notFound();
  }

  if (
    preview &&
    decodeURIComponent((await props.params).slug) !== recipe.slug
  ) {
    redirect(getPreviewPath("recipe", recipe.slug, preview.token));
  }

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14">
      {preview ? (
        <PreviewBanner
          type="recipe"
          isPublished={!!recipe.publishedAt}
          path={recipe.publishedAt ? `/recipe/${recipe.slug}` : "/"}
        />
      ) : (
        <RecipeViewTracker recipeId={recipe.id} />
      )}
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
        <h1 className="font-display max-w-3xl text-4xl leading-[1.05] font-bold tracking-tight md:text-6xl">
          {recipe.title}
        </h1>
        {recipe.description && (
          <p className="text-muted-foreground mt-4 max-w-2xl text-lg">
            {recipe.description}
          </p>
        )}
        {recipe.createdAt && (
          <p className="text-muted-foreground mt-3 text-sm">
            Added {formatDate(recipe.createdAt)}
            {recipe.updatedAt &&
              recipe.updatedAt !== recipe.createdAt &&
              `, updated ${formatDate(recipe.updatedAt)}`}
          </p>
        )}
        <ViewTransition
          name={getImageTransitionName(`recipe/${recipe.slug}`)}
          share="morph"
          default="none"
        >
          <div className="bg-muted mt-8 overflow-hidden rounded-3xl">
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
        </ViewTransition>
        <RecipeInformation recipe={recipe} className="mt-4" />
        <article className="prose prose-lg prose-headings:font-display prose-a:text-primary prose-headings:tracking-tight prose-li:marker:text-primary mt-10 max-w-[68ch]">
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
                  className="border-basil/30 text-basil hover:bg-basil block rounded-full border px-3.5 py-1.5 font-medium transition-colors hover:text-white"
                >
                  {category.name}
                </Link>
              </li>
            ))}
            {recipe.cuisines.map((cuisine) => (
              <li key={cuisine.name}>
                <Link
                  href={`/cuisines/${cuisine.slug}`}
                  className="border-basil/30 text-basil hover:bg-basil block rounded-full border px-3.5 py-1.5 font-medium transition-colors hover:text-white"
                >
                  {cuisine.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
        {!preview && (
          <>
            <RateRecipe recipeId={recipe.id} />
            <RecipeComments recipeId={recipe.id} />
          </>
        )}
      </div>
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <RecipesList heading="Cook this next" recipes={recipes} />
      </aside>
    </div>
  );
}
