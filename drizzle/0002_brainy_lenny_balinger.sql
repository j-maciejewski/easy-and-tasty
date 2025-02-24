ALTER TABLE "easy-and-tasty_category" DROP CONSTRAINT "easy-and-tasty_category_featured_recipe_id_easy-and-tasty_recipe_id_fk";
--> statement-breakpoint
ALTER TABLE "easy-and-tasty_cuisine" DROP CONSTRAINT "easy-and-tasty_cuisine_featured_recipe_id_easy-and-tasty_recipe_id_fk";
--> statement-breakpoint
ALTER TABLE "easy-and-tasty_recipe" ALTER COLUMN "image" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "easy-and-tasty_category" DROP COLUMN "featured_recipe_id";--> statement-breakpoint
ALTER TABLE "easy-and-tasty_cuisine" DROP COLUMN "featured_recipe_id";--> statement-breakpoint
ALTER TABLE "easy-and-tasty_category" ADD CONSTRAINT "easy-and-tasty_category_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "easy-and-tasty_category" ADD CONSTRAINT "easy-and-tasty_category_slug_unique" UNIQUE("slug");--> statement-breakpoint
ALTER TABLE "easy-and-tasty_cuisine" ADD CONSTRAINT "easy-and-tasty_cuisine_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "easy-and-tasty_cuisine" ADD CONSTRAINT "easy-and-tasty_cuisine_slug_unique" UNIQUE("slug");--> statement-breakpoint
ALTER TABLE "easy-and-tasty_page" ADD CONSTRAINT "easy-and-tasty_page_title_unique" UNIQUE("title");--> statement-breakpoint
ALTER TABLE "easy-and-tasty_page" ADD CONSTRAINT "easy-and-tasty_page_slug_unique" UNIQUE("slug");--> statement-breakpoint
ALTER TABLE "easy-and-tasty_recipe" ADD CONSTRAINT "easy-and-tasty_recipe_title_unique" UNIQUE("title");--> statement-breakpoint
ALTER TABLE "easy-and-tasty_recipe" ADD CONSTRAINT "easy-and-tasty_recipe_slug_unique" UNIQUE("slug");