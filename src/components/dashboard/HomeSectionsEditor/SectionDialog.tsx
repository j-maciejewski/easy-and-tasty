import type { Dispatch, SetStateAction } from "react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { type HomeSection, homeSectionTypeEnum } from "@/constants";

import {
  ArticleFeedFields,
  BannerFields,
  CtaFields,
  HeadingFields,
  RecipeFeedFields,
  RecipeGridFields,
  RecipesGroupFields,
  TaxonomyGridFields,
} from "./editors";
import { sectionLabels } from "./helpers";
import type { SectionDraft } from "./types";

const recipeFeedTypes: HomeSection["type"][] = [
  "recipe_full_card",
  "recipe_grid",
  "recipe_carousel",
  "scrollable_recipes",
  "recipes_list",
];

const headingTypes: HomeSection["type"][] = [
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
  onTypeChange: (type: HomeSection["type"]) => void;
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
              <Label>Section type</Label>
              <Select
                value={draft.type}
                onValueChange={(value) =>
                  onTypeChange(value as HomeSection["type"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {homeSectionTypeEnum.options.map((type) => (
                    <SelectItem key={type} value={type}>
                      {sectionLabels[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
            {draft.type === "cta" && (
              <CtaFields draft={draft} setDraft={setDraft} />
            )}
            {headingTypes.includes(draft.type) && (
              <HeadingFields draft={draft} setDraft={setDraft} />
            )}
            {draft.type === "taxonomy_grid" && (
              <TaxonomyGridFields draft={draft} setDraft={setDraft} />
            )}
            {draft.type === "recipes_group" && (
              <RecipesGroupFields draft={draft} setDraft={setDraft} />
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save section</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
