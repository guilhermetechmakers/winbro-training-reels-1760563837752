import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
}

interface PricingSummaryProps {
  onContactSales: () => void;
  onStartTrial: () => void;
}

export function PricingSummary({ onContactSales, onStartTrial }: PricingSummaryProps) {
  const { ref, isVisible } = useScrollAnimation();
  
  const pricingPlans: PricingPlan[] = [
    {
      name: "Starter",
      price: "$29",
      period: "per month",
      description: "Perfect for small teams getting started",
      features: [
        "Up to 10 users",
        "100 video clips",
        "Basic analytics",
        "Email support",
        "Standard security"
      ],
      cta: "Start Trial",
      popular: false
    },
    {
      name: "Professional",
      price: "$99",
      period: "per month",
      description: "Ideal for growing organizations",
      features: [
        "Up to 50 users",
        "Unlimited video clips",
        "Advanced analytics",
        "Priority support",
        "SSO integration",
        "Custom branding"
      ],
      cta: "Start Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "For large organizations with complex needs",
      features: [
        "Unlimited users",
        "Unlimited video clips",
        "Custom analytics",
        "Dedicated support",
        "Advanced SSO",
        "White-label solution",
        "API access"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <section ref={ref} className="py-24 px-4 bg-gradient-to-b from-muted/10 to-background">
      <div className="container mx-auto">
        <div className="text-center mb-20">
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Simple, transparent pricing
            </h2>
          </div>
          <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your organization's training needs
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`group transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <Card className={`relative h-full transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
                plan.popular 
                  ? "border-primary shadow-xl scale-105 bg-gradient-to-br from-primary/5 to-primary/10" 
                  : "border-border hover:border-primary/50 bg-gradient-to-br from-card to-card/80"
              }`}>
                {plan.popular && (
                  <Badge className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-1 text-sm font-semibold shadow-lg">
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors duration-300">
                    {plan.name}
                  </CardTitle>
                  <div className="mt-6">
                    <span className="text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground ml-2 text-lg">{plan.period}</span>
                  </div>
                  <CardDescription className="mt-4 text-base group-hover:text-foreground/80 transition-colors duration-300">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li 
                        key={featureIndex} 
                        className="flex items-start group-hover:translate-x-1 transition-transform duration-300"
                        style={{ animationDelay: `${featureIndex * 50}ms` }}
                      >
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-sm leading-relaxed group-hover:text-foreground/90 transition-colors duration-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    onClick={plan.cta === "Contact Sales" ? onContactSales : onStartTrial}
                    className={`w-full py-3 text-base font-semibold transition-all duration-300 ${
                      plan.popular 
                        ? "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transform hover:scale-105" 
                        : "hover:bg-primary/5 hover:border-primary/50"
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                    {plan.cta === "Start Trial" && (
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}