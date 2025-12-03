import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  cv: router({
    // Get all CV documents for the current user
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getCvDocumentsByUserId(ctx.user.id);
    }),

    // Get a specific CV document
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        const cv = await db.getCvDocumentById(input.id);
        if (!cv || cv.userId !== ctx.user.id) {
          throw new Error("CV not found or access denied");
        }
        return cv;
      }),

    // Create a new CV document
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        content: z.string().optional(),
        fileUrl: z.string().optional(),
        fileKey: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        // فحص الرصيد قبل الإنشاء
        const canCreate = await db.canCreateCV(ctx.user.id);
        if (!canCreate) {
          throw new Error("لا يوجد رصيد كافٍ. يرجى شراء باقة للمتابعة.");
        }

        const result = await db.createCvDocument({
          userId: ctx.user.id,
          ...input,
        });

        // زيادة عداد الاستخدام
        await db.incrementCVUsage(ctx.user.id);

        return result;
      }),

    // Update CV document
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        content: z.string().optional(),
        status: z.enum(["draft", "analyzing", "completed"]).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const cv = await db.getCvDocumentById(input.id);
        if (!cv || cv.userId !== ctx.user.id) {
          throw new Error("CV not found or access denied");
        }
        const { id, ...data } = input;
        await db.updateCvDocument(id, data);
        return { success: true };
      }),

    // Get CV analysis
    getAnalysis: protectedProcedure
      .input(z.object({ cvId: z.number() }))
      .query(async ({ input, ctx }) => {
        const cv = await db.getCvDocumentById(input.cvId);
        if (!cv || cv.userId !== ctx.user.id) {
          throw new Error("CV not found or access denied");
        }
        return await db.getCvAnalysisByCvId(input.cvId);
      }),

    // Create CV analysis with AI
    analyze: protectedProcedure
      .input(z.object({
        cvId: z.number(),
        content: z.string(),
        language: z.enum(["ar", "en"]).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { analyzeCVWithAI } = await import("./_core/aiAnalysis");
        
        const cv = await db.getCvDocumentById(input.cvId);
        if (!cv || cv.userId !== ctx.user.id) {
          throw new Error("CV not found or access denied");
        }

        // Update CV status to analyzing
        await db.updateCvDocument(input.cvId, { status: "analyzing" });

        try {
          // Analyze with AI
          const aiAnalysis = await analyzeCVWithAI(input.content, input.language || "ar");
          
          // Save analysis to database
          const analysis = await db.createCvAnalysis({
            cvId: input.cvId,
            userId: ctx.user.id,
            atsScore: aiAnalysis.score, // Using score as atsScore
            strengths: JSON.stringify(aiAnalysis.strengths),
            weaknesses: JSON.stringify(aiAnalysis.weaknesses),
            suggestions: JSON.stringify(aiAnalysis.suggestions),
            correctedContent: aiAnalysis.detailedFeedback, // Using correctedContent for detailed feedback
          });

          // Update CV status to completed
          await db.updateCvDocument(input.cvId, { status: "completed" });

          return analysis;
        } catch (error) {
          // Update CV status to draft on error
          await db.updateCvDocument(input.cvId, { status: "draft" });
          throw error;
        }
      }),
    
    // Create professional CV (paid service - $1)
    createProfessionalCV: protectedProcedure
      .input(z.object({
        cvId: z.number(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { getStripe } = await import("./_core/stripe");
        const stripe = getStripe();
        
        // Get original CV
        const cv = await db.getCvDocumentById(input.cvId);
        if (!cv || cv.userId !== ctx.user.id) {
          throw new Error("السيرة الذاتية غير موجودة");
        }
        
        if (!cv.content) {
          throw new Error("لا يوجد محتوى للسيرة الذاتية");
        }
        
        // Create Stripe checkout session for $1
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: "سيرة ذاتية احترافية جاهزة",
                  description: "سيرة ذاتية محسّنة بالكامل بواسطة الذكاء الاصطناعي",
                },
                unit_amount: 100, // $1.00
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `${(await import("./_core/env")).ENV.frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}&type=pro_cv&cvId=${input.cvId}`,
          cancel_url: `${(await import("./_core/env")).ENV.frontendUrl}/cv/analysis/${input.cvId}`,
          metadata: {
            userId: ctx.user.id.toString(),
            cvId: input.cvId.toString(),
            type: "professional_cv",
          },
        });
        
        return {
          paymentUrl: session.url,
        };
      }),
  }),

  portfolio: router({
    // Get all portfolios for the current user
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getPortfoliosByUserId(ctx.user.id);
    }),

    // Create a new portfolio
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
        content: z.string().optional(),
        fileUrl: z.string().optional(),
        fileKey: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return await db.createPortfolio({
          userId: ctx.user.id,
          ...input,
        });
      }),
  }),

  linkedin: router({
    // Get all LinkedIn analyses for the current user
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getLinkedinAnalysesByUserId(ctx.user.id);
    }),

    // Analyze LinkedIn profile (placeholder)
    analyze: protectedProcedure
      .input(z.object({
        profileUrl: z.string().url(),
      }))
      .mutation(async ({ input, ctx }) => {
        // TODO: Implement LinkedIn analysis with AI
        return await db.createLinkedinAnalysis({
          userId: ctx.user.id,
          profileUrl: input.profileUrl,
          profileScore: 0,
          strengths: JSON.stringify([]),
          weaknesses: JSON.stringify([]),
          suggestions: JSON.stringify([]),
        });
      }),
  }),

  coverLetter: router({
    // Get all cover letters for the current user
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getCoverLettersByUserId(ctx.user.id);
    }),

    // Get a specific cover letter
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        const letter = await db.getCoverLetterById(input.id);
        if (!letter || letter.userId !== ctx.user.id) {
          throw new Error("Cover letter not found or access denied");
        }
        return letter;
      }),

    // Create a new cover letter
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        content: z.string(),
        jobTitle: z.string().optional(),
        companyName: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return await db.createCoverLetter({
          userId: ctx.user.id,
          ...input,
        });
      }),
  }),

  subscription: router({
    // Get current user's subscription info
    get: protectedProcedure.query(async ({ ctx }) => {
      return await db.getOrCreateSubscription(ctx.user.id);
    }),

    // Check if user can create CV
    canCreateCV: protectedProcedure.query(async ({ ctx }) => {
      return await db.canCreateCV(ctx.user.id);
    }),

    // Check if user can create portfolio
    canCreatePortfolio: protectedProcedure.query(async ({ ctx }) => {
      return await db.canCreatePortfolio(ctx.user.id);
    }),

    // Create Stripe checkout session
    createCheckoutSession: protectedProcedure
      .input(z.object({
        packageId: z.string(),
        price: z.number(),
        credits: z.number(),
        type: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { createCheckoutSession } = await import("./_core/stripe");
        
        const session = await createCheckoutSession({
          userId: ctx.user.id,
          userEmail: ctx.user.email || "",
          packageId: input.packageId,
          price: input.price,
          credits: input.credits,
          type: input.type,
        });

        return {
          url: session.url,
          sessionId: session.sessionId,
          success: true,
        };
      }),

    // Verify payment and add credits
    verifyPayment: protectedProcedure
      .input(z.object({ sessionId: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const { verifyCheckoutSession } = await import("./_core/stripe");
        
        const result = await verifyCheckoutSession(input.sessionId);
        
        if (result.success && result.metadata) {
          const credits = parseInt(result.metadata.credits);
          const type = result.metadata.type;
          
          // Add credits to user's subscription
          if (type === "CV") {
            await db.addCredits(ctx.user.id, 'cv', credits);
          } else if (type === "Portfolio") {
            await db.addCredits(ctx.user.id, 'portfolio', credits);
          }
          
          return { success: true, credits, type };
        }
        
        return { success: false };
      }),
  }),
});

export type AppRouter = typeof appRouter;
