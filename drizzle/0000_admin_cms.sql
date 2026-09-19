CREATE TABLE IF NOT EXISTS "admin_users" (
  "id" serial PRIMARY KEY NOT NULL,
  "email" varchar(256) NOT NULL,
  "password_hash" text NOT NULL,
  "role" varchar(32) DEFAULT 'editor' NOT NULL,
  "active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "admin_users_email_uidx" ON "admin_users" USING btree ("email");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "admin_sessions" (
  "id" serial PRIMARY KEY NOT NULL,
  "token_hash" text NOT NULL,
  "user_id" integer NOT NULL,
  "expires_at" timestamp with time zone NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "admin_sessions_token_uidx" ON "admin_sessions" USING btree ("token_hash");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "site_settings" (
  "id" serial PRIMARY KEY NOT NULL,
  "key" varchar(64) NOT NULL,
  "value" jsonb NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "site_settings_key_uidx" ON "site_settings" USING btree ("key");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "media_assets" (
  "id" serial PRIMARY KEY NOT NULL,
  "url" text NOT NULL,
  "pathname" text,
  "alt" text DEFAULT '' NOT NULL,
  "content_type" varchar(128),
  "size_bytes" integer,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pages" (
  "id" serial PRIMARY KEY NOT NULL,
  "locale" varchar(8) NOT NULL,
  "route" varchar(512) NOT NULL,
  "title" text DEFAULT '' NOT NULL,
  "status" varchar(32) DEFAULT 'draft' NOT NULL,
  "blocks" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "pages_locale_route_uidx" ON "pages" USING btree ("locale","route");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "news_posts" (
  "id" serial PRIMARY KEY NOT NULL,
  "locale" varchar(8) NOT NULL,
  "slug" varchar(512) NOT NULL,
  "title" text NOT NULL,
  "excerpt" text DEFAULT '' NOT NULL,
  "cover_url" text,
  "body" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "status" varchar(32) DEFAULT 'draft' NOT NULL,
  "published_at" timestamp with time zone,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "news_posts_locale_slug_uidx" ON "news_posts" USING btree ("locale","slug");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "members" (
  "id" serial PRIMARY KEY NOT NULL,
  "public_id" varchar(32) NOT NULL,
  "first_name" varchar(80) DEFAULT '' NOT NULL,
  "last_name" varchar(80) DEFAULT '' NOT NULL,
  "primary_email" varchar(256) NOT NULL,
  "secondary_email" varchar(256),
  "phone" varchar(64),
  "status" varchar(32) DEFAULT 'candidate' NOT NULL,
  "level" varchar(64),
  "profile" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "members_public_id_uidx" ON "members" USING btree ("public_id");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "members_primary_email_uidx" ON "members" USING btree ("primary_email");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "applications" (
  "id" serial PRIMARY KEY NOT NULL,
  "public_id" varchar(32) NOT NULL,
  "member_id" integer,
  "status" varchar(32) DEFAULT 'new' NOT NULL,
  "auto_level" varchar(64),
  "approved_level" varchar(64),
  "payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "admin_comment" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "applications_public_id_uidx" ON "applications" USING btree ("public_id");
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "admin_sessions" ADD CONSTRAINT "admin_sessions_user_id_admin_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."admin_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "applications" ADD CONSTRAINT "applications_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
