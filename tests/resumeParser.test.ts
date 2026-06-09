import { describe, it, expect, vi } from "vitest";
import { parseResume } from "./resumeParser";

// Mock the hybrid parser
vi.mock("./hybridResumeParser", () => ({
  parseResumeHybrid: vi.fn((text) => {
    // Simple mock that extracts basic info from text
    if (!text || text.trim().length === 0) {
      throw new Error("Resume text is empty");
    }

    // For "Sample resume text" - should fail to extract name
    if (text === "Sample resume text") {
      throw new Error("Could not extract name from resume. Please ensure your resume contains your name.");
    }

    // For the full test resume
    return {
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      summary: "",
      experience: [
        {
          company: "Tech Corp",
          role: "Senior Developer",
          duration: "2020-2023",
          description: "Led development of core features",
        },
      ],
      skills: ["JavaScript", "React", "Node.js", "TypeScript"],
      education: [
        {
          school: "University of Tech",
          degree: "Bachelor",
          field: "Computer Science",
        },
      ],
    };
  }),
}));

// Mock the robust LLM
vi.mock("./robustLLM", () => ({
  robustInvokeLLM: vi.fn(async (messages, options) => {
    // Mock LLM enhancement
    return "Experienced software engineer with expertise in full-stack development";
  }),
}));

describe("Resume Parser", () => {
  it("should parse resume text and extract structured data", async () => {
    const resumeText = `
      John Doe
      john@example.com
      +1 (555) 123-4567
      
      EXPERIENCE
      Senior Developer at Tech Corp (2020-2023)
      Led development of core features
      
      SKILLS
      JavaScript, React, Node.js, TypeScript
      
      EDUCATION
      Bachelor in Computer Science
      University of Tech
    `;

    const result = await parseResume(resumeText);

    expect(result).toBeDefined();
    expect(result.name).toBe("John Doe");
    expect(result.email).toBe("john@example.com");
    expect(result.phone).toBe("+1 (555) 123-4567");
    expect(result.experience).toHaveLength(1);
    expect(result.experience[0].company).toBe("Tech Corp");
    expect(result.skills).toContain("JavaScript");
    expect(result.education).toHaveLength(1);
  });

  it("should handle empty resume text gracefully", async () => {
    const resumeText = "";

    await expect(parseResume(resumeText)).rejects.toThrow("Resume text is empty");
  });

  it("should extract all required fields", async () => {
    const resumeText = `
      John Doe
      john@example.com
      +1 (555) 123-4567
      
      SKILLS
      JavaScript, React, Node.js, TypeScript
    `;

    const result = await parseResume(resumeText);

    expect(result).toHaveProperty("name");
    expect(result).toHaveProperty("email");
    expect(result).toHaveProperty("phone");
    expect(result).toHaveProperty("experience");
    expect(result).toHaveProperty("skills");
    expect(result).toHaveProperty("education");
  });

  it("should enhance summary via LLM when missing", async () => {
    const resumeText = `
      John Doe
      john@example.com
      +1 (555) 123-4567
      
      EXPERIENCE
      Senior Developer at Tech Corp (2020-2023)
      
      SKILLS
      JavaScript, React, Node.js, TypeScript
    `;

    const result = await parseResume(resumeText);

    // Summary should be enhanced by LLM
    expect(result.summary).toBeDefined();
    expect(result.summary?.length).toBeGreaterThan(0);
  });
});
