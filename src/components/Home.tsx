import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { ArrowRight, Zap, Globe, Share2 } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      setLocation("/create");
    } else {
      window.location.href = getLoginUrl();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-slate-900">Portfolio Flow</div>
          <div>
            {isAuthenticated ? (
              <Button onClick={() => setLocation("/dashboard")} variant="outline">
                My Portfolios
              </Button>
            ) : (
              <Button onClick={() => (window.location.href = getLoginUrl())}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Create Your Professional Portfolio in Minutes
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Upload your resume, answer a few questions, and get a stunning, personalized portfolio website hosted on Manus. No coding required.
          </p>

          <Button
            onClick={handleGetStarted}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-lg inline-flex items-center gap-2"
          >
            Get Started <ArrowRight className="w-5 h-5" />
          </Button>

          <p className="text-sm text-slate-500 mt-4">
            Free forever. No credit card required.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Why Choose Portfolio Flow?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 border border-slate-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Lightning Fast Setup
              </h3>
              <p className="text-slate-600">
                Upload your resume and answer 5-7 simple questions. Your portfolio is ready in minutes, not hours.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 border border-slate-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Hosted on Manus
              </h3>
              <p className="text-slate-600">
                Get a professional, free subdomain. Your portfolio is live and accessible instantly with zero hosting fees.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 border border-slate-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Share2 className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Easy Sharing
              </h3>
              <p className="text-slate-600">
                Share your portfolio with one click. Perfect for job applications, networking, and showcasing your work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            How It Works
          </h2>

          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { num: "1", title: "Upload Resume", desc: "PDF or text file" },
              { num: "2", title: "Answer Questions", desc: "5-7 simple questions" },
              { num: "3", title: "Choose Template", desc: "Pick your design" },
              { num: "4", title: "Go Live", desc: "Share your portfolio" },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{step.title}</h3>
                <p className="text-sm text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Build Your Portfolio?
          </h2>
          <p className="text-lg mb-8 text-blue-100">
            Join thousands of professionals creating stunning portfolios with Portfolio Flow.
          </p>
          <Button
            onClick={handleGetStarted}
            size="lg"
            className="bg-white text-blue-600 hover:bg-slate-100 px-8 py-6 text-lg rounded-lg"
          >
            Get Started Now <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2026 Portfolio Flow. Powered by Manus.</p>
        </div>
      </footer>
    </div>
  );
}
