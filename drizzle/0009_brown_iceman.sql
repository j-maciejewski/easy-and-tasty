ALTER TYPE "public"."staticPageType" ADD VALUE 'articles';--> statement-breakpoint
CREATE TABLE "easy-and-tasty_article_comment_like" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"article_comment_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "easy-and-tasty_article_comment" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" varchar(256) NOT NULL,
	"user_id" text NOT NULL,
	"article_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "easy-and-tasty_article_view" (
	"id" serial PRIMARY KEY NOT NULL,
	"article_id" integer NOT NULL,
	"user_id" text,
	"viewed_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"ip_address" varchar(45),
	"user_agent" varchar(512)
);
--> statement-breakpoint
ALTER TABLE "easy-and-tasty_page" RENAME TO "easy-and-tasty_article";--> statement-breakpoint
ALTER TABLE "easy-and-tasty_article" DROP CONSTRAINT "easy-and-tasty_page_title_unique";--> statement-breakpoint
ALTER TABLE "easy-and-tasty_article" DROP CONSTRAINT "easy-and-tasty_page_slug_unique";--> statement-breakpoint
ALTER TABLE "easy-and-tasty_article_comment_like" ADD CONSTRAINT "easy-and-tasty_article_comment_like_user_id_easy-and-tasty_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."easy-and-tasty_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "easy-and-tasty_article_comment_like" ADD CONSTRAINT "easy-and-tasty_article_comment_like_article_comment_id_easy-and-tasty_article_comment_id_fk" FOREIGN KEY ("article_comment_id") REFERENCES "public"."easy-and-tasty_article_comment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "easy-and-tasty_article_comment" ADD CONSTRAINT "easy-and-tasty_article_comment_user_id_easy-and-tasty_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."easy-and-tasty_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "easy-and-tasty_article_comment" ADD CONSTRAINT "easy-and-tasty_article_comment_article_id_easy-and-tasty_article_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."easy-and-tasty_article"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "easy-and-tasty_article_view" ADD CONSTRAINT "easy-and-tasty_article_view_article_id_easy-and-tasty_article_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."easy-and-tasty_article"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "easy-and-tasty_article_view" ADD CONSTRAINT "easy-and-tasty_article_view_user_id_easy-and-tasty_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."easy-and-tasty_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "easy-and-tasty_article" ADD CONSTRAINT "easy-and-tasty_article_title_unique" UNIQUE("title");--> statement-breakpoint
ALTER TABLE "easy-and-tasty_article" ADD CONSTRAINT "easy-and-tasty_article_slug_unique" UNIQUE("slug");