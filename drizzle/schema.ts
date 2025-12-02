import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// جدول السير الذاتية
export const cvDocuments = mysqlTable("cv_documents", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"), // المحتوى النصي للسيرة الذاتية
  fileUrl: varchar("file_url", { length: 512 }), // رابط الملف المرفوع
  fileKey: varchar("file_key", { length: 512 }), // مفتاح الملف في S3
  status: mysqlEnum("status", ["draft", "analyzing", "completed"]).default("draft").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// جدول تحليلات السيرة الذاتية
export const cvAnalyses = mysqlTable("cv_analyses", {
  id: int("id").autoincrement().primaryKey(),
  cvId: int("cv_id").notNull(),
  userId: int("user_id").notNull(),
  atsScore: int("ats_score"), // درجة توافق ATS من 0-100
  strengths: text("strengths"), // نقاط القوة (JSON)
  weaknesses: text("weaknesses"), // نقاط الضعف (JSON)
  suggestions: text("suggestions"), // الاقتراحات (JSON)
  correctedContent: text("corrected_content"), // المحتوى المصحح
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// جدول البورتفوليو
export const portfolios = mysqlTable("portfolios", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  content: text("content"), // المحتوى (JSON)
  fileUrl: varchar("file_url", { length: 512 }),
  fileKey: varchar("file_key", { length: 512 }),
  status: mysqlEnum("status", ["draft", "analyzing", "completed"]).default("draft").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// جدول تحليلات البورتفوليو
export const portfolioAnalyses = mysqlTable("portfolio_analyses", {
  id: int("id").autoincrement().primaryKey(),
  portfolioId: int("portfolio_id").notNull(),
  userId: int("user_id").notNull(),
  qualityScore: int("quality_score"), // درجة الجودة من 0-100
  strengths: text("strengths"),
  improvements: text("improvements"),
  suggestions: text("suggestions"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// جدول تحليلات لينكد إن
export const linkedinAnalyses = mysqlTable("linkedin_analyses", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  profileUrl: varchar("profile_url", { length: 512 }).notNull(),
  profileScore: int("profile_score"), // درجة الملف الشخصي من 0-100
  strengths: text("strengths"),
  weaknesses: text("weaknesses"),
  suggestions: text("suggestions"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// جدول خطابات التوصية
export const coverLetters = mysqlTable("cover_letters", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  jobTitle: varchar("job_title", { length: 255 }),
  companyName: varchar("company_name", { length: 255 }),
  status: mysqlEnum("status", ["draft", "analyzing", "completed"]).default("draft").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// جدول تحليلات خطابات التوصية
export const coverLetterAnalyses = mysqlTable("cover_letter_analyses", {
  id: int("id").autoincrement().primaryKey(),
  coverLetterId: int("cover_letter_id").notNull(),
  userId: int("user_id").notNull(),
  qualityScore: int("quality_score"),
  strengths: text("strengths"),
  improvements: text("improvements"),
  suggestions: text("suggestions"),
  improvedContent: text("improved_content"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type CvDocument = typeof cvDocuments.$inferSelect;
export type CvAnalysis = typeof cvAnalyses.$inferSelect;
export type Portfolio = typeof portfolios.$inferSelect;
export type PortfolioAnalysis = typeof portfolioAnalyses.$inferSelect;
export type LinkedinAnalysis = typeof linkedinAnalyses.$inferSelect;
export type CoverLetter = typeof coverLetters.$inferSelect;
export type CoverLetterAnalysis = typeof coverLetterAnalyses.$inferSelect;

// جدول الاشتراكات
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().unique(),
  cvCredits: int("cv_credits").default(1).notNull(),
  cvUsed: int("cv_used").default(0).notNull(),
  portfolioCredits: int("portfolio_credits").default(1).notNull(),
  portfolioUsed: int("portfolio_used").default(0).notNull(),
  hasUsedFreeTrial: int("has_used_free_trial").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// جدول المشتريات
export const purchases = mysqlTable("purchases", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  packageType: varchar("package_type", { length: 50 }).notNull(),
  creditsAmount: int("credits_amount").notNull(),
  priceUsd: int("price_usd").notNull(),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type Purchase = typeof purchases.$inferSelect;