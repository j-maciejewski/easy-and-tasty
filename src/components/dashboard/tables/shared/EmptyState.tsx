import type { LucideIcon } from "lucide-react";
import { Plus, SearchX } from "lucide-react";

import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState = ({
  icon: Icon = SearchX,
  title = "No results",
  description = "There is nothing to show here yet.",
  action,
  className,
}: EmptyStateProps) => {
  return (
    <div
      className={cn(
        "bg-card flex flex-col items-center justify-center gap-3 rounded-md border border-dashed px-6 py-16 text-center",
        className,
      )}
    >
      <div className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-full">
        <Icon className="size-6" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="text-muted-foreground max-w-sm text-sm">{description}</p>
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};

interface TableEmptyStateOptions {
  entity: string;
  entityPlural?: string;
  isFiltered: boolean;
  hasQuery?: boolean;
  onClear: () => void;
  onAdd?: () => void;
}

export const getTableEmptyState = ({
  entity,
  entityPlural = `${entity}s`,
  isFiltered,
  hasQuery = isFiltered,
  onClear,
  onAdd,
}: TableEmptyStateOptions): EmptyStateProps =>
  isFiltered
    ? {
        title: `No matching ${entityPlural}`,
        description: "Try adjusting your search or filters.",
        action: (
          <Button variant="outline" onClick={onClear}>
            {hasQuery ? "Clear search" : "Clear filters"}
          </Button>
        ),
      }
    : {
        title: `No ${entityPlural} yet`,
        description: `Get started by creating your first ${entity}.`,
        action: onAdd && (
          <Button onClick={onAdd}>
            <Plus />
            Add {entity}
          </Button>
        ),
      };
