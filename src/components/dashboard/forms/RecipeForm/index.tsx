"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { Resolver, useForm, useFormState } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Switch,
  Textarea,
} from "@/components/ui";
import { getDashboardRecipePath, Path } from "@/config";
import { recipeFormSchema } from "@/constants";
import { api } from "@/trpc/react";
import { useRecipesActions, useReturnTo, withReturnTo } from "@/utils";

import { ImageUploadField } from "../ImageUploadField";
import { EditorLayout, FormSection } from "../shared";
import { ContentEditor } from "./ContentEditor";
import { DetailsSection } from "./DetailsSection";
import { TaxonomySection } from "./TaxonomySection";
import type { RecipeFormValues } from "./types";

export namespace RecipeForm {
  export interface Props {
    recipeId?: number;
    onSubmit?: () => void;
  }
}

export function RecipeForm({ recipeId, onSubmit }: RecipeForm.Props) {
  const isEditMode = recipeId !== undefined;
  const router = useRouter();
  const returnTo = useReturnTo(Path.DASHBOARD_RECIPES);
  const { handleCreateRecipe, handleUpdateRecipe } = useRecipesActions();

  const { data, isLoading } = api.authorized.recipe.getRecipe.useQuery(
    recipeId!,
    {
      enabled: isEditMode,
    },
  );

  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema) as Resolver<RecipeFormValues>,
    ...(isEditMode
      ? {
          values: data
            ? {
                title: data.title,
                description: data.description,
                cuisines: data.cuisineIds,
                categories: data.categoryIds,
                content: data.content,
                difficulty: data.difficulty,
                time: data.time,
                servings: data.servings,
                image: data.image,
                published: Boolean(data.publishedAt),
              }
            : {
                title: "",
                description: "",
                cuisines: [],
                categories: [],
                content: "",
                difficulty: "medium",
                time: 0,
                servings: 0,
                image: "",
                published: false,
              },
        }
      : {
          defaultValues: {
            title: "",
            image: "",
            description: "",
            content: "",
            time: 1,
            servings: 1,
            cuisines: [],
            categories: [],
            published: false,
          },
        }),
  });

  const { isDirty, isSubmitting } = useFormState({ control: form.control });

  async function handleSubmit(values: RecipeFormValues) {
    if (isEditMode) {
      await handleUpdateRecipe(recipeId, values, () => {
        form.reset(values);
        onSubmit?.();
      });
    } else {
      await handleCreateRecipe(values, (id) => {
        form.reset(values);
        onSubmit?.();
        router.replace(
          id ? withReturnTo(getDashboardRecipePath(id), returnTo) : returnTo,
        );
      });
    }
  }

  if (isEditMode && isLoading)
    return (
      <LoaderCircle className="text-muted-foreground mx-auto my-8 animate-spin" />
    );

  if (isEditMode && !data) redirect(Path.DASHBOARD_RECIPES);

  const isPublished = isEditMode ? Boolean(data?.publishedAt) : undefined;

  return (
    <Form {...form}>
      <EditorLayout
        title={isEditMode ? (data?.title ?? "Edit recipe") : "New recipe"}
        isPublished={isPublished}
        viewHref={
          isPublished && data ? `${Path.RECIPE}/${data.slug}` : undefined
        }
        isDirty={isDirty}
        isSubmitting={isSubmitting}
        submitLabel={isEditMode ? "Save changes" : "Create recipe"}
        onCancel={() => router.push(returnTo)}
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className="grid items-start gap-6 lg:grid-cols-3">
          <div className="min-w-0 space-y-6 lg:col-span-2">
            <FormSection
              title="Basics"
              description="The title and short description shown on cards."
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="resize-none" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormSection>

            <FormSection
              title="Ingredients & steps"
              description="Markdown content. Paste an image to upload it."
            >
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Content</FormLabel>
                    <FormControl>
                      <ContentEditor field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormSection>
          </div>

          <div className="min-w-0 space-y-6">
            <FormSection title="Publishing">
              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="bg-input flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <FormLabel>Publish</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-success data-[state=unchecked]:bg-muted-foreground/35"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </FormSection>

            <FormSection title="Media">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <ImageUploadField
                        value={field.value}
                        onChange={field.onChange}
                        alt="recipe"
                        inputId="recipe-image-input"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormSection>

            <DetailsSection />

            <TaxonomySection />
          </div>
        </div>
      </EditorLayout>
    </Form>
  );
}
