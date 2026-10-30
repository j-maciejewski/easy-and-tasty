import { Input, Label } from "@/components/ui";

import type { DraftEditorProps } from "../types";

export const HeadingFields = ({ draft, setDraft }: DraftEditorProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label>Heading</Label>
        <Input
          value={draft.heading ?? ""}
          onChange={(evt) =>
            setDraft((prev) => ({
              ...prev!,
              heading: evt.target.value,
            }))
          }
        />
      </div>
      <div className="space-y-2">
        <Label>Subheading</Label>
        <Input
          value={draft.subheading ?? ""}
          onChange={(evt) =>
            setDraft((prev) => ({
              ...prev!,
              subheading: evt.target.value,
            }))
          }
        />
      </div>
    </>
  );
};
