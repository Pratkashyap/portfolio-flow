import { exec } from "child_process";
import { promisify } from "util";
import { writeFile, unlink, readFile } from "fs/promises";
import { tmpdir } from "os";
import { randomBytes } from "crypto";
import path from "path";

const execAsync = promisify(exec);

/**
 * Convert PDF buffer to text using multiple methods
 * 1. Try pdftotext command (fastest if available)
 * 2. Try basic PDF text stream extraction (fallback)
 */
export async function convertPdfToText(pdfBuffer: Buffer): Promise<string> {
  try {
    // Validate buffer
    if (!pdfBuffer || pdfBuffer.length === 0) {
      throw new Error("PDF buffer is empty");
    }

    console.log(`[PDF Handler] Processing PDF: size ${pdfBuffer.length} bytes`);

    // Method 1: Try pdftotext command
    try {
      return await extractUsingPdfToText(pdfBuffer);
    } catch (error) {
      console.warn(`[PDF Handler] pdftotext method failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    // Method 2: Try basic PDF text extraction
    try {
      return await extractUsingFallback(pdfBuffer);
    } catch (error) {
      console.warn(`[PDF Handler] Fallback extraction failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    throw new Error("Could not extract text using any available method");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[PDF Handler] Error converting PDF to text: ${errorMessage}`);
    throw new Error(`Failed to extract text from PDF: ${errorMessage}`);
  }
}

/**
 * Extract text using pdftotext command
 */
async function extractUsingPdfToText(pdfBuffer: Buffer): Promise<string> {
  const tempDir = tmpdir();
  const randomName = randomBytes(8).toString("hex");
  const pdfPath = path.join(tempDir, `${randomName}.pdf`);
  const txtPath = path.join(tempDir, `${randomName}.txt`);

  try {
    // Write PDF buffer to temporary file
    await writeFile(pdfPath, pdfBuffer);
    console.log("[PDF Handler] PDF file written successfully");

    // Use pdftotext command with timeout
    try {
      await execAsync(`pdftotext "${pdfPath}" "${txtPath}" 2>&1`, { timeout: 30000 });
    } catch (execError) {
      // pdftotext might fail but still create output, try to read it
      console.log("[PDF Handler] pdftotext command executed (may have warnings)");
    }

    // Try to read the output file
    let text = "";
    try {
      text = await readFile(txtPath, "utf-8");
    } catch (readError) {
      throw new Error("pdftotext did not produce output file");
    }

    if (text.trim().length === 0) {
      throw new Error("PDF contains no extractable text");
    }

    console.log(`[PDF Handler] Text extracted: ${text.length} characters`);
    return text.trim();
  } finally {
    // Clean up temporary files
    await Promise.all([unlink(pdfPath), unlink(txtPath)]).catch(() => {});
  }
}

/**
 * Extract text using basic PDF text stream parsing
 * This is a simple fallback that looks for text patterns in the PDF
 */
async function extractUsingFallback(pdfBuffer: Buffer): Promise<string> {
  try {
    // Convert buffer to string for pattern matching
    const pdfString = pdfBuffer.toString("latin1");

    // Strategy 1: Look for text in parentheses (common PDF text format)
    let textMatches: string[] = pdfString.match(/\(([^)]*)\)/g) || [];
    
    if (textMatches.length === 0) {
      // Strategy 2: Look for text between BT...ET markers
      const btMatches = pdfString.match(/BT[\s\S]*?ET/g) || [];
      if (btMatches.length > 0) {
        for (const match of btMatches) {
          const innerMatches = match.match(/\(([^)]*)\)/g) || [];
          textMatches = [...textMatches, ...innerMatches];
        }
      }
    }

    if (textMatches.length === 0) {
      // Strategy 3: Look for any printable text sequences
      const printableMatches = pdfString.match(/[\x20-\x7E]{4,}/g) || [];
      if (printableMatches.length > 0) {
        const extractedText = printableMatches
          .filter((text) => !text.includes("obj") && !text.includes("stream") && text.length > 3)
          .join(" ");
        
        if (extractedText.trim().length > 20) {
          console.log("[PDF Handler] Text extracted using printable text extraction");
          return extractedText.trim();
        }
      }
      
      throw new Error("No text patterns found in PDF");
    }

    // Extract and clean text
    let extractedText = textMatches
      .map((match) => {
        // Remove parentheses and decode basic PDF escape sequences
        let text = match.slice(1, -1);
        text = text.replace(/\\n/g, " ");
        text = text.replace(/\\r/g, " ");
        text = text.replace(/\\\(/g, "(");
        text = text.replace(/\\\)/g, ")");
        return text;
      })
      .filter((text) => text.length > 0)
      .join(" ");

    // Clean up multiple spaces
    extractedText = extractedText.replace(/\s+/g, " ").trim();

    if (extractedText.length < 20) {
      throw new Error("Extracted text is too short to be valid");
    }

    console.log("[PDF Handler] Text extracted using fallback method");
    return extractedText;
  } catch (error) {
    throw new Error(`Fallback extraction failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
