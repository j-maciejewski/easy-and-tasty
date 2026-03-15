ALTER TYPE "public"."staticPageType" ADD VALUE IF NOT EXISTS 'articles';
--> statement-breakpoint
INSERT INTO "easy-and-tasty_seo" ("pageType", "title", "description", "image")
VALUES ('articles', 'Articles', 'Browse our latest articles and guides.', null)
ON CONFLICT ("pageType") DO NOTHING;