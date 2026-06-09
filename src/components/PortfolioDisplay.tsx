import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader2, Mail, Linkedin, Github, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function PortfolioDisplay() {
  const [slug, setSlug] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Extract slug from URL
  useEffect(() => {
    const hostname = window.location.hostname;
    // Extract slug from subdomain (e.g., rubi-saini-1.manus.space -> rubi-saini-1)
    const parts = hostname.split(".");
    if (parts.length > 0) {
      setSlug(parts[0]);
    }
  }, []);

  // Fetch portfolio data
  const { data: portfolio, isLoading: isFetching, error } = trpc.portfolio.getBySlug.useQuery(
    { slug },
    { enabled: !!slug }
  );

  useEffect(() => {
    if (portfolio || error) {
      setIsLoading(false);
    }
  }, [portfolio, error]);

  if (isLoading || isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Portfolio Not Found</h1>
          <p className="text-slate-600 mb-6">
            This portfolio doesn't exist or has been removed.
          </p>
          <Button onClick={() => window.location.href = "https://portfoliow-itqbyqt8.manus.space"}>
            Create Your Portfolio
          </Button>
        </Card>
      </div>
    );
  }

  const resumeData = portfolio.resumeData || {};
  const questionnaireData = portfolio.questionnaireData || {};

  // Determine template styling
  const getTemplateStyles = () => {
    switch (portfolio.templateId) {
      case 2: // Bold & Modern
        return {
          bgGradient: "from-blue-600 to-blue-800",
          accentColor: "text-blue-600",
          cardBg: "bg-blue-50",
        };
      case 3: // Creative Showcase
        return {
          bgGradient: "from-purple-600 to-pink-600",
          accentColor: "text-purple-600",
          cardBg: "bg-purple-50",
        };
      default: // Minimalist
        return {
          bgGradient: "from-slate-700 to-slate-900",
          accentColor: "text-slate-700",
          cardBg: "bg-slate-50",
        };
    }
  };

  const styles = getTemplateStyles();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className={`bg-gradient-to-r ${styles.bgGradient} text-white py-20`}>
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">{resumeData.name || "Portfolio"}</h1>
          <p className="text-xl opacity-90 mb-6">{resumeData.summary || questionnaireData.jobTitle}</p>

          {/* Contact & Social Links */}
          <div className="flex flex-wrap gap-4 mt-8">
            {resumeData.email && (
              <a
                href={`mailto:${resumeData.email}`}
                className="flex items-center gap-2 bg-white text-slate-900 px-4 py-2 rounded-lg hover:bg-opacity-90 transition"
              >
                <Mail className="w-5 h-5" />
                Email
              </a>
            )}
            {portfolio.linkedinUrl && (
              <a
                href={portfolio.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white text-slate-900 px-4 py-2 rounded-lg hover:bg-opacity-90 transition"
              >
                <Linkedin className="w-5 h-5" />
                LinkedIn
              </a>
            )}
            {portfolio.githubUrl && (
              <a
                href={portfolio.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white text-slate-900 px-4 py-2 rounded-lg hover:bg-opacity-90 transition"
              >
                <Github className="w-5 h-5" />
                GitHub
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Experience */}
            {resumeData.experience && resumeData.experience.length > 0 && (
              <section className="mb-12">
                <h2 className={`text-3xl font-bold ${styles.accentColor} mb-6`}>Experience</h2>
                <div className="space-y-6">
                  {resumeData.experience.map((exp: any, idx: number) => (
                    <Card key={idx} className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-slate-900">{exp.role}</h3>
                          <p className={`${styles.accentColor} font-medium`}>{exp.company}</p>
                        </div>
                        <span className="text-slate-500 text-sm">{exp.duration}</span>
                      </div>
                      <p className="text-slate-600 mt-3">{exp.description}</p>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {resumeData.education && resumeData.education.length > 0 && (
              <section className="mb-12">
                <h2 className={`text-3xl font-bold ${styles.accentColor} mb-6`}>Education</h2>
                <div className="space-y-4">
                  {resumeData.education.map((edu: any, idx: number) => (
                    <Card key={idx} className="p-6">
                      <h3 className="text-lg font-semibold text-slate-900">{edu.degree}</h3>
                      <p className={`${styles.accentColor} font-medium`}>{edu.school}</p>
                      <p className="text-slate-600 text-sm mt-1">{edu.field}</p>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div>
            {/* Skills */}
            {resumeData.skills && resumeData.skills.length > 0 && (
              <Card className={`${styles.cardBg} p-6 mb-6`}>
                <h3 className={`text-xl font-bold ${styles.accentColor} mb-4`}>Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className={`${styles.accentColor} bg-white px-3 py-1 rounded-full text-sm font-medium border`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {/* Contact Info */}
            <Card className={`${styles.cardBg} p-6`}>
              <h3 className={`text-xl font-bold ${styles.accentColor} mb-4`}>Contact</h3>
              <div className="space-y-3">
                {resumeData.email && (
                  <div>
                    <p className="text-slate-600 text-sm">Email</p>
                    <a
                      href={`mailto:${resumeData.email}`}
                      className={`${styles.accentColor} hover:underline font-medium break-all`}
                    >
                      {resumeData.email}
                    </a>
                  </div>
                )}
                {resumeData.phone && (
                  <div>
                    <p className="text-slate-600 text-sm">Phone</p>
                    <a
                      href={`tel:${resumeData.phone}`}
                      className={`${styles.accentColor} hover:underline font-medium`}
                    >
                      {resumeData.phone}
                    </a>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400">
            Created with{" "}
            <a href="https://portfoliow-itqbyqt8.manus.space" className="text-blue-400 hover:underline">
              Portfolio Flow
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
