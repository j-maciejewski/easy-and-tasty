import { z } from "zod";

import { articleFeedSchema, recipeFeedSchema } from "@/constants/homeSections";

export const pageSectionTypeEnum = z.enum([
  "markdown",
  "banner",
  "recipe_full_card",
  "recipe_grid",
  "recipe_carousel",
  "articles_list",
  "scrollable_recipes",
  "recipes_list",
  "separator",
]);

export const markdownPageSectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("markdown"),
  content: z.string().min(1),
});

export const bannerPageSectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("banner"),
  title: z.string().min(2),
  text: z.string().optional(),
  image: z.string().min(1),
  href: z.string().min(1),
});

export const recipeFullCardPageSectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("recipe_full_card"),
  recipeFeed: recipeFeedSchema.optional(),
});

export const recipeGridPageSectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("recipe_grid"),
  offset: z.number().int().min(0).max(5),
  limit: z.number().int().min(1).max(3),
  recipeFeed: recipeFeedSchema.optional(),
});

export const recipeCarouselPageSectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("recipe_carousel"),
  recipeFeed: recipeFeedSchema.optional(),
});

export const articlesListPageSectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("articles_list"),
  heading: z.string().min(2),
  subheading: z.string().optional(),
  articleFeed: articleFeedSchema.optional(),
});

export const scrollableRecipesPageSectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("scrollable_recipes"),
  heading: z.string().min(2),
  subheading: z.string().optional(),
  recipeFeed: recipeFeedSchema.optional(),
});

export const recipesListPageSectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("recipes_list"),
  heading: z.string().min(2),
  subheading: z.string().optional(),
  recipeFeed: recipeFeedSchema.optional(),
});

export const separatorPageSectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("separator"),
});

export const pageSectionSchema = z.discriminatedUnion("type", [
  markdownPageSectionSchema,
  bannerPageSectionSchema,
  recipeFullCardPageSectionSchema,
  recipeGridPageSectionSchema,
  recipeCarouselPageSectionSchema,
  articlesListPageSectionSchema,
  scrollableRecipesPageSectionSchema,
  recipesListPageSectionSchema,
  separatorPageSectionSchema,
]);

export const pageSectionsSchema = z.array(pageSectionSchema).min(1, {
  message: "At least one section is required.",
});

export type PageSection = z.infer<typeof pageSectionSchema>;

export function parsePageSections(
  storedContent: string | null | undefined,
): PageSection[] {
  if (!storedContent) {
    return [
      {
        id: "markdown-default",
        type: "markdown",
        content: "",
      },
    ];
  }

  try {
    const parsedJson = JSON.parse(storedContent);
    const parsedSections = pageSectionsSchema.safeParse(parsedJson);

    if (parsedSections.success) return parsedSections.data;
  } catch {
    // Legacy pages may still store plain markdown in `content`.
  }

  return [
    {
      id: "markdown-legacy",
      type: "markdown" as const,
      content: storedContent,
    },
  ];
}

export function stringifyPageSections(sections: PageSection[]) {
  return JSON.stringify(sections);
}
