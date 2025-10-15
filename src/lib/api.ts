// API Client Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Simple fetch wrapper with error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
    }
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

// API utilities
export const api = {
  get: <T>(endpoint: string) => apiRequest<T>(endpoint),
  post: <T>(endpoint: string, data: unknown) => 
    apiRequest<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  put: <T>(endpoint: string, data: unknown) => 
    apiRequest<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  patch: <T>(endpoint: string, data: unknown) => 
    apiRequest<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (endpoint: string) => 
    apiRequest(endpoint, { method: "DELETE" }),
};

// Video Clips API
export const clipsApi = {
  getAll: async (filters?: any) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const queryString = params.toString();
    return api.get(`/clips${queryString ? `?${queryString}` : ""}`);
  },

  getById: async (id: string) => api.get(`/clips/${id}`),

  create: async (data: any) => api.post("/clips", data),

  update: async (id: string, data: any) => api.put(`/clips/${id}`, data),

  delete: async (id: string) => api.delete(`/clips/${id}`),

  search: async (query: string, filters?: any) => {
    const params = new URLSearchParams({ q: query });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    return api.get(`/clips/search?${params.toString()}`);
  },

  upload: async (file: File, onProgress?: (progress: number) => void) => {
    const formData = new FormData();
    formData.append("file", file);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable && onProgress) {
          const progress = (e.loaded / e.total) * 100;
          onProgress(progress);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error(`Upload failed: ${xhr.status}`));
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Upload failed"));
      });

      xhr.open("POST", `${API_BASE_URL}/clips/upload`);
      const token = localStorage.getItem("auth_token");
      if (token) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      }
      xhr.send(formData);
    });
  },
};

// Courses API
export const coursesApi = {
  getAll: async (filters?: any) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const queryString = params.toString();
    return api.get(`/courses${queryString ? `?${queryString}` : ""}`);
  },

  getById: async (id: string) => api.get(`/courses/${id}`),

  create: async (data: any) => api.post("/courses", data),

  update: async (id: string, data: any) => api.put(`/courses/${id}`, data),

  delete: async (id: string) => api.delete(`/courses/${id}`),

  enroll: async (id: string) => api.post(`/courses/${id}/enroll`, {}),

  getProgress: async (id: string) => api.get(`/courses/${id}/progress`),

  updateProgress: async (id: string, data: any) => 
    api.put(`/courses/${id}/progress`, data),
};

// Users API
export const usersApi = {
  getCurrent: async () => api.get("/users/me"),

  updateProfile: async (data: any) => api.put("/users/me", data),

  getAll: async (filters?: any) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const queryString = params.toString();
    return api.get(`/users${queryString ? `?${queryString}` : ""}`);
  },

  getById: async (id: string) => api.get(`/users/${id}`),

  update: async (id: string, data: any) => api.put(`/users/${id}`, data),

  delete: async (id: string) => api.delete(`/users/${id}`),

  invite: async (data: any) => api.post("/users/invite", data),

  bulkInvite: async (data: any) => api.post("/users/bulk-invite", data),
};

// Auth API
export const authApi = {
  login: async (credentials: any) => {
    const response = await api.post("/auth/login", credentials) as any;
    if (response.token) {
      localStorage.setItem("auth_token", response.token);
    }
    return response;
  },

  register: async (data: any) => {
    const response = await api.post("/auth/register", data) as any;
    if (response.token) {
      localStorage.setItem("auth_token", response.token);
    }
    return response;
  },

  logout: async () => {
    await api.post("/auth/logout", {});
    localStorage.removeItem("auth_token");
  },

  forgotPassword: async (email: string) => 
    api.post("/auth/forgot-password", { email }),

  resetPassword: async (token: string, password: string) => 
    api.post("/auth/reset-password", { token, password }),

  verifyEmail: async (token: string) => 
    api.post("/auth/verify-email", { token }),

  resendVerification: async () => api.post("/auth/resend-verification", {}),
};

// Analytics API
export const analyticsApi = {
  getOverview: async () => api.get("/analytics/overview"),

  getClipsAnalytics: async (filters?: any) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const queryString = params.toString();
    return api.get(`/analytics/clips${queryString ? `?${queryString}` : ""}`);
  },

  getCoursesAnalytics: async (filters?: any) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const queryString = params.toString();
    return api.get(`/analytics/courses${queryString ? `?${queryString}` : ""}`);
  },

  exportReport: async (type: string, filters?: any) => {
    const params = new URLSearchParams({ type });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    return api.get(`/analytics/export?${params.toString()}`);
  },
};

// Settings API
export const settingsApi = {
  getUserSettings: async () => api.get("/settings/user"),

  updateUserSettings: async (data: any) => api.put("/settings/user", data),

  getOrganizationSettings: async () => api.get("/settings/organization"),

  updateOrganizationSettings: async (data: any) => 
    api.put("/settings/organization", data),
};

// Notifications API
export const notificationsApi = {
  getAll: async () => api.get("/notifications"),

  markAsRead: async (id: string) => api.put(`/notifications/${id}/read`, {}),

  markAllAsRead: async () => api.put("/notifications/read-all", {}),

  delete: async (id: string) => api.delete(`/notifications/${id}`),
};

// Billing API
export const billingApi = {
  getSubscription: async () => api.get("/billing/subscription"),

  getInvoices: async () => api.get("/billing/invoices"),

  updatePaymentMethod: async (data: any) => 
    api.put("/billing/payment-method", data),

  updateSubscription: async (data: any) => 
    api.put("/billing/subscription", data),
};
