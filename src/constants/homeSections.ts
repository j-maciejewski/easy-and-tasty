import { z } from "zod";

export const homeSectionTypeEnum = z.enum([
  "banner",
  "recipe_full_card",
  "recipe_grid",
  "recipe_carousel",
  "articles_list",
  "cta",
  "scrollable_recipes",
  "separator",
  "recipes_list",
  "taxonomy_grid",
  "recipes_group",
]);

export const recipeFeedModeEnum = z.enum([
  "random",
  "most_recent",
  "most_liked",
  "most_viewed",
  "most_bookmarked",
  "trending",
  "specific",
]);

export const recipeFeedSchema = z.object({
  mode: recipeFeedModeEnum,
  recipeIds: z.array(z.number().int().positive()),
  limit: z.number().int().min(1).max(24),
});

export const taxonomyEnum = z.enum(["categories", "cuisines"]);

export const articleFeedModeEnum = z.enum(["most_recent", "specific"]);

export const articleFeedSchema = z.object({
  mode: articleFeedModeEnum,
  articleIds: z.array(z.number().int().positive()),
  limit: z.number().int().min(1).max(24),
});

export const bannerSectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("banner"),
  title: z.string().min(2),
  text: z.string().optional(),
  image: z.string().min(1),
  href: z.string().min(1),
});

export const recipeFullCardSectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("recipe_full_card"),
  recipeFeed: recipeFeedSchema.optional(),
});

export const recipeGridSectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("recipe_grid"),
  offset: z.number().int().min(0).max(5),
  limit: z.number().int().min(1).max(3),
  recipeFeed: recipeFeedSchema.optional(),
});

export const recipeCarouselSectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("recipe_carousel"),
  recipeFeed: recipeFeedSchema.optional(),
});

export const ctaSectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("cta"),
  title: z.string().min(2),
  subtitle: z.string().optional(),
  tone: z.enum(["tomato", "sage", "amber"]),
});

export const articlesListSectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("articles_list"),
  heading: z.string().min(2),
  subheading: z.string().optional(),
  articleFeed: articleFeedSchema.optional(),
});

export const scrollableRecipesSectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("scrollable_recipes"),
  heading: z.string().min(2),
  subheading: z.string().optional(),
  recipeFeed: recipeFeedSchema.optional(),
});

export const separatorSectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("separator"),
});

export const recipesListSectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("recipes_list"),
  heading: z.string().min(2),
  subheading: z.string().optional(),
  recipeFeed: recipeFeedSchema.optional(),
});

export const taxonomyGridSectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("taxonomy_grid"),
  heading: z.string().min(2),
  subheading: z.string().optional(),
  taxonomy: taxonomyEnum,
  limit: z.number().int().min(1).max(24),
});

export const recipesGroupSectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("recipes_group"),
  taxonomy: taxonomyEnum,
  slug: z.string().min(1, { message: "Select a category or cuisine." }),
});

export const homeSectionSchema = z.discriminatedUnion("type", [
  bannerSectionSchema,
  recipeFullCardSectionSchema,
  recipeGridSectionSchema,
  recipeCarouselSectionSchema,
  articlesListSectionSchema,
  ctaSectionSchema,
  scrollableRecipesSectionSchema,
  separatorSectionSchema,
  recipesListSectionSchema,
  taxonomyGridSectionSchema,
  recipesGroupSectionSchema,
]);

export const homeSectionsSchema = z.array(homeSectionSchema);

export type HomeSection = z.infer<typeof homeSectionSchema>;

export const defaultHomeSections: HomeSection[] = [
  {
    id: "banner-main",
    type: "banner",
    title: "Comfort Foods",
    text: "Warm, hearty meals perfect for cozy evenings and family gatherings. From creamy casseroles and slow-cooked stews to savory pies and baked classics, these recipes bring comfort and nostalgia to your table, making every bite feel like home.",
    image: "/mock/occasions/comfort-food-banner.webp",
    href: "/comfort-food-classics",
  },
  {
    id: "featured-card",
    type: "recipe_full_card",
    recipeFeed: {
      mode: "random",
      recipeIds: [],
      limit: 6,
    },
  },
  {
    id: "recipe-grid",
    type: "recipe_grid",
    offset: 1,
    limit: 3,
    recipeFeed: {
      mode: "random",
      recipeIds: [],
      limit: 6,
    },
  },
  {
    id: "recipe-carousel",
    type: "recipe_carousel",
    recipeFeed: {
      mode: "random",
      recipeIds: [],
      limit: 6,
    },
  },
  {
    id: "latest-articles-list",
    type: "articles_list",
    heading: "Latest Articles",
    subheading: "Fresh reads from our blog",
    articleFeed: {
      mode: "most_recent",
      articleIds: [],
      limit: 6,
    },
  },
  {
    id: "categories-grid",
    type: "taxonomy_grid",
    heading: "Browse by category",
    subheading: "Pick a meal type or occasion",
    taxonomy: "categories",
    limit: 6,
  },
  {
    id: "italian-group",
    type: "recipes_group",
    taxonomy: "cuisines",
    slug: "italian",
  },
  {
    id: "home-cta",
    type: "cta",
    title: "Browse our recipes",
    subtitle: "Find your favorite from over 1000+ recipes",
    tone: "tomato",
  },
  {
    id: "breakfast-scroll",
    type: "scrollable_recipes",
    heading: "Breakfast recipes",
    subheading: "Easy and quick to make breakfast recipes",
    recipeFeed: {
      mode: "random",
      recipeIds: [],
      limit: 6,
    },
  },
  {
    id: "cuisines-grid",
    type: "taxonomy_grid",
    heading: "Explore cuisines",
    subheading: "Dishes from around the world",
    taxonomy: "cuisines",
    limit: 6,
  },
  {
    id: "separator-main",
    type: "separator",
  },
  {
    id: "all-recipes-list",
    type: "recipes_list",
    heading: "All Recipes",
    recipeFeed: {
      mode: "random",
      recipeIds: [],
      limit: 6,
    },
  },
];
