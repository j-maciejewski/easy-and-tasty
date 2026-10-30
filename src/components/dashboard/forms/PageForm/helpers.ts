import type { PageSection } from "@/constants";

export const sectionLabels: Record<PageSection["type"], string> = {
  markdown: "Markdown",
  banner: "Banner",
  recipe_full_card: "Recipe Full Card",
  recipe_grid: "Recipe Grid",
  recipe_carousel: "Recipe Carousel",
  articles_list: "Articles List",
  scrollable_recipes: "Scrollable Recipes",
  recipes_list: "Recipes List",
  separator: "Separator",
};

export function createDefaultSection(type: PageSection["type"]): PageSection {
  const id = crypto.randomUUID();

  switch (type) {
    case "markdown":
      return {
        id,
        type,
        content: "## New section\n\nStart writing here.",
      };
    case "banner":
      return {
        id,
        type,
        title: "New banner title",
        text: "Banner description",
        image: "/mock/banner.png",
        href: "/",
      };
    case "recipe_full_card":
      return {
        id,
        type,
        recipeFeed: {
          mode: "random",
          recipeIds: [],
          limit: 6,
        },
      };
    case "recipe_grid":
      return {
        id,
        type,
        offset: 0,
        limit: 3,
        recipeFeed: {
          mode: "random",
          recipeIds: [],
          limit: 6,
        },
      };
    case "recipe_carousel":
      return {
        id,
        type,
        recipeFeed: {
          mode: "random",
          recipeIds: [],
          limit: 6,
        },
      };
    case "articles_list":
      return {
        id,
        type,
        heading: "Latest articles",
        subheading: "Stay up to date with our latest posts",
        articleFeed: {
          mode: "most_recent",
          articleIds: [],
          limit: 6,
        },
      };
    case "scrollable_recipes":
      return {
        id,
        type,
        heading: "Featured recipes",
        subheading: "Curated picks from the latest additions",
        recipeFeed: {
          mode: "random",
          recipeIds: [],
          limit: 6,
        },
      };
    case "recipes_list":
      return {
        id,
        type,
        heading: "More recipes",
        subheading: "Browse related recipes",
        recipeFeed: {
          mode: "random",
          recipeIds: [],
          limit: 6,
        },
      };
    case "separator":
      return {
        id,
        type,
      };
  }
}

export function parseIds(value: string) {
  return value
    .split(",")
    .map((id) => Number(id.trim()))
    .filter((id) => Number.isInteger(id) && id > 0);
}

export function getSectionSummary(section: PageSection) {
  switch (section.type) {
    case "markdown":
      return section.content.slice(0, 80);
    case "banner":
      return `${section.title} -> ${section.href}`;
    case "recipe_full_card":
      return `${section.recipeFeed?.mode ?? "random"} | Full cards from fetched recipes`;
    case "recipe_grid":
      return `${section.recipeFeed?.mode ?? "random"} | From index ${section.offset}, show ${section.limit}`;
    case "recipe_carousel":
      return `${section.recipeFeed?.mode ?? "random"} | Featured carousel`;
    case "articles_list":
      return `${section.articleFeed?.mode ?? "most_recent"} | ${section.heading}`;
    case "scrollable_recipes":
      return `${section.recipeFeed?.mode ?? "random"} | ${section.heading}`;
    case "recipes_list":
      return `${section.recipeFeed?.mode ?? "random"} | ${section.heading}`;
    case "separator":
      return "Horizontal divider";
  }
}
