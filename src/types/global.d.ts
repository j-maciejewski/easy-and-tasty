import type { DefaultSession, User as TUser } from "next-auth";

import { categories, cuisines, recipes, seo } from "@/server/db/schema";

declare global {
  type Recipe = typeof recipes.$inferSelect;
  type Seo = typeof seo.$inferSelect;
  type Category = typeof categories.$inferSelect;
  type Cuisine = typeof cuisines.$inferSelect;

  type RecipeRatingOptions = {
    avgRating: number;
    ratingsCount: number;
  };

  type Navigation = {
    label: string;
    href?: string;
    sublinks?: { label: string; href: string }[];
  }[];

  type Cuisine = {
    id: number;
    name: string;
    description: string;
    slug: string;
  };

  type NavigationItem = {
    id: string;
    label: string;
    href?: string;
    children?: { id: string; label: string; href: string }[];
  };

  type DataColumn<T> = {
    label: string;
    render: (item: T) => React.ReactNode;
    sortKey?: string;
    hidden?: boolean;
  };
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string;
    } & DefaultSession["user"];
  }

  interface User extends TUser {
    id: string;
    role?: string;
    preferences?: string | null;
  }
}
