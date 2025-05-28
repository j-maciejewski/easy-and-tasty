CREATE TYPE "public"."difficulty" AS ENUM('easy', 'medium', 'hard');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('viewer', 'editor', 'admin');--> statement-breakpoint
CREATE TYPE "public"."staticPageType" AS ENUM('home', 'categories', 'cuisines', 'recipes');--> statement-breakpoint
CREATE TABLE "easy-and-tasty_account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text
);
--> statement-breakpoint
CREATE TABLE "easy-and-tasty_authenticator" (
	"credentialID" text NOT NULL,
	"userId" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"credentialPublicKey" text NOT NULL,
	"counter" integer NOT NULL,
	"credentialDeviceType" text NOT NULL,
	"credentialBackedUp" boolean NOT NULL,
	"transports" text,
	CONSTRAINT "easy-and-tasty_authenticator_credentialID_unique" UNIQUE("credentialID")
);
--> statement-breakpoint
CREATE TABLE "easy-and-tasty_category" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"slug" varchar(256) NOT NULL,
	"description" varchar(256) NOT NULL,
	CONSTRAINT "easy-and-tasty_category_name_unique" UNIQUE("name"),
	CONSTRAINT "easy-and-tasty_category_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "easy-and-tasty_comment_like" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"comment_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "easy-and-tasty_comment" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" varchar(256) NOT NULL,
	"user_id" text NOT NULL,
	"reply_id" integer,
	"recipe_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "easy-and-tasty_cuisine" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"slug" varchar(256) NOT NULL,
	"description" varchar(256) NOT NULL,
	CONSTRAINT "easy-and-tasty_cuisine_name_unique" UNIQUE("name"),
	CONSTRAINT "easy-and-tasty_cuisine_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "easy-and-tasty_page" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"image" varchar(1024),
	"slug" varchar(256) NOT NULL,
	"description" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone,
	"publishedAt" timestamp with time zone,
	CONSTRAINT "easy-and-tasty_page_title_unique" UNIQUE("title"),
	CONSTRAINT "easy-and-tasty_page_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "easy-and-tasty_recipe_bookmark" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"recipe_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "easy-and-tasty_recipe_category" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer NOT NULL,
	"recipe_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "easy-and-tasty_recipe_cuisine" (
	"id" serial PRIMARY KEY NOT NULL,
	"cuisine_id" integer NOT NULL,
	"recipe_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "easy-and-tasty_recipe_rating" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"recipe_id" integer NOT NULL,
	"score" smallint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "easy-and-tasty_recipe" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" varchar(1024) NOT NULL,
	"difficulty" "difficulty" NOT NULL,
	"image" varchar(1024) NOT NULL,
	"content" varchar(2048) NOT NULL,
	"servings" integer NOT NULL,
	"slug" varchar(256) NOT NULL,
	"time" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone,
	CONSTRAINT "easy-and-tasty_recipe_title_unique" UNIQUE("title"),
	CONSTRAINT "easy-and-tasty_recipe_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "easy-and-tasty_seo" (
	"staticPageType" "staticPageType" NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" varchar(256) NOT NULL,
	"image" varchar(1024),
	CONSTRAINT "easy-and-tasty_seo_staticPageType_unique" UNIQUE("staticPageType"),
	CONSTRAINT "easy-and-tasty_seo_title_unique" UNIQUE("title")
);
--> statement-breakpoint
CREATE TABLE "easy-and-tasty_session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "easy-and-tasty_user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" varchar(256) NOT NULL,
	"emailVerified" timestamp,
	"password" varchar(256),
	"image" varchar(1024),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone,
	"role" "role" DEFAULT 'viewer' NOT NULL,
	"preferences" varchar(512)
);
--> statement-breakpoint
CREATE TABLE "easy-and-tasty_verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "easy-and-tasty_account" ADD CONSTRAINT "easy-and-tasty_account_userId_easy-and-tasty_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."easy-and-tasty_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "easy-and-tasty_authenticator" ADD CONSTRAINT "easy-and-tasty_authenticator_userId_easy-and-tasty_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."easy-and-tasty_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "easy-and-tasty_comment_like" ADD CONSTRAINT "easy-and-tasty_comment_like_user_id_easy-and-tasty_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."easy-and-tasty_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "easy-and-tasty_comment_like" ADD CONSTRAINT "easy-and-tasty_comment_like_comment_id_easy-and-tasty_comment_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."easy-and-tasty_comment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "easy-and-tasty_comment" ADD CONSTRAINT "easy-and-tasty_comment_user_id_easy-and-tasty_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."easy-and-tasty_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "easy-and-tasty_comment" ADD CONSTRAINT "easy-and-tasty_comment_reply_id_easy-and-tasty_comment_id_fk" FOREIGN KEY ("reply_id") REFERENCES "public"."easy-and-tasty_comment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "easy-and-tasty_comment" ADD CONSTRAINT "easy-and-tasty_comment_recipe_id_easy-and-tasty_recipe_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."easy-and-tasty_recipe"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "easy-and-tasty_recipe_bookmark" ADD CONSTRAINT "easy-and-tasty_recipe_bookmark_user_id_easy-and-tasty_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."easy-and-tasty_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "easy-and-tasty_recipe_bookmark" ADD CONSTRAINT "easy-and-tasty_recipe_bookmark_recipe_id_easy-and-tasty_recipe_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."easy-and-tasty_recipe"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "easy-and-tasty_recipe_category" ADD CONSTRAINT "easy-and-tasty_recipe_category_category_id_easy-and-tasty_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."easy-and-tasty_category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "easy-and-tasty_recipe_category" ADD CONSTRAINT "easy-and-tasty_recipe_category_recipe_id_easy-and-tasty_recipe_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."easy-and-tasty_recipe"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "easy-and-tasty_recipe_cuisine" ADD CONSTRAINT "easy-and-tasty_recipe_cuisine_cuisine_id_easy-and-tasty_cuisine_id_fk" FOREIGN KEY ("cuisine_id") REFERENCES "public"."easy-and-tasty_cuisine"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "easy-and-tasty_recipe_cuisine" ADD CONSTRAINT "easy-and-tasty_recipe_cuisine_recipe_id_easy-and-tasty_recipe_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."easy-and-tasty_recipe"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "easy-and-tasty_recipe_rating" ADD CONSTRAINT "easy-and-tasty_recipe_rating_user_id_easy-and-tasty_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."easy-and-tasty_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "easy-and-tasty_recipe_rating" ADD CONSTRAINT "easy-and-tasty_recipe_rating_recipe_id_easy-and-tasty_recipe_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."easy-and-tasty_recipe"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "easy-and-tasty_session" ADD CONSTRAINT "easy-and-tasty_session_userId_easy-and-tasty_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."easy-and-tasty_user"("id") ON DELETE cascade ON UPDATE no action;