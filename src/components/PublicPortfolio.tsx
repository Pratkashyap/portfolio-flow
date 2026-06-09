import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, Phone, Linkedin, Github, Copy, Share2 } from "lucide-react";
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

interface QuestionnaireData {
  jobTitle: string;
  yearsExperience: string;
  workStyle: string;
  keyAchievement: string;
  designPreference: string;
}

export default function PublicPortfolio() {
  const [, params] = useRoute("/portfolio/:url");
  const portfolioUrl = params?.url || "";

  const { data: portfolio, isLoading, error } = trpc.portfolioDisplay.getByUrl.useQuery(
    { portfolioUrl },
    { enabled: !!portfolioUrl }
  );

  const resumeData = portfolio?.resumeData as ResumeData | undefined;
  const questionnaireData = portfolio?.questionnaireData as QuestionnaireData | undefined;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Loader2 className="animate-spin w-12 h-12 text-blue-600" />
      </div>
    );
  }

  if (error || !portfolio || !resumeData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Portfolio Not Found</h1>
          <p className="text-slate-600 mb-6">This portfolio doesn't exist or has been removed.</p>
          <Button onClick={() => window.location.href = "/"}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Portfolio link copied!");
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
    window.open(url, "_blank");
  };

  const shareOnTwitter = () => {
    const text = `Check out my professional portfolio: ${resumeData.name}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, "_blank");
  };

  // Template rendering based on templateId
  const renderTemplate = () => {
    const templateId = portfolio.templateId;

    if (templateId === 1) {
      return renderMinimalist();
    } else if (templateId === 2) {
      return renderBoldModern();
    } else {
      return renderCreative();
    }
  };

  const renderMinimalist = () => (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 py-8">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-2">{resumeData.name}</h1>
          <p className="text-xl text-slate-600 mb-4">{questionnaireData?.jobTitle || "Professional"}</p>
          <div className="flex gap-4 text-sm text-slate-600">
            {resumeData.email && (
              <a href={`mailto:${resumeData.email}`} className="flex items-center gap-1 hover:text-slate-900">
                <Mail className="w-4 h-4" /> {resumeData.email}
              </a>
            )}
            {resumeData.phone && (
              <a href={`tel:${resumeData.phone}`} className="flex items-center gap-1 hover:text-slate-900">
                <Phone className="w-4 h-4" /> {resumeData.phone}
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Summary */}
        {resumeData.summary && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">About</h2>
            <p className="text-slate-700 leading-relaxed">{resumeData.summary}</p>
          </section>
        )}

        {/* Experience */}
        {resumeData.experience.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Experience</h2>
            <div className="space-y-8">
              {resumeData.experience.map((exp, idx) => (
                <div key={idx} className="border-l-2 border-slate-300 pl-6">
                  <h3 className="text-xl font-semibold">{exp.role}</h3>
                  <p className="text-slate-600">{exp.company}</p>
                  <p className="text-sm text-slate-500 mb-2">{exp.duration}</p>
                  <p className="text-slate-700">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {resumeData.skills.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill, idx) => (
                <span key={idx} className="bg-slate-100 text-slate-900 px-3 py-1 rounded text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {resumeData.education.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Education</h2>
            <div className="space-y-4">
              {resumeData.education.map((edu, idx) => (
                <div key={idx}>
                  <h3 className="text-lg font-semibold">{edu.degree}</h3>
                  <p className="text-slate-600">{edu.school}</p>
                  {edu.field && <p className="text-sm text-slate-500">{edu.field}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer with Share Options */}
      <footer className="border-t border-slate-200 bg-slate-50 py-8">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-slate-600 mb-4">Share this portfolio</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button onClick={copyLink} variant="outline" size="sm" className="gap-2">
              <Copy className="w-4 h-4" /> Copy Link
            </Button>
            <Button onClick={shareOnLinkedIn} variant="outline" size="sm" className="gap-2">
              <Linkedin className="w-4 h-4" /> LinkedIn
            </Button>
            <Button onClick={shareOnTwitter} variant="outline" size="sm" className="gap-2">
              <Share2 className="w-4 h-4" /> Twitter
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-6">Created with Portfolio Flow • Free hosting on Manus</p>
        </div>
      </footer>
    </div>
  );

  const renderBoldModern = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-5xl font-bold mb-2">{resumeData.name}</h1>
          <p className="text-xl text-blue-100 mb-6">{questionnaireData?.jobTitle || "Professional"}</p>
          <div className="flex gap-6 text-sm text-blue-100">
            {resumeData.email && (
              <a href={`mailto:${resumeData.email}`} className="flex items-center gap-2 hover:text-white">
                <Mail className="w-4 h-4" /> {resumeData.email}
              </a>
            )}
            {resumeData.phone && (
              <a href={`tel:${resumeData.phone}`} className="flex items-center gap-2 hover:text-white">
                <Phone className="w-4 h-4" /> {resumeData.phone}
              </a>
            )}
            {portfolio.linkedinUrl && (
              <a href={portfolio.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white">
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Summary */}
        {resumeData.summary && (
          <section className="mb-12 bg-slate-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">About</h2>
            <p className="text-slate-100 leading-relaxed">{resumeData.summary}</p>
          </section>
        )}

        {/* Experience */}
        {resumeData.experience.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-blue-400">Experience</h2>
            <div className="space-y-6">
              {resumeData.experience.map((exp, idx) => (
                <div key={idx} className="bg-slate-800 rounded-lg p-6 border-l-4 border-blue-500">
                  <h3 className="text-xl font-semibold mb-1">{exp.role}</h3>
                  <p className="text-blue-300 font-medium">{exp.company}</p>
                  <p className="text-sm text-slate-400 mb-3">{exp.duration}</p>
                  <p className="text-slate-200">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {resumeData.skills.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">Skills</h2>
            <div className="flex flex-wrap gap-3">
              {resumeData.skills.map((skill, idx) => (
                <span key={idx} className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {resumeData.education.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-blue-400">Education</h2>
            <div className="space-y-4">
              {resumeData.education.map((edu, idx) => (
                <div key={idx} className="bg-slate-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold">{edu.degree}</h3>
                  <p className="text-blue-300">{edu.school}</p>
                  {edu.field && <p className="text-sm text-slate-400">{edu.field}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 py-8 border-t border-slate-700">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-slate-300 mb-4">Share this portfolio</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button onClick={copyLink} variant="outline" size="sm" className="gap-2 bg-slate-800 border-slate-600 text-white hover:bg-slate-700">
              <Copy className="w-4 h-4" /> Copy Link
            </Button>
            <Button onClick={shareOnLinkedIn} variant="outline" size="sm" className="gap-2 bg-slate-800 border-slate-600 text-white hover:bg-slate-700">
              <Linkedin className="w-4 h-4" /> LinkedIn
            </Button>
            <Button onClick={shareOnTwitter} variant="outline" size="sm" className="gap-2 bg-slate-800 border-slate-600 text-white hover:bg-slate-700">
              <Share2 className="w-4 h-4" /> Twitter
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-6">Created with Portfolio Flow • Free hosting on Manus</p>
        </div>
      </footer>
    </div>
  );

  const renderCreative = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-6xl font-black mb-2 drop-shadow-lg">{resumeData.name}</h1>
          <p className="text-2xl font-light mb-6 drop-shadow">{questionnaireData?.jobTitle || "Creative Professional"}</p>
          <div className="flex gap-6 text-sm">
            {resumeData.email && (
              <a href={`mailto:${resumeData.email}`} className="flex items-center gap-2 hover:opacity-80">
                <Mail className="w-5 h-5" /> {resumeData.email}
              </a>
            )}
            {resumeData.phone && (
              <a href={`tel:${resumeData.phone}`} className="flex items-center gap-2 hover:opacity-80">
                <Phone className="w-5 h-5" /> {resumeData.phone}
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* Summary */}
        {resumeData.summary && (
          <section className="mb-16 bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              About Me
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed">{resumeData.summary}</p>
          </section>
        )}

        {/* Experience */}
        {resumeData.experience.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Experience
            </h2>
            <div className="space-y-6">
              {resumeData.experience.map((exp, idx) => (
                <div key={idx} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">{exp.role}</h3>
                      <p className="text-lg text-purple-600 font-semibold">{exp.company}</p>
                    </div>
                    <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{exp.duration}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {resumeData.skills.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Skills
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {resumeData.skills.map((skill, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 shadow text-center hover:shadow-md transition-shadow">
                  <p className="font-semibold text-slate-900">{skill}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {resumeData.education.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Education
            </h2>
            <div className="space-y-4">
              {resumeData.education.map((edu, idx) => (
                <div key={idx} className="bg-white rounded-lg p-6 shadow border-l-4 border-gradient-to-r from-purple-600 to-pink-600">
                  <h3 className="text-xl font-bold text-slate-900">{edu.degree}</h3>
                  <p className="text-purple-600 font-medium">{edu.school}</p>
                  {edu.field && <p className="text-slate-600">{edu.field}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-slate-300 mb-6 text-lg">Share this portfolio</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button onClick={copyLink} size="sm" className="gap-2 bg-purple-600 hover:bg-purple-700">
              <Copy className="w-4 h-4" /> Copy Link
            </Button>
            <Button onClick={shareOnLinkedIn} size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Linkedin className="w-4 h-4" /> LinkedIn
            </Button>
            <Button onClick={shareOnTwitter} size="sm" className="gap-2 bg-sky-600 hover:bg-sky-700">
              <Share2 className="w-4 h-4" /> Twitter
            </Button>
          </div>
          <p className="text-xs text-slate-400 mt-8">Created with Portfolio Flow • Free hosting on Manus</p>
        </div>
      </footer>
    </div>
  );

  return renderTemplate();
}
