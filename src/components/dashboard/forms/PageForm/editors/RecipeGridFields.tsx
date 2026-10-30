import { FormLabel, Input } from "@/components/ui";

import type { DraftEditorProps } from "../types";

export const RecipeGridFields = ({ draft, setDraft }: DraftEditorProps) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-2">
        <FormLabel>Offset (0-5)</FormLabel>
        <Input
          type="number"
          value={draft.offset ?? 0}
          min={0}
          max={5}
          onChange={(evt) =>
            setDraft((prev) => ({
              ...prev!,
              offset: Number(evt.target.value),
            }))
          }
        />
      </div>
      <div className="space-y-2">
        <FormLabel>Limit (1-3)</FormLabel>
        <Input
          type="number"
          value={draft.limit ?? 3}
          min={1}
          max={3}
          onChange={(evt) =>
            setDraft((prev) => ({
              ...prev!,
              limit: Number(evt.target.value),
            }))
          }
        />
      </div>
    </div>
  );
};
