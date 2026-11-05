CREATE TABLE `waitlist_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`role` text NOT NULL,
	`location` text DEFAULT '' NOT NULL,
	`consent_version` text NOT NULL,
	`consented_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	CONSTRAINT "waitlist_role_valid" CHECK("waitlist_entries"."role" IN ('buyer', 'seller', 'both'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `waitlist_email_unique` ON `waitlist_entries` (`email`);--> statement-breakpoint
CREATE TABLE `waitlist_rate_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `waitlist_rate_expiry` ON `waitlist_rate_limits` (`expires_at`);