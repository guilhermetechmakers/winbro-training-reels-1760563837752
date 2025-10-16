import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Tags, Award, ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export function HowItWorks() {
  const { ref, isVisible } = useScrollAnimation();
  
  const steps = [
    {
      icon: Camera,
      title: "Capture",
      description: "Record 30-second demonstrations of your processes, procedures, and troubleshooting steps",
      details: [
        "Mobile-friendly recording",
        "One-touch capture",
        "Automatic quality optimization",
        "Instant preview"
      ]
    },
    {
      icon: Tags,
      title: "Curate",
      description: "AI automatically tags and organizes your videos for easy discovery and management",
      details: [
        "AI-powered transcription",
        "Smart categorization",
        "Searchable metadata",
        "Quality scoring"
      ]
    },
    {
      icon: Award,
      title: "Learn",
      description: "Create structured courses and track completion with certificates and analytics",
      details: [
        "Course builder",
        "Progress tracking",
        "Automated certificates",
        "Engagement analytics"
      ]
    }
  ];

  return (
    <section ref={ref} className="py-24 px-4 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto">
        <div className="text-center mb-20">
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              How it works
            </h2>
          </div>
          <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Transform your process knowledge into effective training in three simple steps
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`group transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <Card className="h-full text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <step.icon className="w-10 h-10 text-primary group-hover:text-primary/80" />
                    </div>
                    {/* Step Number */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors duration-300">
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-base leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300 mb-6">
                    {step.description}
                  </CardDescription>
                  
                  <ul className="space-y-3 text-left">
                    {step.details.map((detail, detailIndex) => (
                      <li 
                        key={detailIndex}
                        className="flex items-start group-hover:translate-x-1 transition-transform duration-300"
                        style={{ animationDelay: `${detailIndex * 50}ms` }}
                      >
                        <div className="w-2 h-2 bg-primary/60 rounded-full mt-2 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-sm text-muted-foreground group-hover:text-foreground/90 transition-colors duration-300">
                          {detail}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        
        {/* Process Flow Arrows */}
        <div className="hidden md:flex justify-center items-center mt-8 space-x-4">
          {steps.slice(0, -1).map((_, index) => (
            <div
              key={index}
              className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${(index + 1) * 200 + 100}ms` }}
            >
              <ArrowRight className="w-8 h-8 text-primary/60 group-hover:text-primary transition-colors duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}