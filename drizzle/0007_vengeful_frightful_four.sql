CREATE TABLE "easy-and-tasty_recipe_view" (
	"id" serial PRIMARY KEY NOT NULL,
	"recipe_id" integer NOT NULL,
	"user_id" text,
	"viewed_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"ip_address" varchar(45),
	"user_agent" varchar(512)
);
--> statement-breakpoint
ALTER TABLE "easy-and-tasty_recipe_bookmark" ADD COLUMN "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE "easy-and-tasty_recipe_view" ADD CONSTRAINT "easy-and-tasty_recipe_view_recipe_id_easy-and-tasty_recipe_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."easy-and-tasty_recipe"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "easy-and-tasty_recipe_view" ADD CONSTRAINT "easy-and-tasty_recipe_view_user_id_easy-and-tasty_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."easy-and-tasty_user"("id") ON DELETE no action ON UPDATE no action;