import type { DefaultSession, User as TUser } from "next-auth";

import { recipes, seo } from "@/server/db/schema";

declare global {
  type Recipe = typeof recipes.$inferSelect;
  type RecipeRatingOptions = {
    avgRating: number;
    ratingsCount: number;
  };

  type Navigation = {
    label: string;
    href?: string;
    sublinks?: { label: string; href: string }[];
  }[];

  type Seo = typeof seo.$inferSelect;

  type NavigationItem = {
    id: string;
    label: string;
    href?: string;
    children?: { id: string; label: string; href: string }[];
  };
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string;
      preferences?: { dashboard?: { formsInModals?: boolean } } | null;
    } & DefaultSession["user"];
  }

  interface User extends TUser {
    id: string;
    role?: string;
    preferences?: string | null;
  }
}
