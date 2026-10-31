import type { Dispatch, SetStateAction } from "react";

import type { HomeSection } from "@/constants";

export type SectionDraft = {
  id: string;
  type: HomeSection["type"];
  title?: string;
  text?: string;
  image?: string;
  href?: string;
  offset?: number;
  limit?: number;
  subtitle?: string;
  tone?: "tomato" | "sage" | "amber";
  heading?: string;
  subheading?: string;
  taxonomy?: "categories" | "cuisines";
  slug?: string;
  recipeFeed?: {
    mode:
      | "random"
      | "most_recent"
      | "most_liked"
      | "most_viewed"
      | "most_bookmarked"
      | "trending"
      | "specific";
    recipeIds: number[];
    limit: number;
  };
  articleFeed?: {
    mode: "most_recent" | "specific";
    articleIds: number[];
    limit: number;
  };
};

export interface DraftEditorProps {
  draft: SectionDraft;
  setDraft: Dispatch<SetStateAction<SectionDraft | null>>;
}
