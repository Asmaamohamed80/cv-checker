CREATE TABLE `cover_letter_analyses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cover_letter_id` int NOT NULL,
	`user_id` int NOT NULL,
	`quality_score` int,
	`strengths` text,
	`improvements` text,
	`suggestions` text,
	`improved_content` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cover_letter_analyses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cover_letters` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`job_title` varchar(255),
	`company_name` varchar(255),
	`status` enum('draft','analyzing','completed') NOT NULL DEFAULT 'draft',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cover_letters_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cv_analyses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cv_id` int NOT NULL,
	`user_id` int NOT NULL,
	`ats_score` int,
	`strengths` text,
	`weaknesses` text,
	`suggestions` text,
	`corrected_content` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cv_analyses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cv_documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text,
	`file_url` varchar(512),
	`file_key` varchar(512),
	`status` enum('draft','analyzing','completed') NOT NULL DEFAULT 'draft',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cv_documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `linkedin_analyses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`profile_url` varchar(512) NOT NULL,
	`profile_score` int,
	`strengths` text,
	`weaknesses` text,
	`suggestions` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `linkedin_analyses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `portfolio_analyses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`portfolio_id` int NOT NULL,
	`user_id` int NOT NULL,
	`quality_score` int,
	`strengths` text,
	`improvements` text,
	`suggestions` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `portfolio_analyses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `portfolios` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`content` text,
	`file_url` varchar(512),
	`file_key` varchar(512),
	`status` enum('draft','analyzing','completed') NOT NULL DEFAULT 'draft',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `portfolios_id` PRIMARY KEY(`id`)
);
