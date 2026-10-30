"use client";

import { Plus, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui";
import {
  defaultHomeSections,
  type HomeSection,
  homeSectionSchema,
} from "@/constants";
import { api } from "@/trpc/react";

import { SortableList } from "../SortableList";
import { createDefaultSection } from "./helpers";
import { SectionCard } from "./SectionCard";
import { SectionDialog } from "./SectionDialog";
import type { SectionDraft } from "./types";

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
            <h1 className="text-2xl font-semibold">Home Sections</h1>
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

      {sections.length === 0 ? (
        <p className="bg-background text-foreground/70 rounded-lg border p-4 text-sm italic">
          No sections yet. Add your first section.
        </p>
      ) : (
        <SortableList
          items={sections}
          onReorder={setSections}
          className="bg-background divide-y rounded-lg border"
          itemClassName="bg-background first:rounded-t-lg last:rounded-b-lg"
          renderItem={(section, index, dragHandle) => (
            <SectionCard
              section={section}
              isFirst={index === 0}
              isLast={index === sections.length - 1}
              dragHandle={dragHandle}
              onMoveUp={() => moveSection(index, "up")}
              onMoveDown={() => moveSection(index, "down")}
              onEdit={() => openEditDialog(section)}
              onDelete={() =>
                setSections((prev) =>
                  prev.filter((item) => item.id !== section.id),
                )
              }
            />
          )}
        />
      )}

      <Button disabled={!sectionsChanged} onClick={handleSaveSections}>
        <Save className="mr-2 size-4" />
        Save sections
      </Button>

      <SectionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        isEditing={!!editingId}
        draft={draft}
        setDraft={setDraft}
        onTypeChange={handleDraftTypeChange}
        onSave={saveDraft}
      />
    </div>
  );
}
