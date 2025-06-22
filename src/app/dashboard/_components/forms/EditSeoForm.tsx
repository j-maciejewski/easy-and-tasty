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
    <>
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

          <Button type="submit" className="text-white">
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
}
