import type { Certificate, Course, User } from '@/types';

// Certificate template interface
export interface CertificateTemplate {
  id: string;
  name: string;
  template_html: string;
  template_css: string;
  background_image?: string;
  logo_url?: string;
  is_default: boolean;
}

// Certificate generation options
export interface CertificateGenerationOptions {
  template_id?: string;
  custom_fields?: Record<string, string>;
  include_verification_code?: boolean;
  include_completion_date?: boolean;
  include_course_duration?: boolean;
}

// Default certificate template
const DEFAULT_TEMPLATE: CertificateTemplate = {
  id: 'default',
  name: 'Default Certificate',
  is_default: true,
  template_html: `
    <div class="certificate-container">
      <div class="certificate-header">
        <div class="logo">
          <img src="{{logo_url}}" alt="Company Logo" />
        </div>
        <h1 class="certificate-title">Certificate of Completion</h1>
      </div>
      
      <div class="certificate-body">
        <p class="certificate-text">
          This is to certify that
        </p>
        <h2 class="recipient-name">{{user_name}}</h2>
        <p class="certificate-text">
          has successfully completed the course
        </p>
        <h3 class="course-name">{{course_title}}</h3>
        <p class="certificate-text">
          on {{completion_date}}
        </p>
        {{#if include_duration}}
        <p class="course-duration">
          Course Duration: {{course_duration}}
        </p>
        {{/if}}
      </div>
      
      <div class="certificate-footer">
        <div class="signature-section">
          <div class="signature-line"></div>
          <p class="signature-label">Instructor Signature</p>
        </div>
        <div class="verification-section">
          <p class="verification-code">Verification Code: {{verification_code}}</p>
          <p class="verification-url">Verify at: {{verification_url}}</p>
        </div>
      </div>
    </div>
  `,
  template_css: `
    .certificate-container {
      width: 800px;
      height: 600px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: 8px solid #2d3748;
      border-radius: 20px;
      padding: 40px;
      font-family: 'Georgia', serif;
      color: #2d3748;
      position: relative;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }
    
    .certificate-header {
      text-align: center;
      margin-bottom: 40px;
    }
    
    .logo img {
      height: 60px;
      margin-bottom: 20px;
    }
    
    .certificate-title {
      font-size: 36px;
      font-weight: bold;
      color: #2d3748;
      margin: 0;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .certificate-body {
      text-align: center;
      margin: 40px 0;
    }
    
    .certificate-text {
      font-size: 18px;
      margin: 10px 0;
      color: #4a5568;
    }
    
    .recipient-name {
      font-size: 32px;
      font-weight: bold;
      color: #2d3748;
      margin: 20px 0;
      text-decoration: underline;
      text-decoration-color: #667eea;
      text-underline-offset: 8px;
    }
    
    .course-name {
      font-size: 24px;
      font-weight: bold;
      color: #667eea;
      margin: 20px 0;
      font-style: italic;
    }
    
    .course-duration {
      font-size: 16px;
      color: #718096;
      margin: 10px 0;
    }
    
    .certificate-footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 40px;
    }
    
    .signature-section {
      text-align: left;
    }
    
    .signature-line {
      width: 200px;
      height: 2px;
      background: #2d3748;
      margin-bottom: 5px;
    }
    
    .signature-label {
      font-size: 14px;
      color: #718096;
      margin: 0;
    }
    
    .verification-section {
      text-align: right;
    }
    
    .verification-code {
      font-size: 12px;
      color: #718096;
      margin: 5px 0;
      font-family: 'Courier New', monospace;
    }
    
    .verification-url {
      font-size: 10px;
      color: #a0aec0;
      margin: 0;
    }
    
    .certificate-container::before {
      content: '';
      position: absolute;
      top: 20px;
      left: 20px;
      right: 20px;
      bottom: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 10px;
      pointer-events: none;
    }
  `,
  logo_url: '/logo.png',
};

// Certificate generation service
export class CertificateGenerator {
  private templates: Map<string, CertificateTemplate> = new Map();
  
  constructor() {
    // Initialize with default template
    this.templates.set('default', DEFAULT_TEMPLATE);
  }

  // Add or update a template
  addTemplate(template: CertificateTemplate): void {
    this.templates.set(template.id, template);
  }

  // Get template by ID
  getTemplate(templateId: string): CertificateTemplate | undefined {
    return this.templates.get(templateId);
  }

  // Get all templates
  getAllTemplates(): CertificateTemplate[] {
    return Array.from(this.templates.values());
  }

  // Generate certificate data
  generateCertificateData(
    certificate: Certificate,
    course: Course,
    user: User,
    options: CertificateGenerationOptions = {}
  ): {
    html: string;
    css: string;
    data: Record<string, string>;
  } {
    const template = this.getTemplate(options.template_id || 'default') || DEFAULT_TEMPLATE;
    
    // Prepare data for template
    const data = {
      user_name: user.full_name || user.email,
      course_title: course.title,
      completion_date: new Date(certificate.issued_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      course_duration: this.formatDuration(course.estimated_duration),
      verification_code: certificate.verification_code,
      verification_url: `${window.location.origin}/verify/${certificate.verification_code}`,
      logo_url: template.logo_url || '/logo.png',
      include_duration: String(options.include_course_duration !== false),
      ...options.custom_fields,
    };

    // Process template with data
    let html = template.template_html;
    Object.entries(data).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, String(value));
    });

    // Process conditional blocks
    html = this.processConditionalBlocks(html, data);

    return {
      html,
      css: template.template_css,
      data,
    };
  }

  // Generate PDF (this would typically call a backend service)
  async generatePDF(
    certificate: Certificate,
    course: Course,
    user: User,
    options: CertificateGenerationOptions = {}
  ): Promise<Blob> {
    const { html, css } = this.generateCertificateData(certificate, course, user, options);
    
    // This is a simplified version - in a real app, you'd send this to a backend service
    // that uses libraries like Puppeteer, Playwright, or jsPDF to generate the PDF
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Certificate - ${course.title}</title>
          <style>${css}</style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;

    // For now, return a simple HTML blob
    // In production, this would be a proper PDF
    return new Blob([fullHtml], { type: 'text/html' });
  }

  // Generate certificate preview (for UI preview)
  generatePreview(
    course: Course,
    user: User,
    options: CertificateGenerationOptions = {}
  ): string {
    const mockCertificate: Certificate = {
      id: 'preview',
      enrollment_id: 'preview',
      user_id: user.id,
      course_id: course.id,
      certificate_number: 'PREVIEW-001',
      issued_at: new Date().toISOString(),
      pdf_url: '',
      verification_code: 'PREVIEW123',
    };

    const { html, css } = this.generateCertificateData(mockCertificate, course, user, options);
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Certificate Preview</title>
          <style>${css}</style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;
  }

  // Process conditional blocks in template
  private processConditionalBlocks(html: string, data: Record<string, any>): string {
    // Simple conditional processing for {{#if}} blocks
    const ifRegex = /{{#if\s+(\w+)}}(.*?){{\/if}}/gs;
    
    return html.replace(ifRegex, (_, condition, content) => {
      if (data[condition]) {
        return content;
      }
      return '';
    });
  }

  // Format duration in minutes to human readable format
  private formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} minutes`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    
    return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
  }

  // Validate certificate data
  validateCertificateData(certificate: Certificate, course: Course, user: User): string[] {
    const errors: string[] = [];

    if (!certificate.verification_code) {
      errors.push('Verification code is required');
    }

    if (!course.title) {
      errors.push('Course title is required');
    }

    if (!user.full_name && !user.email) {
      errors.push('User name or email is required');
    }

    if (!certificate.issued_at) {
      errors.push('Issue date is required');
    }

    return errors;
  }

  // Generate verification URL
  generateVerificationUrl(verificationCode: string): string {
    return `${window.location.origin}/verify/${verificationCode}`;
  }

  // Extract verification code from URL
  extractVerificationCodeFromUrl(url: string): string | null {
    const match = url.match(/\/verify\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  }
}

// Export singleton instance
export const certificateGenerator = new CertificateGenerator();

// Utility functions
export const certificateUtils = {
  // Generate a unique verification code
  generateVerificationCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  // Generate certificate number
  generateCertificateNumber(courseId: string, userId: string): string {
    const timestamp = Date.now().toString(36);
    const coursePrefix = courseId.substring(0, 4).toUpperCase();
    const userPrefix = userId.substring(0, 4).toUpperCase();
    return `${coursePrefix}-${userPrefix}-${timestamp}`;
  },

  // Format certificate date
  formatCertificateDate(date: string | Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  // Check if certificate is expired (if applicable)
  isCertificateExpired(certificate: Certificate, validityPeriod?: number): boolean {
    if (!validityPeriod) return false;
    
    const issuedDate = new Date(certificate.issued_at);
    const expiryDate = new Date(issuedDate.getTime() + (validityPeriod * 24 * 60 * 60 * 1000));
    
    return new Date() > expiryDate;
  },
};
