-- Legacy club registry: allow shared/missing emails; keep registration number as optional unique anchor.
-- New public enrollment still requires email via zod form validation (not DB NOT NULL).

UPDATE "members" SET "primary_email" = NULL WHERE "primary_email" = '';
--> statement-breakpoint

DROP INDEX IF EXISTS "members_primary_email_uidx";
--> statement-breakpoint

ALTER TABLE "members" ALTER COLUMN "primary_email" DROP NOT NULL;
--> statement-breakpoint

ALTER TABLE "members" ADD COLUMN IF NOT EXISTS "registration_number" varchar(64);
--> statement-breakpoint

ALTER TABLE "members" ADD COLUMN IF NOT EXISTS "registered_at" timestamp with time zone;
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "members_primary_email_idx" ON "members" USING btree ("primary_email");
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "members_registration_number_uidx"
  ON "members" USING btree ("registration_number")
  WHERE "registration_number" IS NOT NULL;
