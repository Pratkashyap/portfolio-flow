import fs from "fs";
import { invokeLLM } from "./server/_core/llm.ts";

// Read the resume text
const resumeText = fs.readFileSync("/tmp/prateek_resume.txt", "utf-8");

console.log("Resume text length:", resumeText.length);
console.log("First 500 characters:", resumeText.substring(0, 500));
console.log("\n---\n");

const systemPrompt = `You are an expert resume parser. Extract structured information from the provided resume text.
Return a valid JSON object with the following structure. Be lenient with missing fields - use empty strings or empty arrays as needed.
{
  "name": "Full name",
  "email": "Email address or empty string",
  "phone": "Phone number or empty string",
  "summary": "Brief professional summary if available",
  "experience": [
    {
      "company": "Company name",
      "role": "Job title",
      "duration": "Time period (e.g., 2020-2022)",
      "description": "Brief description of responsibilities"
    }
  ],
  "skills": ["skill1", "skill2", "skill3"],
  "education": [
    {
      "school": "School/University name",
      "degree": "Degree type",
      "field": "Field of study"
    }
  ]
}

IMPORTANT:
- Extract at least 3-5 job experiences if available
- Extract at least 5-10 skills if available
- Extract at least 1-2 education entries if available
- For missing fields, use empty string "" or empty array []
- Make sure all required fields are present in the output`;

const userPrompt = `Please parse this resume and extract the structured information. Be thorough and extract as much detail as possible:\n\n${resumeText}`;

try {
  console.log("Calling LLM to parse resume...");
  const response = await invokeLLM({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "resume_data",
        strict: false,
        schema: {
          type: "object",
          properties: {
            name: { type: "string" },
            email: { type: "string" },
            phone: { type: "string" },
            summary: { type: "string" },
            experience: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  company: { type: "string" },
                  role: { type: "string" },
                  duration: { type: "string" },
                  description: { type: "string" },
                },
              },
            },
            skills: {
              type: "array",
              items: { type: "string" },
            },
            education: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  school: { type: "string" },
                  degree: { type: "string" },
                  field: { type: "string" },
                },
              },
            },
          },
          required: ["name", "email", "phone", "experience", "skills", "education"],
        },
      },
    },
  });

  const content = response.choices[0]?.message.content;
  console.log("LLM Response type:", typeof content);
  
  let parsed;
  if (typeof content === "string") {
    console.log("Parsing string response...");
    let jsonStr = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }
    parsed = JSON.parse(jsonStr.trim());
  } else {
    parsed = content;
  }

  console.log("\n✅ Successfully parsed resume!");
  console.log("\nExtracted Data:");
  console.log("- Name:", parsed.name);
  console.log("- Email:", parsed.email);
  console.log("- Phone:", parsed.phone);
  console.log("- Experience entries:", parsed.experience?.length || 0);
  console.log("- Skills:", parsed.skills?.length || 0);
  console.log("- Education entries:", parsed.education?.length || 0);
  
  console.log("\nFull parsed data:");
  console.log(JSON.stringify(parsed, null, 2));
} catch (error) {
  console.error("❌ Error parsing resume:", error);
  process.exit(1);
}
