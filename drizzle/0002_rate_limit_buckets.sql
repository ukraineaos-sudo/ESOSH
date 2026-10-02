CREATE TABLE IF NOT EXISTS "rate_limit_buckets" (
	"key" varchar(191) PRIMARY KEY NOT NULL,
	"window_start" timestamp with time zone NOT NULL,
	"count" integer DEFAULT 0 NOT NULL
);
