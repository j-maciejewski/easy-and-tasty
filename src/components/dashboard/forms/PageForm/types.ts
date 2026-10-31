import type { Dispatch, SetStateAction } from "react";
import { z } from "zod";

import type { PageSection, pageFormSchema } from "@/constants";

export type PageFormValues = z.infer<typeof pageFormSchema>;

export type SectionDraft = {
  id: string;
  type: PageSection["type"];
  content?: string;
  title?: string;
  text?: string;
  image?: string;
  href?: string;
  offset?: number;
  limit?: number;
  heading?: string;
  subheading?: string;
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
