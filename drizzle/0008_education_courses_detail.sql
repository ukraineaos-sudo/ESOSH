ALTER TABLE "education_courses" ADD COLUMN IF NOT EXISTS "slug" varchar(160) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "education_courses" ADD COLUMN IF NOT EXISTS "description_extra_uk" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "education_courses" ADD COLUMN IF NOT EXISTS "description_extra_en" text DEFAULT '' NOT NULL;--> statement-breakpoint
UPDATE "education_courses"
SET "slug" = 'course-' || "id"::text
WHERE "slug" IS NULL OR "slug" = '';--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "education_courses_slug_uidx" ON "education_courses" ("slug");
