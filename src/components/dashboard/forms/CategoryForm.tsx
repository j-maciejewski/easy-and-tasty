"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Button,
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
import { Path } from "@/config";
import { categoryFormSchema } from "@/constants";
import { api } from "@/trpc/react";
import { useCategoriesActions } from "@/utils";

export namespace CategoryForm {
  export interface Props {
    categoryId?: number;
    onSubmit?: () => void;
  }
}

export function CategoryForm({ categoryId, onSubmit }: CategoryForm.Props) {
  const { handleCreateCategory, handleUpdateCategory } = useCategoriesActions();

  const isEditMode = categoryId !== undefined;

  const { data, isLoading } = api.authorized.category.getCategory.useQuery(
    categoryId!,
    {
      enabled: isEditMode,
    },
  );

  const form = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    values:
      isEditMode && data
        ? {
            name: data.name,
            slug: data.slug,
            description: data.description,
            published: Boolean(data.publishedAt),
          }
        : undefined,
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      published: false,
    },
  });

  if (isEditMode && isLoading) {
    return <LoaderCircle className="mx-auto my-2 animate-spin text-gray-500" />;
  }

  if (isEditMode && !data) {
    redirect(Path.DASHBOARD_CATEGORIES);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) =>
          isEditMode
            ? handleUpdateCategory(categoryId, values, onSubmit)
            : handleCreateCategory(values, onSubmit),
        )}
        className="min-w-1 space-y-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
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
        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border bg-card p-3 shadow-sm">
              <FormLabel>Publish</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-orange-500/70"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="text-white">
          Submit
        </Button>
      </form>
    </Form>
  );
}
