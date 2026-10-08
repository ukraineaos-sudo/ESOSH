ALTER TABLE "training_certificates" ADD COLUMN IF NOT EXISTS "score" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "training_certificates" ADD COLUMN IF NOT EXISTS "score_total" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "training_certificates" ADD COLUMN IF NOT EXISTS "score_percent" integer DEFAULT 0 NOT NULL;
