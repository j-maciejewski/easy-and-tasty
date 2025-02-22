CREATE TABLE "easy-and-tasty_page" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"image" varchar(2048),
	"slug" varchar(256) NOT NULL,
	"description" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone,
	"publishedAt" timestamp with time zone
);
