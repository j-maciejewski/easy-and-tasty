CREATE TABLE IF NOT EXISTS "easy-and-tasty_comment_like" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"comment_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "easy-and-tasty_comment" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"reply_id" integer,
	"recipe_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "easy-and-tasty_rating" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" smallint NOT NULL,
	"recipe_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "easy-and-tasty_recipe_like" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"recipe_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "easy-and-tasty_recipe_tag" (
	"id" serial PRIMARY KEY NOT NULL,
	"tag_id" integer NOT NULL,
	"recipe_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "easy-and-tasty_recipe" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"image" varchar(1024),
	"ingredients" json NOT NULL,
	"recipe" json NOT NULL,
	"description" varchar(256),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "easy-and-tasty_tag" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "easy-and-tasty_user" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(256) NOT NULL,
	"last_name" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"password" varchar(256) NOT NULL,
	"image" varchar(1024),
	"description" varchar(256),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
DROP TABLE "easy-and-tasty_post";--> statement-breakpoint
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
 ALTER TABLE "easy-and-tasty_rating" ADD CONSTRAINT "easy-and-tasty_rating_user_id_easy-and-tasty_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."easy-and-tasty_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "easy-and-tasty_rating" ADD CONSTRAINT "easy-and-tasty_rating_recipe_id_easy-and-tasty_recipe_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."easy-and-tasty_recipe"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "easy-and-tasty_recipe_like" ADD CONSTRAINT "easy-and-tasty_recipe_like_user_id_easy-and-tasty_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."easy-and-tasty_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "easy-and-tasty_recipe_like" ADD CONSTRAINT "easy-and-tasty_recipe_like_recipe_id_easy-and-tasty_recipe_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."easy-and-tasty_recipe"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "easy-and-tasty_recipe_tag" ADD CONSTRAINT "easy-and-tasty_recipe_tag_tag_id_easy-and-tasty_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."easy-and-tasty_tag"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "easy-and-tasty_recipe_tag" ADD CONSTRAINT "easy-and-tasty_recipe_tag_recipe_id_easy-and-tasty_recipe_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."easy-and-tasty_recipe"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "easy-and-tasty_recipe" ADD CONSTRAINT "easy-and-tasty_recipe_user_id_easy-and-tasty_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."easy-and-tasty_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
