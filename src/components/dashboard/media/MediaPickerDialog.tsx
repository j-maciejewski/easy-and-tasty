"use client";

import { keepPreviousData } from "@tanstack/react-query";
import { ImageOff } from "lucide-react";
import { useEffect, useState } from "react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { api } from "@/trpc/react";

import { SearchBar } from "../tables/shared/SearchBar";
import { MediaGrid } from "./MediaGrid";

const PAGE_SIZE = 20;

interface MediaPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
}

export const MediaPickerDialog = ({
  open,
  onOpenChange,
  onSelect,
}: MediaPickerDialogProps) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim());
      setLimit(PAGE_SIZE);
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  const { data, isLoading, isFetching } =
    api.authorized.media.getMedia.useQuery(
      { page: 1, limit, query: debouncedQuery || undefined },
      { enabled: open, placeholderData: keepPreviousData },
    );

  const items = data?.items ?? [];
  const activeKey = items.find(({ url }) => url === selectedUrl)?.key ?? null;

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) setSelectedUrl(null);
    onOpenChange(isOpen);
  };

  const handleConfirm = () => {
    if (!selectedUrl) return;

    onSelect(selectedUrl);
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[calc(100%-4rem)] flex-col sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Media library</DialogTitle>
          <DialogDescription>
            Pick a previously uploaded image.
          </DialogDescription>
        </DialogHeader>
        <SearchBar
          placeholder="Search files..."
          value={query}
          onChange={setQuery}
        />
        <div className="-mx-1 min-h-0 flex-1 overflow-y-auto px-1 py-1">
          <MediaGrid
            items={items}
            isLoading={isLoading}
            activeKey={activeKey}
            onOpen={({ url }) => setSelectedUrl(url)}
            emptyState={
              debouncedQuery
                ? {
                    title: "No matching files",
                    description: "Try a different search.",
                    action: (
                      <Button variant="outline" onClick={() => setQuery("")}>
                        Clear search
                      </Button>
                    ),
                  }
                : {
                    icon: ImageOff,
                    title: "No files yet",
                    description: "Upload an image to get started.",
                  }
            }
          />
          {data && data.total > items.length && (
            <div className="mt-4 flex justify-center">
              <Button
                variant="outline"
                disabled={isFetching}
                onClick={() => setLimit((prev) => prev + PAGE_SIZE)}
              >
                {isFetching ? "Loading..." : "Load more"}
              </Button>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={!selectedUrl} onClick={handleConfirm}>
            Use image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
