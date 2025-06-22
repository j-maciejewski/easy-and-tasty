CREATE TYPE "public"."configTypeEnum" AS ENUM('header_navigation');--> statement-breakpoint
CREATE TABLE "easy-and-tasty_config" (
	"configType" "configTypeEnum" NOT NULL,
	"data" json NOT NULL,
	CONSTRAINT "easy-and-tasty_config_configType_unique" UNIQUE("configType")
);
