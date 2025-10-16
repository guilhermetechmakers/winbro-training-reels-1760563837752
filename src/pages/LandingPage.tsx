import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeatureHighlights } from "@/components/landing/FeatureHighlights";
import { CustomerProof } from "@/components/landing/CustomerProof";
import { PricingSummary } from "@/components/landing/PricingSummary";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { DemoRequestForm } from "@/components/landing/DemoRequestForm";

interface Testimonial {
  name: string;
  title: string;
  company: string;
  content: string;
  rating: number;
  photoUrl?: string;
}

export function LandingPage() {
  const navigate = useNavigate();
  const [isDemoFormOpen, setIsDemoFormOpen] = useState(false);

  // Sample testimonials data
  const testimonials: Testimonial[] = [
    {
      name: "Sarah Johnson",
      title: "Training Manager",
      company: "TechCorp Manufacturing",
      content: "Winbro Training Reels has revolutionized our employee onboarding. The 30-second clips are perfect for our fast-paced environment. Our technicians can now find exactly what they need in seconds.",
      rating: 5,
      photoUrl: undefined
    },
    {
      name: "Mike Chen",
      title: "Operations Director",
      company: "Precision Industries",
      content: "The AI transcription and tagging saves us hours every week. Our maintenance team can quickly access troubleshooting videos right when they need them. It's been a game-changer for our efficiency.",
      rating: 5,
      photoUrl: undefined
    },
    {
      name: "Emily Rodriguez",
      title: "HR Director",
      company: "Global Solutions Inc",
      content: "The course builder is incredibly intuitive. We created our entire safety training program in just a few days. The completion rates have improved dramatically since we switched to micro-videos.",
      rating: 5,
      photoUrl: undefined
    }
  ];

  // Sample customer logos (placeholder data)
  const customerLogos = [
    "TechCorp Manufacturing",
    "Precision Industries", 
    "Global Solutions Inc",
    "Advanced Manufacturing Co",
    "Industrial Systems Ltd",
    "Process Solutions Group"
  ];

  const handleDemoRequest = () => {
    // Track demo request
    console.log("Demo requested");
    setIsDemoFormOpen(true);
  };

  const handleSignupClick = () => {
    // Track signup click
    console.log("Signup clicked");
    navigate("/signup");
  };

  const handleContactSales = () => {
    // Track contact sales click
    console.log("Contact sales clicked");
    setIsDemoFormOpen(true);
  };

  const handleStartTrial = () => {
    // Track trial start click
    console.log("Start trial clicked");
    navigate("/signup");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-foreground" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              <span className="text-xl font-bold">Winbro Training Reels</span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate("/login")}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                Sign In
              </button>
              <button 
                onClick={handleSignupClick}
                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <HeroSection 
          onDemoRequest={handleDemoRequest}
          onSignupClick={handleSignupClick}
        />
        
        <FeatureHighlights />
        
        <CustomerProof 
          testimonials={testimonials}
          customerLogos={customerLogos}
        />
        
        <PricingSummary 
          onContactSales={handleContactSales}
          onStartTrial={handleStartTrial}
        />
        
        <HowItWorks />
        
        {/* Final CTA Section */}
        <section className="py-24 px-4 bg-gradient-to-br from-primary/5 via-background to-secondary/10 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
          <div className="absolute top-10 right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-secondary/20 rounded-full blur-xl animate-pulse delay-1000" />
          
          <div className="container mx-auto text-center relative z-10">
            <div className="animate-fade-in-up">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Ready to transform your training?
              </h2>
            </div>
            
            <div className="animate-fade-in-up delay-200">
              <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
                Join thousands of organizations already using Winbro Training Reels to create 
                more effective, engaging training programs.
              </p>
            </div>
            
            <div className="animate-fade-in-up delay-400">
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button 
                  onClick={handleSignupClick}
                  className="w-full sm:w-auto px-8 py-4 text-lg font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-lg"
                >
                  Start Your Free Trial
                  <svg className="w-5 h-5 ml-2 inline group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
                <button 
                  onClick={handleDemoRequest}
                  className="w-full sm:w-auto px-8 py-4 text-lg font-semibold border-2 border-primary/20 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 rounded-lg"
                >
                  Schedule a Demo
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
      
      {/* Demo Request Form Modal */}
      <DemoRequestForm 
        isOpen={isDemoFormOpen}
        onClose={() => setIsDemoFormOpen(false)}
      />
    </div>
  );
}