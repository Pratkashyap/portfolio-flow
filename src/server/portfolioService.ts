import { getDb } from "./db";
import { portfolios, InsertPortfolio } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export interface PortfolioGenerationInput {
  userId: number;
  templateId: number;
  resumeData: any;
  questionnaireData: any;
  githubData?: any;
  linkedinUrl?: string;
  githubUrl?: string;
}

/**
 * Generate a unique portfolio URL slug from user name
 */
export function generatePortfolioSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, "") // Remove special characters
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .slice(0, 30); // Limit to 30 characters
}

/**
 * Create and deploy a new portfolio
 */
export async function generatePortfolio(input: PortfolioGenerationInput): Promise<{
  portfolioId: number;
  portfolioUrl: string;
  slug: string;
}> {
  try {
    const db = await getDb();
    if (!db) {
      throw new Error("Database connection failed");
    }

    // Generate unique slug from user name
    const baseSlug = generatePortfolioSlug(input.resumeData.name || "portfolio");
    let slug = baseSlug;
    let counter = 1;

    // Check if slug already exists and generate unique one
    while (true) {
      const existing = await db
        .select()
        .from(portfolios)
        .where(eq(portfolios.portfolioUrl, `https://${slug}-${input.userId}.manus.space`))
        .limit(1);

      if (existing.length === 0) {
        break;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const portfolioUrl = `https://${slug}-${input.userId}.manus.space`;

    // Create portfolio record
    const portfolioData: InsertPortfolio = {
      userId: input.userId,
      templateId: input.templateId,
      resumeData: JSON.stringify(input.resumeData),
      questionnaireData: JSON.stringify(input.questionnaireData),
      githubData: input.githubData ? JSON.stringify(input.githubData) : null,
      linkedinUrl: input.linkedinUrl,
      githubUrl: input.githubUrl,
      portfolioUrl,
      isPublished: 1,
    };

    // Insert into database
    const result = await db.insert(portfolios).values(portfolioData);

    console.log(`[Portfolio Service] Portfolio created: ${portfolioUrl}`);

    return {
      portfolioId: result[0] as unknown as number,
      portfolioUrl,
      slug,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[Portfolio Service] Error generating portfolio: ${errorMessage}`);
    throw new Error(`Failed to generate portfolio: ${errorMessage}`);
  }
}

/**
 * Get portfolio by URL slug
 */
export async function getPortfolioBySlug(slug: string) {
  try {
    const db = await getDb();
    if (!db) {
      throw new Error("Database connection failed");
    }

    // Extract user ID from slug (format: slug-userId)
    const parts = slug.split("-");
    const userId = parseInt(parts[parts.length - 1]);

    if (isNaN(userId)) {
      throw new Error("Invalid portfolio slug format");
    }

    const result = await db
      .select()
      .from(portfolios)
      .where(eq(portfolios.userId, userId))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const portfolio = result[0];

    // Parse JSON fields
    return {
      ...portfolio,
      resumeData: portfolio.resumeData ? JSON.parse(portfolio.resumeData) : null,
      questionnaireData: portfolio.questionnaireData
        ? JSON.parse(portfolio.questionnaireData)
        : null,
      githubData: portfolio.githubData ? JSON.parse(portfolio.githubData) : null,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[Portfolio Service] Error fetching portfolio: ${errorMessage}`);
    throw new Error(`Failed to fetch portfolio: ${errorMessage}`);
  }
}

/**
 * Get all portfolios for a user
 */
export async function getUserPortfolios(userId: number) {
  try {
    const db = await getDb();
    if (!db) {
      throw new Error("Database connection failed");
    }

    const results = await db
      .select()
      .from(portfolios)
      .where(eq(portfolios.userId, userId));

    return results.map((portfolio) => ({
      ...portfolio,
      resumeData: portfolio.resumeData ? JSON.parse(portfolio.resumeData) : null,
      questionnaireData: portfolio.questionnaireData
        ? JSON.parse(portfolio.questionnaireData)
        : null,
      githubData: portfolio.githubData ? JSON.parse(portfolio.githubData) : null,
    }));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[Portfolio Service] Error fetching user portfolios: ${errorMessage}`);
    throw new Error(`Failed to fetch portfolios: ${errorMessage}`);
  }
}
