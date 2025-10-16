import { api } from '@/lib/api';

// Admin Types
export interface AdminStats {
  pendingContent: number;
  activeUsers: number;
  systemHealth: 'healthy' | 'warning' | 'error';
  processingQueue: number;
  totalContent: number;
  totalViews: number;
  completionRate: number;
  supportTickets: number;
}

export interface ModerationItem {
  id: string;
  title: string;
  description?: string;
  uploadedBy: string;
  uploadedAt: string;
  status: 'pending' | 'flagged' | 'approved' | 'rejected';
  reason?: string;
  thumbnailUrl?: string;
  duration: number;
  tags: string[];
  machineModel?: string;
  process?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'error';
  videoProcessing: {
    queue: number;
    active: number;
    failed: number;
  };
  cdn: {
    status: 'healthy' | 'degraded' | 'down';
    responseTime: number;
  };
  database: {
    status: 'healthy' | 'slow' | 'down';
    responseTime: number;
    connections: number;
  };
  storage: {
    used: number;
    total: number;
    percentage: number;
  };
  errors: {
    count: number;
    recent: Array<{
      id: string;
      message: string;
      timestamp: string;
      severity: 'low' | 'medium' | 'high';
    }>;
  };
}

export interface UserStats {
  total: number;
  active: number;
  newThisWeek: number;
  byRole: {
    admin: number;
    curator: number;
    user: number;
  };
  seatUsage: {
    used: number;
    total: number;
    percentage: number;
  };
  recentActivity: Array<{
    id: string;
    user: string;
    action: string;
    timestamp: string;
  }>;
}

export interface ContentAllocation {
  id: string;
  contentId: string;
  contentTitle: string;
  organizationId: string;
  organizationName: string;
  equipmentType: string;
  allocatedAt: string;
  allocatedBy: string;
}

export interface PlatformAnalytics {
  contentMetrics: {
    totalClips: number;
    totalCourses: number;
    totalViews: number;
    averageCompletionRate: number;
  };
  userEngagement: {
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    averageSessionDuration: number;
    loginFrequency: number;
  };
  subscriptionMetrics: {
    totalRevenue: number;
    activeSubscriptions: number;
    churnRate: number;
    averageRevenuePerUser: number;
  };
  supportMetrics: {
    totalTickets: number;
    openTickets: number;
    averageResolutionTime: number;
    satisfactionScore: number;
  };
  trends: {
    contentGrowth: Array<{ date: string; count: number }>;
    userGrowth: Array<{ date: string; count: number }>;
    revenueGrowth: Array<{ date: string; amount: number }>;
  };
}

// Admin API
export const adminApi = {
  // Stats and Overview
  getStats: (): Promise<AdminStats> =>
    api.get('/api/admin/stats'),

  getSystemHealth: (): Promise<SystemHealth> =>
    api.get('/api/admin/system-health'),

  getUserStats: (): Promise<UserStats> =>
    api.get('/api/admin/users/stats'),

  getPlatformAnalytics: (filters?: { dateFrom?: string; dateTo?: string }): Promise<PlatformAnalytics> => {
    const params = new URLSearchParams();
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);
    const queryString = params.toString();
    return api.get(`/api/admin/analytics${queryString ? `?${queryString}` : ''}`);
  },

  // Content Moderation
  getModerationQueue: (filters?: { status?: string; priority?: string }): Promise<ModerationItem[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    const queryString = params.toString();
    return api.get(`/api/admin/moderation-queue${queryString ? `?${queryString}` : ''}`);
  },

  approveContent: (contentId: string, reason?: string): Promise<void> =>
    api.post(`/api/admin/content/${contentId}/approve`, { reason }),

  rejectContent: (contentId: string, reason: string): Promise<void> =>
    api.post(`/api/admin/content/${contentId}/reject`, { reason }),

  flagContent: (contentId: string, reason: string): Promise<void> =>
    api.post(`/api/admin/content/${contentId}/flag`, { reason }),

  bulkApproveContent: (contentIds: string[]): Promise<void> =>
    api.post('/api/admin/content/bulk-approve', { contentIds }),

  bulkRejectContent: (contentIds: string[], reason: string): Promise<void> =>
    api.post('/api/admin/content/bulk-reject', { contentIds, reason }),

  // User Management
  getAllUsers: (filters?: { role?: string; status?: string; search?: string }): Promise<any[]> => {
    const params = new URLSearchParams();
    if (filters?.role) params.append('role', filters.role);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    const queryString = params.toString();
    return api.get(`/api/admin/users${queryString ? `?${queryString}` : ''}`);
  },

  updateUserRole: (userId: string, role: 'admin' | 'curator' | 'user'): Promise<void> =>
    api.put(`/api/admin/users/${userId}/role`, { role }),

  activateUser: (userId: string): Promise<void> =>
    api.put(`/api/admin/users/${userId}/activate`, {}),

  deactivateUser: (userId: string): Promise<void> =>
    api.put(`/api/admin/users/${userId}/deactivate`, {}),

  bulkUpdateUsers: (userIds: string[], updates: { role?: string; status?: string }): Promise<void> =>
    api.put('/api/admin/users/bulk-update', { userIds, updates }),

  // Content Allocation
  getContentAllocations: (): Promise<ContentAllocation[]> =>
    api.get('/api/admin/content-allocations'),

  allocateContent: (contentId: string, organizationId: string, equipmentType: string): Promise<void> =>
    api.post('/api/admin/content-allocations', { contentId, organizationId, equipmentType }),

  removeContentAllocation: async (allocationId: string): Promise<void> => {
    await api.delete(`/api/admin/content-allocations/${allocationId}`);
  },

  // System Management
  retryFailedProcessing: async (jobId: string): Promise<void> => {
    await api.post(`/api/admin/processing/${jobId}/retry`, {});
  },

  clearProcessingQueue: (): Promise<void> =>
    api.post('/api/admin/processing/clear-queue', {}) as Promise<void>,

  getSystemLogs: (filters?: { level?: string; dateFrom?: string; dateTo?: string }): Promise<any[]> => {
    const params = new URLSearchParams();
    if (filters?.level) params.append('level', filters.level);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);
    const queryString = params.toString();
    return api.get(`/api/admin/logs${queryString ? `?${queryString}` : ''}`);
  },

  // Global Search
  globalSearch: (query: string, filters?: { type?: string; dateFrom?: string; dateTo?: string }): Promise<{
    content: any[];
    users: any[];
    organizations: any[];
    total: number;
  }> => {
    const params = new URLSearchParams({ q: query });
    if (filters?.type) params.append('type', filters.type);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);
    return api.get(`/api/admin/search?${params.toString()}`);
  },

  // Reports and Exports
  exportReport: (type: 'users' | 'content' | 'analytics' | 'system'): Promise<Blob> =>
    api.get(`/api/admin/export/${type}`) as Promise<Blob>,

  generateReport: (type: string, filters: any): Promise<{ reportId: string; downloadUrl: string }> =>
    api.post('/api/admin/reports/generate', { type, filters }),
};