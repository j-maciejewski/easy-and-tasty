import clsx from "clsx";
import { Metadata } from "next";

import {
  ArticlesList,
  Banner,
  FullWidthWrapper,
  RecipeCard,
  RecipeCardFull,
  RecipesCarousel,
  RecipesList,
  ScrollableRecipes,
  SectionHeading,
  TaxonomyGrid,
} from "@/components/app";
import { RecipesGroupPreview } from "@/components/app/RecipesGroupPreview";
import { Separator } from "@/components/ui";
import { HomeSection } from "@/constants";
import {
  getCategories,
  getCuisines,
  getHomeSections,
  getSeo,
} from "@/lib/data";
import { parseMetadata } from "@/lib/utils";
import { api } from "@/trpc/server";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeo("home");

  if (!seo) return {};

  return parseMetadata(seo.title ?? "Home", seo.description, "", seo.image);
}

export default async function () {
  const homeSections = await getHomeSections();

  const recipesBySection = new Map<
    string,
    Awaited<ReturnType<typeof api.public.recipe.getRecipesForSection>>
  >();

  const articlesBySection = new Map<
    string,
    Awaited<ReturnType<typeof api.public.article.getArticlesForSection>>
  >();

  await Promise.all(
    homeSections.map(async (section) => {
      if (
        section.type !== "recipe_full_card" &&
        section.type !== "recipe_grid" &&
        section.type !== "recipe_carousel" &&
        section.type !== "scrollable_recipes" &&
        section.type !== "recipes_list"
      ) {
        return;
      }

      const requestedLimit =
        section.type === "recipe_grid"
          ? Math.max(
              section.recipeFeed?.limit ?? 6,
              section.offset + section.limit,
            )
          : (section.recipeFeed?.limit ?? 6);

      const recipes = await api.public.recipe.getRecipesForSection({
        mode: section.recipeFeed?.mode ?? "random",
        recipeIds: section.recipeFeed?.recipeIds ?? [],
        limit: requestedLimit,
      });

      recipesBySection.set(section.id, recipes);

      return;
    }),
  );

  await Promise.all(
    homeSections.map(async (section) => {
      if (section.type !== "articles_list") {
        return;
      }

      const articles = await api.public.article.getArticlesForSection({
        mode: section.articleFeed?.mode ?? "most_recent",
        articleIds: section.articleFeed?.articleIds ?? [],
        limit: section.articleFeed?.limit ?? 6,
      });

      articlesBySection.set(section.id, articles);
    }),
  );

  const usesTaxonomy = (taxonomy: "categories" | "cuisines") =>
    homeSections.some(
      (section) =>
        (section.type === "taxonomy_grid" ||
          section.type === "recipes_group") &&
        section.taxonomy === taxonomy,
    );

  const [categories, cuisines] = await Promise.all([
    usesTaxonomy("categories") ? getCategories() : [],
    usesTaxonomy("cuisines") ? getCuisines() : [],
  ]);

  const taxonomyItems = { categories, cuisines };

  const ctaToneClasses: Record<"tomato" | "sage" | "amber", string> = {
    tomato: "bg-primary text-primary-foreground",
    sage: "bg-basil text-white",
    amber: "bg-saffron text-ink",
  };

  function renderSection(section: HomeSection, index: number) {
    switch (section.type) {
      case "banner":
        return (
          <FullWidthWrapper key={section.id} className="first:-mt-4">
            <Banner
              title={section.title}
              text={section.text}
              image={section.image}
              href={section.href}
              priority={index === 0}
            />
          </FullWidthWrapper>
        );
      case "recipe_full_card": {
        const recipes = recipesBySection.get(section.id) ?? [];
        if (!recipes.length) return null;

        return (
          <div key={section.id} className="space-y-6">
            {recipes.map((recipe) => (
              <RecipeCardFull key={recipe.id} recipe={recipe} />
            ))}
          </div>
        );
      }
      case "recipe_grid": {
        const recipes = recipesBySection.get(section.id) ?? [];
        const recipeGrid = recipes?.slice(
          section.offset,
          section.offset + section.limit,
        );

        if (!recipeGrid?.length) return null;

        return (
          <div
            key={section.id}
            className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
          >
            {recipeGrid.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        );
      }
      case "recipe_carousel": {
        const recipes = recipesBySection.get(section.id) ?? [];
        return recipes ? (
          <RecipesCarousel key={section.id} recipes={recipes} />
        ) : null;
      }
      case "articles_list": {
        const articles = articlesBySection.get(section.id) ?? [];

        return (
          <ArticlesList
            key={section.id}
            heading={section.heading}
            subheading={section.subheading}
            articles={articles}
          />
        );
      }
      case "cta":
        return (
          <FullWidthWrapper
            key={section.id}
            className={clsx("py-14 md:py-20", ctaToneClasses[section.tone])}
          >
            <div className="width-content mx-auto px-4">
              <p className="font-display max-w-3xl text-3xl leading-tight font-bold tracking-tight md:text-5xl">
                {section.title}
              </p>
              {section.subtitle && (
                <p className="mt-4 max-w-2xl text-lg opacity-90">
                  {section.subtitle}
                </p>
              )}
            </div>
          </FullWidthWrapper>
        );
      case "scrollable_recipes": {
        const recipes = recipesBySection.get(section.id) ?? [];
        return recipes ? (
          <ScrollableRecipes
            key={section.id}
            recipes={recipes}
            heading={section.heading}
            subheading={section.subheading}
          />
        ) : null;
      }
      case "separator":
        return <Separator key={section.id} orientation="horizontal" />;
      case "recipes_list": {
        const recipes = recipesBySection.get(section.id) ?? [];
        return recipes ? (
          <RecipesList
            key={section.id}
            heading={section.heading}
            subheading={section.subheading}
            recipes={recipes}
          />
        ) : null;
      }
      case "taxonomy_grid": {
        const items = taxonomyItems[section.taxonomy].slice(0, section.limit);
        if (!items.length) return null;

        return (
          <div key={section.id} className="flex flex-col">
            <SectionHeading
              heading={section.heading}
              subheading={section.subheading}
            />
            <TaxonomyGrid items={items} basePath={`/${section.taxonomy}`} />
          </div>
        );
      }
      case "recipes_group": {
        const group = taxonomyItems[section.taxonomy].find(
          ({ slug }) => slug === section.slug,
        );
        if (!group) return null;

        return section.taxonomy === "cuisines" ? (
          <RecipesGroupPreview key={section.id} cuisine={group} />
        ) : (
          <RecipesGroupPreview key={section.id} category={group} />
        );
      }
    }
  }

  return (
    <div className="flex w-full grow flex-col gap-14 md:gap-20">
      {homeSections.map((section, index) => renderSection(section, index))}
    </div>
  );
}
