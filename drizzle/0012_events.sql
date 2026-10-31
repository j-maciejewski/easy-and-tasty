CREATE TYPE "public"."event_entity_type" AS ENUM('recipe', 'article');--> statement-breakpoint
CREATE TYPE "public"."event_type" AS ENUM('view', 'engaged', 'print', 'share', 'copy', 'search');--> statement-breakpoint
CREATE TABLE "easy-and-tasty_event" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" "event_type" NOT NULL,
	"entity_type" "event_entity_type",
	"entity_id" integer,
	"user_id" text,
	"visitor_hash" varchar(64),
	"source" varchar(128),
	"meta" jsonb,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE "easy-and-tasty_event" ADD CONSTRAINT "easy-and-tasty_event_user_id_easy-and-tasty_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."easy-and-tasty_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "event_entity_idx" ON "easy-and-tasty_event" USING btree ("entity_type","entity_id","created_at");--> statement-breakpoint
CREATE INDEX "event_type_created_at_idx" ON "easy-and-tasty_event" USING btree ("type","created_at");--> statement-breakpoint
CREATE INDEX "event_user_idx" ON "easy-and-tasty_event" USING btree ("user_id","created_at");--> statement-breakpoint
-- Carry existing views over without the raw IP address and user agent
INSERT INTO "easy-and-tasty_event" ("type", "entity_type", "entity_id", "user_id", "created_at")
SELECT 'view', 'recipe', "recipe_id", "user_id", "viewed_at" FROM "easy-and-tasty_recipe_view";--> statement-breakpoint
INSERT INTO "easy-and-tasty_event" ("type", "entity_type", "entity_id", "user_id", "created_at")
SELECT 'view', 'article', "article_id", "user_id", "viewed_at" FROM "easy-and-tasty_article_view";
