import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Camera, Lightbulb, Target } from "lucide-react";

export function CaptureGuidelines() {
  const guidelines = [
    {
      icon: Clock,
      title: "Duration",
      description: "Keep clips between 20-30 seconds",
      tip: "Focus on single, clear procedures"
    },
    {
      icon: Camera,
      title: "Framing",
      description: "Keep hands and tools in frame",
      tip: "Use landscape orientation when possible"
    },
    {
      icon: Lightbulb,
      title: "Lighting",
      description: "Ensure good lighting on work area",
      tip: "Avoid backlighting and shadows"
    },
    {
      icon: Target,
      title: "Focus",
      description: "One procedure per clip",
      tip: "Start and end with clear context"
    }
  ];

  const bestPractices = [
    "Record in a quiet environment",
    "Speak clearly if providing narration",
    "Show the complete process from start to finish",
    "Use close-ups for detailed work",
    "Keep the camera steady",
    "Test audio levels before recording"
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Capture Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {guidelines.map((guideline, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <guideline.icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <h4 className="font-medium text-sm">{guideline.title}</h4>
                <p className="text-sm text-muted-foreground">{guideline.description}</p>
                <p className="text-xs text-primary/80 italic">{guideline.tip}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {bestPractices.map((practice, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                <span className="text-muted-foreground">{practice}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <Badge variant="secondary" className="text-xs">
              Pro Tip
            </Badge>
            <p className="text-sm text-muted-foreground">
              Record multiple takes if needed. You can always trim the best parts later.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
