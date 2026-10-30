"use client";

import { ImagePlus, Upload } from "lucide-react";
import { useState } from "react";

import { Button, Input } from "@/components/ui";

import { MediaPickerDialog } from "../media/MediaPickerDialog";
import { ImageUploadPreview } from "./ImageUploadPreview";

const allowedTypes = ["image/png", "image/jpeg"];

type UploadResponse =
  | {
      data: {
        name: string;
        url: string;
      };
      error: null;
    }
  | { data: null; error: string };

export interface ImageUploadFieldProps {
  value?: string;
  onChange: (value: string) => void;
  alt: string;
  inputId: string;
}

export function ImageUploadField({
  value,
  onChange,
  alt,
  inputId,
}: ImageUploadFieldProps) {
  const [isLibraryOpen, setLibraryOpen] = useState(false);

  async function handleUpload(evt: React.ChangeEvent<HTMLInputElement>) {
    const file = evt.target.files?.[0];

    if (!file || !allowedTypes.includes(file.type)) return;

    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const message = (await response.json()) as UploadResponse;

    if (message.data) {
      onChange(message.data.url);
    } else {
      console.log(message.error);
    }
  }

  return (
    <>
      <ImageUploadPreview value={value} alt={alt} inputId={inputId} />
      <Input
        id={inputId}
        type="file"
        accept="image/png, image/jpeg"
        className="hidden"
        onChange={handleUpload}
      />
      <div className="mt-2 flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" asChild>
          <label htmlFor={inputId} className="cursor-pointer">
            <Upload />
            Upload
          </label>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setLibraryOpen(true)}
        >
          <ImagePlus />
          Choose from library
        </Button>
      </div>
      <MediaPickerDialog
        open={isLibraryOpen}
        onOpenChange={setLibraryOpen}
        onSelect={onChange}
      />
    </>
  );
}
