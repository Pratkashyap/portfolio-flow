import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Loader2, Github, Linkedin } from "lucide-react";

interface PortfolioData {
  resumeData: {
    name: string;
    email: string;
    phone: string;
    experience: Array<any>;
    skills: string[];
    education: Array<any>;
  };
  questionnaireData: {
    jobTitle: string;
    achievement: string;
    industry: string;
  };
  templateId: number;
  linkedinUrl?: string;
  githubUrl?: string;
}

export default function PortfolioPreview() {
  const [, setLocation] = useLocation();
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [socialLinks, setSocialLinks] = useState({
    linkedinUrl: "",
    githubUrl: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("portfolioData");
    if (!saved) {
      setLocation("/create");
    } else {
      const data = JSON.parse(saved);
      setPortfolioData(data);
      setSocialLinks({
        linkedinUrl: data.linkedinUrl || "",
        githubUrl: data.githubUrl || "",
      });
    }
  }, [setLocation]);

  const handleSocialLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSocialLinks((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // Save social links
      const saved = localStorage.getItem("portfolioData");
      if (saved) {
        const data = JSON.parse(saved);
        data.linkedinUrl = socialLinks.linkedinUrl;
        data.githubUrl = socialLinks.githubUrl;
        localStorage.setItem("portfolioData", JSON.stringify(data));
      }

      // Simulate portfolio generation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Navigate to success page
      setLocation("/success");
    } catch (error) {
      console.error("Error generating portfolio:", error);
      alert("Failed to generate portfolio. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!portfolioData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const { resumeData, questionnaireData } = portfolioData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Preview Your Portfolio
          </h1>
          <p className="text-slate-600">
            Step 4 of 4: Add social links and generate your portfolio
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-2 flex-1 rounded-full ${
                step <= 4 ? "bg-blue-600" : "bg-slate-200"
              }`}
            />
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Preview Section */}
          <div className="lg:col-span-2">
            <Card className="p-8 bg-white">
              {/* Portfolio Header */}
              <div className="mb-8 pb-8 border-b">
                <h2 className="text-4xl font-bold text-slate-900 mb-2">
                  {resumeData.name}
                </h2>
                <p className="text-xl text-blue-600 font-semibold mb-4">
                  {questionnaireData.jobTitle}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                  <span>{resumeData.email}</span>
                  <span>{resumeData.phone}</span>
                  <span className="capitalize">{questionnaireData.industry}</span>
                </div>
              </div>

              {/* Achievement */}
              {questionnaireData.achievement && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Highlight
                  </h3>
                  <p className="text-slate-700">
                    {questionnaireData.achievement}
                  </p>
                </div>
              )}

              {/* Experience */}
              {resumeData.experience && resumeData.experience.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Experience
                  </h3>
                  <div className="space-y-4">
                    {resumeData.experience.map((exp, idx) => (
                      <div key={idx} className="border-l-4 border-blue-600 pl-4">
                        <h4 className="font-semibold text-slate-900">
                          {exp.role}
                        </h4>
                        <p className="text-slate-600">{exp.company}</p>
                        <p className="text-sm text-slate-500">{exp.duration}</p>
                        {exp.description && (
                          <p className="text-slate-700 mt-2">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {resumeData.skills && resumeData.skills.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.slice(0, 12).map((skill, idx) => (
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

              {/* Education */}
              {resumeData.education && resumeData.education.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Education
                  </h3>
                  <div className="space-y-3">
                    {resumeData.education.map((edu, idx) => (
                      <div key={idx}>
                        <h4 className="font-semibold text-slate-900">
                          {edu.degree} in {edu.field}
                        </h4>
                        <p className="text-slate-600">{edu.school}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Social Links Section */}
          <div>
            <Card className="p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Social Links (Optional)
              </h3>

              <div className="space-y-4">
                {/* LinkedIn */}
                <div>
                  <Label htmlFor="linkedinUrl" className="block mb-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Linkedin className="w-4 h-4" />
                      LinkedIn Profile
                    </div>
                  </Label>
                  <Input
                    id="linkedinUrl"
                    name="linkedinUrl"
                    type="url"
                    value={socialLinks.linkedinUrl}
                    onChange={handleSocialLinkChange}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>

                {/* GitHub */}
                <div>
                  <Label htmlFor="githubUrl" className="block mb-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Github className="w-4 h-4" />
                      GitHub Profile
                    </div>
                  </Label>
                  <Input
                    id="githubUrl"
                    name="githubUrl"
                    type="url"
                    value={socialLinks.githubUrl}
                    onChange={handleSocialLinkChange}
                    placeholder="https://github.com/..."
                  />
                </div>

                {/* Info */}
                <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-700">
                  <p>
                    Add your social profiles to showcase your work and connect with others.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-4 border-t">
                  <Button
                    onClick={() => setLocation("/templates")}
                    variant="outline"
                    className="w-full"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate & Deploy"
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
