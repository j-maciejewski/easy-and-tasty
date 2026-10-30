import {
  Badge,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui";

interface BadgeListProps {
  items: { id: React.Key; label: React.ReactNode }[];
  max?: number;
  badgeClassName?: string;
}

export const BadgeList = ({
  items,
  max = 2,
  badgeClassName,
}: BadgeListProps) => {
  const visible = items.slice(0, max);
  const rest = items.slice(max);

  return (
    <div className="inline-flex items-center gap-1.5">
      {visible.map(({ id, label }) => (
        <Badge key={id} className={badgeClassName}>
          {label}
        </Badge>
      ))}
      {rest.length > 0 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant="outline"
              tabIndex={0}
              className="text-muted-foreground cursor-default"
              aria-label={`${rest.length} more`}
            >
              +{rest.length}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <ul>
              {rest.map(({ id, label }) => (
                <li key={id}>{label}</li>
              ))}
            </ul>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};
