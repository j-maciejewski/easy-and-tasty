import { Badge } from "@/components/ui";

interface StatusBadgeProps {
  isPublished: boolean;
}

export const StatusBadge = ({ isPublished }: StatusBadgeProps) => {
  return (
    <Badge
      className={
        isPublished
          ? "border-emerald-500/25 bg-emerald-500/15 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/20 dark:text-emerald-300"
          : "border-orange-500/25 bg-orange-500/15 text-orange-700 dark:border-orange-400/30 dark:bg-orange-400/20 dark:text-orange-300"
      }
    >
      {isPublished ? "Published" : "Draft"}
    </Badge>
  );
};
