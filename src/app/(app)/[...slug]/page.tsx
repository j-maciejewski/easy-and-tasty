import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";

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
  RecipesList,
  ScrollableRecipes,
} from "@/components/app";
import { RetryImage } from "@/components/app/RetryImage";
import { Separator } from "@/components/ui";
import { type PageSection, parsePageSections } from "@/constants";
import { getArticle } from "@/lib/data";
import { getImageTransitionName, parseMetadata, parseSlug } from "@/lib/utils";
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
    slug: page.slug.split("/"),
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

  function renderSection(section: PageSection, index: number) {
    switch (section.type) {
      case "markdown":
        return (
          <div
            key={section.id}
            className="prose prose-lg prose-headings:font-display prose-a:text-primary prose-headings:tracking-tight prose-li:marker:text-primary max-w-[68ch]"
          >
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
              priority={index === 0}
            />
          </FullWidthWrapper>
        );
      case "recipe_full_card": {
        const sectionRecipes = sectionRecipesMap.get(section.id) ?? [];
        if (!sectionRecipes.length) return null;

        return (
          <div key={section.id} className="space-y-6">
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
            className="grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3"
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
          <RecipesList
            key={section.id}
            heading={section.heading}
            subheading={section.subheading}
            recipes={sectionRecipesMap.get(section.id) ?? []}
          />
        );
      case "separator":
        return <Separator key={section.id} orientation="horizontal" />;
    }
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14">
      <div className="min-w-0">
        <ArticleViewTracker articleId={page.id} />
        <Breadcrumbs
          paths={[
            { label: "Articles", href: "/articles" },
            { label: page.title, active: true },
          ]}
          shareConfig={{
            path: `/${page.slug}`,
            text: "Check out this awesome article!",
            type: "article",
          }}
        />
        <h1 className="font-display max-w-3xl text-4xl leading-[1.05] font-bold tracking-tight md:text-6xl">
          {page.title}
        </h1>
        <time
          dateTime={new Date(page.createdAt).toISOString()}
          className="text-muted-foreground mt-4 block text-sm"
        >
          {formattedCreatedAt}
        </time>
        {page.image && (
          <ViewTransition
            name={getImageTransitionName(page.slug)}
            share="morph"
            default="none"
          >
            <div className="bg-muted mt-8 overflow-hidden rounded-3xl">
              <RetryImage
                src={page.image}
                width={1200}
                height={675}
                alt={page.title}
                sizes="(max-width: 1024px) 100vw, 900px"
                priority
                className="aspect-video w-full object-cover"
              />
            </div>
          </ViewTransition>
        )}
        <div className="mt-10 space-y-10">
          {sections.map((section, index) => renderSection(section, index))}
        </div>
        <ArticleComments articleId={page.id} />
      </div>
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <ArticlesList
          heading="More to read"
          articles={latestArticles.slice(0, 6)}
        />
      </aside>
    </div>
  );
}
