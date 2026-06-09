import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { eq } from "drizzle-orm";
import { portfolios } from "../drizzle/schema";

export const portfolioDisplayRouter = router({
  // Get portfolio by URL slug - public endpoint
  getByUrl: publicProcedure
    .input(z.object({ portfolioUrl: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      const portfolio = await db
        .select()
        .from(portfolios)
        .where(eq(portfolios.portfolioUrl, input.portfolioUrl))
        .limit(1);

      if (portfolio.length === 0) {
        throw new Error("Portfolio not found");
      }

      const p = portfolio[0];
      if (!p.isPublished) {
        throw new Error("Portfolio not published");
      }

      return {
        id: p.id,
        portfolioUrl: p.portfolioUrl,
        templateId: p.templateId,
        resumeData: p.resumeData ? JSON.parse(p.resumeData) : null,
        questionnaireData: p.questionnaireData ? JSON.parse(p.questionnaireData) : null,
        githubData: p.githubData ? JSON.parse(p.githubData) : null,
        linkedinUrl: p.linkedinUrl,
        githubUrl: p.githubUrl,
        createdAt: p.createdAt,
      };
    }),

  // Get portfolio by ID (for authenticated users to view their own)
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      const portfolio = await db
        .select()
        .from(portfolios)
        .where(eq(portfolios.id, input.id))
        .limit(1);

      if (portfolio.length === 0) {
        throw new Error("Portfolio not found");
      }

      const p = portfolio[0];

      return {
        id: p.id,
        portfolioUrl: p.portfolioUrl,
        templateId: p.templateId,
        resumeData: p.resumeData ? JSON.parse(p.resumeData) : null,
        questionnaireData: p.questionnaireData ? JSON.parse(p.questionnaireData) : null,
        githubData: p.githubData ? JSON.parse(p.githubData) : null,
        linkedinUrl: p.linkedinUrl,
        githubUrl: p.githubUrl,
        isPublished: p.isPublished,
        createdAt: p.createdAt,
      };
    }),
});
