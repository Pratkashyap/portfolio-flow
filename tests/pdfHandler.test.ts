import { describe, it, expect, vi, beforeEach } from "vitest";
import { convertPdfToText } from "./pdfHandler";

// Mock the child_process module
vi.mock("child_process", () => ({
  exec: vi.fn(),
}));

// Mock fs/promises module
vi.mock("fs/promises", () => ({
  writeFile: vi.fn().mockResolvedValue(undefined),
  unlink: vi.fn().mockResolvedValue(undefined),
  readFile: vi.fn().mockResolvedValue("Sample extracted text from PDF"),
}));

describe("PDF Handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should convert PDF buffer to text", async () => {
    const { exec } = await import("child_process");
    const { promisify } = await import("util");

    // Mock the promisified exec to succeed
    vi.mocked(exec).mockImplementationOnce((cmd, callback) => {
      callback(null, "", "");
      return {} as any;
    });

    const pdfBuffer = Buffer.from("PDF content");
    const result = await convertPdfToText(pdfBuffer);

    expect(result).toBeDefined();
    expect(typeof result).toBe("string");
    expect(result).toContain("Sample extracted text");
  });

  it("should handle PDF conversion errors gracefully with fallback", async () => {
    const { exec } = await import("child_process");

    // Mock exec to fail
    vi.mocked(exec).mockImplementationOnce((cmd, callback) => {
      callback(new Error("pdftotext command failed"), "", "");
      return {} as any;
    });

    // Create a buffer with some text content that fallback can extract
    const pdfBuffer = Buffer.from("(Sample text content) BT (more text) ET");

    const result = await convertPdfToText(pdfBuffer);
    
    // Should succeed with fallback extraction
    expect(result).toBeDefined();
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("should handle empty buffer gracefully", async () => {
    const pdfBuffer = Buffer.from("");

    await expect(convertPdfToText(pdfBuffer)).rejects.toThrow(
      "PDF buffer is empty"
    );
  });

  it("should clean up temporary files after successful conversion", async () => {
    const { exec } = await import("child_process");
    const { unlink } = await import("fs/promises");

    // Mock exec to succeed
    vi.mocked(exec).mockImplementationOnce((cmd, callback) => {
      callback(null, "", "");
      return {} as any;
    });

    const pdfBuffer = Buffer.from("PDF content");
    await convertPdfToText(pdfBuffer);

    // Verify unlink was called to clean up files
    expect(vi.mocked(unlink)).toHaveBeenCalled();
  });
});
