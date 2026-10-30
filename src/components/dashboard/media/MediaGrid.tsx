"use client";

import { Check } from "lucide-react";
import { useState } from "react";

import { Badge, Skeleton } from "@/components/ui";
import { cn } from "@/lib/utils";

import { EmptyState, type EmptyStateProps } from "../tables/shared/EmptyState";
import { formatFileSize, formatUploadDate, type MediaItem } from "./utils";

interface MediaGridProps {
  items: MediaItem[];
  isLoading?: boolean;
  skeletonCount?: number;
  emptyState?: EmptyStateProps;
  activeKey?: string | null;
  selectedKeys?: Set<string>;
  onToggleSelect?: (item: MediaItem) => void;
  onOpen: (item: MediaItem) => void;
  className?: string;
}

const gridClassName =
  "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";

export const UsageBadge = ({ count }: { count: number }) => (
  <Badge
    className={
      count
        ? "border-success/30 bg-success/10 text-success"
        : "border-warning/30 bg-warning/10 text-warning"
    }
  >
    {count ? `Used in ${count}` : "Unused"}
  </Badge>
);

const MediaThumbnail = ({ src, alt }: { src: string; alt: string }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="bg-muted relative aspect-square overflow-hidden">
      {isLoading && <Skeleton className="absolute inset-0 rounded-none" />}
      {/** biome-ignore lint/performance/noImgElement: explanation */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={cn(
          "size-full object-cover transition-opacity duration-200",
          isLoading ? "opacity-0" : "opacity-100",
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
      />
    </div>
  );
};

const MediaTile = ({
  item,
  isActive,
  isSelected,
  onToggleSelect,
  onOpen,
}: {
  item: MediaItem;
  isActive: boolean;
  isSelected: boolean;
  onToggleSelect?: (item: MediaItem) => void;
  onOpen: (item: MediaItem) => void;
}) => {
  const isSelectable = !!onToggleSelect && item.usages.length === 0;

  return (
    <div
      className={cn(
        "bg-card group relative overflow-hidden rounded-lg border transition-shadow hover:shadow-md",
        (isActive || isSelected) && "ring-primary ring-2",
      )}
    >
      <button
        type="button"
        className="block w-full text-left focus-visible:outline-none"
        onClick={() => onOpen(item)}
        aria-label={`Open ${item.name}`}
      >
        <MediaThumbnail src={item.url} alt={item.name} />
        <div className="space-y-1.5 p-3">
          <p className="truncate text-sm font-medium" title={item.name}>
            {item.name}
          </p>
          <p className="text-muted-foreground text-xs">
            {formatFileSize(item.size)} · {formatUploadDate(item.uploadedAt)}
          </p>
          <UsageBadge count={item.usages.length} />
        </div>
      </button>
      {isSelectable && (
        <button
          type="button"
          role="checkbox"
          aria-checked={isSelected}
          aria-label={`Select ${item.name}`}
          onClick={() => onToggleSelect(item)}
          className={cn(
            "bg-card/90 absolute top-2 left-2 flex size-6 items-center justify-center rounded-md border shadow-sm transition-opacity",
            isSelected
              ? "bg-primary border-primary text-primary-foreground"
              : "opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
          )}
        >
          {isSelected && <Check className="size-4" />}
        </button>
      )}
    </div>
  );
};

export const MediaGrid = ({
  items,
  isLoading = false,
  skeletonCount = 10,
  emptyState,
  activeKey,
  selectedKeys,
  onToggleSelect,
  onOpen,
  className,
}: MediaGridProps) => {
  if (isLoading)
    return (
      <div className={cn(gridClassName, className)}>
        {Array.from({ length: skeletonCount }, (_, idx) => (
          <div key={idx} className="overflow-hidden rounded-lg border">
            <Skeleton className="aspect-square rounded-none" />
            <div className="space-y-2 p-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );

  if (!items.length) return <EmptyState {...emptyState} />;

  return (
    <div className={cn(gridClassName, className)}>
      {items.map((item) => (
        <MediaTile
          key={item.key}
          item={item}
          isActive={activeKey === item.key}
          isSelected={!!selectedKeys?.has(item.key)}
          onToggleSelect={onToggleSelect}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
};
