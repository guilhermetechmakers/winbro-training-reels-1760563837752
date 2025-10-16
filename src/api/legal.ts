import { api } from '@/lib/api';

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

export interface SupportTicket {
  name: string;
  email: string;
  subject: string;
  message: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  category: 'general' | 'technical' | 'billing' | 'feature-request' | 'bug-report';
  attachment?: File;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FaqSearchParams {
  query?: string;
  category?: string;
  limit?: number;
  offset?: number;
}

export interface LegalAcceptance {
  documentType: string;
  documentVersion: string;
  acceptedAt: string;
}

export const legalApi = {
  // Cookie Preferences
  updateCookiePreferences: async (preferences: CookiePreferences) => {
    return api.post('/legal/cookies', preferences);
  },

  getCookiePreferences: async () => {
    return api.get('/legal/cookies');
  },

  // Support Tickets
  submitSupportTicket: async (ticket: SupportTicket) => {
    const formData = new FormData();
    formData.append('name', ticket.name);
    formData.append('email', ticket.email);
    formData.append('subject', ticket.subject);
    formData.append('message', ticket.message);
    formData.append('priority', ticket.priority);
    formData.append('category', ticket.category);
    
    if (ticket.attachment) {
      formData.append('attachment', ticket.attachment);
    }

    // Use fetch directly for FormData
    const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
    const token = localStorage.getItem("auth_token");
    
    const response = await fetch(`${API_BASE_URL}/support/tickets`, {
      method: 'POST',
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  },

  getSupportTickets: async (params?: { status?: string; limit?: number; offset?: number }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const queryString = queryParams.toString();
    return api.get(`/support/tickets${queryString ? `?${queryString}` : ''}`);
  },

  // FAQ Management
  getFaqs: async (params: FaqSearchParams = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
    const queryString = queryParams.toString();
    return api.get(`/support/faqs${queryString ? `?${queryString}` : ''}`);
  },

  searchFaqs: async (query: string, category?: string) => {
    const queryParams = new URLSearchParams({ query });
    if (category) {
      queryParams.append('category', category);
    }
    return api.get(`/support/faqs/search?${queryParams.toString()}`);
  },

  // Legal Document Acceptance
  trackLegalAcceptance: async (document: string, version: string) => {
    return api.post('/legal/acceptance', {
      documentType: document,
      documentVersion: version
    });
  },

  getLegalAcceptances: async () => {
    return api.get('/legal/acceptances');
  },

  // Legal Documents
  getLegalDocument: async (documentType: string) => {
    return api.get(`/legal/documents/${documentType}`);
  },

  // Privacy Requests
  submitDataRequest: async (requestType: 'export' | 'deletion', details: string) => {
    return api.post('/legal/privacy-requests', {
      requestType,
      details
    });
  },

  getPrivacyRequests: async () => {
    return api.get('/legal/privacy-requests');
  }
};