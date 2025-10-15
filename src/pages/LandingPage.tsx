import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Upload, 
  Search, 
  BookOpen, 
  Users, 
  BarChart3,
  CheckCircle,
  ArrowRight,
  Star,
  Shield,
  Zap
} from "lucide-react";

export function LandingPage() {
  const features = [
    {
      icon: Upload,
      title: "Easy Video Upload",
      description: "Drag and drop your training videos with automatic transcription and AI tagging."
    },
    {
      icon: Search,
      title: "Smart Search",
      description: "Find exactly what you need with AI-powered search across video content and transcripts."
    },
    {
      icon: BookOpen,
      title: "Course Builder",
      description: "Create structured training courses by combining videos, quizzes, and assessments."
    },
    {
      icon: Users,
      title: "Team Management",
      description: "Manage users, roles, and permissions with enterprise-grade security and SSO."
    },
    {
      icon: BarChart3,
      title: "Analytics & Reports",
      description: "Track progress, completion rates, and engagement with detailed analytics."
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "Enterprise security with encryption, audit logs, and compliance features."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Training Manager",
      company: "TechCorp",
      content: "Winbro Training Reels has revolutionized our employee onboarding. The 30-second clips are perfect for our fast-paced environment.",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Operations Director",
      company: "Manufacturing Inc",
      content: "The AI transcription and tagging saves us hours every week. Our technicians can find exactly what they need in seconds.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "HR Director",
      company: "Global Solutions",
      content: "The course builder is incredibly intuitive. We created our entire safety training program in just a few days.",
      rating: 5
    }
  ];

  const pricingPlans = [
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
      cta: "Start Free Trial",
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
      cta: "Start Free Trial",
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Play className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Winbro Training Reels</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            <Zap className="w-3 h-3 mr-1" />
            New: AI-Powered Transcription
          </Badge>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Transform Training with
            <br />
            Micro-Video Learning
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Create, organize, and deliver 20-30 second training clips that your team will actually watch. 
            Perfect for machine operations, maintenance, and troubleshooting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <Play className="w-4 h-4 mr-2" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need for effective training</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From video upload to course completion, we provide all the tools you need to create 
              engaging, effective training programs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Loved by training teams worldwide</h2>
            <p className="text-lg text-muted-foreground">
              See what our customers are saying about Winbro Training Reels
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-muted-foreground">
              Choose the plan that fits your organization
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground ml-2">{plan.period}</span>
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to transform your training?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of organizations already using Winbro Training Reels to create 
            more effective, engaging training programs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Start Your Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Play className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">Winbro Training</span>
              </div>
              <p className="text-muted-foreground">
                Empowering teams with micro-video learning solutions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/features" className="hover:text-foreground">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-foreground">Pricing</Link></li>
                <li><Link to="/integrations" className="hover:text-foreground">Integrations</Link></li>
                <li><Link to="/api" className="hover:text-foreground">API</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/about" className="hover:text-foreground">About</Link></li>
                <li><Link to="/blog" className="hover:text-foreground">Blog</Link></li>
                <li><Link to="/careers" className="hover:text-foreground">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/help" className="hover:text-foreground">Help Center</Link></li>
                <li><Link to="/docs" className="hover:text-foreground">Documentation</Link></li>
                <li><Link to="/status" className="hover:text-foreground">Status</Link></li>
                <li><Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Winbro Training Reels. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
