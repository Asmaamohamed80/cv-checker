import { int, mysqlTable, varchar, timestamp, boolean } from "drizzle-orm/mysql-core";

/**
 * جدول الاشتراكات والباقات
 * يتتبع عدد الاستخدامات المتاحة لكل مستخدم
 */
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  
  // عدد السير الذاتية المتاحة
  cvCredits: int("cv_credits").default(1).notNull(), // 1 مجاني للجميع
  cvUsed: int("cv_used").default(0).notNull(),
  
  // عدد البورتفوليوهات المتاحة
  portfolioCredits: int("portfolio_credits").default(1).notNull(), // 1 مجاني للجميع
  portfolioUsed: int("portfolio_used").default(0).notNull(),
  
  // هل استخدم المستخدم الاستخدام المجاني؟
  hasUsedFreeTrial: boolean("has_used_free_trial").default(false).notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

/**
 * جدول المعاملات والمشتريات
 * يحفظ سجل الباقات المشتراة
 */
export const purchases = mysqlTable("purchases", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  
  // نوع الباقة
  packageType: varchar("package_type", { length: 50 }).notNull(), // 'cv' or 'portfolio'
  creditsAmount: int("credits_amount").notNull(), // 10, 50, or 100
  priceUsd: int("price_usd").notNull(), // السعر بالدولار (5, 10, 15)
  
  // معلومات Stripe
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  
  status: varchar("status", { length: 50 }).default("pending").notNull(), // pending, completed, failed
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type Purchase = typeof purchases.$inferSelect;
