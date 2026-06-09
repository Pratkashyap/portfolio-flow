import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Check } from "lucide-react";

interface Template {
  id: number;
  name: string;
  description: string;
  color: string;
  features: string[];
}

const templates: Template[] = [
  {
    id: 1,
    name: "Minimalist Professional",
    description: "Clean, simple layout focused on content",
    color: "bg-slate-100",
    features: ["Navy sidebar", "Light background", "Minimal animations", "Content-focused"],
  },
  {
    id: 2,
    name: "Bold & Modern",
    description: "Vibrant design with smooth animations",
    color: "bg-blue-100",
    features: ["Mint & Navy colors", "Animated titles", "Parallax effects", "Project carousel"],
  },
  {
    id: 3,
    name: "Creative Showcase",
    description: "Artistic design with colorful gradients",
    color: "bg-purple-100",
    features: ["Colorful gradients", "Large hero image", "Card-based layout", "Smooth transitions"],
  },
];

export default function TemplateSelection() {
  const [, setLocation] = useLocation();
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);

  useEffect(() => {
    // Load portfolio data from localStorage
    const saved = localStorage.getItem("portfolioData");
    if (!saved) {
      setLocation("/create");
    }
  }, [setLocation]);

  const handleContinue = () => {
    if (!selectedTemplate) {
      alert("Please select a template");
      return;
    }

    // Save template selection
    const saved = localStorage.getItem("portfolioData");
    if (saved) {
      const data = JSON.parse(saved);
      data.templateId = selectedTemplate;
      localStorage.setItem("portfolioData", JSON.stringify(data));
    }

    setLocation("/preview");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Choose Your Design
          </h1>
          <p className="text-slate-600">
            Step 3 of 4: Select a template that matches your style
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex gap-2 mb-12 max-w-2xl mx-auto">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-2 flex-1 rounded-full ${
                step <= 3 ? "bg-blue-600" : "bg-slate-200"
              }`}
            />
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
          {templates.map((template) => (
            <Card
              key={template.id}
              className={`overflow-hidden cursor-pointer transition-all transform hover:scale-105 ${
                selectedTemplate === template.id
                  ? "ring-2 ring-blue-600 shadow-lg"
                  : "hover:shadow-lg"
              }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              {/* Template Preview */}
              <div className={`${template.color} h-40 relative flex items-center justify-center`}>
                <div className="text-center">
                  <div className="text-4xl font-bold text-slate-400 mb-2">
                    {template.id}
                  </div>
                  <p className="text-sm text-slate-500">Template Preview</p>
                </div>
                {selectedTemplate === template.id && (
                  <div className="absolute top-2 right-2 bg-blue-600 text-white p-2 rounded-full">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Template Info */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {template.name}
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  {template.description}
                </p>

                {/* Features */}
                <div className="space-y-2">
                  {template.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Select Button */}
                <Button
                  onClick={() => setSelectedTemplate(template.id)}
                  variant={selectedTemplate === template.id ? "default" : "outline"}
                  className="w-full mt-4"
                >
                  {selectedTemplate === template.id ? "Selected" : "Select"}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 max-w-2xl mx-auto">
          <Button
            onClick={() => setLocation("/questionnaire")}
            variant="outline"
            className="flex-1"
          >
            Back
          </Button>
          <Button
            onClick={handleContinue}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Continue to Preview
          </Button>
        </div>
      </div>
    </div>
  );
}
