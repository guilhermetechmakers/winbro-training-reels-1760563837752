import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Search, BookOpen, Award } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export function FeatureHighlights() {
  const { ref, isVisible } = useScrollAnimation();
  
  const features = [
    {
      icon: Play,
      title: "Short Videos",
      description: "20-30 second focused clips that capture essential knowledge without overwhelming your team"
    },
    {
      icon: Search,
      title: "Searchable Library",
      description: "Find knowledge instantly with AI-powered search across video content and transcripts"
    },
    {
      icon: BookOpen,
      title: "Course Builder",
      description: "Create structured training modules by combining videos, quizzes, and assessments"
    },
    {
      icon: Award,
      title: "Certificates",
      description: "Validate learning completion with automated certificates and progress tracking"
    }
  ];

  return (
    <section ref={ref} className="py-24 px-4 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto">
        <div className="text-center mb-20">
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Everything you need for effective training
            </h2>
          </div>
          <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              From video capture to course completion, we provide all the tools you need to create 
              engaging, effective training programs that your team will actually use.
            </p>
          </div>
        </div>
        
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Card className="h-full text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-8 h-8 text-primary group-hover:text-primary/80" />
                  </div>
                  <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-base leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}