import { Input, Label, Textarea } from "@/components/ui";

import { ImageUploadField } from "../../forms/ImageUploadField";
import type { DraftEditorProps } from "../types";

export const BannerFields = ({ draft, setDraft }: DraftEditorProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label>Title</Label>
        <Input
          value={draft.title ?? ""}
          onChange={(evt) =>
            setDraft((prev) => ({
              ...prev!,
              title: evt.target.value,
            }))
          }
        />
      </div>
      <div className="space-y-2">
        <Label>Text</Label>
        <Textarea
          value={draft.text ?? ""}
          onChange={(evt) =>
            setDraft((prev) => ({
              ...prev!,
              text: evt.target.value,
            }))
          }
        />
      </div>
      <div className="space-y-2">
        <Label>Image</Label>
        <ImageUploadField
          value={draft.image}
          onChange={(value) =>
            setDraft((prev) => ({
              ...prev!,
              image: value,
            }))
          }
          alt="banner"
          inputId="home-banner-image-input"
        />
      </div>
      <div className="space-y-2">
        <Label>Link</Label>
        <Input
          value={draft.href ?? ""}
          onChange={(evt) =>
            setDraft((prev) => ({
              ...prev!,
              href: evt.target.value,
            }))
          }
        />
      </div>
    </>
  );
};
