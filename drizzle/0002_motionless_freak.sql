ALTER TABLE "easy-and-tasty_recipe" ALTER COLUMN "description" SET DATA TYPE varchar(1024);--> statement-breakpoint
ALTER TABLE "easy-and-tasty_recipe" ALTER COLUMN "description" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "easy-and-tasty_recipe" ADD COLUMN "title" varchar(256) NOT NULL;