import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LegalDocumentViewer } from '@/components/legal/LegalDocumentViewer';
import { legalApi } from '@/api/legal';
import { Shield, Eye, Database, Lock, Download, Mail, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export function PrivacyPolicyPage() {
  const [isAccepted, setIsAccepted] = useState(false);

  const acceptPrivacyMutation = useMutation({
    mutationFn: ({ document, version }: { document: string; version: string }) =>
      legalApi.trackLegalAcceptance(document, version),
    onSuccess: () => {
      setIsAccepted(true);
      toast.success('Privacy Policy accepted successfully');
    },
    onError: (error) => {
      console.error('Failed to accept privacy policy:', error);
      toast.error('Failed to accept privacy policy. Please try again.');
    }
  });

  const handleAccept = (documentId: string, version: string) => {
    acceptPrivacyMutation.mutate({ document: documentId, version });
  };

  const mockDocument = {
    id: 'privacy-policy',
    title: 'Privacy Policy',
    version: '3.2',
    lastUpdated: '2024-01-15T00:00:00Z',
    content: 'Full privacy policy content...',
    sections: [
      {
        id: '1',
        title: 'Introduction',
        content: `
          <p>Winbro Training Reels ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.</p>
          <p>By using our service, you agree to the collection and use of information in accordance with this policy.</p>
        `
      },
      {
        id: '2',
        title: 'Information We Collect',
        content: `
          <h4>Personal Information</h4>
          <p>We collect information you provide directly to us, such as:</p>
          <ul>
            <li>Name and email address</li>
            <li>Account credentials</li>
            <li>Profile information</li>
            <li>Payment information (processed securely by third-party providers)</li>
            <li>Communications with us</li>
          </ul>
          
          <h4>Usage Information</h4>
          <p>We automatically collect certain information about your use of our service:</p>
          <ul>
            <li>Device information (IP address, browser type, operating system)</li>
            <li>Usage patterns and preferences</li>
            <li>Content you create, upload, or interact with</li>
            <li>Log data and analytics</li>
          </ul>
        `
      },
      {
        id: '3',
        title: 'How We Use Your Information',
        content: `
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our service</li>
            <li>Process transactions and send related information</li>
            <li>Send technical notices and support messages</li>
            <li>Respond to your comments and questions</li>
            <li>Develop new products and services</li>
            <li>Monitor and analyze usage and trends</li>
            <li>Detect, prevent, and address technical issues</li>
            <li>Comply with legal obligations</li>
          </ul>
        `
      },
      {
        id: '4',
        title: 'Information Sharing and Disclosure',
        content: `
          <p>We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:</p>
          <ul>
            <li><strong>Service Providers:</strong> We may share information with trusted third parties who assist us in operating our service</li>
            <li><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our rights</li>
            <li><strong>Business Transfers:</strong> Information may be transferred in connection with a merger or acquisition</li>
            <li><strong>Consent:</strong> We may share information with your explicit consent</li>
          </ul>
        `
      },
      {
        id: '5',
        title: 'Data Security',
        content: `
          <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
          <p>These measures include:</p>
          <ul>
            <li>Encryption of data in transit and at rest</li>
            <li>Regular security assessments and updates</li>
            <li>Access controls and authentication</li>
            <li>Employee training on data protection</li>
            <li>Incident response procedures</li>
          </ul>
        `
      },
      {
        id: '6',
        title: 'Your Rights and Choices',
        content: `
          <p>Depending on your location, you may have certain rights regarding your personal information:</p>
          <ul>
            <li><strong>Access:</strong> Request access to your personal information</li>
            <li><strong>Correction:</strong> Request correction of inaccurate information</li>
            <li><strong>Deletion:</strong> Request deletion of your personal information</li>
            <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
            <li><strong>Objection:</strong> Object to certain processing activities</li>
            <li><strong>Withdrawal:</strong> Withdraw consent where processing is based on consent</li>
          </ul>
        `
      },
      {
        id: '7',
        title: 'Cookies and Tracking Technologies',
        content: `
          <p>We use cookies and similar technologies to enhance your experience and analyze usage patterns.</p>
          <p>You can control cookie preferences through your browser settings or our cookie management tool.</p>
          <p>For more information, please see our <a href="/cookie-policy" class="text-primary hover:underline">Cookie Policy</a>.</p>
        `
      },
      {
        id: '8',
        title: 'Data Retention',
        content: `
          <p>We retain your personal information for as long as necessary to provide our service and fulfill the purposes outlined in this policy.</p>
          <p>Retention periods vary depending on the type of information and applicable legal requirements.</p>
          <p>When we no longer need your information, we will securely delete or anonymize it.</p>
        `
      },
      {
        id: '9',
        title: 'International Data Transfers',
        content: `
          <p>Your information may be transferred to and processed in countries other than your own.</p>
          <p>We ensure appropriate safeguards are in place to protect your information during international transfers.</p>
        `
      },
      {
        id: '10',
        title: 'Children\'s Privacy',
        content: `
          <p>Our service is not intended for children under 13 years of age.</p>
          <p>We do not knowingly collect personal information from children under 13.</p>
          <p>If we become aware that we have collected information from a child under 13, we will take steps to delete such information.</p>
        `
      },
      {
        id: '11',
        title: 'Changes to This Policy',
        content: `
          <p>We may update this Privacy Policy from time to time.</p>
          <p>We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date.</p>
          <p>Your continued use of our service after changes constitutes acceptance of the updated policy.</p>
        `
      },
      {
        id: '12',
        title: 'Contact Us',
        content: `
          <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
          <ul>
            <li><strong>Email:</strong> privacy@winbro.com</li>
            <li><strong>Address:</strong> Winbro Training Reels, Privacy Department, 123 Business St, City, State 12345</li>
            <li><strong>Phone:</strong> 1-800-WINBRO-1</li>
          </ul>
        `
      }
    ],
    downloadUrl: '/legal/privacy-policy.pdf',
    requiresAcceptance: true
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground">
            How we collect, use, and protect your personal information
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
                <Shield className="h-3 w-3 mr-1" />
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

        {/* Privacy Rights Section */}
        <div className="mt-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Your Privacy Rights
              </CardTitle>
              <CardDescription>
                You have control over your personal information. Here's what you can do:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="h-4 w-4 text-primary" />
                    <h4 className="font-medium">Access Your Data</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Request a copy of all personal information we have about you.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Request Data Export
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="h-4 w-4 text-primary" />
                    <h4 className="font-medium">Delete Your Data</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Request deletion of your personal information from our systems.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Request Deletion
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <h4 className="font-medium">Contact Privacy Team</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Get help with privacy questions or concerns.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Contact Us
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Protection Compliance</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                We are committed to complying with applicable data protection laws, including:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">GDPR (EU)</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Right to access and portability</li>
                    <li>• Right to rectification and erasure</li>
                    <li>• Right to restrict processing</li>
                    <li>• Right to object to processing</li>
                    <li>• Data protection by design</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">CCPA (California)</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Right to know about data collection</li>
                    <li>• Right to delete personal information</li>
                    <li>• Right to opt-out of sale</li>
                    <li>• Right to non-discrimination</li>
                    <li>• Right to data portability</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Questions About Privacy?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have any questions about our privacy practices or want to exercise your rights, please contact our Privacy Team.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" asChild>
                  <a href="mailto:privacy@winbro.com">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Privacy Team
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