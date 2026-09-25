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
  username: varchar("username", { length: 64 }).notNull(),
  email: varchar("email", { length: 256 }),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 32 }).notNull().default("editor"),
  active: boolean("active").notNull().default(true),
  mustChangePassword: boolean("must_change_password").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("admin_users_username_uidx").on(table.username),
  uniqueIndex("admin_users_email_uidx").on(table.email),
]);

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

/** RU: Керівний склад (Про ESOSH). EN: Leadership / management team cards. */
export const leadershipPeople = pgTable("leadership_people", {
  id: serial("id").primaryKey(),
  sortOrder: integer("sort_order").notNull().default(0),
  photoUrl: text("photo_url").notNull().default(""),
  /** Extra CSS on photo (e.g. is--helmut). */
  photoClass: varchar("photo_class", { length: 128 }).notNull().default(""),
  nameUk: text("name_uk").notNull().default(""),
  nameEn: text("name_en").notNull().default(""),
  roleUk: text("role_uk").notNull().default(""),
  roleEn: text("role_en").notNull().default(""),
  status: varchar("status", { length: 32 }).notNull().default("published"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

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
  locale: varchar("locale", { length: 8 }).notNull().default("uk"),
  status: varchar("status", { length: 32 }).notNull().default("new"),
  autoLevel: varchar("auto_level", { length: 64 }),
  approvedLevel: varchar("approved_level", { length: 64 }),
  requiresManualReview: boolean("requires_manual_review").notNull().default(false),
  autoLevelRules: jsonb("auto_level_rules").notNull().default([]),
  payload: jsonb("payload").notNull().default({}),
  consentVersion: varchar("consent_version", { length: 32 }).notNull().default("1.0"),
  testScore: integer("test_score"),
  testPassedAt: timestamp("test_passed_at", { withTimezone: true }),
  idempotencyKey: varchar("idempotency_key", { length: 64 }),
  adminComment: text("admin_comment"),
  decidedBy: integer("decided_by").references(() => adminUsers.id, { onDelete: "set null" }),
  decidedAt: timestamp("decided_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("applications_public_id_uidx").on(table.publicId),
  uniqueIndex("applications_idempotency_uidx").on(table.idempotencyKey),
]);

export const applicationFiles = pgTable("application_files", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").notNull().references(() => applications.id, { onDelete: "cascade" }),
  fieldKey: varchar("field_key", { length: 64 }).notNull(),
  originalName: text("original_name").notNull(),
  pathname: text("pathname").notNull(),
  contentType: varchar("content_type", { length: 128 }),
  sizeBytes: integer("size_bytes"),
  reviewStatus: varchar("review_status", { length: 32 }).notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const applicationEvents = pgTable("application_events", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").notNull().references(() => applications.id, { onDelete: "cascade" }),
  actorType: varchar("actor_type", { length: 32 }).notNull(),
  actorId: integer("actor_id"),
  eventType: varchar("event_type", { length: 64 }).notNull(),
  message: text("message"),
  meta: jsonb("meta").notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
