ALTER TABLE "easy-and-tasty_comment" DROP CONSTRAINT "easy-and-tasty_comment_reply_id_easy-and-tasty_comment_id_fk";
--> statement-breakpoint
ALTER TABLE "easy-and-tasty_comment" DROP COLUMN "reply_id";