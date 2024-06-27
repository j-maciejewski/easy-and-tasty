// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  AnyPgColumn,
  integer,
  json,
  pgTableCreator,
  serial,
  smallint,
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

export const users = createTable(
  "user",
  {
    id: serial("id").primaryKey(),
    firstName: varchar("first_name", { length: 256 }).notNull(),
    lastName: varchar("last_name", { length: 256 }).notNull(),
    email: varchar("email", { length: 256 }).notNull(),
    password: varchar("password", { length: 256 }).notNull(),
    image: varchar("image", { length: 1024 }),
    description: varchar("description", { length: 256 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }),
  },
);

export const recipes = createTable(
  "recipe",
  {
    id: serial("id").primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id),
    image: varchar("image", { length: 1024 }),
    ingredients: json('ingredients').notNull(),
    recipe: json('recipe').notNull(),
    description: varchar("description", { length: 256 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }),
  },
);

export const ratings = createTable(
  "rating",
  {
    id: serial("id").primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id),
    recipeId: integer('recipe_id').notNull().references(() => recipes.id),
    score: smallint('user_id').notNull(),
  },
);

export const comments = createTable(
  "comment",
  {
    id: serial("id").primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id),
    replyId: integer('reply_id').references((): AnyPgColumn => comments.id),
    recipeId: integer('recipe_id').notNull().references(() => recipes.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }),
  },
);

export const comment_likes = createTable(
  "comment_like",
  {
    id: serial("id").primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id),
    commentId: integer('comment_id').notNull().references(() => comments.id)
  },
);

export const recipe_likes = createTable(
  "recipe_like",
  {
    id: serial("id").primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id),
    recipeId: integer('recipe_id').notNull().references(() => recipes.id)
  },
);

export const recipe_tags = createTable(
  "recipe_tag",
  {
    id: serial("id").primaryKey(),
    tagId: integer('tag_id').notNull().references(() => tags.id),
    recipeId: integer('recipe_id').notNull().references(() => recipes.id)
  },
);

export const tags = createTable(
  "tag",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
  },
);
