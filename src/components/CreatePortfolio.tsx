import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, CheckCircle } from "lucide-react";
import { useRef, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface ResumeData {
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

export default function CreatePortfolio() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // tRPC mutations
  const uploadPdfMutation = trpc.resume.uploadPdf.useMutation();
  const parseMutation = trpc.resume.parse.useMutation();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const SUPPORTED_FORMATS = ['.pdf', '.txt'];

  const handleFileSelect = async (file: File) => {
    // Validate file format
    if (!file.name.match(/\.(pdf|txt)$/i)) {
      toast.error(`Unsupported file format. Supported formats: ${SUPPORTED_FORMATS.join(', ')}`);
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0);
      toast.error(`File is too large. Maximum size: ${sizeMB}MB. Your file: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
      return;
    }

    // Validate file is not empty
    if (file.size === 0) {
      toast.error("File is empty. Please upload a file with content.");
      return;
    }

    setIsLoading(true);
    try {
      let text = "";

      // Handle PDF files
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        // Read file as base64 using browser API
        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        let binaryString = "";
        for (let i = 0; i < bytes.byteLength; i++) {
          binaryString += String.fromCharCode(bytes[i]);
        }
        const base64String = btoa(binaryString);

        // Call backend to convert PDF to text using tRPC
        try {
          const result = await uploadPdfMutation.mutateAsync({
            fileBuffer: base64String,
          });
          text = result.text;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to extract text from PDF";
          throw new Error(errorMessage);
        }
      } else {
        // For text files, read directly
        text = await file.text();
        
        // Validate text file is not empty
        if (!text || text.trim().length === 0) {
          throw new Error("Text file is empty. Please upload a file with content.");
        }
      }

      // Validate extracted text is not too short
      if (text.trim().length < 50) {
        throw new Error("Resume content is too short. Please ensure your resume has enough information.");
      }

      // Call the backend to parse the resume using tRPC
      try {
        const parsed = await parseMutation.mutateAsync({
          resumeText: text,
        });
        setResumeData(parsed);
        setFormData({
          name: parsed.name || "",
          email: parsed.email || "",
          phone: parsed.phone || "",
        });
        toast.success("Resume parsed successfully!");
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to parse resume";
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error processing resume:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to process resume. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContinue = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Store the resume data in localStorage for the next step
    localStorage.setItem(
      "portfolioData",
      JSON.stringify({
        resumeData: {
          ...resumeData,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
      })
    );

    setLocation("/questionnaire");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Create Your Portfolio
          </h1>
          <p className="text-slate-600">
            Step 1 of 4: Upload your resume
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-2 flex-1 rounded-full ${
                step === 1 ? "bg-blue-600" : "bg-slate-200"
              }`}
            />
          ))}
        </div>

        {!resumeData ? (
          // Resume Upload Section
          <Card className="p-8 mb-6">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                isDragging
                  ? "border-blue-600 bg-blue-50"
                  : "border-slate-300 hover:border-slate-400"
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Drag and drop your resume
              </h3>
              <p className="text-slate-600 mb-4">
                or click to browse. Supports PDF and text files.
              </p>
              <p className="text-sm text-slate-500 mb-4">
                📄 Max file size: 10MB | Supported: .pdf, .txt
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
            </div>

            {isLoading && (
              <div className="flex items-center justify-center gap-2 mt-4 text-blue-600">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing your resume...</span>
              </div>
            )}

            {/* Helpful Notes */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">📋 Tips for best results:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ Use a clear, well-formatted resume</li>
                <li>✓ Include your name, email, and phone number</li>
                <li>✓ List your work experience and education</li>
                <li>✓ Add your skills and key achievements</li>
                <li>✓ Minimum 50 characters of content required</li>
              </ul>
            </div>
          </Card>
        ) : (
          // Resume Data Review Section
          <Card className="p-8">
            <div className="flex items-center gap-2 mb-6 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Resume parsed successfully!</span>
            </div>

            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Basic Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="block mb-2">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="block mb-2">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="block mb-2">
                      Phone *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
              </div>

              {/* Extracted Skills */}
              {resumeData.skills && resumeData.skills.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">
                    Skills Found
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.slice(0, 10).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience Summary */}
              {resumeData.experience && resumeData.experience.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">
                    Experience Found
                  </h3>
                  <div className="space-y-2">
                    {resumeData.experience.slice(0, 3).map((exp, idx) => (
                      <div key={idx} className="text-sm">
                        <p className="font-semibold text-slate-900">
                          {exp.role} at {exp.company}
                        </p>
                        <p className="text-slate-600">{exp.duration}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t">
                <Button
                  onClick={() => setResumeData(null)}
                  variant="outline"
                  className="flex-1"
                >
                  Upload Different Resume
                </Button>
                <Button
                  onClick={handleContinue}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Continue
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
