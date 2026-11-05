import { FormLabel } from "@/components/ui";

import { MarkdownEditor, type MarkdownEditorMode } from "../../shared";
import type { DraftEditorProps } from "../types";

interface MarkdownFieldsProps extends DraftEditorProps {
  onModeChange?: (mode: MarkdownEditorMode) => void;
}

export const MarkdownFields = ({
  draft,
  setDraft,
  onModeChange,
}: MarkdownFieldsProps) => {
  return (
    <div className="space-y-2">
      <FormLabel>Content</FormLabel>
      <MarkdownEditor
        height="360px"
        onModeChange={onModeChange}
        value={draft.content ?? ""}
        onChange={(content) =>
          setDraft((prev) => ({
            ...prev!,
            content,
          }))
        }
      />
    </div>
  );
};
