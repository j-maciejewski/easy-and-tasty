import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import type { recipeFeedModeEnum } from "@/constants";

import { parseIds } from "../helpers";
import type { DraftEditorProps } from "../types";

export const RecipeFeedFields = ({ draft, setDraft }: DraftEditorProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label>Recipe source</Label>
        <Select
          value={draft.recipeFeed?.mode ?? "random"}
          onValueChange={(value) =>
            setDraft((prev) => ({
              ...prev!,
              recipeFeed: {
                mode: value as (typeof recipeFeedModeEnum.options)[number],
                recipeIds: prev?.recipeFeed?.recipeIds ?? [],
                limit: prev?.recipeFeed?.limit ?? 6,
              },
            }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="random">Random</SelectItem>
            <SelectItem value="most_recent">Most recent</SelectItem>
            <SelectItem value="most_liked">Most liked</SelectItem>
            <SelectItem value="most_viewed">Most viewed</SelectItem>
            <SelectItem value="most_bookmarked">Most bookmarked</SelectItem>
            <SelectItem value="specific">Specific recipes</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {draft.recipeFeed?.mode === "specific" ? (
        <div className="space-y-2">
          <Label>Recipe IDs (comma-separated)</Label>
          <Input
            value={(draft.recipeFeed.recipeIds ?? []).join(", ")}
            onChange={(evt) =>
              setDraft((prev) => ({
                ...prev!,
                recipeFeed: {
                  mode: prev?.recipeFeed?.mode ?? "specific",
                  recipeIds: parseIds(evt.target.value),
                  limit: prev?.recipeFeed?.limit ?? 6,
                },
              }))
            }
          />
        </div>
      ) : (
        <div className="space-y-2">
          <Label>Fetched recipes count</Label>
          <Input
            type="number"
            min={1}
            max={24}
            value={draft.recipeFeed?.limit ?? 6}
            onChange={(evt) =>
              setDraft((prev) => ({
                ...prev!,
                recipeFeed: {
                  mode: prev?.recipeFeed?.mode ?? "random",
                  recipeIds: prev?.recipeFeed?.recipeIds ?? [],
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
