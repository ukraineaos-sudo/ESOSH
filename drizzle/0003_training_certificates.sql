CREATE TABLE IF NOT EXISTS "training_certificates" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_slug" varchar(128) NOT NULL,
	"course_code" varchar(16) NOT NULL,
	"participant_name" varchar(200) NOT NULL,
	"identity_hash" varchar(64) NOT NULL,
	"course_title_uk" text NOT NULL,
	"course_title_en" text NOT NULL,
	"duration_uk" text NOT NULL,
	"duration_en" text NOT NULL,
	"completion_date" varchar(32) NOT NULL,
	"certificate_number" varchar(64) NOT NULL,
	"modules_snapshot" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"download_token" varchar(64) NOT NULL,
	"issued_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "training_certificates_number_uidx" ON "training_certificates" USING btree ("certificate_number");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "training_certificates_download_uidx" ON "training_certificates" USING btree ("download_token");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "training_certificates_identity_uidx" ON "training_certificates" USING btree ("identity_hash");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "training_certificate_counters" (
	"course_code" varchar(16) NOT NULL,
	"year" integer NOT NULL,
	"last_seq" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "training_certificate_counters_pk" PRIMARY KEY("course_code","year")
);
