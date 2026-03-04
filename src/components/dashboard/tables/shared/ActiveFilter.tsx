import { X } from "lucide-react";

import { Badge } from "@/components/ui";

interface ActiveFilterProps {
  content: React.ReactNode;
  onClear: () => void;
}

export const ActiveFilter = ({ content, onClear }: ActiveFilterProps) => {
  return (
    <Badge
      className="cursor-pointer border-violet-500/25 bg-violet-500/15 text-violet-700 hover:bg-violet-500/25 dark:border-violet-400/30 dark:bg-violet-400/20 dark:text-violet-300 dark:hover:bg-violet-400/30"
      tabIndex={0}
      onClick={onClear}
    >
      {content} <X className="h-4 text-rose-600 dark:text-rose-300" />
    </Badge>
  );
};
