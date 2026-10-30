"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

import { Button, FormItem, FormMessage } from "@/components/ui";
import { type PageSection, pageSectionSchema } from "@/constants";

import { FormSection } from "../shared";
import { createDefaultSection } from "./helpers";
import { SectionDialog } from "./SectionDialog";
import { SectionsList } from "./SectionsList";
import type { PageFormValues, SectionDraft } from "./types";

export const SectionsField = () => {
  const form = useFormContext<PageFormValues>();

  const [draft, setDraft] = useState<SectionDraft | null>(null);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const sections = form.watch("sections");

  function setSections(nextSections: PageSection[]) {
    form.setValue("sections", nextSections, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
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

  return (
    <FormSection
      title="Sections"
      description="Build the article body from reorderable blocks."
      action={
        <Button type="button" variant="outline" onClick={openAddDialog}>
          <Plus className="mr-2 size-4" />
          Add section
        </Button>
      }
    >
      <FormItem>
        <SectionsList
          sections={sections}
          onChange={setSections}
          onEdit={openEditDialog}
        />
        <FormMessage>{form.formState.errors.sections?.message}</FormMessage>
      </FormItem>

      <SectionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        isEditing={!!editingSectionId}
        draft={draft}
        setDraft={setDraft}
        onTypeChange={handleDraftTypeChange}
        onSave={saveDraft}
      />
    </FormSection>
  );
};
