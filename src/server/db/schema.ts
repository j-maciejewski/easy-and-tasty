// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  type AnyPgColumn,
  boolean,
  integer,
  pgEnum,
  pgTableCreator,
  primaryKey,
  serial,
  smallint,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `easy-and-tasty_${name}`);

export const roleEnum = pgEnum("role", ["viewer", "editor", "admin"]);

export const users = createTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: varchar("email", { length: 256 }).notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  password: varchar("password", { length: 256 }),
  image: varchar("image", { length: 1024 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }),
  role: roleEnum("role").default("viewer").notNull(),
  preferences: varchar("preferences", { length: 512 }),
});

export const difficultyEnum = pgEnum("difficulty", ["easy", "medium", "hard"]);

export const recipes = createTable("recipe", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 256 }).notNull().unique(),
  description: varchar("description", { length: 1024 }).notNull(),
  difficulty: difficultyEnum("difficulty").notNull(),
  image: varchar("image", { length: 1024 }).notNull(),
  content: varchar("content", { length: 8192 }).notNull(),
  servings: integer("servings").notNull(), // 1, 2, 3 and so
  slug: varchar("slug", { length: 256 }).notNull().unique(),
  time: integer("time").notNull(), // in minutes
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }),
});

export const recipe_ratings = createTable("recipe_rating", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  recipeId: integer("recipe_id")
    .notNull()
    .references(() => recipes.id),
  score: smallint("score").notNull(),
});

export const comments = createTable("comment", {
  id: serial("id").primaryKey(),
  text: varchar("text", { length: 256 }).notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  replyId: integer("reply_id").references((): AnyPgColumn => comments.id),
  recipeId: integer("recipe_id")
    .notNull()
    .references(() => recipes.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }),
});

export const comment_likes = createTable("comment_like", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  commentId: integer("comment_id")
    .notNull()
    .references(() => comments.id),
});

export const recipe_bookmarks = createTable("recipe_bookmark", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  recipeId: integer("recipe_id")
    .notNull()
    .references(() => recipes.id),
});

export const recipe_categories = createTable("recipe_category", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id),
  recipeId: integer("recipe_id")
    .notNull()
    .references(() => recipes.id),
});

export const recipe_cuisines = createTable("recipe_cuisine", {
  id: serial("id").primaryKey(),
  cuisineId: integer("cuisine_id")
    .notNull()
    .references(() => cuisines.id),
  recipeId: integer("recipe_id")
    .notNull()
    .references(() => recipes.id),
});

export const categories = createTable("category", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull().unique(),
  slug: varchar("slug", { length: 256 }).notNull().unique(),
  description: varchar("description", { length: 256 }).notNull(),
});

export const cuisines = createTable("cuisine", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull().unique(),
  slug: varchar("slug", { length: 256 }).notNull().unique(),
  description: varchar("description", { length: 256 }).notNull(),
});

export const pages = createTable("page", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 256 }).notNull().unique(),
  image: varchar("image", { length: 1024 }),
  slug: varchar("slug", { length: 256 }).notNull().unique(),
  description: varchar("description", { length: 256 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }),
  publishedAt: timestamp("publishedAt", { withTimezone: true }),
});

export const staticPageTypeEnum = pgEnum("staticPageType", [
  "home",
  "categories",
  "cuisines",
  "recipes",
]);

export const seo = createTable("seo", {
  pageType: staticPageTypeEnum("staticPageType").notNull().unique(),
  title: varchar("title", { length: 256 }).notNull().unique(),
  description: varchar("description", { length: 256 }).notNull(),
  image: varchar("image", { length: 1024 }),
});

export const accounts = createTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ],
);

export const sessions = createTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { withTimezone: true }).notNull(),
});

export const verificationTokens = createTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { withTimezone: true }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ],
);

export const authenticators = createTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ],
);
