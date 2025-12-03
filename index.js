var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/_core/env.ts
var env_exports = {};
__export(env_exports, {
  ENV: () => ENV
});
var ENV;
var init_env = __esm({
  "server/_core/env.ts"() {
    "use strict";
    ENV = {
      appId: process.env.VITE_APP_ID ?? "",
      cookieSecret: process.env.JWT_SECRET ?? "",
      databaseUrl: process.env.DATABASE_URL ?? "",
      oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
      ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
      isProduction: process.env.NODE_ENV === "production",
      forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
      forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
      frontendUrl: process.env.NODE_ENV === "production" ? "https://your-domain.com" : "http://localhost:5173",
      stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? "",
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY ?? ""
    };
  }
});

// server/_core/llm.ts
async function invokeLLM(params) {
  assertApiKey();
  const {
    messages,
    tools,
    toolChoice,
    tool_choice,
    outputSchema,
    output_schema,
    responseFormat,
    response_format
  } = params;
  const payload = {
    model: "gemini-2.5-flash",
    messages: messages.map(normalizeMessage)
  };
  if (tools && tools.length > 0) {
    payload.tools = tools;
  }
  const normalizedToolChoice = normalizeToolChoice(
    toolChoice || tool_choice,
    tools
  );
  if (normalizedToolChoice) {
    payload.tool_choice = normalizedToolChoice;
  }
  payload.max_tokens = 32768;
  payload.thinking = {
    "budget_tokens": 128
  };
  const normalizedResponseFormat = normalizeResponseFormat({
    responseFormat,
    response_format,
    outputSchema,
    output_schema
  });
  if (normalizedResponseFormat) {
    payload.response_format = normalizedResponseFormat;
  }
  const response = await fetch(resolveApiUrl(), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${ENV.forgeApiKey}`
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `LLM invoke failed: ${response.status} ${response.statusText} \u2013 ${errorText}`
    );
  }
  return await response.json();
}
var ensureArray, normalizeContentPart, normalizeMessage, normalizeToolChoice, resolveApiUrl, assertApiKey, normalizeResponseFormat;
var init_llm = __esm({
  "server/_core/llm.ts"() {
    "use strict";
    init_env();
    ensureArray = (value) => Array.isArray(value) ? value : [value];
    normalizeContentPart = (part) => {
      if (typeof part === "string") {
        return { type: "text", text: part };
      }
      if (part.type === "text") {
        return part;
      }
      if (part.type === "image_url") {
        return part;
      }
      if (part.type === "file_url") {
        return part;
      }
      throw new Error("Unsupported message content part");
    };
    normalizeMessage = (message) => {
      const { role, name, tool_call_id } = message;
      if (role === "tool" || role === "function") {
        const content = ensureArray(message.content).map((part) => typeof part === "string" ? part : JSON.stringify(part)).join("\n");
        return {
          role,
          name,
          tool_call_id,
          content
        };
      }
      const contentParts = ensureArray(message.content).map(normalizeContentPart);
      if (contentParts.length === 1 && contentParts[0].type === "text") {
        return {
          role,
          name,
          content: contentParts[0].text
        };
      }
      return {
        role,
        name,
        content: contentParts
      };
    };
    normalizeToolChoice = (toolChoice, tools) => {
      if (!toolChoice) return void 0;
      if (toolChoice === "none" || toolChoice === "auto") {
        return toolChoice;
      }
      if (toolChoice === "required") {
        if (!tools || tools.length === 0) {
          throw new Error(
            "tool_choice 'required' was provided but no tools were configured"
          );
        }
        if (tools.length > 1) {
          throw new Error(
            "tool_choice 'required' needs a single tool or specify the tool name explicitly"
          );
        }
        return {
          type: "function",
          function: { name: tools[0].function.name }
        };
      }
      if ("name" in toolChoice) {
        return {
          type: "function",
          function: { name: toolChoice.name }
        };
      }
      return toolChoice;
    };
    resolveApiUrl = () => ENV.forgeApiUrl && ENV.forgeApiUrl.trim().length > 0 ? `${ENV.forgeApiUrl.replace(/\/$/, "")}/v1/chat/completions` : "https://forge.manus.im/v1/chat/completions";
    assertApiKey = () => {
      if (!ENV.forgeApiKey) {
        throw new Error("OPENAI_API_KEY is not configured");
      }
    };
    normalizeResponseFormat = ({
      responseFormat,
      response_format,
      outputSchema,
      output_schema
    }) => {
      const explicitFormat = responseFormat || response_format;
      if (explicitFormat) {
        if (explicitFormat.type === "json_schema" && !explicitFormat.json_schema?.schema) {
          throw new Error(
            "responseFormat json_schema requires a defined schema object"
          );
        }
        return explicitFormat;
      }
      const schema = outputSchema || output_schema;
      if (!schema) return void 0;
      if (!schema.name || !schema.schema) {
        throw new Error("outputSchema requires both name and schema");
      }
      return {
        type: "json_schema",
        json_schema: {
          name: schema.name,
          schema: schema.schema,
          ...typeof schema.strict === "boolean" ? { strict: schema.strict } : {}
        }
      };
    };
  }
});

// server/_core/aiAnalysis.ts
var aiAnalysis_exports = {};
__export(aiAnalysis_exports, {
  analyzeCVWithAI: () => analyzeCVWithAI,
  generateCVWithAI: () => generateCVWithAI
});
async function analyzeCVWithAI(content, language = "ar") {
  const systemPrompt = language === "ar" ? `\u0623\u0646\u062A \u062E\u0628\u064A\u0631 \u0641\u064A \u062A\u062D\u0644\u064A\u0644 \u0627\u0644\u0633\u064A\u0631 \u0627\u0644\u0630\u0627\u062A\u064A\u0629 \u0648\u0641\u062D\u0635\u0647\u0627 \u062D\u0633\u0628 \u0645\u0639\u0627\u064A\u064A\u0631 ATS (Applicant Tracking Systems). 
\u0645\u0647\u0645\u062A\u0643 \u0647\u064A \u062A\u062D\u0644\u064A\u0644 \u0627\u0644\u0633\u064A\u0631\u0629 \u0627\u0644\u0630\u0627\u062A\u064A\u0629 \u0627\u0644\u0645\u0642\u062F\u0645\u0629 \u0648\u062A\u0642\u062F\u064A\u0645 \u062A\u0642\u064A\u064A\u0645 \u0634\u0627\u0645\u0644 \u064A\u062A\u0636\u0645\u0646:
1. \u062F\u0631\u062C\u0629 \u0639\u0627\u0645\u0629 \u0645\u0646 100
2. \u0646\u0633\u0628\u0629 \u062A\u0648\u0627\u0641\u0642 \u0645\u0639 \u0623\u0646\u0638\u0645\u0629 ATS
3. \u0646\u0642\u0627\u0637 \u0627\u0644\u0642\u0648\u0629 (3-5 \u0646\u0642\u0627\u0637)
4. \u0646\u0642\u0627\u0637 \u0627\u0644\u0636\u0639\u0641 (3-5 \u0646\u0642\u0627\u0637)
5. \u0627\u0642\u062A\u0631\u0627\u062D\u0627\u062A \u0644\u0644\u062A\u062D\u0633\u064A\u0646 (5-7 \u0627\u0642\u062A\u0631\u0627\u062D\u0627\u062A \u0645\u062D\u062F\u062F\u0629 \u0648\u0642\u0627\u0628\u0644\u0629 \u0644\u0644\u062A\u0637\u0628\u064A\u0642)
6. \u062A\u0642\u064A\u064A\u0645 \u0645\u0641\u0635\u0644

\u064A\u062C\u0628 \u0623\u0646 \u064A\u0643\u0648\u0646 \u0627\u0644\u062A\u062D\u0644\u064A\u0644 \u062F\u0642\u064A\u0642\u0627\u064B\u060C \u0645\u0641\u0635\u0644\u0627\u064B\u060C \u0648\u0645\u0628\u0646\u064A\u0627\u064B \u0639\u0644\u0649 \u0623\u0641\u0636\u0644 \u0627\u0644\u0645\u0645\u0627\u0631\u0633\u0627\u062A \u0641\u064A \u0643\u062A\u0627\u0628\u0629 \u0627\u0644\u0633\u064A\u0631 \u0627\u0644\u0630\u0627\u062A\u064A\u0629.` : `You are an expert in analyzing resumes and checking them according to ATS (Applicant Tracking Systems) standards.
Your task is to analyze the provided resume and provide a comprehensive evaluation that includes:
1. Overall score out of 100
2. ATS compatibility percentage
3. Strengths (3-5 points)
4. Weaknesses (3-5 points)
5. Improvement suggestions (5-7 specific and actionable suggestions)
6. Detailed evaluation

The analysis should be accurate, detailed, and based on best practices in resume writing.`;
  const userPrompt = language === "ar" ? `\u0642\u0645 \u0628\u062A\u062D\u0644\u064A\u0644 \u0627\u0644\u0633\u064A\u0631\u0629 \u0627\u0644\u0630\u0627\u062A\u064A\u0629 \u0627\u0644\u062A\u0627\u0644\u064A\u0629:

${content}

\u0642\u062F\u0645 \u0627\u0644\u062A\u062D\u0644\u064A\u0644 \u0628\u0635\u064A\u063A\u0629 JSON \u0645\u0639 \u0627\u0644\u0645\u0641\u0627\u062A\u064A\u062D \u0627\u0644\u062A\u0627\u0644\u064A\u0629:
{
  "score": \u0631\u0642\u0645 \u0645\u0646 0 \u0625\u0644\u0649 100,
  "atsCompatibility": \u0631\u0642\u0645 \u0645\u0646 0 \u0625\u0644\u0649 100,
  "strengths": ["\u0646\u0642\u0637\u0629 \u0642\u0648\u0629 1", "\u0646\u0642\u0637\u0629 \u0642\u0648\u0629 2", ...],
  "weaknesses": ["\u0646\u0642\u0637\u0629 \u0636\u0639\u0641 1", "\u0646\u0642\u0637\u0629 \u0636\u0639\u0641 2", ...],
  "suggestions": ["\u0627\u0642\u062A\u0631\u0627\u062D 1", "\u0627\u0642\u062A\u0631\u0627\u062D 2", ...],
  "detailedFeedback": "\u062A\u0642\u064A\u064A\u0645 \u0645\u0641\u0635\u0644 \u0634\u0627\u0645\u0644"
}` : `Analyze the following resume:

${content}

Provide the analysis in JSON format with the following keys:
{
  "score": number from 0 to 100,
  "atsCompatibility": number from 0 to 100,
  "strengths": ["strength 1", "strength 2", ...],
  "weaknesses": ["weakness 1", "weakness 2", ...],
  "suggestions": ["suggestion 1", "suggestion 2", ...],
  "detailedFeedback": "comprehensive detailed evaluation"
}`;
  try {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "cv_analysis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              score: { type: "number", description: "Overall score from 0 to 100" },
              atsCompatibility: { type: "number", description: "ATS compatibility from 0 to 100" },
              strengths: {
                type: "array",
                items: { type: "string" },
                description: "List of strengths"
              },
              weaknesses: {
                type: "array",
                items: { type: "string" },
                description: "List of weaknesses"
              },
              suggestions: {
                type: "array",
                items: { type: "string" },
                description: "List of improvement suggestions"
              },
              detailedFeedback: { type: "string", description: "Detailed evaluation" }
            },
            required: ["score", "atsCompatibility", "strengths", "weaknesses", "suggestions", "detailedFeedback"],
            additionalProperties: false
          }
        }
      }
    });
    const content2 = response.choices[0]?.message?.content;
    if (!content2 || typeof content2 !== "string") {
      throw new Error("No response from AI");
    }
    const result = JSON.parse(content2);
    return result;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw new Error("Failed to analyze CV with AI");
  }
}
async function generateCVWithAI(userInput, language = "ar", jobType) {
  const systemPrompt = language === "ar" ? `\u0623\u0646\u062A \u062E\u0628\u064A\u0631 \u0641\u064A \u0643\u062A\u0627\u0628\u0629 \u0627\u0644\u0633\u064A\u0631 \u0627\u0644\u0630\u0627\u062A\u064A\u0629 \u0627\u0644\u0627\u062D\u062A\u0631\u0627\u0641\u064A\u0629 \u0627\u0644\u0645\u062A\u0648\u0627\u0641\u0642\u0629 \u0645\u0639 \u0645\u0639\u0627\u064A\u064A\u0631 ATS.
\u0645\u0647\u0645\u062A\u0643 \u0647\u064A \u0625\u0646\u0634\u0627\u0621 \u0633\u064A\u0631\u0629 \u0630\u0627\u062A\u064A\u0629 \u0627\u062D\u062A\u0631\u0627\u0641\u064A\u0629 \u0628\u0646\u0627\u0621\u064B \u0639\u0644\u0649 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0627\u0644\u0645\u0642\u062F\u0645\u0629 \u0645\u0646 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645.
\u0627\u0644\u0633\u064A\u0631\u0629 \u064A\u062C\u0628 \u0623\u0646 \u062A\u0643\u0648\u0646:
- \u0645\u0646\u0638\u0645\u0629 \u0648\u0645\u0646\u0633\u0642\u0629 \u0628\u0634\u0643\u0644 \u0627\u062D\u062A\u0631\u0627\u0641\u064A
- \u0645\u062A\u0648\u0627\u0641\u0642\u0629 \u0645\u0639 \u0623\u0646\u0638\u0645\u0629 ATS
- \u062A\u062D\u062A\u0648\u064A \u0639\u0644\u0649 \u0643\u0644\u0645\u0627\u062A \u0645\u0641\u062A\u0627\u062D\u064A\u0629 \u0645\u0646\u0627\u0633\u0628\u0629
- \u062E\u0627\u0644\u064A\u0629 \u0645\u0646 \u0627\u0644\u0623\u062E\u0637\u0627\u0621 \u0627\u0644\u0644\u063A\u0648\u064A\u0629
- \u0645\u0646\u0627\u0633\u0628\u0629 \u0644\u0644\u062A\u0642\u062F\u064A\u0645 \u0639\u0644\u0649 \u0627\u0644\u0648\u0638\u0627\u0626\u0641${jobType ? ` \u0641\u064A \u0645\u062C\u0627\u0644 ${jobType}` : ""}` : `You are an expert in writing professional resumes that comply with ATS standards.
Your task is to create a professional resume based on the information provided by the user.
The resume should be:
- Well-organized and professionally formatted
- ATS-compatible
- Contains appropriate keywords
- Free of grammatical errors
- Suitable for job applications${jobType ? ` in the field of ${jobType}` : ""}`;
  const userPrompt = language === "ar" ? `\u0642\u0645 \u0628\u0625\u0646\u0634\u0627\u0621 \u0633\u064A\u0631\u0629 \u0630\u0627\u062A\u064A\u0629 \u0627\u062D\u062A\u0631\u0627\u0641\u064A\u0629 \u0628\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0628\u0646\u0627\u0621\u064B \u0639\u0644\u0649 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0627\u0644\u062A\u0627\u0644\u064A\u0629:

${userInput}

\u0627\u0644\u0633\u064A\u0631\u0629 \u064A\u062C\u0628 \u0623\u0646 \u062A\u062D\u062A\u0648\u064A \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0633\u0627\u0645 \u0627\u0644\u062A\u0627\u0644\u064A\u0629:
- \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0627\u0644\u0634\u062E\u0635\u064A\u0629
- \u0627\u0644\u0645\u0644\u062E\u0635 \u0627\u0644\u0645\u0647\u0646\u064A
- \u0627\u0644\u062E\u0628\u0631\u0627\u062A \u0627\u0644\u0639\u0645\u0644\u064A\u0629
- \u0627\u0644\u062A\u0639\u0644\u064A\u0645
- \u0627\u0644\u0645\u0647\u0627\u0631\u0627\u062A
- \u0627\u0644\u0634\u0647\u0627\u062F\u0627\u062A (\u0625\u0646 \u0648\u062C\u062F\u062A)` : `Create a professional resume in English based on the following information:

${userInput}

The resume should contain the following sections:
- Personal Information
- Professional Summary
- Work Experience
- Education
- Skills
- Certifications (if any)`;
  try {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    });
    const content = response.choices[0]?.message?.content;
    if (!content || typeof content !== "string") {
      throw new Error("No response from AI");
    }
    return content;
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error("Failed to generate CV with AI");
  }
}
var init_aiAnalysis = __esm({
  "server/_core/aiAnalysis.ts"() {
    "use strict";
    init_llm();
  }
});

// server/_core/stripe.ts
var stripe_exports = {};
__export(stripe_exports, {
  createCheckoutSession: () => createCheckoutSession,
  getStripe: () => getStripe,
  verifyCheckoutSession: () => verifyCheckoutSession
});
import Stripe from "stripe";
function getStripe() {
  if (!_stripe) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    _stripe = new Stripe(secretKey, {
      apiVersion: "2025-11-17.clover",
      typescript: true
    });
  }
  return _stripe;
}
async function createCheckoutSession(params) {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `\u0628\u0627\u0642\u0629 ${params.type} - ${params.credits} \u062A\u062D\u0644\u064A\u0644`,
            description: `${params.credits} \u062A\u062D\u0644\u064A\u0644 ${params.type === "CV" ? "\u0633\u064A\u0631\u0629 \u0630\u0627\u062A\u064A\u0629" : "\u0628\u0648\u0631\u062A\u0641\u0648\u0644\u064A\u0648"}`
          },
          unit_amount: Math.round(params.price * 100)
          // Stripe uses cents
        },
        quantity: 1
      }
    ],
    mode: "payment",
    success_url: `${ENV.frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${ENV.frontendUrl}/pricing?canceled=true`,
    customer_email: params.userEmail,
    metadata: {
      userId: params.userId.toString(),
      packageId: params.packageId,
      credits: params.credits.toString(),
      type: params.type
    }
  });
  return {
    url: session.url,
    sessionId: session.id
  };
}
async function verifyCheckoutSession(sessionId) {
  const stripe = getStripe();
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status === "paid") {
      return {
        success: true,
        metadata: session.metadata
      };
    }
    return { success: false };
  } catch (error) {
    console.error("Error verifying checkout session:", error);
    return { success: false };
  }
}
var _stripe;
var init_stripe = __esm({
  "server/_core/stripe.ts"() {
    "use strict";
    init_env();
    _stripe = null;
  }
});

// server/_core/index.ts
import "dotenv/config";
import express2 from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/db.ts
import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";

// drizzle/schema.ts
import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
var users = mysqlTable("users", {
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
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
});
var cvDocuments = mysqlTable("cv_documents", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  // المحتوى النصي للسيرة الذاتية
  fileUrl: varchar("file_url", { length: 512 }),
  // رابط الملف المرفوع
  fileKey: varchar("file_key", { length: 512 }),
  // مفتاح الملف في S3
  status: mysqlEnum("status", ["draft", "analyzing", "completed"]).default("draft").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull()
});
var cvAnalyses = mysqlTable("cv_analyses", {
  id: int("id").autoincrement().primaryKey(),
  cvId: int("cv_id").notNull(),
  userId: int("user_id").notNull(),
  atsScore: int("ats_score"),
  // درجة توافق ATS من 0-100
  strengths: text("strengths"),
  // نقاط القوة (JSON)
  weaknesses: text("weaknesses"),
  // نقاط الضعف (JSON)
  suggestions: text("suggestions"),
  // الاقتراحات (JSON)
  correctedContent: text("corrected_content"),
  // المحتوى المصحح
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var portfolios = mysqlTable("portfolios", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  content: text("content"),
  // المحتوى (JSON)
  fileUrl: varchar("file_url", { length: 512 }),
  fileKey: varchar("file_key", { length: 512 }),
  status: mysqlEnum("status", ["draft", "analyzing", "completed"]).default("draft").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull()
});
var portfolioAnalyses = mysqlTable("portfolio_analyses", {
  id: int("id").autoincrement().primaryKey(),
  portfolioId: int("portfolio_id").notNull(),
  userId: int("user_id").notNull(),
  qualityScore: int("quality_score"),
  // درجة الجودة من 0-100
  strengths: text("strengths"),
  improvements: text("improvements"),
  suggestions: text("suggestions"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var linkedinAnalyses = mysqlTable("linkedin_analyses", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  profileUrl: varchar("profile_url", { length: 512 }).notNull(),
  profileScore: int("profile_score"),
  // درجة الملف الشخصي من 0-100
  strengths: text("strengths"),
  weaknesses: text("weaknesses"),
  suggestions: text("suggestions"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var coverLetters = mysqlTable("cover_letters", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  jobTitle: varchar("job_title", { length: 255 }),
  companyName: varchar("company_name", { length: 255 }),
  status: mysqlEnum("status", ["draft", "analyzing", "completed"]).default("draft").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull()
});
var coverLetterAnalyses = mysqlTable("cover_letter_analyses", {
  id: int("id").autoincrement().primaryKey(),
  coverLetterId: int("cover_letter_id").notNull(),
  userId: int("user_id").notNull(),
  qualityScore: int("quality_score"),
  strengths: text("strengths"),
  improvements: text("improvements"),
  suggestions: text("suggestions"),
  improvedContent: text("improved_content"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().unique(),
  cvCredits: int("cv_credits").default(1).notNull(),
  cvUsed: int("cv_used").default(0).notNull(),
  portfolioCredits: int("portfolio_credits").default(1).notNull(),
  portfolioUsed: int("portfolio_used").default(0).notNull(),
  hasUsedFreeTrial: int("has_used_free_trial").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull()
});
var purchases = mysqlTable("purchases", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  packageType: varchar("package_type", { length: 50 }).notNull(),
  creditsAmount: int("credits_amount").notNull(),
  priceUsd: int("price_usd").notNull(),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at")
});

// server/db.ts
init_env();
var _db = null;
async function getDb() {
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
async function upsertUser(user) {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = {
      openId: user.openId
    };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = /* @__PURE__ */ new Date();
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    }
    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function createCvDocument(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(cvDocuments).values(data);
  return result;
}
async function getCvDocumentsByUserId(userId) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(cvDocuments).where(eq(cvDocuments.userId, userId)).orderBy(desc(cvDocuments.createdAt));
}
async function getCvDocumentById(id) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(cvDocuments).where(eq(cvDocuments.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}
async function updateCvDocument(id, data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(cvDocuments).set(data).where(eq(cvDocuments.id, id));
}
async function createCvAnalysis(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(cvAnalyses).values(data);
  return result;
}
async function getCvAnalysisByCvId(cvId) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(cvAnalyses).where(eq(cvAnalyses.cvId, cvId)).orderBy(desc(cvAnalyses.createdAt)).limit(1);
  return result.length > 0 ? result[0] : null;
}
async function createPortfolio(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(portfolios).values(data);
  return result;
}
async function getPortfoliosByUserId(userId) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(portfolios).where(eq(portfolios.userId, userId)).orderBy(desc(portfolios.createdAt));
}
async function createLinkedinAnalysis(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(linkedinAnalyses).values(data);
  return result;
}
async function getLinkedinAnalysesByUserId(userId) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(linkedinAnalyses).where(eq(linkedinAnalyses.userId, userId)).orderBy(desc(linkedinAnalyses.createdAt));
}
async function createCoverLetter(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(coverLetters).values(data);
  return result;
}
async function getCoverLettersByUserId(userId) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(coverLetters).where(eq(coverLetters.userId, userId)).orderBy(desc(coverLetters.createdAt));
}
async function getCoverLetterById(id) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(coverLetters).where(eq(coverLetters.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}
async function getOrCreateSubscription(userId) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  let subscription = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1);
  if (subscription.length === 0) {
    await db.insert(subscriptions).values({
      userId,
      cvCredits: 1,
      cvUsed: 0,
      portfolioCredits: 1,
      portfolioUsed: 0,
      hasUsedFreeTrial: 0
    });
    subscription = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1);
  }
  return subscription[0];
}
async function canCreateCV(userId) {
  const subscription = await getOrCreateSubscription(userId);
  return subscription.cvUsed < subscription.cvCredits;
}
async function canCreatePortfolio(userId) {
  const subscription = await getOrCreateSubscription(userId);
  return subscription.portfolioUsed < subscription.portfolioCredits;
}
async function incrementCVUsage(userId) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const subscription = await getOrCreateSubscription(userId);
  await db.update(subscriptions).set({
    cvUsed: subscription.cvUsed + 1,
    hasUsedFreeTrial: 1
  }).where(eq(subscriptions.userId, userId));
}
async function addCredits(userId, type, amount) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const subscription = await getOrCreateSubscription(userId);
  if (type === "cv") {
    await db.update(subscriptions).set({ cvCredits: subscription.cvCredits + amount }).where(eq(subscriptions.userId, userId));
  } else {
    await db.update(subscriptions).set({ portfolioCredits: subscription.portfolioCredits + amount }).where(eq(subscriptions.userId, userId));
  }
}

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
init_env();
var isNonEmptyString = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client) {
    this.client = client;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    const redirectUri = atob(state);
    return redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(
      EXCHANGE_TOKEN_PATH,
      payload
    );
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(
      GET_USER_INFO_PATH,
      {
        accessToken: token.accessToken
      }
    );
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(
      platforms.filter((p) => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a Manus user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString(openId) || !isNonEmptyString(appId) || !isNonEmptyString(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var sdk = new SDKServer();

// server/_core/oauth.ts
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
function registerOAuthRoutes(app) {
  app.get("/api/oauth/callback", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }
      await upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
init_env();
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString2(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString2(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/routers.ts
import { z as z2 } from "zod";
var appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true
      };
    })
  }),
  cv: router({
    // Get all CV documents for the current user
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getCvDocumentsByUserId(ctx.user.id);
    }),
    // Get a specific CV document
    get: protectedProcedure.input(z2.object({ id: z2.number() })).query(async ({ input, ctx }) => {
      const cv = await getCvDocumentById(input.id);
      if (!cv || cv.userId !== ctx.user.id) {
        throw new Error("CV not found or access denied");
      }
      return cv;
    }),
    // Create a new CV document
    create: protectedProcedure.input(z2.object({
      title: z2.string(),
      content: z2.string().optional(),
      fileUrl: z2.string().optional(),
      fileKey: z2.string().optional()
    })).mutation(async ({ input, ctx }) => {
      const canCreate = await canCreateCV(ctx.user.id);
      if (!canCreate) {
        throw new Error("\u0644\u0627 \u064A\u0648\u062C\u062F \u0631\u0635\u064A\u062F \u0643\u0627\u0641\u064D. \u064A\u0631\u062C\u0649 \u0634\u0631\u0627\u0621 \u0628\u0627\u0642\u0629 \u0644\u0644\u0645\u062A\u0627\u0628\u0639\u0629.");
      }
      const result = await createCvDocument({
        userId: ctx.user.id,
        ...input
      });
      await incrementCVUsage(ctx.user.id);
      return result;
    }),
    // Update CV document
    update: protectedProcedure.input(z2.object({
      id: z2.number(),
      title: z2.string().optional(),
      content: z2.string().optional(),
      status: z2.enum(["draft", "analyzing", "completed"]).optional()
    })).mutation(async ({ input, ctx }) => {
      const cv = await getCvDocumentById(input.id);
      if (!cv || cv.userId !== ctx.user.id) {
        throw new Error("CV not found or access denied");
      }
      const { id, ...data } = input;
      await updateCvDocument(id, data);
      return { success: true };
    }),
    // Get CV analysis
    getAnalysis: protectedProcedure.input(z2.object({ cvId: z2.number() })).query(async ({ input, ctx }) => {
      const cv = await getCvDocumentById(input.cvId);
      if (!cv || cv.userId !== ctx.user.id) {
        throw new Error("CV not found or access denied");
      }
      return await getCvAnalysisByCvId(input.cvId);
    }),
    // Create CV analysis with AI
    analyze: protectedProcedure.input(z2.object({
      cvId: z2.number(),
      content: z2.string(),
      language: z2.enum(["ar", "en"]).optional()
    })).mutation(async ({ input, ctx }) => {
      const { analyzeCVWithAI: analyzeCVWithAI2 } = await Promise.resolve().then(() => (init_aiAnalysis(), aiAnalysis_exports));
      const cv = await getCvDocumentById(input.cvId);
      if (!cv || cv.userId !== ctx.user.id) {
        throw new Error("CV not found or access denied");
      }
      await updateCvDocument(input.cvId, { status: "analyzing" });
      try {
        const aiAnalysis = await analyzeCVWithAI2(input.content, input.language || "ar");
        const analysis = await createCvAnalysis({
          cvId: input.cvId,
          userId: ctx.user.id,
          atsScore: aiAnalysis.score,
          // Using score as atsScore
          strengths: JSON.stringify(aiAnalysis.strengths),
          weaknesses: JSON.stringify(aiAnalysis.weaknesses),
          suggestions: JSON.stringify(aiAnalysis.suggestions),
          correctedContent: aiAnalysis.detailedFeedback
          // Using correctedContent for detailed feedback
        });
        await updateCvDocument(input.cvId, { status: "completed" });
        return analysis;
      } catch (error) {
        await updateCvDocument(input.cvId, { status: "draft" });
        throw error;
      }
    }),
    // Create professional CV (paid service - $1)
    createProfessionalCV: protectedProcedure.input(z2.object({
      cvId: z2.number()
    })).mutation(async ({ input, ctx }) => {
      const { getStripe: getStripe2 } = await Promise.resolve().then(() => (init_stripe(), stripe_exports));
      const stripe = getStripe2();
      const cv = await getCvDocumentById(input.cvId);
      if (!cv || cv.userId !== ctx.user.id) {
        throw new Error("\u0627\u0644\u0633\u064A\u0631\u0629 \u0627\u0644\u0630\u0627\u062A\u064A\u0629 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F\u0629");
      }
      if (!cv.content) {
        throw new Error("\u0644\u0627 \u064A\u0648\u062C\u062F \u0645\u062D\u062A\u0648\u0649 \u0644\u0644\u0633\u064A\u0631\u0629 \u0627\u0644\u0630\u0627\u062A\u064A\u0629");
      }
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "\u0633\u064A\u0631\u0629 \u0630\u0627\u062A\u064A\u0629 \u0627\u062D\u062A\u0631\u0627\u0641\u064A\u0629 \u062C\u0627\u0647\u0632\u0629",
                description: "\u0633\u064A\u0631\u0629 \u0630\u0627\u062A\u064A\u0629 \u0645\u062D\u0633\u0651\u0646\u0629 \u0628\u0627\u0644\u0643\u0627\u0645\u0644 \u0628\u0648\u0627\u0633\u0637\u0629 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A"
              },
              unit_amount: 100
              // $1.00
            },
            quantity: 1
          }
        ],
        mode: "payment",
        success_url: `${(await Promise.resolve().then(() => (init_env(), env_exports))).ENV.frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}&type=pro_cv&cvId=${input.cvId}`,
        cancel_url: `${(await Promise.resolve().then(() => (init_env(), env_exports))).ENV.frontendUrl}/cv/analysis/${input.cvId}`,
        metadata: {
          userId: ctx.user.id.toString(),
          cvId: input.cvId.toString(),
          type: "professional_cv"
        }
      });
      return {
        paymentUrl: session.url
      };
    })
  }),
  portfolio: router({
    // Get all portfolios for the current user
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getPortfoliosByUserId(ctx.user.id);
    }),
    // Create a new portfolio
    create: protectedProcedure.input(z2.object({
      title: z2.string(),
      description: z2.string().optional(),
      content: z2.string().optional(),
      fileUrl: z2.string().optional(),
      fileKey: z2.string().optional()
    })).mutation(async ({ input, ctx }) => {
      return await createPortfolio({
        userId: ctx.user.id,
        ...input
      });
    })
  }),
  linkedin: router({
    // Get all LinkedIn analyses for the current user
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getLinkedinAnalysesByUserId(ctx.user.id);
    }),
    // Analyze LinkedIn profile (placeholder)
    analyze: protectedProcedure.input(z2.object({
      profileUrl: z2.string().url()
    })).mutation(async ({ input, ctx }) => {
      return await createLinkedinAnalysis({
        userId: ctx.user.id,
        profileUrl: input.profileUrl,
        profileScore: 0,
        strengths: JSON.stringify([]),
        weaknesses: JSON.stringify([]),
        suggestions: JSON.stringify([])
      });
    })
  }),
  coverLetter: router({
    // Get all cover letters for the current user
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getCoverLettersByUserId(ctx.user.id);
    }),
    // Get a specific cover letter
    get: protectedProcedure.input(z2.object({ id: z2.number() })).query(async ({ input, ctx }) => {
      const letter = await getCoverLetterById(input.id);
      if (!letter || letter.userId !== ctx.user.id) {
        throw new Error("Cover letter not found or access denied");
      }
      return letter;
    }),
    // Create a new cover letter
    create: protectedProcedure.input(z2.object({
      title: z2.string(),
      content: z2.string(),
      jobTitle: z2.string().optional(),
      companyName: z2.string().optional()
    })).mutation(async ({ input, ctx }) => {
      return await createCoverLetter({
        userId: ctx.user.id,
        ...input
      });
    })
  }),
  subscription: router({
    // Get current user's subscription info
    get: protectedProcedure.query(async ({ ctx }) => {
      return await getOrCreateSubscription(ctx.user.id);
    }),
    // Check if user can create CV
    canCreateCV: protectedProcedure.query(async ({ ctx }) => {
      return await canCreateCV(ctx.user.id);
    }),
    // Check if user can create portfolio
    canCreatePortfolio: protectedProcedure.query(async ({ ctx }) => {
      return await canCreatePortfolio(ctx.user.id);
    }),
    // Create Stripe checkout session
    createCheckoutSession: protectedProcedure.input(z2.object({
      packageId: z2.string(),
      price: z2.number(),
      credits: z2.number(),
      type: z2.string()
    })).mutation(async ({ input, ctx }) => {
      const { createCheckoutSession: createCheckoutSession2 } = await Promise.resolve().then(() => (init_stripe(), stripe_exports));
      const session = await createCheckoutSession2({
        userId: ctx.user.id,
        userEmail: ctx.user.email || "",
        packageId: input.packageId,
        price: input.price,
        credits: input.credits,
        type: input.type
      });
      return {
        url: session.url,
        sessionId: session.sessionId,
        success: true
      };
    }),
    // Verify payment and add credits
    verifyPayment: protectedProcedure.input(z2.object({ sessionId: z2.string() })).mutation(async ({ input, ctx }) => {
      const { verifyCheckoutSession: verifyCheckoutSession2 } = await Promise.resolve().then(() => (init_stripe(), stripe_exports));
      const result = await verifyCheckoutSession2(input.sessionId);
      if (result.success && result.metadata) {
        const credits = parseInt(result.metadata.credits);
        const type = result.metadata.type;
        if (type === "CV") {
          await addCredits(ctx.user.id, "cv", credits);
        } else if (type === "Portfolio") {
          await addCredits(ctx.user.id, "portfolio", credits);
        }
        return { success: true, credits, type };
      }
      return { success: false };
    })
  })
});

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/_core/vite.ts
import express from "express";
import fs from "fs";
import { nanoid } from "nanoid";
import path2 from "path";
import { createServer as createViteServer } from "vite";
C
      "localhost",
      "127.0.0.1"
    ],
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/_core/vite.ts
async function setupVite(app, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    server: serverOptions,
    appType: "custom"
  });
  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app) {
  const distPath = process.env.NODE_ENV === "development" ? path2.resolve(import.meta.dirname, "../..", "dist", "public") : path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app.use(express.static(distPath));
  app.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/_core/index.ts
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}
async function findAvailablePort(startPort = 3e3) {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}
async function startServer() {
  const app = express2();
  const server = createServer(app);
  app.use(express2.json({ limit: "50mb" }));
  app.use(express2.urlencoded({ limit: "50mb", extended: true }));
  registerOAuthRoutes(app);
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext
    })
  );
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
startServer().catch(console.error);
