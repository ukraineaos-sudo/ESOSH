-- Additive: login by username; keep email as optional contact identifier.
ALTER TABLE "admin_users" ADD COLUMN IF NOT EXISTS "username" varchar(64);
--> statement-breakpoint
ALTER TABLE "admin_users" ADD COLUMN IF NOT EXISTS "must_change_password" boolean DEFAULT false NOT NULL;
--> statement-breakpoint
-- Backfill username from email local-part; disambiguate collisions with id.
UPDATE "admin_users"
SET "username" = lower(split_part("email", '@', 1))
WHERE "username" IS NULL AND "email" IS NOT NULL AND position('@' in "email") > 1;
--> statement-breakpoint
UPDATE "admin_users"
SET "username" = 'user_' || "id"::text
WHERE "username" IS NULL OR trim("username") = '';
--> statement-breakpoint
UPDATE "admin_users" AS a
SET "username" = a."username" || '_' || a."id"::text
FROM (
  SELECT "username"
  FROM "admin_users"
  WHERE "username" IS NOT NULL
  GROUP BY "username"
  HAVING count(*) > 1
) AS dups
WHERE a."username" = dups."username"
  AND a."id" <> (
    SELECT min(b."id") FROM "admin_users" AS b WHERE b."username" = a."username"
  );
--> statement-breakpoint
ALTER TABLE "admin_users" ALTER COLUMN "username" SET NOT NULL;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "admin_users_username_uidx" ON "admin_users" USING btree ("username");
--> statement-breakpoint
-- Email becomes optional (login uses username). Drop NOT NULL if present.
ALTER TABLE "admin_users" ALTER COLUMN "email" DROP NOT NULL;
