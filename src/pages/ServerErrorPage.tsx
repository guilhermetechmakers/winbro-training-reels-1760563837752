import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, RefreshCw, Home, Bug, Mail, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServerErrorPageProps {
  error?: Error;
  resetError?: () => void;
  className?: string;
}

export function ServerErrorPage({ 
  error, 
  resetError, 
  className 
}: ServerErrorPageProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      if (resetError) {
        resetError();
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error('Retry failed:', err);
    } finally {
      setIsRetrying(false);
    }
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const handleReportBug = () => {
    const errorDetails = {
      message: error?.message || 'Server Error',
      stack: error?.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      referrer: document.referrer
    };

    // Copy error details to clipboard
    navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2));
    alert('Error details copied to clipboard. Please paste them in your bug report.');
  };

  const handleContactSupport = () => {
    window.location.href = '/help';
  };

  return (
    <div className={cn("min-h-screen flex items-center justify-center p-4 bg-background", className)}>
      <div className="w-full max-w-2xl">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="h-10 w-10 text-red-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-foreground mb-2">
              Oops! Something went wrong
            </CardTitle>
            <CardDescription className="text-lg">
              We're experiencing technical difficulties. Our team has been notified and is working to fix the issue.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Error Details (Development Only) */}
            {import.meta.env.DEV && error && (
              <div className="p-4 bg-muted rounded-lg text-left">
                <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                  <Bug className="h-4 w-4" />
                  Error Details (Development)
                </h4>
                <pre className="text-xs text-muted-foreground overflow-auto max-h-32">
                  {error.message}
                  {error.stack && `\n\n${error.stack}`}
                </pre>
              </div>
            )}

            {/* Status Information */}
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Server Error 500
              </Badge>
              <Badge variant="outline">
                {new Date().toLocaleString()}
              </Badge>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button 
                onClick={handleRetry} 
                disabled={isRetrying}
                className="w-full"
              >
                {isRetrying ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Retrying...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                  </div>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleGoBack}
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleGoHome}
                className="w-full"
              >
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleContactSupport}
                className="w-full"
              >
                <Mail className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </div>

            {/* Additional Help */}
            <div className="pt-4 border-t">
              <h4 className="font-medium text-foreground mb-2">Still having trouble?</h4>
              <p className="text-sm text-muted-foreground mb-4">
                If the problem persists, please contact our support team with the error details.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleReportBug}
                  className="flex items-center gap-2"
                >
                  <Bug className="h-4 w-4" />
                  Report Bug
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleContactSupport}
                  className="flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Email Support
                </Button>
              </div>
            </div>

            {/* System Status */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span>System Status: Investigating</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Check our <a href="/status" className="text-primary hover:underline">status page</a> for updates
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Helpful Links */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = '/help'}>
            <CardContent className="p-4 text-center">
              <h4 className="font-medium text-sm mb-1">Help Center</h4>
              <p className="text-xs text-muted-foreground">Find answers to common questions</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = '/status'}>
            <CardContent className="p-4 text-center">
              <h4 className="font-medium text-sm mb-1">System Status</h4>
              <p className="text-xs text-muted-foreground">Check for ongoing issues</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = '/contact'}>
            <CardContent className="p-4 text-center">
              <h4 className="font-medium text-sm mb-1">Contact Us</h4>
              <p className="text-xs text-muted-foreground">Get in touch with support</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}