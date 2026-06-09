import { parseResumeHybrid } from './server/hybridResumeParser.ts';
import { execSync } from 'child_process';

// Extract text from Riya's resume
const text = execSync('pdftotext /home/ubuntu/upload/Riya_Gupta_CV.pdf -', { encoding: 'utf-8' });
console.log(`[Test] Extracted ${text.length} characters from Riya's resume\n`);

// Try to parse it
try {
  const parsed = parseResumeHybrid(text);
  console.log(`✅ Successfully parsed Riya's resume!\n`);
  console.log(`Name: ${parsed.name}`);
  console.log(`Email: ${parsed.email}`);
  console.log(`Phone: ${parsed.phone}`);
  console.log(`Skills found: ${parsed.skills.length}`);
  if (parsed.skills.length > 0) {
    console.log(`  - ${parsed.skills.slice(0, 5).join(', ')}${parsed.skills.length > 5 ? '...' : ''}`);
  }
  console.log(`Experience found: ${parsed.experience.length}`);
  if (parsed.experience.length > 0) {
    parsed.experience.forEach((exp, i) => {
      console.log(`  ${i+1}. ${exp.role} at ${exp.company}`);
    });
  }
  console.log(`Education found: ${parsed.education.length}`);
  if (parsed.education.length > 0) {
    parsed.education.forEach((edu, i) => {
      console.log(`  ${i+1}. ${edu.degree} in ${edu.field} from ${edu.school}`);
    });
  }
} catch (error) {
  console.error(`❌ Error:`, error instanceof Error ? error.message : String(error));
  process.exit(1);
}
