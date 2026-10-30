import type { Dispatch, SetStateAction } from "react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormLabel,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { type PageSection, pageSectionTypeEnum } from "@/constants";

import {
  ArticleFeedFields,
  BannerFields,
  HeadingFields,
  MarkdownFields,
  RecipeFeedFields,
  RecipeGridFields,
} from "./editors";
import { sectionLabels } from "./helpers";
import type { SectionDraft } from "./types";

const recipeFeedTypes: PageSection["type"][] = [
  "recipe_full_card",
  "recipe_grid",
  "recipe_carousel",
  "scrollable_recipes",
  "recipes_list",
];

const headingTypes: PageSection["type"][] = [
  "scrollable_recipes",
  "recipes_list",
  "articles_list",
];

interface SectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  draft: SectionDraft | null;
  setDraft: Dispatch<SetStateAction<SectionDraft | null>>;
  onTypeChange: (type: PageSection["type"]) => void;
  onSave: () => void;
}

export const SectionDialog = ({
  open,
  onOpenChange,
  isEditing,
  draft,
  setDraft,
  onTypeChange,
  onSave,
}: SectionDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100%-4rem)] overflow-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit section" : "Add section"}
          </DialogTitle>
        </DialogHeader>

        {draft && (
          <div className="space-y-4">
            <div className="space-y-2">
              <FormLabel>Section type</FormLabel>
              <Select
                value={draft.type}
                onValueChange={(value) =>
                  onTypeChange(value as PageSection["type"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pageSectionTypeEnum.options.map((type) => (
                    <SelectItem key={type} value={type}>
                      {sectionLabels[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {draft.type === "markdown" && (
              <MarkdownFields draft={draft} setDraft={setDraft} />
            )}
            {draft.type === "banner" && (
              <BannerFields draft={draft} setDraft={setDraft} />
            )}
            {draft.type === "recipe_grid" && (
              <RecipeGridFields draft={draft} setDraft={setDraft} />
            )}
            {recipeFeedTypes.includes(draft.type) && (
              <RecipeFeedFields draft={draft} setDraft={setDraft} />
            )}
            {draft.type === "articles_list" && (
              <ArticleFeedFields draft={draft} setDraft={setDraft} />
            )}
            {headingTypes.includes(draft.type) && (
              <HeadingFields draft={draft} setDraft={setDraft} />
            )}
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" onClick={onSave}>
            Save section
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
