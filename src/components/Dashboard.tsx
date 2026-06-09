import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Plus, ExternalLink, Copy, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Portfolio {
  id: number;
  name: string;
  url: string;
  template: string;
  createdAt: string;
  isPublished: boolean;
}

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([
    {
      id: 1,
      name: "John Doe Portfolio",
      url: "https://john-doe-abc123.manus.space",
      template: "Bold & Modern",
      createdAt: "2026-04-02",
      isPublished: true,
    },
  ]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Please sign in to view your portfolios
          </h2>
          <Button
            onClick={() => setLocation("/")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Go to Home
          </Button>
        </Card>
      </div>
    );
  }

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Portfolio URL copied!");
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this portfolio?")) {
      setPortfolios(portfolios.filter((p) => p.id !== id));
      toast.success("Portfolio deleted");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              My Portfolios
            </h1>
            <p className="text-slate-600">
              Welcome back, {user?.name || "User"}! Manage your portfolios here.
            </p>
          </div>
          <Button
            onClick={() => setLocation("/create")}
            className="bg-blue-600 hover:bg-blue-700 gap-2"
            size="lg"
          >
            <Plus className="w-5 h-5" />
            Create New Portfolio
          </Button>
        </div>

        {/* Portfolios Grid */}
        {portfolios.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                No portfolios yet
              </h3>
              <p className="text-slate-600 mb-6">
                Create your first portfolio to get started. It only takes a few
                minutes!
              </p>
              <Button
                onClick={() => setLocation("/create")}
                className="bg-blue-600 hover:bg-blue-700 gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Your First Portfolio
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolios.map((portfolio) => (
              <Card key={portfolio.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  {/* Header */}
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {portfolio.name}
                      </h3>
                      {portfolio.isPublished && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                          Published
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600">
                      Template: {portfolio.template}
                    </p>
                    <p className="text-xs text-slate-500">
                      Created: {new Date(portfolio.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* URL Display */}
                  <div className="bg-slate-50 rounded p-3 mb-4 break-all">
                    <p className="text-xs text-slate-600 mb-1">Portfolio URL</p>
                    <p className="text-sm font-mono text-slate-900">
                      {portfolio.url}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button
                      onClick={() => window.open(portfolio.url, "_blank")}
                      variant="outline"
                      className="w-full gap-2"
                      size="sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Portfolio
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleCopyUrl(portfolio.url)}
                        variant="outline"
                        className="flex-1 gap-2"
                        size="sm"
                      >
                        <Copy className="w-4 h-4" />
                        Copy URL
                      </Button>
                      <Button
                        onClick={() => handleDelete(portfolio.id)}
                        variant="outline"
                        className="flex-1 gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
