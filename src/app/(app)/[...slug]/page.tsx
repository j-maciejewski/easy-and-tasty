import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArticleComments,
  ArticlesList,
  ArticleViewTracker,
  Banner,
  Breadcrumbs,
  FullWidthWrapper,
  MarkdownContent,
  RecipeCard,
  RecipeCardFull,
  RecipesCarousel,
  ScrollableRecipes,
} from "@/components/app";
import { Separator } from "@/components/ui";
import { type PageSection, parsePageSections } from "@/constants";
import { getArticle } from "@/lib/data";
import { parseMetadata, parseSlug } from "@/lib/utils";
import { api } from "@/trpc/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const page = await getArticle(parseSlug((await params).slug));

  if (!page) return {};

  return parseMetadata(
    page.title,
    page.description,
    `/${page.slug}`,
    page.image,
    "article",
  );
}

export async function generateStaticParams() {
  const pages = await api.public.article.getArticles();

  return pages.map((page) => ({
    slug: page.slug.split("/").slice(1),
  }));
}

export default async function ({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const page = await getArticle(parseSlug((await params).slug));
  const sections = parsePageSections(page?.content);
  const latestArticles = (await api.public.article.getArticles()).filter(
    (article) => article.slug !== page?.slug,
  );

  const sectionRecipesMap = new Map<
    string,
    Awaited<ReturnType<typeof api.public.recipe.getRecipesForSection>>
  >();
  const sectionArticlesMap = new Map<
    string,
    Awaited<ReturnType<typeof api.public.article.getArticlesForSection>>
  >();

  await Promise.all(
    sections.map(async (section) => {
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

      const sectionRecipes = await api.public.recipe.getRecipesForSection({
        mode: section.recipeFeed?.mode ?? "random",
        recipeIds: section.recipeFeed?.recipeIds ?? [],
        limit: requestedLimit,
      });

      sectionRecipesMap.set(section.id, sectionRecipes);
    }),
  );

  await Promise.all(
    sections.map(async (section) => {
      if (section.type !== "articles_list") {
        return;
      }

      const sectionArticles = await api.public.article.getArticlesForSection({
        mode: section.articleFeed?.mode ?? "most_recent",
        articleIds: section.articleFeed?.articleIds ?? [],
        limit: section.articleFeed?.limit ?? 6,
      });

      sectionArticlesMap.set(
        section.id,
        sectionArticles.filter((article) => article.slug !== page?.slug),
      );
    }),
  );

  if (!page) {
    notFound();
  }

  const formattedCreatedAt = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(page.createdAt));

  function renderSection(section: PageSection) {
    switch (section.type) {
      case "markdown":
        return (
          <div key={section.id} className="prose max-w-none">
            <MarkdownContent>{section.content}</MarkdownContent>
          </div>
        );
      case "banner":
        return (
          <FullWidthWrapper key={section.id}>
            <Banner
              title={section.title}
              text={section.text}
              image={section.image}
              href={section.href}
            />
          </FullWidthWrapper>
        );
      case "recipe_full_card": {
        const sectionRecipes = sectionRecipesMap.get(section.id) ?? [];
        if (!sectionRecipes.length) return null;

        return (
          <div key={section.id} className="space-y-4">
            {sectionRecipes.map((recipe) => (
              <RecipeCardFull key={recipe.id} recipe={recipe} />
            ))}
          </div>
        );
      }
      case "recipe_grid": {
        const sectionRecipes = sectionRecipesMap.get(section.id) ?? [];
        const recipeGrid = sectionRecipes.slice(
          section.offset,
          section.offset + section.limit,
        );
        if (!recipeGrid?.length) return null;

        return (
          <div
            key={section.id}
            className="grid gap-4 max-md:grid-cols-1 md:grid-cols-3"
          >
            {recipeGrid.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        );
      }
      case "recipe_carousel":
        return (
          <RecipesCarousel
            key={section.id}
            recipes={sectionRecipesMap.get(section.id) ?? []}
          />
        );
      case "articles_list":
        return (
          <ArticlesList
            key={section.id}
            heading={section.heading}
            subheading={section.subheading}
            articles={sectionArticlesMap.get(section.id) ?? []}
          />
        );
      case "scrollable_recipes":
        return (
          <ScrollableRecipes
            key={section.id}
            recipes={sectionRecipesMap.get(section.id) ?? []}
            heading={section.heading}
            subheading={section.subheading}
          />
        );
      case "recipes_list":
        return (
          <div key={section.id} className="text-sm">
            <h3 className="font-semibold text-xl">{section.heading}</h3>
            {section.subheading && (
              <p className="mt-2 text-sm">{section.subheading}</p>
            )}
            <div className="mt-4 flex flex-col gap-2">
              {(sectionRecipesMap.get(section.id) ?? []).map((recipe) => (
                <Link
                  key={recipe.id}
                  href={`/recipe/${recipe.slug}`}
                  className="rounded-md border p-3 transition-colors hover:bg-accent"
                >
                  {recipe.title}
                </Link>
              ))}
            </div>
          </div>
        );
      case "separator":
        return <Separator key={section.id} orientation="horizontal" />;
    }
  }

  return (
    <div className="flex max-lg:flex-col max-lg:gap-4 lg:gap-10">
      <div className="grow">
        <ArticleViewTracker articleId={page.id} />
        <Breadcrumbs
          paths={[{ label: "Article" }, { label: page.title, active: true }]}
          shareConfig={{
            path: `/${page.slug}`,
            text: "Check out this awesome article!",
            type: "article",
          }}
        />
        <h2 className="mb-4 font-semibold text-2xl">{page.title}</h2>
        <p className="mb-4 text-foreground/70 text-sm">
          Created at {formattedCreatedAt}
        </p>
        {page.image && (
          <div className="mb-4 max-h-175 overflow-hidden rounded-lg">
            <Image
              src={page.image}
              width={900}
              height={700}
              alt={page.title}
              loading="lazy"
              className="mx-auto max-h-175 min-h-full w-full object-cover max-sm:w-full"
            />
          </div>
        )}
        <div className="space-y-4">
          {sections.map((section) => renderSection(section))}
        </div>
        <ArticleComments articleId={page.id} />
      </div>
      <Separator orientation="horizontal" className="lg:hidden" />
      <ArticlesList
        heading="Read our other latest articles"
        articles={latestArticles.slice(0, 6)}
        className="mb-4 min-w-[20rem] lg:pt-4"
      />
    </div>
  );
}
