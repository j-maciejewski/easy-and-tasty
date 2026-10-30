import { FormLabel, Input, Textarea } from "@/components/ui";

import { ImageUploadField } from "../../ImageUploadField";
import type { DraftEditorProps } from "../types";

export const BannerFields = ({ draft, setDraft }: DraftEditorProps) => {
  return (
    <>
      <div className="space-y-2">
        <FormLabel>Title</FormLabel>
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
        <FormLabel>Text</FormLabel>
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
        <FormLabel>Image</FormLabel>
        <ImageUploadField
          value={draft.image}
          onChange={(value) =>
            setDraft((prev) => ({
              ...prev!,
              image: value,
            }))
          }
          alt="banner"
          inputId="banner-image-input"
        />
      </div>
      <div className="space-y-2">
        <FormLabel>Link</FormLabel>
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
