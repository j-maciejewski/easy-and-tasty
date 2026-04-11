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
import { cuisineFormSchema } from "@/constants";
import { api } from "@/trpc/react";
import { useCuisinesActions } from "@/utils";

export namespace CuisineForm {
  export interface Props {
    cuisineId?: number;
    onSubmit?: () => void;
  }
}

export function CuisineForm({ cuisineId, onSubmit }: CuisineForm.Props) {
  const { handleCreateCuisine, handleUpdateCuisine } = useCuisinesActions();

  const isEditMode = cuisineId !== undefined;

  const { data, isLoading } = api.authorized.cuisine.getCuisine.useQuery(
    cuisineId!,
    {
      enabled: isEditMode,
    },
  );

  const form = useForm<z.infer<typeof cuisineFormSchema>>({
    resolver: zodResolver(cuisineFormSchema),
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
    redirect(Path.DASHBOARD_CUISINES);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) =>
          isEditMode
            ? handleUpdateCuisine(cuisineId, values, onSubmit)
            : handleCreateCuisine(values, onSubmit),
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
