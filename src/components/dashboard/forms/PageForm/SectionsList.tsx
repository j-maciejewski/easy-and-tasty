import { ArrowDown, ArrowUp, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui";
import type { PageSection } from "@/constants";

import { SortableList } from "../../SortableList";
import { getSectionSummary, sectionLabels } from "./helpers";

interface SectionsListProps {
  sections: PageSection[];
  onChange: (sections: PageSection[]) => void;
  onEdit: (section: PageSection) => void;
}

export const SectionsList = ({
  sections,
  onChange,
  onEdit,
}: SectionsListProps) => {
  function moveSection(index: number, direction: "up" | "down") {
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= sections.length) return;

    const clone = [...sections];
    [clone[index], clone[nextIndex]] = [clone[nextIndex]!, clone[index]!];

    onChange(clone);
  }

  return (
    <SortableList
      items={sections}
      onReorder={onChange}
      className="space-y-2 rounded-lg border p-3"
      itemClassName="bg-card rounded-md border"
      renderItem={(section, index, dragHandle) => (
        <div className="flex items-center gap-2 px-3 py-2">
          {dragHandle}
          <div className="min-w-0 grow">
            <p className="text-sm font-medium">{sectionLabels[section.type]}</p>
            <p className="text-foreground/70 truncate text-xs">
              {getSectionSummary(section)}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={index === 0}
            onClick={() => moveSection(index, "up")}
            aria-label="Move section up"
          >
            <ArrowUp className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={index === sections.length - 1}
            onClick={() => moveSection(index, "down")}
            aria-label="Move section down"
          >
            <ArrowDown className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onEdit(section)}
            aria-label="Edit section"
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() =>
              onChange(sections.filter((item) => item.id !== section.id))
            }
            disabled={sections.length <= 1}
            aria-label="Delete section"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      )}
    />
  );
};
