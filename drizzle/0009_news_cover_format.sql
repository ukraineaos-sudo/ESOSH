ALTER TABLE "news_posts" ADD COLUMN IF NOT EXISTS "cover_format" varchar(32) DEFAULT 'auto' NOT NULL;
