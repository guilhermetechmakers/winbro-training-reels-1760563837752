import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LegalDocumentViewer } from '@/components/legal/LegalDocumentViewer';
import { legalApi } from '@/api/legal';
import { FileText, CheckCircle, Download, Calendar, User } from 'lucide-react';
import { toast } from 'sonner';

export function TermsOfServicePage() {
  const [isAccepted, setIsAccepted] = useState(false);

  const acceptTermsMutation = useMutation({
    mutationFn: ({ document, version }: { document: string; version: string }) =>
      legalApi.trackLegalAcceptance(document, version),
    onSuccess: () => {
      setIsAccepted(true);
      toast.success('Terms of Service accepted successfully');
    },
    onError: (error) => {
      console.error('Failed to accept terms:', error);
      toast.error('Failed to accept terms. Please try again.');
    }
  });

  const handleAccept = (documentId: string, version: string) => {
    acceptTermsMutation.mutate({ document: documentId, version });
  };

  const mockDocument = {
    id: 'terms-of-service',
    title: 'Terms of Service',
    version: '2.1',
    lastUpdated: '2024-01-15T00:00:00Z',
    content: 'Full terms of service content...',
    sections: [
      {
        id: '1',
        title: 'Acceptance of Terms',
        content: `
          <p>By accessing and using Winbro Training Reels ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.</p>
          <p>If you do not agree to abide by the above, please do not use this service.</p>
        `
      },
      {
        id: '2',
        title: 'Description of Service',
        content: `
          <p>Winbro Training Reels provides a platform for creating, managing, and delivering training content including videos, courses, and assessments.</p>
          <p>Our service includes:</p>
          <ul>
            <li>Video upload and processing capabilities</li>
            <li>Course creation and management tools</li>
            <li>User management and analytics</li>
            <li>Assessment and quiz functionality</li>
            <li>Content delivery and streaming</li>
          </ul>
        `
      },
      {
        id: '3',
        title: 'User Accounts',
        content: `
          <p>To access certain features of the Service, you must register for an account. You agree to:</p>
          <ul>
            <li>Provide accurate, current, and complete information during registration</li>
            <li>Maintain and update your account information</li>
            <li>Maintain the security of your password and account</li>
            <li>Accept responsibility for all activities under your account</li>
            <li>Notify us immediately of any unauthorized use of your account</li>
          </ul>
        `
      },
      {
        id: '4',
        title: 'Acceptable Use',
        content: `
          <p>You agree not to use the Service to:</p>
          <ul>
            <li>Upload, post, or transmit any content that is illegal, harmful, or violates any rights</li>
            <li>Impersonate any person or entity or misrepresent your affiliation</li>
            <li>Interfere with or disrupt the Service or servers</li>
            <li>Attempt to gain unauthorized access to any part of the Service</li>
            <li>Use the Service for any commercial purpose without authorization</li>
            <li>Upload content that infringes on intellectual property rights</li>
          </ul>
        `
      },
      {
        id: '5',
        title: 'Content and Intellectual Property',
        content: `
          <p>You retain ownership of content you upload to the Service. By uploading content, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, and distribute your content in connection with the Service.</p>
          <p>You are responsible for ensuring you have all necessary rights to the content you upload.</p>
          <p>We respect intellectual property rights and will respond to valid DMCA takedown notices.</p>
        `
      },
      {
        id: '6',
        title: 'Privacy and Data Protection',
        content: `
          <p>Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use the Service.</p>
          <p>By using the Service, you agree to the collection and use of information in accordance with our Privacy Policy.</p>
        `
      },
      {
        id: '7',
        title: 'Payment and Billing',
        content: `
          <p>Some features of the Service require payment. You agree to pay all fees associated with your use of paid features.</p>
          <p>Fees are billed in advance and are non-refundable except as required by law.</p>
          <p>We may change our fees at any time with 30 days' notice to existing users.</p>
        `
      },
      {
        id: '8',
        title: 'Termination',
        content: `
          <p>We may terminate or suspend your account and access to the Service immediately, without prior notice, for any reason, including breach of these Terms.</p>
          <p>You may terminate your account at any time by contacting us or using the account deletion feature.</p>
          <p>Upon termination, your right to use the Service will cease immediately.</p>
        `
      },
      {
        id: '9',
        title: 'Disclaimers and Limitations',
        content: `
          <p>THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.</p>
          <p>WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES.</p>
          <p>OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID FOR THE SERVICE IN THE 12 MONTHS PRECEDING THE CLAIM.</p>
        `
      },
      {
        id: '10',
        title: 'Changes to Terms',
        content: `
          <p>We reserve the right to modify these Terms at any time. We will notify users of material changes via email or through the Service.</p>
          <p>Your continued use of the Service after changes constitutes acceptance of the new Terms.</p>
        `
      },
      {
        id: '11',
        title: 'Contact Information',
        content: `
          <p>If you have any questions about these Terms, please contact us at:</p>
          <ul>
            <li>Email: legal@winbro.com</li>
            <li>Address: Winbro Training Reels, Legal Department, 123 Business St, City, State 12345</li>
            <li>Phone: 1-800-WINBRO-1</li>
          </ul>
        `
      }
    ],
    downloadUrl: '/legal/terms-of-service.pdf',
    requiresAcceptance: true
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Terms of Service
          </h1>
          <p className="text-lg text-muted-foreground">
            Please read these terms carefully before using our service
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Last updated: {new Date(mockDocument.lastUpdated).toLocaleDateString()}
            </Badge>
            <Badge variant="outline">
              Version {mockDocument.version}
            </Badge>
            {isAccepted && (
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Accepted
              </Badge>
            )}
          </div>
        </div>

        {/* Legal Document Viewer */}
        <LegalDocumentViewer
          document={mockDocument}
          onAccept={handleAccept}
          isAccepted={isAccepted}
        />

        {/* Additional Information */}
        <div className="mt-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Your Rights and Responsibilities
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                As a user of our service, you have certain rights and responsibilities. This section summarizes the key points:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Your Rights</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Access to the service according to your subscription</li>
                    <li>• Data portability and export capabilities</li>
                    <li>• Privacy protection as outlined in our Privacy Policy</li>
                    <li>• Support and assistance with technical issues</li>
                    <li>• Right to terminate your account at any time</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Your Responsibilities</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Comply with all applicable laws and regulations</li>
                    <li>• Respect intellectual property rights</li>
                    <li>• Maintain the security of your account</li>
                    <li>• Use the service only for lawful purposes</li>
                    <li>• Report any security vulnerabilities or issues</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Questions About These Terms?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have any questions about these Terms of Service, please don't hesitate to contact us.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" asChild>
                  <a href="mailto:legal@winbro.com">
                    <FileText className="h-4 w-4 mr-2" />
                    Email Legal Team
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/help">
                    <Download className="h-4 w-4 mr-2" />
                    Get Help
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}