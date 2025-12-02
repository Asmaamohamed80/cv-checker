import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  cvDocuments, 
  cvAnalyses,
  portfolios,
  portfolioAnalyses,
  linkedinAnalyses,
  coverLetters,
  coverLetterAnalyses,
  subscriptions,
  purchases
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// CV Document functions
export async function createCvDocument(data: {
  userId: number;
  title: string;
  content?: string;
  fileUrl?: string;
  fileKey?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(cvDocuments).values(data);
  return result;
}

export async function getCvDocumentsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(cvDocuments)
    .where(eq(cvDocuments.userId, userId))
    .orderBy(desc(cvDocuments.createdAt));
}

export async function getCvDocumentById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(cvDocuments)
    .where(eq(cvDocuments.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updateCvDocument(id: number, data: Partial<{
  title: string;
  content: string;
  status: "draft" | "analyzing" | "completed";
}>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(cvDocuments).set(data).where(eq(cvDocuments.id, id));
}

// CV Analysis functions
export async function createCvAnalysis(data: {
  cvId: number;
  userId: number;
  atsScore?: number;
  strengths?: string;
  weaknesses?: string;
  suggestions?: string;
  correctedContent?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(cvAnalyses).values(data);
  return result;
}

export async function getCvAnalysisByCvId(cvId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(cvAnalyses)
    .where(eq(cvAnalyses.cvId, cvId))
    .orderBy(desc(cvAnalyses.createdAt))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

// Portfolio functions
export async function createPortfolio(data: {
  userId: number;
  title: string;
  description?: string;
  content?: string;
  fileUrl?: string;
  fileKey?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(portfolios).values(data);
  return result;
}

export async function getPortfoliosByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(portfolios)
    .where(eq(portfolios.userId, userId))
    .orderBy(desc(portfolios.createdAt));
}

// LinkedIn Analysis functions
export async function createLinkedinAnalysis(data: {
  userId: number;
  profileUrl: string;
  profileScore?: number;
  strengths?: string;
  weaknesses?: string;
  suggestions?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(linkedinAnalyses).values(data);
  return result;
}

export async function getLinkedinAnalysesByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(linkedinAnalyses)
    .where(eq(linkedinAnalyses.userId, userId))
    .orderBy(desc(linkedinAnalyses.createdAt));
}

// Cover Letter functions
export async function createCoverLetter(data: {
  userId: number;
  title: string;
  content: string;
  jobTitle?: string;
  companyName?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(coverLetters).values(data);
  return result;
}

export async function getCoverLettersByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(coverLetters)
    .where(eq(coverLetters.userId, userId))
    .orderBy(desc(coverLetters.createdAt));
}

export async function getCoverLetterById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(coverLetters)
    .where(eq(coverLetters.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

// Subscription functions
export async function getOrCreateSubscription(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  let subscription = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1);

  if (subscription.length === 0) {
    // إنشاء اشتراك جديد برصيد مجاني
    await db.insert(subscriptions).values({
      userId,
      cvCredits: 1,
      cvUsed: 0,
      portfolioCredits: 1,
      portfolioUsed: 0,
      hasUsedFreeTrial: 0,
    });

    subscription = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1);
  }

  return subscription[0];
}

export async function canCreateCV(userId: number): Promise<boolean> {
  const subscription = await getOrCreateSubscription(userId);
  return subscription.cvUsed < subscription.cvCredits;
}

export async function canCreatePortfolio(userId: number): Promise<boolean> {
  const subscription = await getOrCreateSubscription(userId);
  return subscription.portfolioUsed < subscription.portfolioCredits;
}

export async function incrementCVUsage(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const subscription = await getOrCreateSubscription(userId);
  await db
    .update(subscriptions)
    .set({ 
      cvUsed: subscription.cvUsed + 1,
      hasUsedFreeTrial: 1,
    })
    .where(eq(subscriptions.userId, userId));
}

export async function incrementPortfolioUsage(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const subscription = await getOrCreateSubscription(userId);
  await db
    .update(subscriptions)
    .set({ 
      portfolioUsed: subscription.portfolioUsed + 1,
      hasUsedFreeTrial: 1,
    })
    .where(eq(subscriptions.userId, userId));
}

export async function addCredits(userId: number, type: 'cv' | 'portfolio', amount: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const subscription = await getOrCreateSubscription(userId);
  
  if (type === 'cv') {
    await db
      .update(subscriptions)
      .set({ cvCredits: subscription.cvCredits + amount })
      .where(eq(subscriptions.userId, userId));
  } else {
    await db
      .update(subscriptions)
      .set({ portfolioCredits: subscription.portfolioCredits + amount })
      .where(eq(subscriptions.userId, userId));
  }
}

export async function createPurchase(data: {
  userId: number;
  packageType: string;
  creditsAmount: number;
  priceUsd: number;
  stripePaymentIntentId?: string;
  stripeCustomerId?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(purchases).values(data);
  return result;
}

export async function completePurchase(paymentIntentId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(purchases)
    .set({ 
      status: "completed",
      completedAt: new Date(),
    })
    .where(eq(purchases.stripePaymentIntentId, paymentIntentId));
}
