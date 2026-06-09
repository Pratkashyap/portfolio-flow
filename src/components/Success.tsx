import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { CheckCircle, Copy, Share2, Linkedin, Twitter, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function Success() {
  const [, setLocation] = useLocation();
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get portfolio generation mutation
  const generatePortfolioMutation = trpc.portfolio.generate.useMutation();

  useEffect(() => {
    const generatePortfolio = async () => {
      try {
        setIsGenerating(true);
        setError(null);

        // Get saved portfolio data from localStorage
        const saved = localStorage.getItem("portfolioData");
        if (!saved) {
          setLocation("/create");
          return;
        }

        const data = JSON.parse(saved);

        // Call the backend API to generate portfolio
        const result = await generatePortfolioMutation.mutateAsync({
          templateId: data.templateId || 1,
          resumeData: data.resumeData,
          questionnaireData: data.questionnaireData || {},
          linkedinUrl: data.linkedinUrl,
          githubUrl: data.githubUrl,
        });

        // Set the generated portfolio URL
        setPortfolioUrl(result.portfolioUrl);
        toast.success("Portfolio generated successfully!");
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to generate portfolio";
        console.error("Portfolio generation error:", err);
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsGenerating(false);
      }
    };

    generatePortfolio();
  }, [generatePortfolioMutation, setLocation]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(portfolioUrl);
    setCopied(true);
    toast.success("Portfolio link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareLinkedin = () => {
    const text = `Check out my professional portfolio created with Portfolio Flow!`;
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(portfolioUrl)}`;
    window.open(url, "_blank");
  };

  const handleShareTwitter = () => {
    const text = `Just created my professional portfolio with Portfolio Flow! 🚀 Check it out:`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(portfolioUrl)}`;
    window.open(url, "_blank");
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="flex justify-center mb-4">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Generating Your Portfolio...
          </h1>
          <p className="text-slate-600">
            This usually takes 10-30 seconds. Please wait while we deploy your portfolio to Manus.
          </p>
        </div>
      </div>
    );
  }

  if (error || !portfolioUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="p-8 border-red-200 bg-red-50">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-900 mb-2">
                Portfolio Generation Failed
              </h1>
              <p className="text-red-700 mb-6">
                {error || "Unable to generate portfolio. Please try again."}
              </p>
              <Button
                onClick={() => {
                  localStorage.removeItem("portfolioData");
                  setLocation("/create");
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                Try Again
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            🎉 Portfolio Created Successfully!
          </h1>
          <p className="text-lg text-slate-600">
            Your professional portfolio is now live and ready to share
          </p>
        </div>

        {/* Portfolio URL Card */}
        <Card className="p-8 mb-6">
          <div className="mb-6">
            <p className="text-sm text-slate-600 mb-2">Your Portfolio URL</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={portfolioUrl}
                readOnly
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 font-mono text-sm"
              />
              <Button
                onClick={handleCopyLink}
                variant="outline"
                className="gap-2"
              >
                <Copy className="w-4 h-4" />
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>

          {/* View Portfolio Button */}
          <Button
            onClick={() => window.open(portfolioUrl, "_blank")}
            className="w-full bg-blue-600 hover:bg-blue-700 mb-6"
            size="lg"
          >
            View Your Portfolio
          </Button>

          {/* Share Options */}
          <div>
            <p className="text-sm font-semibold text-slate-900 mb-3">
              Share Your Portfolio
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleShareLinkedin}
                variant="outline"
                className="gap-2"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </Button>
              <Button
                onClick={handleShareTwitter}
                variant="outline"
                className="gap-2"
              >
                <Twitter className="w-4 h-4" />
                Twitter
              </Button>
            </div>
          </div>
        </Card>

        {/* Next Steps */}
        <Card className="p-6 bg-blue-50 border border-blue-200 mb-6">
          <h3 className="font-semibold text-slate-900 mb-3">Next Steps</h3>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex gap-2">
              <span className="text-blue-600 font-bold">1.</span>
              <span>Share your portfolio link with recruiters and connections</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600 font-bold">2.</span>
              <span>Update your resume and LinkedIn with your portfolio URL</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600 font-bold">3.</span>
              <span>Keep your portfolio updated with new projects and skills</span>
            </li>
          </ul>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => {
              localStorage.removeItem("portfolioData");
              setLocation("/");
            }}
            variant="outline"
            className="flex-1"
          >
            Back to Home
          </Button>
          <Button
            onClick={() => {
              localStorage.removeItem("portfolioData");
              setLocation("/create");
            }}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Create Another Portfolio
          </Button>
        </div>
      </div>
    </div>
  );
}
