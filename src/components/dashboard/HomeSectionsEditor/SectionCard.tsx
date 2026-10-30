import { ArrowDown, ArrowUp, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui";
import type { HomeSection } from "@/constants";

import { getSectionSummary, sectionLabels } from "./helpers";

interface SectionCardProps {
  section: HomeSection;
  isFirst: boolean;
  isLast: boolean;
  dragHandle: React.ReactNode;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const SectionCard = ({
  section,
  isFirst,
  isLast,
  dragHandle,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDelete,
}: SectionCardProps) => {
  return (
    <div className="flex items-center gap-3 p-4">
      {dragHandle}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{sectionLabels[section.type]}</p>
        <p className="text-foreground/70 truncate text-xs">
          {getSectionSummary(section)}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          disabled={isFirst}
          onClick={onMoveUp}
          aria-label="Move section up"
        >
          <ArrowUp className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          disabled={isLast}
          onClick={onMoveDown}
          aria-label="Move section down"
        >
          <ArrowDown className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onEdit}
          aria-label="Edit section"
        >
          <Pencil className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          aria-label="Delete section"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
};
