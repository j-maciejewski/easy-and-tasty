import { use, useMemo } from "react";
import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui";
import { CategoriesContext, CuisinesContext } from "@/context";

import { FormSection } from "../shared";
import { TaxonomyField } from "./TaxonomyField";
import type { RecipeFormValues } from "./types";

export const TaxonomySection = () => {
  const form = useFormContext<RecipeFormValues>();
  const { categories } = use(CategoriesContext)!;
  const { cuisines } = use(CuisinesContext)!;

  const categoryOptions = useMemo(
    () =>
      [...categories.values()].map((category) => ({
        label: category.name,
        value: category.id,
      })),
    [categories],
  );

  const cuisineOptions = useMemo(
    () =>
      [...cuisines.values()].map((cuisine) => ({
        label: cuisine.name,
        value: cuisine.id,
      })),
    [cuisines],
  );

  return (
    <FormSection title="Taxonomy">
      <FormField
        control={form.control}
        name="cuisines"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cuisines</FormLabel>
            <FormControl>
              <TaxonomyField
                label="Cuisines"
                options={cuisineOptions}
                value={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="categories"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Categories</FormLabel>
            <FormControl>
              <TaxonomyField
                label="Categories"
                options={categoryOptions}
                value={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormSection>
  );
};
