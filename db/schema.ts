import { sql } from "drizzle-orm";
import { check, index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const waitlistEntries = sqliteTable("waitlist_entries", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role", { enum: ["buyer", "seller", "both"] }).notNull(),
  location: text("location").notNull().default(""),
  consentVersion: text("consent_version").notNull(),
  consentedAt: integer("consented_at").notNull(),
  createdAt: integer("created_at").notNull(),
}, table => [
  uniqueIndex("waitlist_email_unique").on(table.email),
  check("waitlist_role_valid", sql`${table.role} IN ('buyer', 'seller', 'both')`),
]);

export const waitlistRateLimits = sqliteTable("waitlist_rate_limits", {
  key: text("key").primaryKey(),
  count: integer("count").notNull(),
  expiresAt: integer("expires_at").notNull(),
}, table => [index("waitlist_rate_expiry").on(table.expiresAt)]);
