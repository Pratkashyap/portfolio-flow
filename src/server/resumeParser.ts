import { parseResumeHybrid } from "./hybridResumeParser";
import { robustInvokeLLM } from "./robustLLM";

export interface ParsedResume {
  name: string;
  email: string;
  phone: string;
  summary?: string;
  experience: Array<{
    company: string;
    role: string;
    duration: string;
    description: string;
  }>;
  skills: string[];
  education: Array<{
    school: string;
    degree: string;
    field: string;
  }>;
}

/**
 * Parse resume using hybrid approach:
 * 1. Primary: Fast, reliable regex-based extraction
 * 2. Enhancement: Optional LLM for professional summaries and descriptions
 * 
 * This ensures parsing NEVER fails due to LLM issues.
 */
export async function parseResume(resumeText: string): Promise<ParsedResume> {
  if (!resumeText || resumeText.trim().length === 0) {
    throw new Error("Resume text is empty");
  }

  console.log("[Resume Parser] Starting parsing with hybrid approach");

  // ===== STEP 1: RELIABLE REGEX-BASED EXTRACTION =====
  let result: ParsedResume;
  try {
    result = parseResumeHybrid(resumeText);
    console.log("[Resume Parser] Hybrid extraction successful");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[Resume Parser] Hybrid extraction failed:", errorMessage);
    throw new Error(errorMessage);
  }

  // ===== STEP 2: OPTIONAL LLM ENHANCEMENT (NON-BLOCKING) =====
  // Only enhance if we have basic data. Never block on LLM.
  try {
    console.log("[Resume Parser] Attempting LLM enhancement (non-blocking)");

    // Enhance summary if missing
    if (!result.summary || result.summary.length < 20) {
      const summaryPrompt = `Based on this resume data, write a 1-2 sentence professional summary:
Name: ${result.name}
Experience: ${result.experience.map((e) => `${e.role} at ${e.company}`).join(", ")}
Skills: ${result.skills.join(", ")}

Keep it concise and professional.`;

      const enhancedSummary = await robustInvokeLLM(
        [{ role: "user", content: summaryPrompt }],
        { fallbackValue: result.summary || "" }
      );

      if (enhancedSummary && enhancedSummary.length > 10) {
        result.summary = enhancedSummary.substring(0, 300);
        console.log("[Resume Parser] Enhanced summary via LLM");
      }
    }

    // Enhance experience descriptions if missing
    if (result.experience.length > 0) {
      for (let i = 0; i < Math.min(result.experience.length, 3); i++) {
        const exp = result.experience[i];
        if (!exp.description || exp.description.length < 10) {
          const descPrompt = `Write a 1-2 sentence professional description for this role:
Role: ${exp.role}
Company: ${exp.company}
Duration: ${exp.duration}

Keep it concise and impactful.`;

          const enhancedDesc = await robustInvokeLLM(
            [{ role: "user", content: descPrompt }],
            { fallbackValue: exp.description || "" }
          );

          if (enhancedDesc && enhancedDesc.length > 5) {
            exp.description = enhancedDesc.substring(0, 200);
            console.log(`[Resume Parser] Enhanced experience #${i + 1} description via LLM`);
          }
        }
      }
    }

    console.log("[Resume Parser] LLM enhancement completed successfully");
  } catch (error) {
    // LLM enhancement failed - that's OK, we already have the core data
    console.warn(
      "[Resume Parser] LLM enhancement failed (non-blocking):",
      error instanceof Error ? error.message : String(error)
    );
    // Continue without enhancement - the resume is still valid
  }

  // ===== FINAL VALIDATION =====
  if (!result.name || result.name === "Unknown") {
    throw new Error("Could not extract name from resume");
  }

  console.log(`[Resume Parser] Successfully parsed resume for: ${result.name}`);
  console.log(
    `[Resume Parser] Extracted: ${result.experience.length} experiences, ${result.skills.length} skills, ${result.education.length} education entries`
  );

  return result;
}
