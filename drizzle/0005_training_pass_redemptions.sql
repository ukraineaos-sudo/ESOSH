CREATE TABLE IF NOT EXISTS "training_pass_redemptions" (
  "jti" varchar(64) PRIMARY KEY NOT NULL,
  "course_slug" varchar(128) NOT NULL,
  "participant_name" varchar(200) NOT NULL,
  "certificate_id" integer,
  "redeemed_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "training_pass_redemptions_slug_idx" ON "training_pass_redemptions" ("course_slug");
