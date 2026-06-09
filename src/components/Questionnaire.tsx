import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";

interface QuestionnaireData {
  jobTitle: string;
  experience: string;
  workStyle: string;
  achievement: string;
  designPreference: string;
  colorPreference: string;
  industry: string;
}

export default function Questionnaire() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState<QuestionnaireData>({
    jobTitle: "",
    experience: "",
    workStyle: "",
    achievement: "",
    designPreference: "",
    colorPreference: "",
    industry: "",
  });

  useEffect(() => {
    // Load portfolio data from localStorage
    const saved = localStorage.getItem("portfolioData");
    if (!saved) {
      setLocation("/create");
    }
  }, [setLocation]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContinue = () => {
    if (
      !formData.jobTitle ||
      !formData.experience ||
      !formData.workStyle ||
      !formData.achievement ||
      !formData.designPreference ||
      !formData.colorPreference ||
      !formData.industry
    ) {
      alert("Please answer all questions");
      return;
    }

    // Save questionnaire data
    const saved = localStorage.getItem("portfolioData");
    if (saved) {
      const data = JSON.parse(saved);
      data.questionnaireData = formData;
      localStorage.setItem("portfolioData", JSON.stringify(data));
    }

    setLocation("/templates");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Tell Us About Yourself
          </h1>
          <p className="text-slate-600">
            Step 2 of 4: Answer a few questions to personalize your portfolio
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-2 flex-1 rounded-full ${
                step <= 2 ? "bg-blue-600" : "bg-slate-200"
              }`}
            />
          ))}
        </div>

        <Card className="p-8">
          <div className="space-y-8">
            {/* Question 1: Job Title */}
            <div>
              <Label htmlFor="jobTitle" className="block mb-2 font-semibold">
                What is your current or desired job title? *
              </Label>
              <Input
                id="jobTitle"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                placeholder="e.g., Senior Product Manager, Full Stack Developer"
              />
            </div>

            {/* Question 2: Experience */}
            <div>
              <Label className="block mb-3 font-semibold">
                Years of professional experience *
              </Label>
              <Select value={formData.experience} onValueChange={(value) => handleSelectChange("experience", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-2">0-2 years</SelectItem>
                  <SelectItem value="2-5">2-5 years</SelectItem>
                  <SelectItem value="5-10">5-10 years</SelectItem>
                  <SelectItem value="10+">10+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Question 3: Work Style */}
            <div>
              <Label className="block mb-3 font-semibold">
                What's your preferred work style? *
              </Label>
              <RadioGroup value={formData.workStyle} onValueChange={(value) => handleSelectChange("workStyle", value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="collaborative" id="collaborative" />
                  <Label htmlFor="collaborative" className="font-normal cursor-pointer">
                    Collaborative - I love working with teams
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="independent" id="independent" />
                  <Label htmlFor="independent" className="font-normal cursor-pointer">
                    Independent - I prefer working autonomously
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="leadership" id="leadership" />
                  <Label htmlFor="leadership" className="font-normal cursor-pointer">
                    Leadership-focused - I enjoy leading teams
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Question 4: Achievement */}
            <div>
              <Label htmlFor="achievement" className="block mb-2 font-semibold">
                Describe your proudest professional achievement (max 200 characters) *
              </Label>
              <Textarea
                id="achievement"
                name="achievement"
                value={formData.achievement}
                onChange={handleInputChange}
                placeholder="Share a project or accomplishment you're proud of..."
                maxLength={200}
                rows={3}
              />
              <p className="text-sm text-slate-500 mt-1">
                {formData.achievement.length}/200 characters
              </p>
            </div>

            {/* Question 5: Design Preference */}
            <div>
              <Label className="block mb-3 font-semibold">
                What's your design preference? *
              </Label>
              <RadioGroup value={formData.designPreference} onValueChange={(value) => handleSelectChange("designPreference", value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="minimalist" id="minimalist" />
                  <Label htmlFor="minimalist" className="font-normal cursor-pointer">
                    Minimalist - Clean and simple
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bold" id="bold" />
                  <Label htmlFor="bold" className="font-normal cursor-pointer">
                    Bold - Modern and vibrant
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="creative" id="creative" />
                  <Label htmlFor="creative" className="font-normal cursor-pointer">
                    Creative - Artistic and unique
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Question 6: Color Preference */}
            <div>
              <Label className="block mb-3 font-semibold">
                What color scheme do you prefer? *
              </Label>
              <RadioGroup value={formData.colorPreference} onValueChange={(value) => handleSelectChange("colorPreference", value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cool" id="cool" />
                  <Label htmlFor="cool" className="font-normal cursor-pointer">
                    Cool tones - Blues, greens, purples
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="warm" id="warm" />
                  <Label htmlFor="warm" className="font-normal cursor-pointer">
                    Warm tones - Reds, oranges, yellows
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="neutral" id="neutral" />
                  <Label htmlFor="neutral" className="font-normal cursor-pointer">
                    Neutral - Blacks, whites, grays
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Question 7: Industry */}
            <div>
              <Label className="block mb-3 font-semibold">
                What's your industry or domain? *
              </Label>
              <Select value={formData.industry} onValueChange={(value) => handleSelectChange("industry", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech">Technology</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="consulting">Consulting</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t">
              <Button
                onClick={() => setLocation("/create")}
                variant="outline"
                className="flex-1"
              >
                Back
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
      </div>
    </div>
  );
}
