import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CookieConsentBanner } from '@/components/legal/CookieConsentBanner';
import { legalApi, type CookiePreferences } from '@/api/legal';
import { Cookie, Shield, BarChart3, Target, Save, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function CookiePolicyPage() {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false
  });

  const queryClient = useQueryClient();

  // Fetch current cookie preferences
  const { data: currentPreferences, isLoading } = useQuery({
    queryKey: ['cookie-preferences'],
    queryFn: legalApi.getCookiePreferences,
    retry: false
  });

  // Update preferences mutation
  const updatePreferencesMutation = useMutation({
    mutationFn: legalApi.updateCookiePreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cookie-preferences'] });
      toast.success('Cookie preferences saved successfully');
    },
    onError: (error) => {
      console.error('Failed to save preferences:', error);
      toast.error('Failed to save preferences. Please try again.');
    }
  });

  useEffect(() => {
    if (currentPreferences) {
      setPreferences(currentPreferences as CookiePreferences);
    }
  }, [currentPreferences]);

  const handlePreferenceChange = (key: keyof CookiePreferences, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSavePreferences = () => {
    updatePreferencesMutation.mutate(preferences);
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true
    };
    setPreferences(allAccepted);
    updatePreferencesMutation.mutate(allAccepted);
  };

  const handleRejectAll = () => {
    const onlyEssential = {
      essential: true,
      analytics: false,
      marketing: false
    };
    setPreferences(onlyEssential);
    updatePreferencesMutation.mutate(onlyEssential);
  };

  const cookieTypes = [
    {
      id: 'essential',
      name: 'Essential Cookies',
      description: 'These cookies are necessary for the website to function and cannot be switched off in our systems.',
      icon: Shield,
      required: true,
      examples: [
        'Authentication cookies',
        'Security cookies',
        'Load balancing cookies',
        'User interface customization cookies'
      ]
    },
    {
      id: 'analytics',
      name: 'Analytics Cookies',
      description: 'These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.',
      icon: BarChart3,
      required: false,
      examples: [
        'Google Analytics',
        'Performance monitoring',
        'User behavior tracking',
        'Site usage statistics'
      ]
    },
    {
      id: 'marketing',
      name: 'Marketing Cookies',
      description: 'These cookies may be set through our site by our advertising partners to build a profile of your interests.',
      icon: Target,
      required: false,
      examples: [
        'Advertising cookies',
        'Social media cookies',
        'Remarketing cookies',
        'Personalized advertising'
      ]
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Cookie Consent Banner */}
      <CookieConsentBanner
        onSavePreferences={handleSavePreferences}
        onAcceptAll={handleAcceptAll}
        onRejectAll={handleRejectAll}
      />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Cookie className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Cookie Policy
          </h1>
          <p className="text-lg text-muted-foreground">
            Learn about how we use cookies and manage your preferences
          </p>
          <Badge variant="outline" className="mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </Badge>
        </div>

        {/* Cookie Preferences Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Save className="h-5 w-5" />
              Your Cookie Preferences
            </CardTitle>
            <CardDescription>
              Manage your cookie preferences below. You can change these settings at any time.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {cookieTypes.map((cookieType) => {
              const Icon = cookieType.icon;
              const isEnabled = preferences[cookieType.id as keyof CookiePreferences];
              
              return (
                <div key={cookieType.id} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        isEnabled ? "bg-primary/10" : "bg-muted"
                      )}>
                        <Icon className={cn(
                          "h-5 w-5",
                          isEnabled ? "text-primary" : "text-muted-foreground"
                        )} />
                      </div>
                      <div>
                        <Label className="text-base font-medium">
                          {cookieType.name}
                          {cookieType.required && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              Required
                            </Badge>
                          )}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {cookieType.description}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={(checked) => 
                        handlePreferenceChange(cookieType.id as keyof CookiePreferences, checked)
                      }
                      disabled={cookieType.required}
                      className={cn(
                        cookieType.required && "opacity-50"
                      )}
                    />
                  </div>
                  
                  {isEnabled && (
                    <div className="ml-12 space-y-2">
                      <p className="text-sm font-medium text-foreground">Examples:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {cookieType.examples.map((example, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-primary rounded-full" />
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {cookieType.id !== 'marketing' && <Separator />}
                </div>
              );
            })}
            
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={handleSavePreferences}
                disabled={updatePreferencesMutation.isPending}
                className="flex-1"
              >
                {updatePreferencesMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Save Preferences
                  </div>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleAcceptAll}
                className="flex-1"
              >
                Accept All
              </Button>
              <Button
                variant="outline"
                onClick={handleRejectAll}
                className="flex-1"
              >
                Reject All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Information */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>What Are Cookies?</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
                They are widely used to make websites work more efficiently and to provide information to website owners.
              </p>
              <p>
                Cookies can be "persistent" or "session" cookies. Persistent cookies remain on your personal computer or 
                mobile device when you go offline, while session cookies are deleted as soon as you close your web browser.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How We Use Cookies</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                We use cookies for several purposes:
              </p>
              <ul>
                <li><strong>Essential Cookies:</strong> These are necessary for the website to function properly and cannot be disabled.</li>
                <li><strong>Analytics Cookies:</strong> These help us understand how visitors interact with our website by collecting and reporting information anonymously.</li>
                <li><strong>Marketing Cookies:</strong> These are used to track visitors across websites to display relevant and engaging advertisements.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Managing Your Cookie Preferences</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                You can control and/or delete cookies as you wish. You can delete all cookies that are already on your 
                computer and you can set most browsers to prevent them from being placed. If you do this, however, you 
                may have to manually adjust some preferences every time you visit a site and some services and functionalities may not work.
              </p>
              <p>
                Most web browsers allow some control of most cookies through the browser settings. To find out more about 
                cookies, including how to see what cookies have been set and how to manage and delete them, visit 
                <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  www.aboutcookies.org
                </a> or 
                <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  www.allaboutcookies.org
                </a>.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                If you have any questions about our use of cookies or this Cookie Policy, please contact us at:
              </p>
              <ul>
                <li>Email: privacy@winbro.com</li>
                <li>Address: Winbro Training Reels, Privacy Department, 123 Business St, City, State 12345</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}