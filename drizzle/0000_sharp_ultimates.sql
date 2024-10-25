CREATE TYPE "public"."difficulty" AS ENUM('easy', 'medium', 'hard');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "easy-and-tasty_category" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"slug" varchar(256) NOT NULL,
	"description" varchar(256) NOT NULL,
	"featured_recipe_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "easy-and-tasty_comment_like" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"comment_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "easy-and-tasty_comment" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" varchar(256) NOT NULL,
	"user_id" integer NOT NULL,
	"reply_id" integer,
	"recipe_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "easy-and-tasty_cuisine" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"slug" varchar(256) NOT NULL,
	"description" varchar(256) NOT NULL,
	"featured_recipe_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "easy-and-tasty_recipe_category" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer NOT NULL,
	"recipe_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "easy-and-tasty_recipe_cuisine" (
	"id" serial PRIMARY KEY NOT NULL,
	"cuisine_id" integer NOT NULL,
	"recipe_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "easy-and-tasty_recipe_rating" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"recipe_id" integer NOT NULL,
	"score" smallint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "easy-and-tasty_recipe_save" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"recipe_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "easy-and-tasty_recipe" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" varchar(1024) NOT NULL,
	"difficulty" "difficulty" NOT NULL,
	"image" varchar(2048),
	"content" varchar(2048) NOT NULL,
	"servings" integer,
	"slug" varchar(256) NOT NULL,
	"time" integer,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "easy-and-tasty_user" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(256) NOT NULL,
	"last_name" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"password" varchar(256) NOT NULL,
	"image" varchar(1024),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "easy-and-tasty_category" ADD CONSTRAINT "easy-and-tasty_category_featured_recipe_id_easy-and-tasty_recipe_id_fk" FOREIGN KEY ("featured_recipe_id") REFERENCES "public"."easy-and-tasty_recipe"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "easy-and-tasty_comment_like" ADD CONSTRAINT "easy-and-tasty_comment_like_user_id_easy-and-tasty_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."easy-and-tasty_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "easy-and-tasty_comment_like" ADD CONSTRAINT "easy-and-tasty_comment_like_comment_id_easy-and-tasty_comment_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."easy-and-tasty_comment"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "easy-and-tasty_comment" ADD CONSTRAINT "easy-and-tasty_comment_user_id_easy-and-tasty_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."easy-and-tasty_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "easy-and-tasty_comment" ADD CONSTRAINT "easy-and-tasty_comment_reply_id_easy-and-tasty_comment_id_fk" FOREIGN KEY ("reply_id") REFERENCES "public"."easy-and-tasty_comment"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "easy-and-tasty_comment" ADD CONSTRAINT "easy-and-tasty_comment_recipe_id_easy-and-tasty_recipe_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."easy-and-tasty_recipe"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "easy-and-tasty_cuisine" ADD CONSTRAINT "easy-and-tasty_cuisine_featured_recipe_id_easy-and-tasty_recipe_id_fk" FOREIGN KEY ("featured_recipe_id") REFERENCES "public"."easy-and-tasty_recipe"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "easy-and-tasty_recipe_category" ADD CONSTRAINT "easy-and-tasty_recipe_category_category_id_easy-and-tasty_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."easy-and-tasty_category"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "easy-and-tasty_recipe_category" ADD CONSTRAINT "easy-and-tasty_recipe_category_recipe_id_easy-and-tasty_recipe_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."easy-and-tasty_recipe"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "easy-and-tasty_recipe_cuisine" ADD CONSTRAINT "easy-and-tasty_recipe_cuisine_cuisine_id_easy-and-tasty_cuisine_id_fk" FOREIGN KEY ("cuisine_id") REFERENCES "public"."easy-and-tasty_cuisine"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "easy-and-tasty_recipe_cuisine" ADD CONSTRAINT "easy-and-tasty_recipe_cuisine_recipe_id_easy-and-tasty_recipe_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."easy-and-tasty_recipe"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "easy-and-tasty_recipe_rating" ADD CONSTRAINT "easy-and-tasty_recipe_rating_user_id_easy-and-tasty_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."easy-and-tasty_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "easy-and-tasty_recipe_rating" ADD CONSTRAINT "easy-and-tasty_recipe_rating_recipe_id_easy-and-tasty_recipe_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."easy-and-tasty_recipe"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "easy-and-tasty_recipe_save" ADD CONSTRAINT "easy-and-tasty_recipe_save_user_id_easy-and-tasty_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."easy-and-tasty_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "easy-and-tasty_recipe_save" ADD CONSTRAINT "easy-and-tasty_recipe_save_recipe_id_easy-and-tasty_recipe_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."easy-and-tasty_recipe"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
