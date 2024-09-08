DO $$ BEGIN
 CREATE TYPE "public"."difficulty" AS ENUM('easy', 'medium', 'hard');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "easy-and-tasty_cuisine" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"slug" varchar(256) NOT NULL,
	"description" varchar(256) NOT NULL,
	"featured_recipe_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "easy-and-tasty_recipe_cuisine" (
	"id" serial PRIMARY KEY NOT NULL,
	"cuisine_id" integer NOT NULL,
	"recipe_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "easy-and-tasty_tag" RENAME TO "easy-and-tasty_category";--> statement-breakpoint
ALTER TABLE "easy-and-tasty_recipe_tag" RENAME TO "easy-and-tasty_recipe_category";--> statement-breakpoint
ALTER TABLE "easy-and-tasty_rating" RENAME TO "easy-and-tasty_recipe_rating";--> statement-breakpoint
ALTER TABLE "easy-and-tasty_recipe_category" RENAME COLUMN "tag_id" TO "category_id";--> statement-breakpoint
ALTER TABLE "easy-and-tasty_recipe" RENAME COLUMN "recipe" TO "content";--> statement-breakpoint
ALTER TABLE "easy-and-tasty_recipe_rating" DROP CONSTRAINT "easy-and-tasty_rating_user_id_easy-and-tasty_user_id_fk";
--> statement-breakpoint
ALTER TABLE "easy-and-tasty_recipe_rating" DROP CONSTRAINT "easy-and-tasty_rating_recipe_id_easy-and-tasty_recipe_id_fk";
--> statement-breakpoint
ALTER TABLE "easy-and-tasty_recipe_category" DROP CONSTRAINT "easy-and-tasty_recipe_tag_tag_id_easy-and-tasty_tag_id_fk";
--> statement-breakpoint
ALTER TABLE "easy-and-tasty_recipe_category" DROP CONSTRAINT "easy-and-tasty_recipe_tag_recipe_id_easy-and-tasty_recipe_id_fk";
--> statement-breakpoint
ALTER TABLE "easy-and-tasty_recipe" DROP CONSTRAINT "easy-and-tasty_recipe_user_id_easy-and-tasty_user_id_fk";
--> statement-breakpoint
ALTER TABLE "easy-and-tasty_recipe" ALTER COLUMN "content" SET DATA TYPE varchar(1024);--> statement-breakpoint
ALTER TABLE "easy-and-tasty_comment" ADD COLUMN "text" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "easy-and-tasty_recipe" ADD COLUMN "difficulty" "difficulty" NOT NULL;--> statement-breakpoint
ALTER TABLE "easy-and-tasty_recipe" ADD COLUMN "servings" integer;--> statement-breakpoint
ALTER TABLE "easy-and-tasty_recipe" ADD COLUMN "slug" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "easy-and-tasty_recipe" ADD COLUMN "time" integer;--> statement-breakpoint
ALTER TABLE "easy-and-tasty_category" ADD COLUMN "slug" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "easy-and-tasty_category" ADD COLUMN "description" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "easy-and-tasty_category" ADD COLUMN "featured_recipe_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "easy-and-tasty_cuisine" ADD CONSTRAINT "easy-and-tasty_cuisine_featured_recipe_id_easy-and-tasty_recipe_id_fk" FOREIGN KEY ("featured_recipe_id") REFERENCES "public"."easy-and-tasty_recipe"("id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "easy-and-tasty_category" ADD CONSTRAINT "easy-and-tasty_category_featured_recipe_id_easy-and-tasty_recipe_id_fk" FOREIGN KEY ("featured_recipe_id") REFERENCES "public"."easy-and-tasty_recipe"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "easy-and-tasty_recipe" DROP COLUMN IF EXISTS "ingredients";--> statement-breakpoint
ALTER TABLE "easy-and-tasty_recipe" DROP COLUMN IF EXISTS "user_id";