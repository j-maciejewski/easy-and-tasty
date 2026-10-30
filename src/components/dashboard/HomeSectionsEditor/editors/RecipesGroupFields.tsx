import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import type { taxonomyEnum } from "@/constants";
import { api } from "@/trpc/react";

import type { DraftEditorProps } from "../types";

export const RecipesGroupFields = ({ draft, setDraft }: DraftEditorProps) => {
  const { data: categories } = api.public.category.getCategories.useQuery();
  const { data: cuisines } = api.public.cuisine.getCuisines.useQuery();
  const taxonomyOptions =
    draft.taxonomy === "categories" ? categories : cuisines;

  return (
    <>
      <div className="space-y-2">
        <Label>Source</Label>
        <Select
          value={draft.taxonomy ?? "categories"}
          onValueChange={(value) =>
            setDraft((prev) => ({
              ...prev!,
              taxonomy: value as (typeof taxonomyEnum.options)[number],
              slug: "",
            }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="categories">Categories</SelectItem>
            <SelectItem value="cuisines">Cuisines</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>
          {draft.taxonomy === "categories" ? "Category" : "Cuisine"}
        </Label>
        <Select
          value={draft.slug ?? ""}
          onValueChange={(value) =>
            setDraft((prev) => ({
              ...prev!,
              slug: value,
            }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>
            {taxonomyOptions?.map(({ name, slug }) => (
              <SelectItem key={slug} value={slug}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};
