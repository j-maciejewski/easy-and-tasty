import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import type { taxonomyEnum } from "@/constants";

import type { DraftEditorProps } from "../types";
import { HeadingFields } from "./HeadingFields";

export const TaxonomyGridFields = ({ draft, setDraft }: DraftEditorProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label>Source</Label>
        <Select
          value={draft.taxonomy ?? "categories"}
          onValueChange={(value) =>
            setDraft((prev) => ({
              ...prev!,
              taxonomy: value as (typeof taxonomyEnum.options)[number],
            }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="categories">Categories</SelectItem>
            <SelectItem value="cuisines">Cuisines</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Items count</Label>
        <Input
          type="number"
          min={1}
          max={24}
          value={draft.limit ?? 6}
          onChange={(evt) =>
            setDraft((prev) => ({
              ...prev!,
              limit: Number(evt.target.value),
            }))
          }
        />
      </div>
      <HeadingFields draft={draft} setDraft={setDraft} />
    </>
  );
};
