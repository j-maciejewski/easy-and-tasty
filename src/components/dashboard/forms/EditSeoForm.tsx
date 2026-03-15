"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
  Textarea,
} from "@/components/ui";
import { api } from "@/trpc/react";

import { ImageUploadField } from "./ImageUploadField";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  image: z.string(),
});

export namespace EditSeoForm {
  export interface Props {
    data?: Omit<Seo, "pageType">;
    pageType: Seo["pageType"];
    onSubmit?: () => void;
  }
}

export function EditSeoForm({ onSubmit, data, pageType }: EditSeoForm.Props) {
  const updateSeoConfig = api.authorized.seo.updateSeoConfig.useMutation();

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    try {
      await updateSeoConfig.mutateAsync({ ...values, pageType });

      toast.success("Config was modified.");

      onSubmit?.();
    } catch (error) {
      toast.error(
        (error as Error)?.message ??
          "There was an error while modifying config.",
      );
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: data
      ? {
          title: data.title,
          description: data.description,
          image: data.image ?? "",
        }
      : {
          title: "",
          description: "",
          image: "",
        },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="min-w-1 space-y-8"
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
                  alt="seo"
                  inputId="seo-image-input"
                />
              </FormControl>
              <FormMessage />
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
