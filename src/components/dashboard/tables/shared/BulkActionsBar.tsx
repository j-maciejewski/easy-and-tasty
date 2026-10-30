"use client";

import { ChevronDown, LucideIcon, X } from "lucide-react";
import { useState } from "react";

import { GenericConfirmModal } from "@/components/dashboard";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";
import { cn } from "@/lib/utils";

interface BulkActionBase {
  label: string;
  icon?: LucideIcon;
  variant?: "default" | "destructive";
}

interface BulkButtonAction extends BulkActionBase {
  onClick: () => void | Promise<void>;
  confirm?: { title: string; description?: string };
}

interface BulkSelectAction extends BulkActionBase {
  options: { value: number; label: string }[];
  onSelect: (value: number) => void | Promise<void>;
}

export type BulkAction = BulkButtonAction | BulkSelectAction;

interface BulkActionsBarProps {
  count: number;
  onClear: () => void;
  actions: BulkAction[];
}

export const BulkActionsBar = ({
  count,
  onClear,
  actions,
}: BulkActionsBarProps) => {
  const [isPending, setIsPending] = useState(false);
  const [confirmAction, setConfirmAction] = useState<BulkButtonAction | null>(
    null,
  );

  if (count === 0) return null;

  const run = async (callback: () => void | Promise<void>) => {
    setIsPending(true);
    try {
      await callback();
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <div
        role="toolbar"
        aria-label="Bulk actions"
        className="bg-popover text-popover-foreground sticky bottom-4 z-20 mt-4 flex flex-wrap items-center gap-2 rounded-xl border p-2 pl-4 shadow-lg"
      >
        <span className="text-sm font-medium tabular-nums" aria-live="polite">
          {count} selected
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          disabled={isPending}
          className="text-muted-foreground"
        >
          <X />
          Clear
        </Button>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {actions.map((action) => {
            const Icon = action.icon;
            const className = cn(
              action.variant === "destructive" &&
                "text-destructive hover:text-destructive",
            );

            if ("options" in action)
              return (
                <DropdownMenu key={action.label} modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isPending || action.options.length === 0}
                      className={className}
                    >
                      {Icon && <Icon />}
                      {action.label}
                      <ChevronDown className="opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="max-h-72 overflow-y-auto"
                  >
                    {action.options.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => run(() => action.onSelect(option.value))}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              );

            return (
              <Button
                key={action.label}
                variant="outline"
                size="sm"
                disabled={isPending}
                className={className}
                onClick={() =>
                  action.confirm
                    ? setConfirmAction(action)
                    : run(action.onClick)
                }
              >
                {Icon && <Icon />}
                {action.label}
              </Button>
            );
          })}
        </div>
      </div>

      {confirmAction?.confirm && (
        <GenericConfirmModal
          open
          title={confirmAction.confirm.title}
          description={confirmAction.confirm.description}
          handleClose={() => setConfirmAction(null)}
          handleConfirm={() => {
            const { onClick } = confirmAction;
            setConfirmAction(null);
            run(onClick);
          }}
        />
      )}
    </>
  );
};
