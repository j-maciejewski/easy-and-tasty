"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "lucide-react";
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

const formSchema = z.object({
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
});

export namespace AddPageForm {
  export interface Props {
    onSubmit?: () => void;
  }
}

export function AddPageForm({ onSubmit }: AddPageForm.Props) {
  const addPage = api.authorized.page.addPage.useMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    await addPage.mutateAsync(values);

    toast.success("Page was added.");

    if (onSubmit) onSubmit();
  }

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
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <label htmlFor="image-input">
                  {field.value ? (
                    <div className="mt-2 flex max-h-80 cursor-pointer overflow-hidden rounded-lg border">
                      {/** biome-ignore lint/performance/noImgElement: explanation */}
                      <img
                        src={field.value}
                        className="mx-auto max-h-80 object-cover"
                        alt="recipe"
                      />
                    </div>
                  ) : (
                    <div className="flex cursor-pointer flex-col items-center justify-center rounded-lg border p-5 text-foreground/50 text-sm">
                      <Image className="size-14 stroke-1" />
                      Click to add image
                    </div>
                  )}
                </label>
                <Input
                  id="image-input"
                  type="file"
                  accept="image/png, image/jpeg"
                  className="hidden"
                  onChange={async (evt) => {
                    const file = evt.target.files?.[0];

                    if (
                      !file ||
                      !["image/png", "image/jpeg"].includes(file.type)
                    )
                      return;

                    const formData = new FormData();

                    formData.append("file", file);

                    const response = await fetch("/api/upload", {
                      method: "POST",
                      body: formData,
                    });

                    const message = (await response.json()) as
                      | {
                          data: {
                            name: string;
                            url: string;
                          };
                          error: null;
                        }
                      | { data: null; error: string };

                    if (message.data) {
                      field.onChange(message.data.url);
                    } else {
                      console.log(message.error);
                    }
                  }}
                />
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

        <Button type="submit" className="text-white">
          Submit
        </Button>
      </form>
    </Form>
  );
}
