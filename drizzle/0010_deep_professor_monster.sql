ALTER TABLE "easy-and-tasty_user" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "easy-and-tasty_user" ALTER COLUMN "role" SET DEFAULT 'viewer'::text;--> statement-breakpoint
DROP TYPE "public"."role";--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('viewer', 'editor');--> statement-breakpoint
ALTER TABLE "easy-and-tasty_user" ALTER COLUMN "role" SET DEFAULT 'viewer'::"public"."role";--> statement-breakpoint
ALTER TABLE "easy-and-tasty_user" ALTER COLUMN "role" SET DATA TYPE "public"."role" USING "role"::"public"."role";