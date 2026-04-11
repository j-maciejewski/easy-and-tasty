"use client";

import { Image as ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Skeleton } from "@/components/ui";

export interface ImageUploadPreviewProps {
  value?: string;
  alt: string;
  inputId: string;
}

export function ImageUploadPreview({
  value,
  alt,
  inputId,
}: ImageUploadPreviewProps) {
  const [isLoading, setIsLoading] = useState(Boolean(value));

  useEffect(() => {
    setIsLoading(Boolean(value));
  }, [value]);

  return (
    <label htmlFor={inputId}>
      {value ? (
        <div className="relative mt-2 flex max-h-80 cursor-pointer overflow-hidden rounded-lg border">
          {isLoading && <Skeleton className="absolute inset-0 rounded-none" />}
          {/** biome-ignore lint/performance/noImgElement: explanation */}
          <img
            src={value}
            className={`mx-auto max-h-80 object-cover transition-opacity duration-200 ${
              isLoading ? "opacity-0" : "opacity-100"
            }`}
            alt={alt}
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
          />
        </div>
      ) : (
        <div className="flex cursor-pointer flex-col items-center justify-center rounded-lg border bg-input p-5 text-foreground/50 text-sm">
          <ImageIcon className="size-14 stroke-1" />
          Click to add image
        </div>
      )}
    </label>
  );
}
