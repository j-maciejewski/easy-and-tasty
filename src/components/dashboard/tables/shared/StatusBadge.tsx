import { Badge } from "@/components/ui";

interface StatusBadgeProps {
  isPublished: boolean;
}

export const StatusBadge = ({ isPublished }: StatusBadgeProps) => {
  return (
    <Badge
      className={
        isPublished
          ? "border-emerald-700 bg-emerald-700 text-white"
          : "border-orange-700 bg-orange-700 text-white"
      }
    >
      {isPublished ? "Published" : "Draft"}
    </Badge>
  );
};
