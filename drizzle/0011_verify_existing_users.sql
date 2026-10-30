-- Credentials sign-in now requires a confirmed email; treat accounts created before that as confirmed
UPDATE "easy-and-tasty_user" SET "emailVerified" = "created_at" WHERE "emailVerified" IS NULL;
