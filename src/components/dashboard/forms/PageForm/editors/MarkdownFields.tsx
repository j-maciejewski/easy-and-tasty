import { FormLabel, Textarea } from "@/components/ui";

import type { DraftEditorProps } from "../types";

export const MarkdownFields = ({ draft, setDraft }: DraftEditorProps) => {
  return (
    <div className="space-y-2">
      <FormLabel>Content</FormLabel>
      <Textarea
        className="min-h-48"
        value={draft.content ?? ""}
        onChange={(evt) =>
          setDraft((prev) => ({
            ...prev!,
            content: evt.target.value,
          }))
        }
      />
    </div>
  );
};
