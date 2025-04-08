import { recipes } from "@/server/db/schema";
import type { DefaultSession, User as TUser } from "next-auth";

declare global {
  type Prettify<T> = {
    [K in keyof T]: T[K];
  } & {};

  type Recipe = typeof recipes.$inferSelect;
  type RecipeRatingOptions = {
    avgRating: number;
    ratingsCount: number;
  };

  type Navigation = {
    links: (
      | {
          label: string;
          href: string;
        }
      | {
          label: string;
          sublinks: { label: string; href: string }[];
        }
    )[];
  };
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string;
      preferences?: string | null;
    } & DefaultSession["user"];
  }

  interface User extends TUser {
    id: string;
    role?: string;
    preferences?: string | null;
  }
}
