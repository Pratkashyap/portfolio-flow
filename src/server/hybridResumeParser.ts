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

// ===== SIMPLE, RELIABLE REGEX-BASED EXTRACTION =====
export function parseResumeHybrid(resumeText: string): ParsedResume {
  if (!resumeText || resumeText.trim().length === 0) {
    throw new Error("Resume text is empty");
  }

  console.log("[Hybrid Parser] Starting resume parsing");

  const result: ParsedResume = {
    name: "",
    email: "",
    phone: "",
    summary: "",
    experience: [],
    skills: [],
    education: [],
  };

  // ===== EXTRACT NAME =====
  // Try to match names - handles both "John Doe" and "JOHN DOE" formats
  // Look for 2-3 word names (first name + last name, or first + middle + last)
  // Pattern: Capital letter followed by any letters (uppercase or lowercase), repeated 1-2 times
  const nameMatch = resumeText.match(/^\s*([A-Z][A-Za-z]*(?:\s+[A-Z][A-Za-z]*){1,2})\s*(?:\n|$)/m);
  if (nameMatch) {
    const extractedName = nameMatch[1]?.trim() || "";
    // Make sure it's not a section header like "Contact" or "Summary"
    if (!['Contact', 'Summary', 'Experience', 'Skills', 'Education', 'Projects', 'CONTACT', 'SUMMARY', 'EXPERIENCE', 'SKILLS', 'EDUCATION', 'PROJECTS'].includes(extractedName)) {
      result.name = extractedName;
    }
  }

  // If name not found, try alternative patterns for all-caps names
  if (!result.name) {
    // Try to find any line with 2+ capitalized words at the start
    const altNameMatch = resumeText.match(/^\s*([A-Z][A-Z\s]+)\s*(?:\n|$)/m);
    if (altNameMatch) {
      const extractedName = altNameMatch[1]?.trim() || "";
      // Filter out common headers
      if (extractedName.length > 2 && extractedName.length < 100 && !['CONTACT', 'SUMMARY', 'EXPERIENCE', 'SKILLS', 'EDUCATION', 'PROJECTS', 'WORK', 'OBJECTIVE', 'PROFILE'].includes(extractedName)) {
        result.name = extractedName;
      }
    }
  }

  if (!result.name) {
    throw new Error("Could not extract name from resume. Please ensure your resume contains your name.");
  }

  console.log(`[Hybrid Parser] Extracted name: ${result.name}`);

  // ===== EXTRACT EMAIL =====
  const emailMatch = resumeText.match(/([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  if (emailMatch) {
    result.email = emailMatch[1];
  }

  // ===== EXTRACT PHONE =====
  const phoneMatch = resumeText.match(/(\+?[\d\s\-()]{10,})/);
  if (phoneMatch) {
    result.phone = phoneMatch[1].trim();
  }

  // ===== EXTRACT SUMMARY =====
  const summaryMatch = resumeText.match(
    /(?:PROFESSIONAL SUMMARY|OBJECTIVE|SUMMARY|PROFILE)[:\s]+([\s\S]*?)(?=\n\n|EXPERIENCE|SKILLS|EDUCATION|$)/i
  );
  if (summaryMatch) {
    result.summary = summaryMatch[1].trim().split("\n")[0].substring(0, 300);
  }

  // ===== EXTRACT SKILLS =====
  const skillsSection = resumeText.match(
    /(?:SKILLS?|TECHNICAL SKILLS?|COMPETENCIES?|EXPERTISE)[:\s]+([\s\S]*?)(?=\n\n|EXPERIENCE|EDUCATION|PROJECTS|$)/i
  );
  if (skillsSection) {
    const skills = skillsSection[1]
      .split(/[,\n•\-|]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && s.length < 50);
    result.skills = skills.slice(0, 20);
  }

  // ===== EXTRACT EXPERIENCE (SIMPLIFIED) =====
  // Just extract any capitalized company names and roles
  const companyMatches = Array.from(resumeText.matchAll(/^([A-Z][A-Za-z\s&]+)$/gm));
  for (const match of companyMatches) {
    const company = match[1];
    if (company && company.length > 2 && company.length < 100) {
      result.experience.push({
        company: company.trim(),
        role: "Position",
        duration: "",
        description: "",
      });
    }
  }

  // ===== EXTRACT EDUCATION =====
  const educationMatches = Array.from(
    resumeText.matchAll(
      /(?:Bachelor|Master|MBA|B\.?S\.?|M\.?S\.?|B\.?A\.?|M\.?A\.?|Ph\.?D\.?|Diploma|Associate|B\.?Tech|M\.?Tech)[^\n]*(?:\n[^\n]*)?/gi
    )
  );

  for (const match of educationMatches) {
    const eduText = match[0];
    if (eduText.length > 5 && eduText.length < 200 && result.education.length < 5) {
      const lines = eduText.split("\n");
      result.education.push({
        degree: lines[0]?.trim() || "",
        school: lines[1]?.trim() || "",
        field: "",
      });
    }
  }

  console.log(
    `[Hybrid Parser] Extracted: ${result.experience.length} experiences, ${result.skills.length} skills, ${result.education.length} education entries`
  );

  return result;
}
