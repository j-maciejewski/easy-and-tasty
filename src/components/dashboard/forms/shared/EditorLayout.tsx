"use client";

import { ExternalLink, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { GenericConfirmModal } from "@/components/dashboard/modals/GenericConfirmModal";
import { StatusBadge } from "@/components/dashboard/tables/shared/StatusBadge";
import { Button } from "@/components/ui";
import { useUnsavedChangesWarning } from "@/utils";

interface EditorLayoutProps {
  title: string;
  isPublished?: boolean;
  viewHref?: string;
  isDirty: boolean;
  isSubmitting: boolean;
  submitLabel?: string;
  onCancel: () => void;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  children: React.ReactNode;
}

export const EditorLayout = ({
  title,
  isPublished,
  viewHref,
  isDirty,
  isSubmitting,
  submitLabel = "Save",
  onCancel,
  onSubmit,
  children,
}: EditorLayoutProps) => {
  const router = useRouter();
  const [pendingLeave, setPendingLeave] = useState<(() => void) | null>(null);

  useUnsavedChangesWarning(isDirty, (href) =>
    setPendingLeave(() => () => router.push(href)),
  );

  const handleCancel = () => {
    if (isDirty) setPendingLeave(() => onCancel);
    else onCancel();
  };

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <h1 className="truncate text-2xl font-semibold">{title}</h1>
            {isPublished !== undefined && (
              <StatusBadge isPublished={isPublished} />
            )}
          </div>
          {viewHref && (
            <Button asChild variant="outline" size="sm">
              <Link href={viewHref} target="_blank" rel="noopener">
                <ExternalLink />
                View on site
              </Link>
            </Button>
          )}
        </div>

        {children}

        <div className="bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky bottom-0 z-10 -mx-6 flex items-center justify-end gap-2 border-t px-6 py-4 backdrop-blur">
          {isDirty && (
            <span className="text-muted-foreground mr-auto text-sm">
              Unsaved changes
            </span>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={!isDirty || isSubmitting}>
            {isSubmitting && <LoaderCircle className="animate-spin" />}
            {submitLabel}
          </Button>
        </div>
      </form>

      <GenericConfirmModal
        title="Discard unsaved changes?"
        description="Your changes will be lost if you leave this page."
        confirmText="Discard"
        closeText="Keep editing"
        open={pendingLeave !== null}
        handleClose={() => setPendingLeave(null)}
        handleConfirm={() => {
          pendingLeave?.();
          setPendingLeave(null);
        }}
      />
    </>
  );
};
