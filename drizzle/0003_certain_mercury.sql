ALTER TABLE "easy-and-tasty_page" ALTER COLUMN "description" SET DATA TYPE varchar(1024);--> statement-breakpoint
ALTER TABLE "easy-and-tasty_page" ADD COLUMN "content" varchar(8192) NOT NULL;