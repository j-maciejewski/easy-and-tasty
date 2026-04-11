"use client";

import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { zodResolver } from "@hookform/resolvers/zod";
import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { LoaderCircle, Plus, X } from "lucide-react";
import { redirect } from "next/navigation";
import { use, useMemo, useRef } from "react";
import { Resolver, useForm } from "react-hook-form";
import { z } from "zod";

import { MultiSelect } from "@/components/dashboard";
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
  Switch,
  Textarea,
} from "@/components/ui";
import { Path } from "@/config";
import { recipeFormSchema } from "@/constants";
import { CategoriesContext, CuisinesContext } from "@/context";
import { api } from "@/trpc/react";
import { useRecipesActions } from "@/utils";

import { ImageUploadField } from "./ImageUploadField";

export namespace RecipeForm {
  export interface Props {
    recipeId?: number;
    onSubmit?: () => void;
  }
}

export function RecipeForm({ recipeId, onSubmit }: RecipeForm.Props) {
  const isEditMode = recipeId !== undefined;
  const { handleCreateRecipe, handleUpdateRecipe } = useRecipesActions();

  const { data, isLoading } = api.authorized.recipe.getRecipe.useQuery(
    recipeId!,
    {
      enabled: isEditMode,
    },
  );
  const richTextRef = useRef<ReactCodeMirrorRef>(null);

  const { categories } = use(CategoriesContext)!;
  const { cuisines } = use(CuisinesContext)!;

  const categoryOptions = useMemo(
    () =>
      [...categories.values()].map((category) => ({
        label: category.name,
        value: category.id,
      })),
    [categories],
  );

  const cuisineOptions = useMemo(
    () =>
      [...cuisines.values()].map((cuisine) => ({
        label: cuisine.name,
        value: cuisine.id,
      })),
    [cuisines],
  );

  const form = useForm<z.infer<typeof recipeFormSchema>>({
    resolver: zodResolver(recipeFormSchema) as Resolver<
      z.infer<typeof recipeFormSchema>
    >,
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

  async function handleSubmit(values: z.infer<typeof recipeFormSchema>) {
    if (isEditMode) {
      await handleUpdateRecipe(recipeId, values, onSubmit);
    } else {
      await handleCreateRecipe(values, onSubmit);
    }
  }

  if (isEditMode && isLoading)
    return <LoaderCircle className="mx-auto my-2 animate-spin text-gray-500" />;

  if (isEditMode && !data) redirect(Path.DASHBOARD_RECIPES);

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
                  className="overflow-hidden rounded-lg border ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&>div]:bg-input! [&>div]:outline-0!"
                  height="320px"
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
                defaultValue={field.value}
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
                <Input
                  {...field}
                  type="number"
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
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
                <Input
                  {...field}
                  type="number"
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
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
                        className="cursor-pointer text-nowrap bg-input"
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
                        className="h-full cursor-pointer bg-input"
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
                        className="cursor-pointer text-nowrap bg-input"
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
                        className="h-full cursor-pointer bg-input"
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
          name="published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border bg-input p-3 shadow-sm">
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
