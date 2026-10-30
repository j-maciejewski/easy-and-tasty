import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import type { articleFeedModeEnum } from "@/constants";

import { parseIds } from "../helpers";
import type { DraftEditorProps } from "../types";

export const ArticleFeedFields = ({ draft, setDraft }: DraftEditorProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label>Article source</Label>
        <Select
          value={draft.articleFeed?.mode ?? "most_recent"}
          onValueChange={(value) =>
            setDraft((prev) => ({
              ...prev!,
              articleFeed: {
                mode: value as (typeof articleFeedModeEnum.options)[number],
                articleIds: prev?.articleFeed?.articleIds ?? [],
                limit: prev?.articleFeed?.limit ?? 6,
              },
            }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="most_recent">Most recent</SelectItem>
            <SelectItem value="specific">Specific articles</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {draft.articleFeed?.mode === "specific" ? (
        <div className="space-y-2">
          <Label>Article IDs (comma-separated)</Label>
          <Input
            value={(draft.articleFeed.articleIds ?? []).join(", ")}
            onChange={(evt) =>
              setDraft((prev) => ({
                ...prev!,
                articleFeed: {
                  mode: prev?.articleFeed?.mode ?? "specific",
                  articleIds: parseIds(evt.target.value),
                  limit: prev?.articleFeed?.limit ?? 6,
                },
              }))
            }
          />
        </div>
      ) : (
        <div className="space-y-2">
          <Label>Fetched articles count</Label>
          <Input
            type="number"
            min={1}
            max={24}
            value={draft.articleFeed?.limit ?? 6}
            onChange={(evt) =>
              setDraft((prev) => ({
                ...prev!,
                articleFeed: {
                  mode: prev?.articleFeed?.mode ?? "most_recent",
                  articleIds: prev?.articleFeed?.articleIds ?? [],
                  limit: Number(evt.target.value),
                },
              }))
            }
          />
        </div>
      )}
    </>
  );
};
