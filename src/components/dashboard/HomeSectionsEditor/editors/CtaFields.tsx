import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";

import type { DraftEditorProps } from "../types";

export const CtaFields = ({ draft, setDraft }: DraftEditorProps) => {
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
        <Label>Subtitle</Label>
        <Input
          value={draft.subtitle ?? ""}
          onChange={(evt) =>
            setDraft((prev) => ({
              ...prev!,
              subtitle: evt.target.value,
            }))
          }
        />
      </div>
      <div className="space-y-2">
        <Label>Tone</Label>
        <Select
          value={draft.tone ?? "tomato"}
          onValueChange={(value) =>
            setDraft((prev) => ({
              ...prev!,
              tone: value as "tomato" | "sage" | "amber",
            }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tomato">Tomato</SelectItem>
            <SelectItem value="sage">Sage</SelectItem>
            <SelectItem value="amber">Amber</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};
