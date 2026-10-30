"use client";

import { keepPreviousData } from "@tanstack/react-query";
import { ImageOff, Trash2 } from "lucide-react";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { PaginationContext } from "@/context";
import { api } from "@/trpc/react";
import { useDebouncedSearchQuery } from "@/utils";
import {
  type MediaFilter,
  useMediaFilter,
} from "@/utils/dashboard/useMediaFilter";

import { ErrorCatcher } from "../ErrorCatcher";
import { GenericConfirmModal } from "../modals/GenericConfirmModal";
import { Pagination } from "../Pagination";
import {
  ActiveFilter,
  getTableEmptyState,
  SearchBar,
  TableToolbar,
} from "../tables/shared";
import { MediaDetailsSheet } from "./MediaDetailsSheet";
import { MediaGrid } from "./MediaGrid";
import type { MediaItem } from "./utils";

type DeleteAction =
  | { type: "single"; item: MediaItem }
  | { type: "selected" }
  | { type: "allUnused" };

const filterLabels: Record<MediaFilter, string> = {
  all: "All files",
  used: "Used",
  unused: "Unused",
};

export const MediaLibrary = () => {
  const { query, setQuery, debouncedQuery, clearQuery } =
    useDebouncedSearchQuery();
  const { filter, setFilter, clearFilter } = useMediaFilter();
  const { pagination, setTotalItemsCount, handleChangePage } =
    use(PaginationContext)!;

  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [deleteAction, setDeleteAction] = useState<DeleteAction | null>(null);

  const utils = api.useUtils();
  const { data, isLoading, error } = api.authorized.media.getMedia.useQuery(
    {
      page: pagination.currentPage,
      limit: pagination.itemsPerPage,
      filter,
      query: debouncedQuery || undefined,
    },
    { placeholderData: keepPreviousData },
  );
  const deleteMedia = api.authorized.media.deleteMedia.useMutation();

  const items = data?.items ?? [];
  const activeItem = items.find(({ key }) => key === activeKey) ?? null;
  const unusedCount = data?.counts.unused ?? 0;

  // biome-ignore lint/correctness/useExhaustiveDependencies: explanation
  useEffect(() => {
    if (!data) return;

    setTotalItemsCount(data.total);

    if (
      pagination.currentPage > 1 &&
      (pagination.currentPage - 1) * pagination.itemsPerPage >= data.total
    )
      handleChangePage(1);
  }, [data?.total]);

  const toggleSelect = ({ key }: MediaItem) =>
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const clearFilters = () => {
    clearQuery();
    clearFilter();
  };

  const handleDelete = async (action: DeleteAction) => {
    setDeleteAction(null);

    try {
      const { deleted, skipped } = await deleteMedia.mutateAsync(
        action.type === "allUnused"
          ? { allUnused: true }
          : {
              keys:
                action.type === "single"
                  ? [action.item.key]
                  : [...selectedKeys],
            },
      );

      if (action.type === "single") setActiveKey(null);
      if (action.type !== "single") setSelectedKeys(new Set());

      await utils.authorized.media.getMedia.invalidate();

      if (deleted)
        toast.success(
          `Deleted ${deleted} ${deleted === 1 ? "file" : "files"}.`,
        );
      if (skipped)
        toast.warning(
          `Skipped ${skipped} ${skipped === 1 ? "file" : "files"} that ${skipped === 1 ? "is" : "are"} in use or no longer exist.`,
        );
      if (!deleted && !skipped) toast.info("Nothing to delete.");
    } catch (error) {
      toast.error(
        (error as Error)?.message ?? "There was an error deleting the files.",
      );
    }
  };

  const confirmContent = (() => {
    switch (deleteAction?.type) {
      case "single":
        return {
          title: "Delete file?",
          description: `"${deleteAction.item.name}" will be permanently removed from storage.`,
        };
      case "selected":
        return {
          title: `Delete ${selectedKeys.size} selected ${selectedKeys.size === 1 ? "file" : "files"}?`,
          description:
            "Files that are currently in use will be skipped. This action cannot be undone.",
        };
      case "allUnused":
        return {
          title: `Delete all ${unusedCount} unused ${unusedCount === 1 ? "file" : "files"}?`,
          description:
            "Every file not referenced by recipes, articles, SEO or page configs will be permanently removed. This action cannot be undone.",
        };
      default:
        return { title: "" };
    }
  })();

  const isFiltered = !!debouncedQuery || filter !== "all";

  return (
    <ErrorCatcher errors={[error] as (Error | null)[]}>
      <div>
        <TableToolbar
          search={
            <SearchBar
              placeholder="Search files..."
              value={query}
              onChange={setQuery}
            />
          }
          filters={
            <Select
              value={filter}
              onValueChange={(value) => setFilter(value as MediaFilter)}
            >
              <SelectTrigger
                className="bg-card w-40"
                aria-label="Filter by usage"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card">
                {(Object.keys(filterLabels) as MediaFilter[]).map((value) => (
                  <SelectItem key={value} value={value}>
                    {filterLabels[value]}
                    {data && (
                      <span className="text-muted-foreground ml-1">
                        {data.counts[value]}
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
          actions={
            <>
              {selectedKeys.size > 0 && (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedKeys(new Set())}
                  >
                    Clear selection
                  </Button>
                  <Button
                    variant="destructive"
                    disabled={deleteMedia.isPending}
                    onClick={() => setDeleteAction({ type: "selected" })}
                  >
                    <Trash2 />
                    Delete selected ({selectedKeys.size})
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                className="text-destructive hover:text-destructive"
                disabled={!unusedCount || deleteMedia.isPending}
                onClick={() => setDeleteAction({ type: "allUnused" })}
              >
                <Trash2 />
                Delete all unused{unusedCount ? ` (${unusedCount})` : ""}
              </Button>
            </>
          }
        />
        <div className="mb-6 flex flex-wrap gap-2 empty:hidden">
          {debouncedQuery && (
            <ActiveFilter
              content={<>Query: {debouncedQuery}</>}
              onClear={clearQuery}
            />
          )}
          {filter !== "all" && (
            <ActiveFilter
              content={<>Usage: {filterLabels[filter]}</>}
              onClear={clearFilter}
            />
          )}
        </div>

        <MediaGrid
          items={items}
          isLoading={isLoading}
          skeletonCount={pagination.itemsPerPage}
          activeKey={activeKey}
          selectedKeys={selectedKeys}
          onToggleSelect={toggleSelect}
          onOpen={({ key }) => setActiveKey(key)}
          emptyState={
            isFiltered
              ? getTableEmptyState({
                  entity: "file",
                  isFiltered,
                  hasQuery: !!debouncedQuery && filter === "all",
                  onClear: clearFilters,
                })
              : {
                  icon: ImageOff,
                  title: "No files yet",
                  description:
                    "Images uploaded in recipe, article and page editors will show up here.",
                }
          }
        />

        <Pagination />

        <MediaDetailsSheet
          item={activeItem}
          onClose={() => setActiveKey(null)}
          onDelete={(item) => setDeleteAction({ type: "single", item })}
        />

        <GenericConfirmModal
          open={!!deleteAction}
          title={confirmContent.title}
          description={confirmContent.description}
          confirmText="Delete"
          confirmVariant="destructive"
          handleClose={() => setDeleteAction(null)}
          handleConfirm={() => deleteAction && handleDelete(deleteAction)}
        />
      </div>
    </ErrorCatcher>
  );
};
