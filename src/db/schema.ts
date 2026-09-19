import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 256 }).notNull(),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 32 }).notNull().default("editor"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [uniqueIndex("admin_users_email_uidx").on(table.email)]);

export const adminSessions = pgTable("admin_sessions", {
  id: serial("id").primaryKey(),
  tokenHash: text("token_hash").notNull(),
  userId: integer("user_id").notNull().references(() => adminUsers.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [uniqueIndex("admin_sessions_token_uidx").on(table.tokenHash)]);

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 64 }).notNull(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [uniqueIndex("site_settings_key_uidx").on(table.key)]);

export const mediaAssets = pgTable("media_assets", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  pathname: text("pathname"),
  alt: text("alt").notNull().default(""),
  contentType: varchar("content_type", { length: 128 }),
  sizeBytes: integer("size_bytes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const pages = pgTable("pages", {
  id: serial("id").primaryKey(),
  locale: varchar("locale", { length: 8 }).notNull(),
  route: varchar("route", { length: 512 }).notNull(),
  title: text("title").notNull().default(""),
  status: varchar("status", { length: 32 }).notNull().default("draft"),
  blocks: jsonb("blocks").notNull().default([]),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [uniqueIndex("pages_locale_route_uidx").on(table.locale, table.route)]);

export const newsPosts = pgTable("news_posts", {
  id: serial("id").primaryKey(),
  locale: varchar("locale", { length: 8 }).notNull(),
  slug: varchar("slug", { length: 512 }).notNull(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull().default(""),
  coverUrl: text("cover_url"),
  body: jsonb("body").notNull().default([]),
  status: varchar("status", { length: 32 }).notNull().default("draft"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [uniqueIndex("news_posts_locale_slug_uidx").on(table.locale, table.slug)]);

export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  publicId: varchar("public_id", { length: 32 }).notNull(),
  firstName: varchar("first_name", { length: 80 }).notNull().default(""),
  lastName: varchar("last_name", { length: 80 }).notNull().default(""),
  primaryEmail: varchar("primary_email", { length: 256 }).notNull(),
  secondaryEmail: varchar("secondary_email", { length: 256 }),
  phone: varchar("phone", { length: 64 }),
  status: varchar("status", { length: 32 }).notNull().default("candidate"),
  level: varchar("level", { length: 64 }),
  profile: jsonb("profile").notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("members_public_id_uidx").on(table.publicId),
  uniqueIndex("members_primary_email_uidx").on(table.primaryEmail),
]);

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  publicId: varchar("public_id", { length: 32 }).notNull(),
  memberId: integer("member_id").references(() => members.id, { onDelete: "set null" }),
  status: varchar("status", { length: 32 }).notNull().default("new"),
  autoLevel: varchar("auto_level", { length: 64 }),
  approvedLevel: varchar("approved_level", { length: 64 }),
  payload: jsonb("payload").notNull().default({}),
  adminComment: text("admin_comment"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [uniqueIndex("applications_public_id_uidx").on(table.publicId)]);
