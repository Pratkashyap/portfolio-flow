import { describe, it, expect } from "vitest";
import { parseResumeHybrid } from "./hybridResumeParser";

describe("Hybrid Resume Parser", () => {
  it("should extract basic info using regex", () => {
    const resumeText = `
      John Doe
      john.doe@email.com
      +1-555-0123
      
      SKILLS
      Python, JavaScript, React, Node.js
      
      EDUCATION
      Bachelor of Science in Computer Science
      State University, 2020
    `;

    const result = parseResumeHybrid(resumeText);

    expect(result.name).toBe("John Doe");
    expect(result.email).toBe("john.doe@email.com");
    expect(result.phone).toContain("555");
    expect(result.skills.length).toBeGreaterThan(0);
  });

  it("should throw error for empty resume", () => {
    expect(() => parseResumeHybrid("")).toThrow("Resume text is empty");
  });

  it("should throw error if name cannot be extracted", () => {
    const resumeText = "just some random text without a name";
    expect(() => parseResumeHybrid(resumeText)).toThrow("Could not extract name");
  });

  it("should handle resume with minimal information", () => {
    const resumeText = `
      Jane Smith
      jane@example.com
    `;

    const result = parseResumeHybrid(resumeText);

    expect(result.name).toBe("Jane Smith");
    expect(result.email).toBe("jane@example.com");
    expect(Array.isArray(result.experience)).toBe(true);
    expect(Array.isArray(result.skills)).toBe(true);
  });

  it("should extract names in ALL CAPS format (like RIYA GUPTA)", () => {
    const resumeText = `
      RIYA GUPTA
      Contact- 9370336699
      riya.gupta.we@gmail.com
      http://www.linkedin.com/in/riyagupta1106
      
      SUMMARY
      Detail-oriented Risk Consultant
      
      SKILLS
      Data Analysis, Risk Assessment, Financial Modeling
    `;

    const result = parseResumeHybrid(resumeText);

    expect(result.name).toBe("RIYA GUPTA");
    expect(result.email).toBe("riya.gupta.we@gmail.com");
    expect(result.phone).toContain("9370");
    expect(result.skills.length).toBeGreaterThan(0);
  });

  it("should extract data from a real-world resume", () => {
    const resumeText = `
      Prateek Kashyap
      prateek@example.com
      +65-8345-9023
      
      PROFESSIONAL SUMMARY
      Data analytics leader with 9+ years of experience
      
      EXPERIENCE
      Warner Brothers Discovery
      Senior Data Analyst
      Jan 2023 - Present
      Led analytics initiatives
      
      MediaCorp
      Data Analyst
      Jun 2021 - Dec 2022
      Developed dashboards
      
      SKILLS
      Python, SQL, Tableau, Power BI, AWS, Azure, Machine Learning
      
      EDUCATION
      Master of Science in Data Science
      National University of Singapore
      2021
    `;

    const result = parseResumeHybrid(resumeText);

    expect(result.name).toBe("Prateek Kashyap");
    expect(result.email).toBe("prateek@example.com");
    expect(result.phone).toContain("8345");
    expect(result.skills.length).toBeGreaterThan(0);
    expect(result.education.length).toBeGreaterThan(0);
  });
});
