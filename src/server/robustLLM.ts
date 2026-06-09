import { invokeLLM } from "./_core/llm";

/**
 * Robust LLM wrapper with retry logic, timeout handling, and graceful fallback
 */

interface LLMOptions {
  maxRetries?: number;
  timeoutMs?: number;
  fallbackValue?: string;
}

/**
 * Call LLM with retry logic and timeout handling
 */
export async function robustInvokeLLM(
  messages: Array<{ role: "user" | "system" | "assistant"; content: string }>,
  options: LLMOptions = {}
): Promise<string> {
  const { maxRetries = 3, timeoutMs = 30000, fallbackValue = "" } = options;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[LLM] Attempt ${attempt}/${maxRetries}...`);

      // Create a timeout promise
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("LLM request timeout")), timeoutMs)
      );

      // Race between LLM call and timeout
      const response = await Promise.race([
        invokeLLM({ messages }),
        timeoutPromise,
      ]);

      // Extract text from response
      const messageContent = response.choices?.[0]?.message?.content;
      if (!messageContent || typeof messageContent !== "string") {
        throw new Error("Empty or invalid response from LLM");
      }

      console.log(`[LLM] Success on attempt ${attempt}`);
      return messageContent;
    } catch (error) {
      console.error(`[LLM] Attempt ${attempt} failed:`, error instanceof Error ? error.message : error);

      if (attempt === maxRetries) {
        console.error(`[LLM] All ${maxRetries} attempts failed. Using fallback.`);
        return fallbackValue;
      }

      // Wait before retrying (exponential backoff)
      const delayMs = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
      console.log(`[LLM] Retrying in ${delayMs}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return fallbackValue;
}

/**
 * Generate professional summary from resume data
 */
export async function generateProfessionalSummary(
  name: string,
  title: string,
  experience: string,
  skills: string
): Promise<string> {
  const prompt = `Generate a professional 2-3 sentence summary for a resume. Use the following information:
Name: ${name}
Title: ${title}
Years of Experience: ${experience}
Key Skills: ${skills}

Write a compelling, professional summary that highlights their expertise and value proposition. Keep it concise and impressive.`;

  const result = await robustInvokeLLM(
    [{ role: "user", content: prompt }],
    {
      maxRetries: 2,
      timeoutMs: 15000,
      fallbackValue: `${name} is a ${title} with expertise in ${skills}. Dedicated professional committed to delivering excellence.`,
    }
  );

  return result;
}

/**
 * Enhance achievement descriptions
 */
export async function enhanceAchievements(
  achievements: string[]
): Promise<string[]> {
  if (achievements.length === 0) return [];

  const prompt = `Enhance these achievement bullet points to be more impactful and professional. Make them concise, metrics-focused, and impressive:

${achievements.map((a, i) => `${i + 1}. ${a}`).join("\n")}

Return ONLY the enhanced bullet points in the same format, one per line, without numbering.`;

  const result = await robustInvokeLLM(
    [{ role: "user", content: prompt }],
    {
      maxRetries: 2,
      timeoutMs: 15000,
      fallbackValue: achievements.join("\n"),
    }
  );

  return result.split("\n").filter((line) => line.trim().length > 0);
}

/**
 * Generate project descriptions
 */
export async function generateProjectDescription(
  projectTitle: string,
  projectDetails: string
): Promise<string> {
  const prompt = `Write a compelling 1-2 sentence project description for a portfolio. Make it impressive and highlight the impact:

Project: ${projectTitle}
Details: ${projectDetails}

Return ONLY the description, no additional text.`;

  const result = await robustInvokeLLM(
    [{ role: "user", content: prompt }],
    {
      maxRetries: 2,
      timeoutMs: 15000,
      fallbackValue: projectTitle,
    }
  );

  return result.trim();
}
