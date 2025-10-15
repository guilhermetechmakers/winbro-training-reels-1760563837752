import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Home, 
  Search, 
  ArrowLeft, 
  RefreshCw, 
  AlertTriangle,
  Compass,
  HelpCircle
} from "lucide-react";

export function NotFoundPage() {
  const quickLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, description: 'Overview and analytics' },
    { name: 'Content Library', href: '/library', icon: Search, description: 'Browse training videos' },
    { name: 'Course Builder', href: '/course-builder', icon: Search, description: 'Create new courses' },
    { name: 'Analytics', href: '/analytics', icon: Search, description: 'View performance data' },
    { name: 'User Management', href: '/users', icon: Search, description: 'Manage team members' },
    { name: 'Settings', href: '/settings', icon: Search, description: 'Account preferences' }
  ];

  const popularSearches = [
    'Machine Setup',
    'Safety Protocol',
    'Maintenance',
    'Quality Control',
    'Troubleshooting',
    'Training Videos'
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* 404 Illustration */}
        <div className="relative">
          <div className="text-9xl font-bold text-primary/20 select-none">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-16 w-16 text-primary" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Page Not Found</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/dashboard">
            <Button size="lg" className="w-full sm:w-auto">
              <Home className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full sm:w-auto"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full sm:w-auto"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Page
          </Button>
        </div>

        {/* Quick Links */}
        <Card className="mt-12">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Quick Navigation</h2>
                <p className="text-muted-foreground">
                  Here are some popular pages you might be looking for:
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link key={link.name} to={link.href}>
                      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                              <Icon className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 text-left">
                              <h3 className="font-medium group-hover:text-primary transition-colors">
                                {link.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {link.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Suggestions */}
        <Card>
          <CardContent className="p-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Popular Searches</h2>
                <p className="text-muted-foreground">
                  Try searching for one of these popular topics:
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center">
                {popularSearches.map((search) => (
                  <Button
                    key={search}
                    variant="outline"
                    size="sm"
                    className="hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => {
                      // In a real app, this would redirect to search results
                      window.location.href = `/library?search=${encodeURIComponent(search)}`;
                    }}
                  >
                    <Search className="h-3 w-3 mr-2" />
                    {search}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <HelpCircle className="h-4 w-4" />
            <span>Still can't find what you're looking for?</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="ghost" asChild>
              <Link to="/help">
                <HelpCircle className="h-4 w-4 mr-2" />
                Help Center
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/contact">
                <Compass className="h-4 w-4 mr-2" />
                Contact Support
              </Link>
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            Error 404 • Winbro Training Reels
          </p>
        </div>
      </div>
    </div>
  );
}
