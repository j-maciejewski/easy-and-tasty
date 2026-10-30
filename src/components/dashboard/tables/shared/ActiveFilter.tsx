import { X } from "lucide-react";

import { Badge } from "@/components/ui";

interface ActiveFilterProps {
  content: React.ReactNode;
  onClear: () => void;
}

export const ActiveFilter = ({ content, onClear }: ActiveFilterProps) => {
  return (
    <Badge
      asChild
      className="border-primary/25 bg-primary/10 text-primary hover:bg-primary/15 cursor-pointer"
    >
      <button type="button" onClick={onClear} aria-label="Clear filter">
        {content} <X className="text-primary/70 h-4" />
      </button>
    </Badge>
  );
};
