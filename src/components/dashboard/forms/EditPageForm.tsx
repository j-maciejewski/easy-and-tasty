"use client";

import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { zodResolver } from "@hookform/resolvers/zod";
import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { Image, LoaderCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { useRef } from "react";
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
import { pageFormSchema } from "@/constants";
import { api } from "@/trpc/react";
import { usePagesActions } from "@/utils";

export namespace EditPageForm {
  export interface Props {
    pageId: number;
    onSubmit?: () => void;
  }
}

export function EditPageForm({ pageId, onSubmit }: EditPageForm.Props) {
  const { handleUpdatePage } = usePagesActions();
  const richTextRef = useRef<ReactCodeMirrorRef>(null);

  const { data, isLoading } = api.authorized.page.getPageById.useQuery(pageId);

  const form = useForm<z.infer<typeof pageFormSchema>>({
    resolver: zodResolver(pageFormSchema),
    values: data
      ? {
          title: data.title,
          slug: data.slug,
          image: data.image ?? "",
          description: data.description,
          content: data.content,
          published: Boolean(data.publishedAt),
        }
      : {
          title: "",
          slug: "",
          image: "",
          description: "",
          content: "",
          published: false,
        },
  });

  async function handleSubmit(values: z.infer<typeof pageFormSchema>) {
    await handleUpdatePage(pageId, values, onSubmit);
  }

  if (isLoading)
    return <LoaderCircle className="mx-auto my-2 animate-spin text-gray-500" />;

  if (!data) redirect(Path.DASHBOARD_PAGES);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => handleSubmit(values))}
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
                <div>
                  <label htmlFor="image-input">
                    {field.value ? (
                      <div className="mt-2 flex max-h-80 cursor-pointer overflow-hidden rounded-lg border">
                        {/** biome-ignore lint/performance/noImgElement: explanation */}
                        <img
                          src={field.value}
                          className="mx-auto max-h-80 object-cover"
                          alt="page"
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
                </div>
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
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <CodeMirror
                  {...field}
                  className="overflow-hidden rounded-lg border px-3 py-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&>div]:bg-transparent [&>div]:outline-0!"
                  height="200px"
                  extensions={[markdown({ base: markdownLanguage })]}
                  theme="dark"
                  basicSetup={{
                    lineNumbers: false,
                    foldGutter: false,
                    highlightActiveLine: false,
                  }}
                  ref={richTextRef}
                  onPaste={async (evt) => {
                    evt.preventDefault();
                    evt.stopPropagation();
                    const dataTransfer = evt.clipboardData;

                    if (dataTransfer?.items) {
                      for (const item of dataTransfer.items) {
                        if (
                          item.kind === "file" &&
                          item.type.startsWith("image/")
                        ) {
                          const file = item.getAsFile();

                          if (file && richTextRef.current?.view) {
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
                              const transaction =
                                richTextRef.current.view.state.update({
                                  changes: {
                                    from: richTextRef.current.view.state
                                      .selection.main.head,
                                    insert: `![${message.data.name}](${message.data.url})`,
                                  },
                                });

                              richTextRef.current.view.dispatch(transaction);
                            } else {
                              console.log(message.error);
                            }
                          }
                        }
                      }
                    }
                  }}
                />
              </FormControl>
              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <FormLabel>Publish</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
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
