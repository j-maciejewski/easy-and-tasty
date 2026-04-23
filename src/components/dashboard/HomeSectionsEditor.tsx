"use client";

import {
  ArrowDown,
  ArrowUp,
  GripVertical,
  Pencil,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Textarea,
} from "@/components/ui";
import {
  articleFeedModeEnum,
  defaultHomeSections,
  type HomeSection,
  homeSectionSchema,
  homeSectionTypeEnum,
  recipeFeedModeEnum,
} from "@/constants";
import { api } from "@/trpc/react";

import { ImageUploadField } from "./forms/ImageUploadField";

type SectionDraft = {
  id: string;
  type: HomeSection["type"];
  title?: string;
  text?: string;
  image?: string;
  href?: string;
  offset?: number;
  limit?: number;
  subtitle?: string;
  tone?: "tomato" | "sage" | "amber";
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

const sectionLabels: Record<HomeSection["type"], string> = {
  banner: "Banner",
  recipe_full_card: "Recipe Full Card",
  recipe_grid: "Recipe Grid",
  recipe_carousel: "Recipe Carousel",
  articles_list: "Articles List",
  cta: "Call To Action",
  scrollable_recipes: "Scrollable Recipes",
  separator: "Separator",
  recipes_list: "Recipes List",
};

function createDefaultSection(type: HomeSection["type"]): HomeSection {
  const id = crypto.randomUUID();

  switch (type) {
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
        offset: 1,
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
    case "cta":
      return {
        id,
        type,
        title: "Explore more recipes",
        subtitle: "Find your next favorite dish",
        tone: "tomato",
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
    case "separator":
      return {
        id,
        type,
      };
    case "recipes_list":
      return {
        id,
        type,
        heading: "All recipes",
        subheading: "Browse every recipe in one place",
        recipeFeed: {
          mode: "random",
          recipeIds: [],
          limit: 6,
        },
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

function getSectionSummary(section: HomeSection) {
  switch (section.type) {
    case "banner":
      return `${section.title} -> ${section.href}`;
    case "recipe_full_card":
      return `${section.recipeFeed?.mode ?? "random"} | Full cards from fetched recipes`;
    case "recipe_grid":
      return `${section.recipeFeed?.mode ?? "random"} | From index ${section.offset}, show ${section.limit}`;
    case "recipe_carousel":
      return `${section.recipeFeed?.mode ?? "random"} | Featured recipes carousel`;
    case "articles_list":
      return `${section.articleFeed?.mode ?? "most_recent"} | ${section.heading}`;
    case "cta":
      return `${section.title} (${section.tone})`;
    case "scrollable_recipes":
      return `${section.recipeFeed?.mode ?? "random"} | ${section.heading}`;
    case "separator":
      return "Horizontal divider";
    case "recipes_list":
      return `${section.recipeFeed?.mode ?? "random"} | ${section.heading}`;
  }
}

export namespace HomeSectionsEditor {
  export interface Props {
    inModal?: boolean;
  }
}

export function HomeSectionsEditor({ inModal }: HomeSectionsEditor.Props) {
  const { data, isLoading } = api.authorized.home.getSections.useQuery();
  const updateSections = api.authorized.home.updateSections.useMutation();

  const sourceSections = useMemo(() => data ?? defaultHomeSections, [data]);
  const [sections, setSections] = useState<HomeSection[]>(sourceSections);

  const [draft, setDraft] = useState<SectionDraft | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draggedSectionId, setDraggedSectionId] = useState<string | null>(null);

  const sectionsChanged =
    JSON.stringify(sourceSections) !== JSON.stringify(sections);

  useEffect(() => {
    setSections(sourceSections);
  }, [sourceSections]);

  function moveSection(index: number, direction: "up" | "down") {
    setSections((prev) => {
      const nextIndex = direction === "up" ? index - 1 : index + 1;
      if (nextIndex < 0 || nextIndex >= prev.length) return prev;

      const clone = [...prev];
      [clone[index], clone[nextIndex]] = [clone[nextIndex]!, clone[index]!];

      return clone;
    });
  }

  function moveSectionById(sourceId: string, targetId: string) {
    if (sourceId === targetId) return;

    setSections((prev) => {
      const sourceIndex = prev.findIndex(({ id }) => id === sourceId);
      const targetIndex = prev.findIndex(({ id }) => id === targetId);

      if (sourceIndex < 0 || targetIndex < 0) return prev;

      const clone = [...prev];
      const [moved] = clone.splice(sourceIndex, 1);
      if (!moved) return prev;
      clone.splice(targetIndex, 0, moved);

      return clone;
    });
  }

  function openAddDialog() {
    const defaultSection = createDefaultSection("banner");
    setDraft(defaultSection);
    setEditingId(null);
    setDialogOpen(true);
  }

  function openEditDialog(section: HomeSection) {
    setDraft({ ...section });
    setEditingId(section.id);
    setDialogOpen(true);
  }

  function handleDraftTypeChange(type: HomeSection["type"]) {
    if (!draft) return;

    const newSection = createDefaultSection(type);
    setDraft({ ...newSection, id: draft.id });
  }

  function saveDraft() {
    if (!draft) return;

    const parsed = homeSectionSchema.safeParse(draft);

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid section data.");
      return;
    }

    const section = parsed.data;

    setSections((prev) => {
      if (editingId) {
        return prev.map((item) => (item.id === editingId ? section : item));
      }

      return [...prev, section];
    });

    setDialogOpen(false);
    setEditingId(null);
    setDraft(null);
  }

  async function handleSaveSections() {
    try {
      await updateSections.mutateAsync(sections);
      toast.success("Home sections saved.");
    } catch (error) {
      toast.error((error as Error).message ?? "Failed to save sections.");
    }
  }

  if (isLoading) return "Loading...";

  return (
    <div className="space-y-4">
      {!inModal && (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-2xl">Home Sections</h1>
            <p className="text-foreground/70 text-sm">
              Build the homepage by combining banners, cards, carousels, and
              other section blocks.
            </p>
          </div>
          <Button variant="outline" onClick={openAddDialog}>
            <Plus className="mr-2 size-4" />
            Add section
          </Button>
        </div>
      )}

      {inModal && (
        <div className="flex justify-end">
          <Button variant="outline" onClick={openAddDialog}>
            <Plus className="mr-2 size-4" />
            Add section
          </Button>
        </div>
      )}

      <div className="rounded-lg border bg-background">
        {sections.length === 0 ? (
          <p className="p-4 text-foreground/70 text-sm italic">
            No sections yet. Add your first section.
          </p>
        ) : (
          sections.map((section, index) => (
            <div key={section.id}>
              <div className="flex items-center gap-3 p-4">
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
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm">
                    {sectionLabels[section.type]}
                  </p>
                  <p className="truncate text-foreground/70 text-xs">
                    {getSectionSummary(section)}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={index === 0}
                    onClick={() => moveSection(index, "up")}
                    aria-label="Move section up"
                  >
                    <ArrowUp className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={index === sections.length - 1}
                    onClick={() => moveSection(index, "down")}
                    aria-label="Move section down"
                  >
                    <ArrowDown className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(section)}
                    aria-label="Edit section"
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setSections((prev) =>
                        prev.filter((item) => item.id !== section.id),
                      )
                    }
                    aria-label="Delete section"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
              {index !== sections.length - 1 && <Separator />}
            </div>
          ))
        )}
      </div>

      <Button disabled={!sectionsChanged} onClick={handleSaveSections}>
        <Save className="mr-2 size-4" />
        Save sections
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[calc(100%-4rem)] overflow-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit section" : "Add section"}
            </DialogTitle>
          </DialogHeader>

          {draft && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Section type</Label>
                <Select
                  value={draft.type}
                  onValueChange={(value) =>
                    handleDraftTypeChange(value as HomeSection["type"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {homeSectionTypeEnum.options.map((type) => (
                      <SelectItem key={type} value={type}>
                        {sectionLabels[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {draft.type === "banner" && (
                <>
                  <div className="space-y-2">
                    <Label>Title</Label>
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
                    <Label>Text</Label>
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
                    <Label>Image</Label>
                    <ImageUploadField
                      value={draft.image}
                      onChange={(value) =>
                        setDraft((prev) => ({
                          ...prev!,
                          image: value,
                        }))
                      }
                      alt="banner"
                      inputId="home-banner-image-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Link</Label>
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
                    <Label>Recipe source</Label>
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
                      <Label>Recipe IDs (comma-separated)</Label>
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
                      <Label>Fetched recipes count</Label>
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
                      <Label>Offset (0-5)</Label>
                      <Input
                        type="number"
                        value={draft.offset ?? 1}
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
                      <Label>Limit (1-3)</Label>
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
                    <Label>Recipe source</Label>
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
                      <Label>Recipe IDs (comma-separated)</Label>
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
                      <Label>Fetched recipes count</Label>
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
                    <Label>Recipe source</Label>
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
                      <Label>Recipe IDs (comma-separated)</Label>
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
                      <Label>Fetched recipes count</Label>
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
                    <Label>Article source</Label>
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
                      <Label>Article IDs (comma-separated)</Label>
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
                      <Label>Fetched articles count</Label>
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

              {draft.type === "cta" && (
                <>
                  <div className="space-y-2">
                    <Label>Title</Label>
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
                    <Label>Subtitle</Label>
                    <Input
                      value={draft.subtitle ?? ""}
                      onChange={(evt) =>
                        setDraft((prev) => ({
                          ...prev!,
                          subtitle: evt.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tone</Label>
                    <Select
                      value={draft.tone ?? "tomato"}
                      onValueChange={(value) =>
                        setDraft((prev) => ({
                          ...prev!,
                          tone: value as "tomato" | "sage" | "amber",
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tomato">Tomato</SelectItem>
                        <SelectItem value="sage">Sage</SelectItem>
                        <SelectItem value="amber">Amber</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {draft.type === "scrollable_recipes" && (
                <>
                  <div className="space-y-2">
                    <Label>Heading</Label>
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
                    <Label>Subheading</Label>
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
                    <Label>Heading</Label>
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
                    <Label>Subheading</Label>
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
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveDraft}>Save section</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
