"use client";

import { Copy, ExternalLink, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui";

import { UsageBadge } from "./MediaGrid";
import {
  formatFileSize,
  formatUploadDate,
  getUsageHref,
  type MediaItem,
} from "./utils";

const usageTypeLabels = {
  recipe: "Recipe",
  article: "Article",
  seo: "SEO",
  config: "Config",
} as const;

interface MediaDetailsSheetProps {
  item: MediaItem | null;
  onClose: () => void;
  onDelete: (item: MediaItem) => void;
}

export const MediaDetailsSheet = ({
  item,
  onClose,
  onDelete,
}: MediaDetailsSheetProps) => {
  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL copied to clipboard.");
    } catch {
      toast.error("Could not copy the URL.");
    }
  };

  const isUsed = !!item?.usages.length;

  return (
    <Sheet open={!!item} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full gap-0 overflow-y-auto sm:max-w-md">
        {item && (
          <>
            <SheetHeader className="pr-10">
              <SheetTitle className="break-all">{item.name}</SheetTitle>
              <SheetDescription>
                Uploaded {formatUploadDate(item.uploadedAt)}
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-6 px-4 pb-4">
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="bg-muted block overflow-hidden rounded-lg border"
              >
                {/** biome-ignore lint/performance/noImgElement: explanation */}
                <img
                  src={item.url}
                  alt={item.name}
                  className="mx-auto max-h-96 object-contain"
                />
              </a>

              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                <dt className="text-muted-foreground">Size</dt>
                <dd>{formatFileSize(item.size)}</dd>
                <dt className="text-muted-foreground">Uploaded</dt>
                <dd>{item.uploadedAt.toLocaleString()}</dd>
                <dt className="text-muted-foreground">Key</dt>
                <dd className="font-mono text-xs break-all">{item.key}</dd>
                <dt className="text-muted-foreground">Status</dt>
                <dd>
                  <UsageBadge count={item.usages.length} />
                </dd>
              </dl>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleCopyUrl(item.url)}
                >
                  <Copy />
                  Copy URL
                </Button>
                <Button variant="outline" asChild>
                  <a href={item.url} target="_blank" rel="noreferrer">
                    <ExternalLink />
                    Open
                  </a>
                </Button>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Used in</h3>
                {isUsed ? (
                  <ul className="divide-y rounded-lg border">
                    {item.usages.map((usage) => (
                      <li key={`${usage.type}-${usage.id}`}>
                        <Link
                          href={getUsageHref(usage)}
                          className="hover:bg-muted/50 flex items-center justify-between gap-3 px-3 py-2 text-sm transition-colors"
                        >
                          <span className="truncate">{usage.title}</span>
                          <span className="text-muted-foreground shrink-0 text-xs">
                            {usageTypeLabels[usage.type]}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    This file isn't referenced anywhere.
                  </p>
                )}
              </div>
            </div>
            <SheetFooter>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span tabIndex={isUsed ? 0 : -1}>
                    <Button
                      variant="destructive"
                      className="w-full"
                      disabled={isUsed}
                      onClick={() => onDelete(item)}
                    >
                      <Trash2 />
                      Delete
                    </Button>
                  </span>
                </TooltipTrigger>
                {isUsed && (
                  <TooltipContent>
                    Remove this image from everything that uses it first.
                  </TooltipContent>
                )}
              </Tooltip>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
