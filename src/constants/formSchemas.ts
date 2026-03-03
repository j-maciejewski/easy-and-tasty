import { z } from "zod";

import { difficultyEnum } from "@/server/db/schema";

export const categoryFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  slug: z.string().min(2, {
    message: "Slug must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  published: z.boolean(),
});

export const cuisineFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  slug: z.string().min(2, {
    message: "Slug must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  published: z.boolean(),
});

export const recipeFormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  image: z.string(),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  content: z.string().min(2, {
    message: "Content must be at least 2 characters.",
  }),
  difficulty: z.enum(difficultyEnum.enumValues),
  time: z.coerce.number().min(1, {
    message: "Time must be at least 1 minute.",
  }),
  servings: z.coerce.number().min(1, {
    message: "The dish should have at least 1 serving.",
  }),
  cuisines: z.number().array().min(1, {
    message: "The dish should have at least 1 cuisine.",
  }),
  categories: z.number().array().min(1, {
    message: "The dish should have at least 1 category.",
  }),
  published: z.boolean(),
});

export const pageFormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  slug: z.string().min(2, {
    message: "Slug must be at least 2 characters.",
  }),
  image: z.string(),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  content: z.string().min(2, {
    message: "Content must be at least 2 characters.",
  }),
  published: z.boolean(),
});
