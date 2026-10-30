import { z } from "zod";

import { recipeFormSchema } from "@/constants";

export type RecipeFormValues = z.infer<typeof recipeFormSchema>;
