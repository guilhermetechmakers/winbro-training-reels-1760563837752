import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface Testimonial {
  name: string;
  title: string;
  company: string;
  content: string;
  rating: number;
  photoUrl?: string;
}

interface CustomerProofProps {
  testimonials: Testimonial[];
  customerLogos: string[];
}

export function CustomerProof({ testimonials, customerLogos }: CustomerProofProps) {
  const { ref, isVisible } = useScrollAnimation();
  
  return (
    <section ref={ref} className="py-24 px-4 bg-gradient-to-b from-background to-muted/10">
      <div className="container mx-auto">
        <div className="text-center mb-20">
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Trusted by industry leaders
            </h2>
          </div>
          <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what our customers are saying about Winbro Training Reels
            </p>
          </div>
        </div>
        
        {/* Customer Logos */}
        <div className={`transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} mb-16`}>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60">
            {customerLogos.map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-center p-4 hover:opacity-100 transition-opacity duration-300"
              >
                <div className="w-24 h-12 bg-muted/50 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    Logo {index + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`group transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <Card className="h-full hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <Quote className="w-8 h-8 text-primary/60 mr-3" />
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="w-5 h-5 fill-yellow-400 text-yellow-400 group-hover:scale-110 transition-transform duration-300" 
                        style={{ animationDelay: `${i * 100}ms` }}
                      />
                    ))}
                  </div>
                  <blockquote className="text-lg text-muted-foreground mb-6 leading-relaxed group-hover:text-foreground/90 transition-colors duration-300">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="border-t pt-4">
                    <div className="flex items-center">
                      {testimonial.photoUrl ? (
                        <img 
                          src={testimonial.photoUrl} 
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full mr-4 object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                          <span className="text-primary font-semibold text-lg">
                            {testimonial.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-muted-foreground group-hover:text-foreground/70 transition-colors duration-300">
                          {testimonial.title} at {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}