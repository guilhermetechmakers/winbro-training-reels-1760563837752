import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, ArrowRight, Zap } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { LazyVideoPlayer } from "@/components/landing/LazyVideoPlayer";

interface HeroSectionProps {
  onDemoRequest: () => void;
  onSignupClick: () => void;
}

export function HeroSection({ onDemoRequest, onSignupClick }: HeroSectionProps) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="relative py-20 px-4 overflow-hidden min-h-screen flex items-center">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-40 right-20 w-32 h-32 bg-secondary/20 rounded-full blur-2xl animate-pulse delay-1000" />
      <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-accent/15 rounded-full blur-lg animate-pulse delay-2000" />
      
      <div className="container mx-auto text-center relative z-10">
        <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
            <Zap className="w-4 h-4 mr-2 animate-pulse" />
            New: AI-Powered Video Processing
          </Badge>
        </div>
        
        <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent animate-gradient-x">
              Transform Process Knowledge
            </span>
            <br />
            <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Into 30-Second Training Videos
            </span>
          </h1>
        </div>
        
        <div className={`transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Replace paper manuals and tribal knowledge with searchable, visual demonstrations. 
            Perfect for machine operations, maintenance, and troubleshooting.
          </p>
        </div>
        
        <div className={`transition-all duration-700 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              onClick={onDemoRequest}
              size="lg" 
              className="w-full sm:w-auto px-8 py-4 text-lg font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Request Demo
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              onClick={onSignupClick}
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto px-8 py-4 text-lg font-semibold border-2 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300"
            >
              <Play className="w-5 h-5 mr-2" />
              Sign Up Free
            </Button>
          </div>
        </div>
        
        {/* Hero Video Player */}
        <div className={`transition-all duration-700 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} mt-16`}>
          <div className="relative max-w-4xl mx-auto">
            <LazyVideoPlayer
              src="/api/placeholder-video.mp4" // Placeholder - in real app this would be actual video
              poster="/api/placeholder-poster.jpg" // Placeholder poster image
              autoPlay={true}
              muted={true}
              loop={true}
              className="w-full"
            />
          </div>
        </div>
        
        {/* Stats */}
        <div className={`transition-all duration-700 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} mt-16`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">10K+</div>
              <div className="text-sm text-muted-foreground">Training Clips</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Organizations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">95%</div>
              <div className="text-sm text-muted-foreground">Completion Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}