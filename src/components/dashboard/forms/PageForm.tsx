"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowDown,
  ArrowUp,
  GripVertical,
  LoaderCircle,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import {
  articleFeedModeEnum,
  type PageSection,
  pageFormSchema,
  pageSectionSchema,
  pageSectionTypeEnum,
  parsePageSections,
  recipeFeedModeEnum,
} from "@/constants";
import { api } from "@/trpc/react";
import { usePagesActions } from "@/utils";

import { ImageUploadField } from "./ImageUploadField";

export namespace PageForm {
  export interface Props {
    pageId?: number;
    onSubmit?: () => void;
  }
}

type SectionDraft = {
  id: string;
  type: PageSection["type"];
  content?: string;
  title?: string;
  text?: string;
  image?: string;
  href?: string;
  offset?: number;
  limit?: number;
  heading?: string;
  subheading?: string;
  recipeFeed?: {
    mode:
      | "random"
      | "most_recent"
      | "most_liked"
      | "most_viewed"
      | "most_bookmarked"
      | "specific";
    recipeIds: number[];
    limit: number;
  };
  articleFeed?: {
    mode: "most_recent" | "specific";
    articleIds: number[];
    limit: number;
  };
};

const sectionLabels: Record<PageSection["type"], string> = {
  markdown: "Markdown",
  banner: "Banner",
  recipe_full_card: "Recipe Full Card",
  recipe_grid: "Recipe Grid",
  recipe_carousel: "Recipe Carousel",
  articles_list: "Articles List",
  scrollable_recipes: "Scrollable Recipes",
  recipes_list: "Recipes List",
  separator: "Separator",
};

function createDefaultSection(type: PageSection["type"]): PageSection {
  const id = crypto.randomUUID();

  switch (type) {
    case "markdown":
      return {
        id,
        type,
        content: "## New section\n\nStart writing here.",
      };
    case "banner":
      return {
        id,
        type,
        title: "New banner title",
        text: "Banner description",
        image: "/mock/banner.png",
        href: "/",
      };
    case "recipe_full_card":
      return {
        id,
        type,
        recipeFeed: {
          mode: "random",
          recipeIds: [],
          limit: 6,
        },
      };
    case "recipe_grid":
      return {
        id,
        type,
        offset: 0,
        limit: 3,
        recipeFeed: {
          mode: "random",
          recipeIds: [],
          limit: 6,
        },
      };
    case "recipe_carousel":
      return {
        id,
        type,
        recipeFeed: {
          mode: "random",
          recipeIds: [],
          limit: 6,
        },
      };
    case "articles_list":
      return {
        id,
        type,
        heading: "Latest articles",
        subheading: "Stay up to date with our latest posts",
        articleFeed: {
          mode: "most_recent",
          articleIds: [],
          limit: 6,
        },
      };
    case "scrollable_recipes":
      return {
        id,
        type,
        heading: "Featured recipes",
        subheading: "Curated picks from the latest additions",
        recipeFeed: {
          mode: "random",
          recipeIds: [],
          limit: 6,
        },
      };
    case "recipes_list":
      return {
        id,
        type,
        heading: "More recipes",
        subheading: "Browse related recipes",
        recipeFeed: {
          mode: "random",
          recipeIds: [],
          limit: 6,
        },
      };
    case "separator":
      return {
        id,
        type,
      };
  }
}

function parseRecipeIds(value: string) {
  return value
    .split(",")
    .map((id) => Number(id.trim()))
    .filter((id) => Number.isInteger(id) && id > 0);
}

function parseArticleIds(value: string) {
  return value
    .split(",")
    .map((id) => Number(id.trim()))
    .filter((id) => Number.isInteger(id) && id > 0);
}

function getSectionSummary(section: PageSection) {
  switch (section.type) {
    case "markdown":
      return section.content.slice(0, 80);
    case "banner":
      return `${section.title} -> ${section.href}`;
    case "recipe_full_card":
      return `${section.recipeFeed?.mode ?? "random"} | Full cards from fetched recipes`;
    case "recipe_grid":
      return `${section.recipeFeed?.mode ?? "random"} | From index ${section.offset}, show ${section.limit}`;
    case "recipe_carousel":
      return `${section.recipeFeed?.mode ?? "random"} | Featured carousel`;
    case "articles_list":
      return `${section.articleFeed?.mode ?? "most_recent"} | ${section.heading}`;
    case "scrollable_recipes":
      return `${section.recipeFeed?.mode ?? "random"} | ${section.heading}`;
    case "recipes_list":
      return `${section.recipeFeed?.mode ?? "random"} | ${section.heading}`;
    case "separator":
      return "Horizontal divider";
  }
}

export function PageForm({ pageId, onSubmit }: PageForm.Props) {
  const { handleCreatePage, handleUpdatePage } = usePagesActions();
  const isEditMode = pageId !== undefined;

  const { data, isLoading } = api.authorized.page.getPageById.useQuery(
    pageId!,
    {
      enabled: isEditMode,
    },
  );

  const [draft, setDraft] = useState<SectionDraft | null>(null);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [draggedSectionId, setDraggedSectionId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof pageFormSchema>>({
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

  const sections = form.watch("sections");

  function setSections(nextSections: PageSection[]) {
    form.setValue("sections", nextSections, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  }

  function moveSection(index: number, direction: "up" | "down") {
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= sections.length) return;

    const clone = [...sections];
    [clone[index], clone[nextIndex]] = [clone[nextIndex]!, clone[index]!];

    setSections(clone);
  }

  function moveSectionById(sourceId: string, targetId: string) {
    if (sourceId === targetId) return;

    const sourceIndex = sections.findIndex(({ id }) => id === sourceId);
    const targetIndex = sections.findIndex(({ id }) => id === targetId);

    if (sourceIndex < 0 || targetIndex < 0) return;

    const clone = [...sections];
    const [moved] = clone.splice(sourceIndex, 1);
    if (!moved) return;
    clone.splice(targetIndex, 0, moved);
    setSections(clone);
  }

  function openAddDialog() {
    setDraft(createDefaultSection("markdown"));
    setEditingSectionId(null);
    setDialogOpen(true);
  }

  function openEditDialog(section: PageSection) {
    setDraft({ ...section });
    setEditingSectionId(section.id);
    setDialogOpen(true);
  }

  function handleDraftTypeChange(type: PageSection["type"]) {
    if (!draft) return;

    const nextSection = createDefaultSection(type);
    setDraft({ ...nextSection, id: draft.id });
  }

  function saveDraft() {
    if (!draft) return;

    const parsed = pageSectionSchema.safeParse(draft);

    if (!parsed.success) {
      form.setError("sections", {
        message: parsed.error.issues[0]?.message ?? "Invalid section data.",
      });
      return;
    }

    const section = parsed.data;

    if (editingSectionId) {
      setSections(
        sections.map((item) => (item.id === editingSectionId ? section : item)),
      );
    } else {
      setSections([...sections, section]);
    }

    setDialogOpen(false);
    setEditingSectionId(null);
    setDraft(null);
  }

  async function handleSubmit(values: z.infer<typeof pageFormSchema>) {
    if (isEditMode) {
      await handleUpdatePage(pageId, values, onSubmit);
    } else {
      await handleCreatePage(values, onSubmit);
    }
  }

  if (isEditMode && isLoading) {
    return <LoaderCircle className="mx-auto my-2 animate-spin text-gray-500" />;
  }

  if (isEditMode && !data) {
    redirect(Path.DASHBOARD_PAGES);
  }

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

        <FormItem>
          <div className="mb-3 flex items-center justify-between">
            <FormLabel>Sections</FormLabel>
            <Button type="button" variant="outline" onClick={openAddDialog}>
              <Plus className="mr-2 size-4" />
              Add section
            </Button>
          </div>
          <div className="space-y-2 rounded-lg border p-3">
            {sections.map((section, index) => (
              <div
                key={section.id}
                className="flex items-center gap-2 rounded-md border px-3 py-2"
              >
                <button
                  type="button"
                  draggable
                  onDragStart={() => setDraggedSectionId(section.id)}
                  onDragEnd={() => setDraggedSectionId(null)}
                  onDragOver={(evt) => evt.preventDefault()}
                  onDrop={() => {
                    if (!draggedSectionId) return;
                    moveSectionById(draggedSectionId, section.id);
                    setDraggedSectionId(null);
                  }}
                  className="cursor-grab"
                  aria-label="Drag to reorder section"
                >
                  <GripVertical className="size-4 text-foreground/40" />
                </button>
                <div className="min-w-0 grow">
                  <p className="font-medium text-sm">
                    {sectionLabels[section.type]}
                  </p>
                  <p className="truncate text-foreground/70 text-xs">
                    {getSectionSummary(section)}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={index === 0}
                  onClick={() => moveSection(index, "up")}
                >
                  <ArrowUp className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={index === sections.length - 1}
                  onClick={() => moveSection(index, "down")}
                >
                  <ArrowDown className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => openEditDialog(section)}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setSections(
                      sections.filter((item) => item.id !== section.id),
                    )
                  }
                  disabled={sections.length <= 1}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
          <FormMessage>{form.formState.errors.sections?.message}</FormMessage>
        </FormItem>

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
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="text-white">
          Submit
        </Button>
      </form>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[calc(100%-4rem)] overflow-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingSectionId ? "Edit section" : "Add section"}
            </DialogTitle>
          </DialogHeader>

          {draft && (
            <div className="space-y-4">
              <div className="space-y-2">
                <FormLabel>Section type</FormLabel>
                <Select
                  value={draft.type}
                  onValueChange={(value) =>
                    handleDraftTypeChange(value as PageSection["type"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {pageSectionTypeEnum.options.map((type) => (
                      <SelectItem key={type} value={type}>
                        {sectionLabels[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {draft.type === "markdown" && (
                <div className="space-y-2">
                  <FormLabel>Content</FormLabel>
                  <Textarea
                    className="min-h-48"
                    value={draft.content ?? ""}
                    onChange={(evt) =>
                      setDraft((prev) => ({
                        ...prev!,
                        content: evt.target.value,
                      }))
                    }
                  />
                </div>
              )}

              {draft.type === "banner" && (
                <>
                  <div className="space-y-2">
                    <FormLabel>Title</FormLabel>
                    <Input
                      value={draft.title ?? ""}
                      onChange={(evt) =>
                        setDraft((prev) => ({
                          ...prev!,
                          title: evt.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <FormLabel>Text</FormLabel>
                    <Textarea
                      value={draft.text ?? ""}
                      onChange={(evt) =>
                        setDraft((prev) => ({
                          ...prev!,
                          text: evt.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <FormLabel>Image</FormLabel>
                    <ImageUploadField
                      value={draft.image}
                      onChange={(value) =>
                        setDraft((prev) => ({
                          ...prev!,
                          image: value,
                        }))
                      }
                      alt="banner"
                      inputId="banner-image-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <FormLabel>Link</FormLabel>
                    <Input
                      value={draft.href ?? ""}
                      onChange={(evt) =>
                        setDraft((prev) => ({
                          ...prev!,
                          href: evt.target.value,
                        }))
                      }
                    />
                  </div>
                </>
              )}

              {draft.type === "recipe_full_card" && (
                <>
                  <div className="space-y-2">
                    <FormLabel>Recipe source</FormLabel>
                    <Select
                      value={draft.recipeFeed?.mode ?? "random"}
                      onValueChange={(value) =>
                        setDraft((prev) => ({
                          ...prev!,
                          recipeFeed: {
                            mode: value as (typeof recipeFeedModeEnum.options)[number],
                            recipeIds: prev?.recipeFeed?.recipeIds ?? [],
                            limit: prev?.recipeFeed?.limit ?? 6,
                          },
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="random">Random</SelectItem>
                        <SelectItem value="most_recent">Most recent</SelectItem>
                        <SelectItem value="most_liked">Most liked</SelectItem>
                        <SelectItem value="most_viewed">Most viewed</SelectItem>
                        <SelectItem value="most_bookmarked">
                          Most bookmarked
                        </SelectItem>
                        <SelectItem value="specific">
                          Specific recipes
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {draft.recipeFeed?.mode === "specific" ? (
                    <div className="space-y-2">
                      <FormLabel>Recipe IDs (comma-separated)</FormLabel>
                      <Input
                        value={(draft.recipeFeed.recipeIds ?? []).join(", ")}
                        onChange={(evt) =>
                          setDraft((prev) => ({
                            ...prev!,
                            recipeFeed: {
                              mode: prev?.recipeFeed?.mode ?? "specific",
                              recipeIds: parseRecipeIds(evt.target.value),
                              limit: prev?.recipeFeed?.limit ?? 6,
                            },
                          }))
                        }
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <FormLabel>Fetched recipes count</FormLabel>
                      <Input
                        type="number"
                        min={1}
                        max={24}
                        value={draft.recipeFeed?.limit ?? 6}
                        onChange={(evt) =>
                          setDraft((prev) => ({
                            ...prev!,
                            recipeFeed: {
                              mode: prev?.recipeFeed?.mode ?? "random",
                              recipeIds: prev?.recipeFeed?.recipeIds ?? [],
                              limit: Number(evt.target.value),
                            },
                          }))
                        }
                      />
                    </div>
                  )}
                </>
              )}

              {draft.type === "recipe_grid" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <FormLabel>Offset (0-5)</FormLabel>
                      <Input
                        type="number"
                        value={draft.offset ?? 0}
                        min={0}
                        max={5}
                        onChange={(evt) =>
                          setDraft((prev) => ({
                            ...prev!,
                            offset: Number(evt.target.value),
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <FormLabel>Limit (1-3)</FormLabel>
                      <Input
                        type="number"
                        value={draft.limit ?? 3}
                        min={1}
                        max={3}
                        onChange={(evt) =>
                          setDraft((prev) => ({
                            ...prev!,
                            limit: Number(evt.target.value),
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <FormLabel>Recipe source</FormLabel>
                    <Select
                      value={draft.recipeFeed?.mode ?? "random"}
                      onValueChange={(value) =>
                        setDraft((prev) => ({
                          ...prev!,
                          recipeFeed: {
                            mode: value as (typeof recipeFeedModeEnum.options)[number],
                            recipeIds: prev?.recipeFeed?.recipeIds ?? [],
                            limit: prev?.recipeFeed?.limit ?? 6,
                          },
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="random">Random</SelectItem>
                        <SelectItem value="most_recent">Most recent</SelectItem>
                        <SelectItem value="most_liked">Most liked</SelectItem>
                        <SelectItem value="most_viewed">Most viewed</SelectItem>
                        <SelectItem value="most_bookmarked">
                          Most bookmarked
                        </SelectItem>
                        <SelectItem value="specific">
                          Specific recipes
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {draft.recipeFeed?.mode === "specific" ? (
                    <div className="space-y-2">
                      <FormLabel>Recipe IDs (comma-separated)</FormLabel>
                      <Input
                        value={(draft.recipeFeed.recipeIds ?? []).join(", ")}
                        onChange={(evt) =>
                          setDraft((prev) => ({
                            ...prev!,
                            recipeFeed: {
                              mode: prev?.recipeFeed?.mode ?? "specific",
                              recipeIds: parseRecipeIds(evt.target.value),
                              limit: prev?.recipeFeed?.limit ?? 6,
                            },
                          }))
                        }
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <FormLabel>Fetched recipes count</FormLabel>
                      <Input
                        type="number"
                        min={1}
                        max={24}
                        value={draft.recipeFeed?.limit ?? 6}
                        onChange={(evt) =>
                          setDraft((prev) => ({
                            ...prev!,
                            recipeFeed: {
                              mode: prev?.recipeFeed?.mode ?? "random",
                              recipeIds: prev?.recipeFeed?.recipeIds ?? [],
                              limit: Number(evt.target.value),
                            },
                          }))
                        }
                      />
                    </div>
                  )}
                </>
              )}

              {(draft.type === "recipe_carousel" ||
                draft.type === "scrollable_recipes" ||
                draft.type === "recipes_list") && (
                <>
                  <div className="space-y-2">
                    <FormLabel>Recipe source</FormLabel>
                    <Select
                      value={draft.recipeFeed?.mode ?? "random"}
                      onValueChange={(value) =>
                        setDraft((prev) => ({
                          ...prev!,
                          recipeFeed: {
                            mode: value as (typeof recipeFeedModeEnum.options)[number],
                            recipeIds: prev?.recipeFeed?.recipeIds ?? [],
                            limit: prev?.recipeFeed?.limit ?? 6,
                          },
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="random">Random</SelectItem>
                        <SelectItem value="most_recent">Most recent</SelectItem>
                        <SelectItem value="most_liked">Most liked</SelectItem>
                        <SelectItem value="most_viewed">Most viewed</SelectItem>
                        <SelectItem value="most_bookmarked">
                          Most bookmarked
                        </SelectItem>
                        <SelectItem value="specific">
                          Specific recipes
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {draft.recipeFeed?.mode === "specific" ? (
                    <div className="space-y-2">
                      <FormLabel>Recipe IDs (comma-separated)</FormLabel>
                      <Input
                        value={(draft.recipeFeed.recipeIds ?? []).join(", ")}
                        onChange={(evt) =>
                          setDraft((prev) => ({
                            ...prev!,
                            recipeFeed: {
                              mode: prev?.recipeFeed?.mode ?? "specific",
                              recipeIds: parseRecipeIds(evt.target.value),
                              limit: prev?.recipeFeed?.limit ?? 6,
                            },
                          }))
                        }
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <FormLabel>Fetched recipes count</FormLabel>
                      <Input
                        type="number"
                        min={1}
                        max={24}
                        value={draft.recipeFeed?.limit ?? 6}
                        onChange={(evt) =>
                          setDraft((prev) => ({
                            ...prev!,
                            recipeFeed: {
                              mode: prev?.recipeFeed?.mode ?? "random",
                              recipeIds: prev?.recipeFeed?.recipeIds ?? [],
                              limit: Number(evt.target.value),
                            },
                          }))
                        }
                      />
                    </div>
                  )}
                </>
              )}

              {draft.type === "articles_list" && (
                <>
                  <div className="space-y-2">
                    <FormLabel>Article source</FormLabel>
                    <Select
                      value={draft.articleFeed?.mode ?? "most_recent"}
                      onValueChange={(value) =>
                        setDraft((prev) => ({
                          ...prev!,
                          articleFeed: {
                            mode: value as (typeof articleFeedModeEnum.options)[number],
                            articleIds: prev?.articleFeed?.articleIds ?? [],
                            limit: prev?.articleFeed?.limit ?? 6,
                          },
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="most_recent">Most recent</SelectItem>
                        <SelectItem value="specific">
                          Specific articles
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {draft.articleFeed?.mode === "specific" ? (
                    <div className="space-y-2">
                      <FormLabel>Article IDs (comma-separated)</FormLabel>
                      <Input
                        value={(draft.articleFeed.articleIds ?? []).join(", ")}
                        onChange={(evt) =>
                          setDraft((prev) => ({
                            ...prev!,
                            articleFeed: {
                              mode: prev?.articleFeed?.mode ?? "specific",
                              articleIds: parseArticleIds(evt.target.value),
                              limit: prev?.articleFeed?.limit ?? 6,
                            },
                          }))
                        }
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <FormLabel>Fetched articles count</FormLabel>
                      <Input
                        type="number"
                        min={1}
                        max={24}
                        value={draft.articleFeed?.limit ?? 6}
                        onChange={(evt) =>
                          setDraft((prev) => ({
                            ...prev!,
                            articleFeed: {
                              mode: prev?.articleFeed?.mode ?? "most_recent",
                              articleIds: prev?.articleFeed?.articleIds ?? [],
                              limit: Number(evt.target.value),
                            },
                          }))
                        }
                      />
                    </div>
                  )}
                </>
              )}

              {draft.type === "scrollable_recipes" && (
                <>
                  <div className="space-y-2">
                    <FormLabel>Heading</FormLabel>
                    <Input
                      value={draft.heading ?? ""}
                      onChange={(evt) =>
                        setDraft((prev) => ({
                          ...prev!,
                          heading: evt.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <FormLabel>Subheading</FormLabel>
                    <Input
                      value={draft.subheading ?? ""}
                      onChange={(evt) =>
                        setDraft((prev) => ({
                          ...prev!,
                          subheading: evt.target.value,
                        }))
                      }
                    />
                  </div>
                </>
              )}

              {(draft.type === "recipes_list" ||
                draft.type === "articles_list") && (
                <>
                  <div className="space-y-2">
                    <FormLabel>Heading</FormLabel>
                    <Input
                      value={draft.heading ?? ""}
                      onChange={(evt) =>
                        setDraft((prev) => ({
                          ...prev!,
                          heading: evt.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <FormLabel>Subheading</FormLabel>
                    <Input
                      value={draft.subheading ?? ""}
                      onChange={(evt) =>
                        setDraft((prev) => ({
                          ...prev!,
                          subheading: evt.target.value,
                        }))
                      }
                    />
                  </div>
                </>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={saveDraft}>
              Save section
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Form>
  );
}
