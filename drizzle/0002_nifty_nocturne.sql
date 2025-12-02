CREATE TABLE `purchases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`package_type` varchar(50) NOT NULL,
	`credits_amount` int NOT NULL,
	`price_usd` int NOT NULL,
	`stripe_payment_intent_id` varchar(255),
	`stripe_customer_id` varchar(255),
	`status` varchar(50) NOT NULL DEFAULT 'pending',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`completed_at` timestamp,
	CONSTRAINT `purchases_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`cv_credits` int NOT NULL DEFAULT 1,
	`cv_used` int NOT NULL DEFAULT 0,
	`portfolio_credits` int NOT NULL DEFAULT 1,
	`portfolio_used` int NOT NULL DEFAULT 0,
	`has_used_free_trial` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `subscriptions_user_id_unique` UNIQUE(`user_id`)
);
