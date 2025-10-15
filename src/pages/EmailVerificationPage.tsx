import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Clock, Mail, Loader2, ArrowRight, RefreshCw } from "lucide-react";
import { useEmailVerification, useResendVerification } from "@/hooks/use-auth";

interface VerificationState {
  status: 'loading' | 'success' | 'error' | 'expired' | 'invalid' | 'already_verified';
  message: string;
  canResend: boolean;
  resendCooldown: number;
}

export function EmailVerificationPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [verificationState, setVerificationState] = useState<VerificationState>({
    status: 'loading',
    message: 'Verifying your email...',
    canResend: false,
    resendCooldown: 0
  });
  
  const verifyEmailMutation = useEmailVerification();
  const resendVerificationMutation = useResendVerification();

  // Auto-verify on component mount
  useEffect(() => {
    if (token) {
      verifyEmailMutation.mutate(token, {
        onSuccess: (data: any) => {
          if (data.success) {
            setVerificationState({
              status: 'success',
              message: 'Your email has been successfully verified!',
              canResend: false,
              resendCooldown: 0
            });
            
            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
              navigate('/dashboard');
            }, 2000);
          } else {
            handleVerificationError(data.message || 'Verification failed');
          }
        },
        onError: (error: any) => {
          console.error('Email verification error:', error);
          handleVerificationError(error.message || 'An error occurred during verification');
        }
      });
    } else {
      setVerificationState({
        status: 'error',
        message: 'Invalid verification link',
        canResend: false,
        resendCooldown: 0
      });
    }
  }, [token]);

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (verificationState.resendCooldown > 0) {
      const timer = setTimeout(() => {
        setVerificationState(prev => ({
          ...prev,
          resendCooldown: prev.resendCooldown - 1
        }));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (verificationState.resendCooldown === 0 && verificationState.status !== 'success') {
      setVerificationState(prev => ({
        ...prev,
        canResend: true
      }));
    }
  }, [verificationState.resendCooldown, verificationState.status]);


  const handleVerificationError = (errorMessage: string) => {
    let status: VerificationState['status'] = 'error';
    let message = errorMessage;
    let canResend = true;
    let resendCooldown = 0;

    if (errorMessage.includes('expired')) {
      status = 'expired';
      message = 'This verification link has expired';
    } else if (errorMessage.includes('invalid')) {
      status = 'invalid';
      message = 'This verification link is invalid';
    } else if (errorMessage.includes('already verified')) {
      status = 'already_verified';
      message = 'This email is already verified';
      canResend = false;
    } else if (errorMessage.includes('rate limit')) {
      resendCooldown = 300; // 5 minutes
      canResend = false;
    }

    setVerificationState({
      status,
      message,
      canResend,
      resendCooldown
    });
  };

  const handleResendVerification = () => {
    if (!verificationState.canResend || resendVerificationMutation.isPending) return;

    resendVerificationMutation.mutate(undefined, {
      onSuccess: () => {
        setVerificationState(prev => ({
          ...prev,
          canResend: false,
          resendCooldown: 300 // 5 minutes
        }));
      }
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusIcon = () => {
    switch (verificationState.status) {
      case 'loading':
        return <Loader2 className="h-16 w-16 text-primary animate-spin" />;
      case 'success':
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case 'expired':
      case 'invalid':
      case 'error':
        return <XCircle className="h-16 w-16 text-destructive" />;
      case 'already_verified':
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      default:
        return <Mail className="h-16 w-16 text-muted-foreground" />;
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="flex justify-center">
              {getStatusIcon()}
            </div>
            <CardTitle className="text-2xl font-bold">
              Email Verification
            </CardTitle>
            <CardDescription className="text-base">
              {verificationState.message}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Success State */}
            {verificationState.status === 'success' && (
              <div className="space-y-4">
                <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    Your account is now active and ready to use!
                  </AlertDescription>
                </Alert>
                <div className="text-center">
                  <Button 
                    onClick={() => navigate('/dashboard')}
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
                  >
                    Continue to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Already Verified State */}
            {verificationState.status === 'already_verified' && (
              <div className="space-y-4">
                <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    Your email is already verified. You can proceed to the dashboard.
                  </AlertDescription>
                </Alert>
                <div className="text-center">
                  <Button 
                    onClick={() => navigate('/dashboard')}
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Error States */}
            {(verificationState.status === 'error' || verificationState.status === 'expired' || verificationState.status === 'invalid') && (
              <div className="space-y-4">
                <Alert className="border-destructive/20 bg-destructive/5">
                  <XCircle className="h-4 w-4 text-destructive" />
                  <AlertDescription className="text-destructive">
                    {verificationState.message}
                  </AlertDescription>
                </Alert>

                {/* Resend Section */}
                <div className="space-y-3">
                  <div className="text-center">
                    <Button
                      onClick={handleResendVerification}
                      disabled={!verificationState.canResend || resendVerificationMutation.isPending}
                      className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {resendVerificationMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Resend Verification Email
                        </>
                      )}
                    </Button>
                  </div>

                  {verificationState.resendCooldown > 0 && (
                    <div className="text-center text-sm text-muted-foreground">
                      <Clock className="inline h-4 w-4 mr-1" />
                      You can request a new email in {formatTime(verificationState.resendCooldown)}
                    </div>
                  )}

                  <div className="text-center">
                    <Button
                      variant="outline"
                      onClick={() => navigate('/login')}
                      className="w-full"
                    >
                      Back to Login
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {verificationState.status === 'loading' && (
              <div className="text-center space-y-4">
                <div className="text-sm text-muted-foreground">
                  Please wait while we verify your email address...
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Help */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Need help? Contact our support team for assistance.
          </p>
        </div>
      </div>
    </div>
  );
}
