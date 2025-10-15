import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Check, 
  CreditCard, 
  Shield, 
  Lock, 
  ArrowLeft, 
  Users, 
  Zap, 
  Crown,
  Building,
  Globe,
  CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

type PlanType = 'starter' | 'professional' | 'enterprise';
type BillingCycle = 'monthly' | 'yearly';
type PaymentMethod = 'card' | 'bank' | 'paypal';

export function CheckoutPage() {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('professional');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'plan' | 'payment' | 'confirmation'>('plan');

  const plans = {
    starter: {
      name: 'Starter',
      description: 'Perfect for small teams getting started',
      monthlyPrice: 29,
      yearlyPrice: 290,
      features: [
        'Up to 10 users',
        '100 video clips',
        'Basic analytics',
        'Email support',
        'Standard security',
        'Mobile app access'
      ],
      limitations: [
        'No SSO integration',
        'Limited customization',
        'Basic reporting'
      ],
      popular: false,
      icon: Users
    },
    professional: {
      name: 'Professional',
      description: 'Ideal for growing organizations',
      monthlyPrice: 99,
      yearlyPrice: 990,
      features: [
        'Up to 50 users',
        'Unlimited video clips',
        'Advanced analytics',
        'Priority support',
        'SSO integration',
        'Custom branding',
        'API access',
        'Advanced reporting',
        'Team collaboration tools',
        'White-label options'
      ],
      limitations: [],
      popular: true,
      icon: Zap
    },
    enterprise: {
      name: 'Enterprise',
      description: 'For large organizations with complex needs',
      monthlyPrice: 299,
      yearlyPrice: 2990,
      features: [
        'Unlimited users',
        'Unlimited video clips',
        'Custom analytics',
        'Dedicated support',
        'Advanced SSO',
        'White-label solution',
        'Full API access',
        'Custom integrations',
        'On-premise deployment',
        'Dedicated account manager',
        'Custom training',
        'SLA guarantee'
      ],
      limitations: [],
      popular: false,
      icon: Crown
    }
  };

  const currentPlan = plans[selectedPlan];
  const price = billingCycle === 'monthly' ? currentPlan.monthlyPrice : currentPlan.yearlyPrice;
  const savings = billingCycle === 'yearly' ? Math.round((currentPlan.monthlyPrice * 12 - currentPlan.yearlyPrice) / (currentPlan.monthlyPrice * 12) * 100) : 0;

  const handlePlanSelect = (plan: PlanType) => {
    setSelectedPlan(plan);
  };


  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setStep('confirmation');
  };

  const renderPlanSelection = () => (
    <div className="space-y-6">
      {/* Billing Toggle */}
      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-4 bg-muted p-1 rounded-lg">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              billingCycle === 'monthly'
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              billingCycle === 'yearly'
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Yearly
            {savings > 0 && (
              <Badge variant="default" className="ml-2 text-xs">
                Save {savings}%
              </Badge>
            )}
          </button>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(plans).map(([key, plan]) => {
          const Icon = plan.icon;
          const isSelected = selectedPlan === key;
          const isPopular = plan.popular;
          
          return (
            <Card
              key={key}
              className={cn(
                "relative cursor-pointer transition-all duration-200 hover:shadow-lg",
                isSelected && "ring-2 ring-primary shadow-lg",
                isPopular && "border-primary"
              )}
              onClick={() => handlePlanSelect(key as PlanType)}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription className="text-sm">{plan.description}</CardDescription>
                <div className="mt-4">
                  <div className="text-3xl font-bold">
                    ${billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                    <span className="text-lg font-normal text-muted-foreground">
                      /{billingCycle === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                  {billingCycle === 'yearly' && savings > 0 && (
                    <p className="text-sm text-green-600 mt-1">
                      Save ${(plan.monthlyPrice * 12 - plan.yearlyPrice).toLocaleString()} per year
                    </p>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                {plan.limitations.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="space-y-2">
                      {plan.limitations.map((limitation, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-4 h-4 rounded-full border border-muted-foreground flex items-center justify-center">
                            <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                          </div>
                          <span>{limitation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-center">
        <Button
          onClick={() => setStep('payment')}
          size="lg"
          className="px-8"
        >
          Continue to Payment
          <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
        </Button>
      </div>
    </div>
  );

  const renderPaymentForm = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Plan Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{currentPlan.name} Plan</h3>
              <p className="text-sm text-muted-foreground">
                {billingCycle === 'monthly' ? 'Monthly billing' : 'Yearly billing'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">${price}</div>
              <div className="text-sm text-muted-foreground">
                {billingCycle === 'monthly' ? 'per month' : 'per year'}
              </div>
            </div>
          </div>
          
          {billingCycle === 'yearly' && savings > 0 && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  You're saving ${(currentPlan.monthlyPrice * 12 - currentPlan.yearlyPrice).toLocaleString()} per year!
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={paymentMethod} onValueChange={handlePaymentMethodChange}>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                  <CreditCard className="h-4 w-4" />
                  Credit or Debit Card
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bank" id="bank" />
                <Label htmlFor="bank" className="flex items-center gap-2 cursor-pointer">
                  <Building className="h-4 w-4" />
                  Bank Transfer
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer">
                  <Globe className="h-4 w-4" />
                  PayPal
                </Label>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Payment Form */}
      {paymentMethod === 'card' && (
        <Card>
          <CardHeader>
            <CardTitle>Card Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                className="mt-1"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="cardName">Cardholder Name</Label>
              <Input
                id="cardName"
                placeholder="John Doe"
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Billing Address */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" className="mt-1" />
            </div>
          </div>
          
          <div>
            <Label htmlFor="company">Company (Optional)</Label>
            <Input id="company" className="mt-1" />
          </div>
          
          <div>
            <Label htmlFor="address">Address</Label>
            <Input id="address" className="mt-1" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="zip">ZIP Code</Label>
              <Input id="zip" className="mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms and Conditions */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms" className="text-sm">
                I agree to the{' '}
                <a href="#" className="text-primary hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </Label>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox id="marketing" />
              <Label htmlFor="marketing" className="text-sm">
                I would like to receive product updates and marketing communications
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
        <Shield className="h-5 w-5 text-green-600 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-green-700">Secure Payment</p>
          <p className="text-muted-foreground">
            Your payment information is encrypted and secure. We never store your card details.
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={() => setStep('plan')}
          className="flex-1"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Plans
        </Button>
        <Button
          onClick={handleCheckout}
          disabled={isProcessing}
          className="flex-1"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Processing...
            </>
          ) : (
            <>
              <Lock className="h-4 w-4 mr-2" />
              Complete Payment
            </>
          )}
        </Button>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="max-w-2xl mx-auto text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
        <p className="text-muted-foreground">
          Your {currentPlan.name} plan has been activated. You can now access all features.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Plan</span>
              <span>{currentPlan.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Billing</span>
              <span>{billingCycle === 'monthly' ? 'Monthly' : 'Yearly'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Amount</span>
              <span className="font-bold">${price}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="font-medium">Next billing date</span>
              <span>
                {billingCycle === 'monthly' 
                  ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
                  : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString()
                }
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Button size="lg" className="w-full">
          Go to Dashboard
        </Button>
        <Button variant="outline" size="lg" className="w-full">
          Download Invoice
        </Button>
      </div>
    </div>
  );

  return (
    <MainLayout>
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {step === 'plan' && 'Choose Your Plan'}
              {step === 'payment' && 'Complete Your Purchase'}
              {step === 'confirmation' && 'Welcome to Winbro Training!'}
            </h1>
            <p className="text-muted-foreground">
              {step === 'plan' && 'Select the perfect plan for your organization'}
              {step === 'payment' && 'Secure payment processing'}
              {step === 'confirmation' && 'Your account is ready to use'}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
                step === 'plan' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                1
              </div>
              <div className={cn(
                "w-16 h-0.5",
                step !== 'plan' ? "bg-primary" : "bg-muted"
              )} />
              <div className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
                step === 'payment' ? "bg-primary text-primary-foreground" : step === 'confirmation' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                2
              </div>
              <div className={cn(
                "w-16 h-0.5",
                step === 'confirmation' ? "bg-primary" : "bg-muted"
              )} />
              <div className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
                step === 'confirmation' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                3
              </div>
            </div>
          </div>

          {/* Content */}
          {step === 'plan' && renderPlanSelection()}
          {step === 'payment' && renderPaymentForm()}
          {step === 'confirmation' && renderConfirmation()}
        </div>
      </div>
    </MainLayout>
  );
}
