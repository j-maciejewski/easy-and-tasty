import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import type { PublishStatus } from "@/utils";

interface StatusFilterProps {
  value: PublishStatus | undefined;
  onChange: (value: PublishStatus | undefined) => void;
}

export const StatusFilter = ({ value, onChange }: StatusFilterProps) => {
  return (
    <Select
      value={value ?? "all"}
      onValueChange={(next) =>
        onChange(next === "all" ? undefined : (next as PublishStatus))
      }
    >
      <SelectTrigger className="bg-card w-36" aria-label="Filter by status">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-card">
        <SelectItem value="all">All statuses</SelectItem>
        <SelectItem value="published">Published</SelectItem>
        <SelectItem value="draft">Draft</SelectItem>
      </SelectContent>
    </Select>
  );
};
