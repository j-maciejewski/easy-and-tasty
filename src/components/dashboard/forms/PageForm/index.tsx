"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useForm, useFormState } from "react-hook-form";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Switch,
  Textarea,
} from "@/components/ui";
import { getDashboardArticlePath, Path } from "@/config";
import { pageFormSchema, parsePageSections } from "@/constants";
import { api } from "@/trpc/react";
import { useArticlesActions, useReturnTo, withReturnTo } from "@/utils";

import { ImageUploadField } from "../ImageUploadField";
import { EditorLayout, FormSection } from "../shared";
import { createDefaultSection } from "./helpers";
import { SectionsField } from "./SectionsField";
import type { PageFormValues } from "./types";

export namespace PageForm {
  export interface Props {
    pageId?: number;
    onSubmit?: () => void;
  }
}

export function PageForm({ pageId, onSubmit }: PageForm.Props) {
  const { handleCreateArticle, handleUpdateArticle } = useArticlesActions();
  const isEditMode = pageId !== undefined;
  const router = useRouter();
  const returnTo = useReturnTo(Path.DASHBOARD_ARTICLES);

  const { data, isLoading } = api.authorized.article.getArticleById.useQuery(
    pageId!,
    {
      enabled: isEditMode,
    },
  );

  const form = useForm<PageFormValues>({
    resolver: zodResolver(pageFormSchema),
    values:
      isEditMode && data
        ? {
            title: data.title,
            slug: data.slug,
            image: data.image ?? "",
            description: data.description,
            sections: parsePageSections(data.content),
            published: Boolean(data.publishedAt),
          }
        : undefined,
    defaultValues: {
      title: "",
      slug: "",
      image: "",
      description: "",
      sections: [createDefaultSection("markdown")],
      published: false,
    },
  });

  const { isDirty, isSubmitting } = useFormState({ control: form.control });

  async function handleSubmit(values: PageFormValues) {
    if (isEditMode) {
      await handleUpdateArticle(pageId, values, () => {
        form.reset(values);
        onSubmit?.();
      });
    } else {
      await handleCreateArticle(values, (id) => {
        form.reset(values);
        onSubmit?.();
        router.replace(
          id ? withReturnTo(getDashboardArticlePath(id), returnTo) : returnTo,
        );
      });
    }
  }

  if (isEditMode && isLoading) {
    return (
      <LoaderCircle className="text-muted-foreground mx-auto my-8 animate-spin" />
    );
  }

  if (isEditMode && !data) {
    redirect(Path.DASHBOARD_ARTICLES);
  }

  const isPublished = isEditMode ? Boolean(data?.publishedAt) : undefined;

  return (
    <Form {...form}>
      <EditorLayout
        title={isEditMode ? (data?.title ?? "Edit article") : "New article"}
        isPublished={isPublished}
        viewHref={isPublished && data ? `/${data.slug}` : undefined}
        preview={
          isEditMode && data ? { type: "article", id: pageId } : undefined
        }
        isDirty={isDirty}
        isSubmitting={isSubmitting}
        submitLabel={isEditMode ? "Save changes" : "Create article"}
        onCancel={() => router.push(returnTo)}
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className="grid items-start gap-6 lg:grid-cols-3">
          <div className="min-w-0 space-y-6 lg:col-span-2">
            <FormSection title="Basics">
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
            </FormSection>

            <SectionsField />
          </div>

          <div className="min-w-0 space-y-6">
            <FormSection title="Publishing">
              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="bg-card flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
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
                        alt="page"
                        inputId="page-image-input"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormSection>

            <FormSection title="SEO">
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      The article is served at /{field.value || "…"}
                    </FormDescription>
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
                    <FormDescription>
                      Used on article cards and as the meta description.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormSection>
          </div>
        </div>
      </EditorLayout>
    </Form>
  );
}
