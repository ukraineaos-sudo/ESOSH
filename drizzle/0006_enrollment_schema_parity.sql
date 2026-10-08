-- Parity: bring migrate-path DB in line with src/db/schema.ts enrollment/leadership tables.
-- Idempotent for DBs already synced via db:push (IF NOT EXISTS / ADD COLUMN IF NOT EXISTS).

CREATE TABLE IF NOT EXISTS "leadership_people" (
  "id" serial PRIMARY KEY NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "photo_url" text DEFAULT '' NOT NULL,
  "photo_class" varchar(128) DEFAULT '' NOT NULL,
  "name_uk" text DEFAULT '' NOT NULL,
  "name_en" text DEFAULT '' NOT NULL,
  "role_uk" text DEFAULT '' NOT NULL,
  "role_en" text DEFAULT '' NOT NULL,
  "status" varchar(32) DEFAULT 'published' NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "locale" varchar(8) DEFAULT 'uk' NOT NULL;
--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "requires_manual_review" boolean DEFAULT false NOT NULL;
--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "auto_level_rules" jsonb DEFAULT '[]'::jsonb NOT NULL;
--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "consent_version" varchar(32) DEFAULT '1.0' NOT NULL;
--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "test_score" integer;
--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "test_passed_at" timestamp with time zone;
--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "idempotency_key" varchar(64);
--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "decided_by" integer;
--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "decided_at" timestamp with time zone;
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "applications_idempotency_uidx" ON "applications" USING btree ("idempotency_key");
--> statement-breakpoint

DO $$ BEGIN
  ALTER TABLE "applications"
    ADD CONSTRAINT "applications_decided_by_admin_users_id_fk"
    FOREIGN KEY ("decided_by") REFERENCES "public"."admin_users"("id")
    ON DELETE set null ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "application_files" (
  "id" serial PRIMARY KEY NOT NULL,
  "application_id" integer NOT NULL,
  "field_key" varchar(64) NOT NULL,
  "original_name" text NOT NULL,
  "pathname" text NOT NULL,
  "content_type" varchar(128),
  "size_bytes" integer,
  "review_status" varchar(32) DEFAULT 'pending' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

DO $$ BEGIN
  ALTER TABLE "application_files"
    ADD CONSTRAINT "application_files_application_id_applications_id_fk"
    FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id")
    ON DELETE cascade ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "application_events" (
  "id" serial PRIMARY KEY NOT NULL,
  "application_id" integer NOT NULL,
  "actor_type" varchar(32) NOT NULL,
  "actor_id" integer,
  "event_type" varchar(64) NOT NULL,
  "message" text,
  "meta" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

DO $$ BEGIN
  ALTER TABLE "application_events"
    ADD CONSTRAINT "application_events_application_id_applications_id_fk"
    FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id")
    ON DELETE cascade ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
