CREATE TABLE IF NOT EXISTS "education_courses" (
  "id" serial PRIMARY KEY NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "image_url" text DEFAULT '' NOT NULL,
  "level_uk" text DEFAULT '' NOT NULL,
  "level_en" text DEFAULT '' NOT NULL,
  "title_uk" text DEFAULT '' NOT NULL,
  "title_en" text DEFAULT '' NOT NULL,
  "description_uk" text DEFAULT '' NOT NULL,
  "description_en" text DEFAULT '' NOT NULL,
  "cta_url" text DEFAULT '' NOT NULL,
  "cta_label_uk" text DEFAULT '' NOT NULL,
  "cta_label_en" text DEFAULT '' NOT NULL,
  "status" varchar(32) DEFAULT 'published' NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
