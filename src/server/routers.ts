import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { parseResume } from "./resumeParser";
import { fetchGitHubData, fetchGitHubProfile } from "./githubService";
import { convertPdfToText } from "./pdfHandler";
import { generatePortfolio, getUserPortfolios, getPortfolioBySlug } from "./portfolioService";
import { portfolioDisplayRouter } from "./portfolioDisplayRouter";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,
  portfolioDisplay: portfolioDisplayRouter,
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

  resume: router({
    parse: publicProcedure
      .input(z.object({ resumeText: z.string() }))
      .mutation(async ({ input }) => {
        try {
          const parsed = await parseResume(input.resumeText);
          return parsed;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.error("[Resume Parser] Error:", errorMessage);
          throw new Error(errorMessage);
        }
      }),

    uploadPdf: publicProcedure
      .input(z.object({ fileBuffer: z.string() }))
      .mutation(async ({ input }) => {
        try {
          if (!input.fileBuffer || input.fileBuffer.length === 0) {
            throw new Error("No file data provided");
          }

          console.log(`[PDF Upload] Received ${input.fileBuffer.length} characters of base64 data`);

          const buffer = Buffer.from(input.fileBuffer, "base64");
          console.log(`[PDF Upload] Decoded to ${buffer.length} bytes`);

          if (buffer.length === 0) {
            throw new Error("Failed to decode PDF file - buffer is empty");
          }

          const text = await convertPdfToText(buffer);
          console.log(`[PDF Upload] Successfully extracted ${text.length} characters`);
          return { text };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.error("[PDF Upload] Error:", errorMessage);
          throw new Error(errorMessage);
        }
      }),
  }),

  github: router({
    fetchData: publicProcedure
      .input(z.object({ githubUrl: z.string() }))
      .query(async ({ input }) => {
        try {
          const data = await fetchGitHubData(input.githubUrl);
          return data;
        } catch (error) {
          throw new Error("Failed to fetch GitHub data");
        }
      }),

    fetchProfile: publicProcedure
      .input(z.object({ githubUrl: z.string() }))
      .query(async ({ input }) => {
        try {
          const profile = await fetchGitHubProfile(input.githubUrl);
          return profile;
        } catch (error) {
          throw new Error("Failed to fetch GitHub profile");
        }
      }),
  }),

  portfolio: router({
    generate: protectedProcedure
      .input(
        z.object({
          templateId: z.number(),
          resumeData: z.any(),
          questionnaireData: z.any(),
          githubData: z.any().optional(),
          linkedinUrl: z.string().optional(),
          githubUrl: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        try {
          const result = await generatePortfolio({
            userId: ctx.user.id,
            templateId: input.templateId,
            resumeData: input.resumeData,
            questionnaireData: input.questionnaireData,
            githubData: input.githubData,
            linkedinUrl: input.linkedinUrl,
            githubUrl: input.githubUrl,
          });
          return result;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to generate portfolio";
          throw new Error(errorMessage);
        }
      }),

    getMyPortfolios: protectedProcedure.query(async ({ ctx }) => {
      try {
        const portfolios = await getUserPortfolios(ctx.user.id);
        return portfolios;
      } catch (error) {
        throw new Error("Failed to fetch portfolios");
      }
    }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        try {
          const portfolio = await getPortfolioBySlug(input.slug);
          if (!portfolio) {
            throw new Error("Portfolio not found");
          }
          return portfolio;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to fetch portfolio";
          throw new Error(errorMessage);
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
