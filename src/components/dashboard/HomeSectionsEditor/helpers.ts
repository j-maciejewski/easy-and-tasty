import type { HomeSection } from "@/constants";

export const sectionLabels: Record<HomeSection["type"], string> = {
  banner: "Banner",
  recipe_full_card: "Recipe Full Card",
  recipe_grid: "Recipe Grid",
  recipe_carousel: "Recipe Carousel",
  articles_list: "Articles List",
  cta: "Call To Action",
  scrollable_recipes: "Scrollable Recipes",
  separator: "Separator",
  recipes_list: "Recipes List",
  taxonomy_grid: "Categories / Cuisines Grid",
  recipes_group: "Category / Cuisine Recipes",
};

export function createDefaultSection(type: HomeSection["type"]): HomeSection {
  const id = crypto.randomUUID();

  switch (type) {
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
        offset: 1,
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
    case "cta":
      return {
        id,
        type,
        title: "Explore more recipes",
        subtitle: "Find your next favorite dish",
        tone: "tomato",
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
    case "separator":
      return {
        id,
        type,
      };
    case "recipes_list":
      return {
        id,
        type,
        heading: "All recipes",
        subheading: "Browse every recipe in one place",
        recipeFeed: {
          mode: "random",
          recipeIds: [],
          limit: 6,
        },
      };
    case "taxonomy_grid":
      return {
        id,
        type,
        heading: "Browse by category",
        subheading: "Pick a meal type or occasion",
        taxonomy: "categories",
        limit: 6,
      };
    case "recipes_group":
      return {
        id,
        type,
        taxonomy: "cuisines",
        slug: "",
      };
  }
}

export function parseIds(value: string) {
  return value
    .split(",")
    .map((id) => Number(id.trim()))
    .filter((id) => Number.isInteger(id) && id > 0);
}

export function getSectionSummary(section: HomeSection) {
  switch (section.type) {
    case "banner":
      return `${section.title} -> ${section.href}`;
    case "recipe_full_card":
      return `${section.recipeFeed?.mode ?? "random"} | Full cards from fetched recipes`;
    case "recipe_grid":
      return `${section.recipeFeed?.mode ?? "random"} | From index ${section.offset}, show ${section.limit}`;
    case "recipe_carousel":
      return `${section.recipeFeed?.mode ?? "random"} | Featured recipes carousel`;
    case "articles_list":
      return `${section.articleFeed?.mode ?? "most_recent"} | ${section.heading}`;
    case "cta":
      return `${section.title} (${section.tone})`;
    case "scrollable_recipes":
      return `${section.recipeFeed?.mode ?? "random"} | ${section.heading}`;
    case "separator":
      return "Horizontal divider";
    case "recipes_list":
      return `${section.recipeFeed?.mode ?? "random"} | ${section.heading}`;
    case "taxonomy_grid":
      return `${section.taxonomy} | ${section.heading}`;
    case "recipes_group":
      return `${section.taxonomy} | ${section.slug}`;
  }
}
