import { Badge } from "@/components/ui";

interface StatusBadgeProps {
  isPublished: boolean;
}

export const StatusBadge = ({ isPublished }: StatusBadgeProps) => {
  return (
    <Badge
      className={
        isPublished
          ? "border-success/30 bg-success/10 text-success"
          : "border-warning/30 bg-warning/10 text-warning"
      }
    >
      {isPublished ? "Published" : "Draft"}
    </Badge>
  );
};
