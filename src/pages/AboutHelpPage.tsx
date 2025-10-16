// import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { FaqSearch } from '@/components/legal/FaqSearch';
import { ContactForm } from '@/components/legal/ContactForm';
import { legalApi, type FAQ, type SupportTicket } from '@/api/legal';
import { 
  HelpCircle, 
  MessageSquare, 
  BookOpen, 
  Video, 
  FileText, 
  Phone, 
  Mail,
  Lightbulb
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function AboutHelpPage() {
  // Fetch FAQs
  useQuery({
    queryKey: ['faqs'],
    queryFn: () => legalApi.getFaqs({ limit: 100 })
  });

  // Mock FAQ data for demonstration
  const mockFaqs: FAQ[] = [
    {
      id: '1',
      question: 'How do I upload a video?',
      answer: 'To upload a video, go to the Upload page and drag and drop your video file or click to browse. Supported formats include MP4, MOV, AVI, and WebM. Maximum file size is 2GB.',
      category: 'uploads',
      tags: ['upload', 'video', 'file'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      question: 'What video formats are supported?',
      answer: 'We support MP4, MOV, AVI, WebM, and MKV formats. For best results, we recommend using MP4 with H.264 codec.',
      category: 'uploads',
      tags: ['video', 'formats', 'compatibility'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '3',
      question: 'How do I create a course?',
      answer: 'Navigate to the Course Builder page and click "Create New Course". Add your videos, organize them into modules, and set up quizzes and assessments.',
      category: 'courses',
      tags: ['course', 'builder', 'creation'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '4',
      question: 'Can I download videos for offline viewing?',
      answer: 'Yes, you can download videos for offline viewing if the course creator has enabled this feature. Look for the download button on the video player.',
      category: 'courses',
      tags: ['download', 'offline', 'video'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '5',
      question: 'How do I reset my password?',
      answer: 'Click "Forgot Password" on the login page and enter your email address. You\'ll receive a password reset link via email.',
      category: 'getting-started',
      tags: ['password', 'reset', 'account'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '6',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise accounts.',
      category: 'billing',
      tags: ['payment', 'billing', 'credit card'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '7',
      question: 'How do I cancel my subscription?',
      answer: 'Go to Settings > Billing and click "Cancel Subscription". Your access will continue until the end of your current billing period.',
      category: 'billing',
      tags: ['subscription', 'cancel', 'billing'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '8',
      question: 'Why is my video processing taking so long?',
      answer: 'Video processing time depends on file size and duration. Large files or high-resolution videos take longer. You can check processing status in your library.',
      category: 'technical',
      tags: ['processing', 'video', 'performance'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ];

  const handleContactSubmit = async (data: SupportTicket) => {
    try {
      await legalApi.submitSupportTicket(data);
      console.log('Support ticket submitted:', data);
    } catch (error) {
      console.error('Failed to submit support ticket:', error);
      throw error;
    }
  };

  const handleFaqSearch = (query: string) => {
    // Handle FAQ search
    console.log('Searching for:', query);
  };

  const quickLinks = [
    {
      title: 'Getting Started Guide',
      description: 'Learn the basics of using our platform',
      icon: BookOpen,
      href: '/guides/getting-started',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step video guides',
      icon: Video,
      href: '/guides/videos',
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Best Practices',
      description: 'Tips for creating effective training content',
      icon: Lightbulb,
      href: '/guides/best-practices',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      title: 'API Documentation',
      description: 'Technical documentation for developers',
      icon: FileText,
      href: '/docs/api',
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const supportOptions = [
    {
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      icon: MessageSquare,
      availability: 'Available 24/7',
      action: 'Start Chat'
    },
    {
      title: 'Email Support',
      description: 'Send us a detailed message',
      icon: Mail,
      availability: 'Response within 24 hours',
      action: 'Send Email'
    },
    {
      title: 'Phone Support',
      description: 'Speak directly with our team',
      icon: Phone,
      availability: 'Mon-Fri, 9AM-6PM EST',
      action: 'Call Now'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Help & Support
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions, get help with your account, or contact our support team.
          </p>
        </div>

        <Tabs defaultValue="faq" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="contact">Contact Us</TabsTrigger>
            <TabsTrigger value="guides">Guides</TabsTrigger>
          </TabsList>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Search through our knowledge base to find answers to common questions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FaqSearch
                  faqs={mockFaqs}
                  onSearch={handleFaqSearch}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <ContactForm onSubmit={handleContactSubmit} />
              </div>

              {/* Support Options */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Other Ways to Get Help</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {supportOptions.map((option, index) => {
                      const Icon = option.icon;
                      return (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm">{option.title}</h4>
                            <p className="text-xs text-muted-foreground mb-1">
                              {option.description}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {option.availability}
                            </p>
                            <button className="text-xs text-primary hover:underline mt-1">
                              {option.action}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Response Times</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Live Chat</span>
                      <Badge variant="secondary">Instant</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Email Support</span>
                      <Badge variant="secondary">Within 24 hours</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Phone Support</span>
                      <Badge variant="secondary">Business hours</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Guides Tab */}
          <TabsContent value="guides" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <Card key={index} className="group hover:shadow-md transition-all duration-200 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className={cn(
                        "inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 group-hover:scale-110 transition-transform duration-200",
                        link.color
                      )}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">
                        {link.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {link.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Popular Topics</CardTitle>
                <CardDescription>
                  Browse our most helpful guides and tutorials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Getting Started</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Creating your first account</li>
                      <li>• Setting up your profile</li>
                      <li>• Understanding the dashboard</li>
                      <li>• Basic navigation guide</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Content Creation</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Video upload best practices</li>
                      <li>• Creating engaging courses</li>
                      <li>• Adding quizzes and assessments</li>
                      <li>• Managing your content library</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}