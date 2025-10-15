import { api } from "@/lib/api";
import type { 
  Certificate
} from "@/types";

// Certificate Management API
export const certificatesApi = {
  // Get certificate by ID
  getById: async (id: string) => {
    return api.get<Certificate>(`/certificates/${id}`);
  },

  // Get user's certificates
  getUserCertificates: async (filters?: {
    course_id?: string;
    page?: number;
    limit?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const queryString = params.toString();
    return api.get<Certificate[]>(`/certificates${queryString ? `?${queryString}` : ""}`);
  },

  // Generate certificate for completed course
  generate: async (enrollmentId: string) => {
    return api.post<Certificate>(`/enrollments/${enrollmentId}/certificate`, {});
  },

  // Download certificate PDF
  download: async (certificateId: string) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/certificates/${certificateId}/download`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to download certificate');
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificate-${certificateId}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  // Verify certificate
  verify: async (verificationCode: string) => {
    return api.get<CertificateVerification>(`/certificates/verify/${verificationCode}`);
  },

  // Get certificate analytics
  getAnalytics: async (filters?: {
    date_from?: string;
    date_to?: string;
    course_id?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const queryString = params.toString();
    return api.get<{
      total_certificates: number;
      certificates_by_course: Array<{
        course_id: string;
        course_title: string;
        certificate_count: number;
      }>;
      certificates_by_month: Array<{
        month: string;
        count: number;
      }>;
      verification_stats: {
        total_verifications: number;
        successful_verifications: number;
        failed_verifications: number;
      };
    }>(`/certificates/analytics${queryString ? `?${queryString}` : ""}`);
  },

  // Resend certificate email
  resendEmail: async (certificateId: string) => {
    return api.post(`/certificates/${certificateId}/resend-email`, {});
  },

  // Revoke certificate
  revoke: async (certificateId: string, reason: string) => {
    return api.post(`/certificates/${certificateId}/revoke`, { reason });
  },
};

// Certificate Generation Service
export const certificateGenerator = {
  // Generate certificate PDF
  generatePDF: async (certificate: Certificate) => {
    return api.post<{ pdf_url: string }>('/certificates/generate-pdf', certificate);
  },

  // Get certificate template
  getTemplate: async (templateId: string) => {
    return api.get<{
      id: string;
      name: string;
      template_html: string;
      template_css: string;
      background_image?: string;
      logo_url?: string;
    }>(`/certificates/templates/${templateId}`);
  },

  // List available templates
  getTemplates: async () => {
    return api.get<Array<{
      id: string;
      name: string;
      preview_url: string;
      is_default: boolean;
    }>>('/certificates/templates');
  },

  // Update certificate template
  updateTemplate: async (templateId: string, data: {
    name?: string;
    template_html?: string;
    template_css?: string;
    background_image?: string;
    logo_url?: string;
  }) => {
    return api.put(`/certificates/templates/${templateId}`, data);
  },
};

// Input Types
export interface CreateCertificateInput {
  enrollment_id: string;
  user_id: string;
  course_id: string;
  template_id?: string;
}

export interface CertificateVerification {
  valid: boolean;
  certificate?: Certificate;
  error?: string;
  revoked?: boolean;
  revoked_reason?: string;
}
