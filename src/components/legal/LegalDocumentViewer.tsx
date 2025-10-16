import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, Printer, FileText, Calendar, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LegalDocument {
  id: string;
  title: string;
  version: string;
  lastUpdated: string;
  content: string;
  sections: Array<{
    id: string;
    title: string;
    content: string;
  }>;
  downloadUrl?: string;
  requiresAcceptance?: boolean;
}

interface LegalDocumentViewerProps {
  document: LegalDocument;
  onAccept?: (documentId: string, version: string) => void;
  isAccepted?: boolean;
  className?: string;
}

export function LegalDocumentViewer({
  document,
  onAccept,
  isAccepted = false,
  className
}: LegalDocumentViewerProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleAccept = () => {
    if (onAccept) {
      onAccept(document.id, document.version);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (document.downloadUrl) {
      window.open(document.downloadUrl, '_blank');
    } else {
      // Create a downloadable version
      const element = window.document.createElement('a');
      const file = new Blob([document.content], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${document.title.replace(/\s+/g, '-').toLowerCase()}.txt`;
      window.document.body.appendChild(element);
      element.click();
      window.document.body.removeChild(element);
    }
  };

  return (
    <div className={cn("max-w-4xl mx-auto", className)}>
      {/* Document Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {document.title}
              </CardTitle>
              <CardDescription className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Last updated: {new Date(document.lastUpdated).toLocaleDateString()}
                </span>
                <Badge variant="outline">
                  Version {document.version}
                </Badge>
                {isAccepted && (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Accepted
                  </Badge>
                )}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                Print
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Table of Contents */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-sm">Table of Contents</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-96">
                <div className="space-y-1 p-4">
                  {document.sections.map((section, index) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={cn(
                        "w-full text-left p-2 rounded-md text-sm transition-colors duration-150",
                        activeSection === section.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      <div className="font-medium">
                        {index + 1}. {section.title}
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Document Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-8">
              <ScrollArea className="h-[600px]">
                <div className="prose prose-sm max-w-none">
                  {document.sections.map((section, index) => (
                    <div
                      key={section.id}
                      id={section.id}
                      className={cn(
                        "mb-8 scroll-mt-20",
                        activeSection === section.id && "ring-2 ring-primary/20 rounded-lg p-4 -m-4"
                      )}
                    >
                      <h2 className="text-2xl font-bold text-foreground mb-4">
                        {index + 1}. {section.title}
                      </h2>
                      <div 
                        className="text-muted-foreground leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: section.content }}
                      />
                      {index < document.sections.length - 1 && (
                        <Separator className="mt-6" />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Acceptance Section */}
      {document.requiresAcceptance && !isAccepted && (
        <Card className="mt-6 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold text-foreground">
                  Acceptance Required
                </h3>
                <p className="text-sm text-muted-foreground">
                  By clicking "Accept", you acknowledge that you have read and agree to the terms outlined in this document.
                </p>
              </div>
              <Button onClick={handleAccept} className="min-w-32">
                <CheckCircle className="h-4 w-4 mr-2" />
                Accept Terms
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Print Styles */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          .prose {
            font-size: 12px;
            line-height: 1.5;
          }
          
          .prose h2 {
            font-size: 16px;
            margin-top: 20px;
            margin-bottom: 10px;
          }
          
          .prose p {
            margin-bottom: 8px;
          }
        }
      `}</style>
    </div>
  );
}