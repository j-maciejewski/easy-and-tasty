"use client";

import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { zodResolver } from "@hookform/resolvers/zod";
import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { LoaderCircle, Plus, X } from "lucide-react";
import { redirect } from "next/navigation";
import React, { use, useRef } from "react";
import { Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  Badge,
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@/components/ui";
import { Path } from "@/config";
import { difficultyEnum } from "@/server/db/schema";
import { api } from "@/trpc/react";

import { CategoriesContext, CuisinesContext } from "../../_context";
import { MultiSelect } from "../MultiSelect";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  image: z.string(),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  content: z.string().min(2, {
    message: "Content must be at least 2 characters.",
  }),
  difficulty: z.enum(difficultyEnum.enumValues).default("easy"),
  time: z.coerce.number().min(1, {
    message: "Time must be at least 1 minute.",
  }),
  servings: z.coerce.number().min(1, {
    message: "The dish should have at least 1 serving.",
  }),
  cuisines: z.number().array().min(1, {
    message: "The dish should have at least 1 cuisine.",
  }),
  categories: z.number().array().min(1, {
    message: "The dish should have at least 1 category.",
  }),
});

export namespace EditRecipeForm {
  export interface Props {
    recipeId: number;
    categories?: {
      description: string;
      id: number;
      name: string;
      slug: string;
    }[];
    cuisines?: {
      description: string;
      id: number;
      name: string;
      slug: string;
    }[];
    onSubmit?: () => void;
  }
}

export function EditRecipeForm({
  recipeId,
  categories,
  cuisines,
  onSubmit,
}: EditRecipeForm.Props) {
  const { data, isLoading } =
    api.authorized.recipe.getRecipe.useQuery(recipeId);

  const editRecipe = api.authorized.recipe.editRecipe.useMutation();
  const richTextRef = useRef<ReactCodeMirrorRef>(null);

  const categoryOptions = (() => {
    if (categories) {
      return categories.map((category) => ({
        label: category.name,
        value: category.id,
      }));
    }

    const { categories: categoriesMap } = use(CategoriesContext)!;
    return [...categoriesMap.values()].map((category) => ({
      label: category.name,
      value: category.id,
    }));
  })();

  const cuisineOptions = (() => {
    if (cuisines) {
      return cuisines.map((cuisine) => ({
        label: cuisine.name,
        value: cuisine.id,
      }));
    }

    const { cuisines: cuisinesMap } = use(CuisinesContext)!;
    return [...cuisinesMap.values()].map((cuisine) => ({
      label: cuisine.name,
      value: cuisine.id,
    }));
  })();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as Resolver<z.infer<typeof formSchema>>,
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
        },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(recipeId, { values });
      await editRecipe.mutateAsync({ id: recipeId, ...values });

      toast.success("Recipe was modified.");

      onSubmit?.();
    } catch (error) {
      toast.error(
        (error as Error)?.message ??
          "There was an error while modifying the recipe.",
      );
    }
  }

  if (isLoading)
    return <LoaderCircle className="mx-auto my-2 animate-spin text-gray-500" />;

  if (!data) redirect(Path.DASHBOARD_RECIPES);

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
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <React.Fragment>
                    <label htmlFor="image-input">
                      <div className="mt-2 flex max-h-80 cursor-pointer overflow-hidden rounded-lg border">
                        {/** biome-ignore lint/performance/noImgElement: explanation */}
                        <img
                          src={field.value}
                          className="mx-auto max-h-80 object-cover"
                          alt="recipe"
                        />
                      </div>
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
                  </React.Fragment>
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
                    className="[&>div]:!outline-0 overflow-hidden rounded-lg border px-3 py-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&>div]:bg-transparent"
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
                            ["image/png", "image/jpeg"].includes(item.type)
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

                            break;
                          }
                        }
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
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty</FormLabel>
                <Select
                  onValueChange={(val) => {
                    if (!val) return;
                    field.onChange(val);
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="servings"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Servings</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cuisines"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cuisines</FormLabel>
                <FormControl>
                  <div className="flex gap-2 [&>div:last-child]:inline-block">
                    {cuisineOptions
                      .filter((option) => field.value.includes(option.value))
                      .map((option) => (
                        <Badge
                          key={option.label}
                          variant="outline"
                          tabIndex={0}
                          className="cursor-pointer"
                          onClick={() => {
                            field.onChange(
                              field.value.filter(
                                (value) => option.value !== value,
                              ),
                            );
                          }}
                        >
                          {option.label}
                          <X className="ml-2 size-4 text-red-600" />
                        </Badge>
                      ))}
                    <MultiSelect
                      label="Cuisines"
                      options={cuisineOptions.map((option) => ({
                        ...option,
                        checked: field.value.includes(option.value),
                      }))}
                      toggleOption={(value) => {
                        if (field.value.includes(value)) {
                          field.onChange(
                            field.value.filter((_value) => value !== _value),
                          );
                        } else {
                          field.onChange(field.value.concat(value));
                        }
                      }}
                    >
                      <div>
                        <Badge
                          variant="outline"
                          className="h-full cursor-pointer"
                        >
                          <Plus className="size-3" />
                        </Badge>
                      </div>
                    </MultiSelect>
                  </div>
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
                  <div className="flex gap-2 [&>div:last-child]:inline-block">
                    {categoryOptions
                      .filter((option) => field.value.includes(option.value))
                      .map((option) => (
                        <Badge
                          key={option.label}
                          variant="outline"
                          tabIndex={0}
                          className="cursor-pointer text-nowrap"
                          onClick={() => {
                            field.onChange(
                              field.value.filter(
                                (value) => option.value !== value,
                              ),
                            );
                          }}
                        >
                          {option.label}
                          <X className="ml-2 size-4 text-red-600" />
                        </Badge>
                      ))}
                    <MultiSelect
                      label="Categories"
                      options={categoryOptions.map((option) => ({
                        ...option,
                        checked: field.value.includes(option.value),
                      }))}
                      toggleOption={(value) => {
                        if (field.value.includes(value as number)) {
                          field.onChange(
                            field.value.filter((_value) => value !== _value),
                          );
                        } else {
                          field.onChange(field.value.concat(value as number));
                        }
                      }}
                    >
                      <div>
                        <Badge
                          variant="outline"
                          className="h-full cursor-pointer"
                        >
                          <Plus className="size-3" />
                        </Badge>
                      </div>
                    </MultiSelect>
                  </div>
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
