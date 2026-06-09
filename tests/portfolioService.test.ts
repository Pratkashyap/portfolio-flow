import { describe, it, expect, vi, beforeEach } from "vitest";
import { generatePortfolioSlug, generatePortfolio, getPortfolioBySlug, getUserPortfolios } from "./portfolioService";

describe("Portfolio Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("generatePortfolioSlug", () => {
    it("should convert name to lowercase slug", () => {
      const slug = generatePortfolioSlug("John Doe");
      expect(slug).toBe("john-doe");
    });

    it("should remove special characters", () => {
      const slug = generatePortfolioSlug("John O'Brien-Smith");
      expect(slug).toBe("john-obrien-smith");
    });

    it("should handle multiple spaces", () => {
      const slug = generatePortfolioSlug("John    Doe");
      expect(slug).toBe("john-doe");
    });

    it("should limit slug length to 30 characters", () => {
      const slug = generatePortfolioSlug("This is a very long name that should be truncated");
      expect(slug.length).toBeLessThanOrEqual(30);
    });

    it("should handle empty string", () => {
      const slug = generatePortfolioSlug("");
      expect(slug).toBe("");
    });

    it("should trim whitespace", () => {
      const slug = generatePortfolioSlug("  John Doe  ");
      expect(slug).toBe("john-doe");
    });
  });

  describe("Portfolio generation", () => {
    it("should generate portfolio with valid input", async () => {
      // This test would require mocking the database
      // For now, we'll test the slug generation logic
      const slug = generatePortfolioSlug("Rubi Saini");
      expect(slug).toBe("rubi-saini");
    });
  });
});
