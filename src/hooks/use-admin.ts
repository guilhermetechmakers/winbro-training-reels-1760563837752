import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminApi } from '@/api/admin';

// Query Keys
export const adminQueryKeys = {
  stats: ['admin', 'stats'] as const,
  systemHealth: ['admin', 'system-health'] as const,
  userStats: ['admin', 'user-stats'] as const,
  platformAnalytics: (filters?: any) => ['admin', 'platform-analytics', filters] as const,
  moderationQueue: (filters?: any) => ['admin', 'moderation-queue', filters] as const,
  users: (filters?: any) => ['admin', 'users', filters] as const,
  contentAllocations: ['admin', 'content-allocations'] as const,
  systemLogs: (filters?: any) => ['admin', 'system-logs', filters] as const,
  globalSearch: (query: string, filters?: any) => ['admin', 'global-search', query, filters] as const,
};

// Admin Stats Hooks
export const useAdminStats = () => {
  return useQuery({
    queryKey: adminQueryKeys.stats,
    queryFn: adminApi.getStats,
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useSystemHealth = () => {
  return useQuery({
    queryKey: adminQueryKeys.systemHealth,
    queryFn: adminApi.getSystemHealth,
    refetchInterval: 15000, // Refresh every 15 seconds
    staleTime: 1000 * 30, // 30 seconds
  });
};

export const useUserStats = () => {
  return useQuery({
    queryKey: adminQueryKeys.userStats,
    queryFn: adminApi.getUserStats,
    refetchInterval: 60000, // Refresh every minute
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const usePlatformAnalytics = (filters?: { dateFrom?: string; dateTo?: string }) => {
  return useQuery({
    queryKey: adminQueryKeys.platformAnalytics(filters),
    queryFn: () => adminApi.getPlatformAnalytics(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Moderation Hooks
export const useModerationQueue = (filters?: { status?: string; priority?: string }) => {
  return useQuery({
    queryKey: adminQueryKeys.moderationQueue(filters),
    queryFn: () => adminApi.getModerationQueue(filters),
    refetchInterval: 20000, // Refresh every 20 seconds
    staleTime: 1000 * 30, // 30 seconds
  });
};

export const useContentModeration = () => {
  const queryClient = useQueryClient();

  const approveContent = useMutation({
    mutationFn: ({ contentId, reason }: { contentId: string; reason?: string }) =>
      adminApi.approveContent(contentId, reason),
    onSuccess: () => {
      toast.success('Content approved successfully');
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.moderationQueue() });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.stats });
    },
    onError: (error: any) => {
      toast.error(`Failed to approve content: ${error.message}`);
    },
  });

  const rejectContent = useMutation({
    mutationFn: ({ contentId, reason }: { contentId: string; reason: string }) =>
      adminApi.rejectContent(contentId, reason),
    onSuccess: () => {
      toast.success('Content rejected');
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.moderationQueue() });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.stats });
    },
    onError: (error: any) => {
      toast.error(`Failed to reject content: ${error.message}`);
    },
  });

  const flagContent = useMutation({
    mutationFn: ({ contentId, reason }: { contentId: string; reason: string }) =>
      adminApi.flagContent(contentId, reason),
    onSuccess: () => {
      toast.success('Content flagged for review');
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.moderationQueue() });
    },
    onError: (error: any) => {
      toast.error(`Failed to flag content: ${error.message}`);
    },
  });

  const bulkApproveContent = useMutation({
    mutationFn: adminApi.bulkApproveContent,
    onSuccess: (_, contentIds) => {
      toast.success(`${contentIds.length} content items approved successfully`);
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.moderationQueue() });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.stats });
    },
    onError: (error: any) => {
      toast.error(`Failed to approve content: ${error.message}`);
    },
  });

  const bulkRejectContent = useMutation({
    mutationFn: ({ contentIds, reason }: { contentIds: string[]; reason: string }) =>
      adminApi.bulkRejectContent(contentIds, reason),
    onSuccess: (_, { contentIds }) => {
      toast.success(`${contentIds.length} content items rejected`);
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.moderationQueue() });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.stats });
    },
    onError: (error: any) => {
      toast.error(`Failed to reject content: ${error.message}`);
    },
  });

  return {
    approveContent,
    rejectContent,
    flagContent,
    bulkApproveContent,
    bulkRejectContent,
  };
};

// User Management Hooks
export const useAdminUsers = (filters?: { role?: string; status?: string; search?: string }) => {
  return useQuery({
    queryKey: adminQueryKeys.users(filters),
    queryFn: () => adminApi.getAllUsers(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useUserManagement = () => {
  const queryClient = useQueryClient();

  const updateUserRole = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: 'admin' | 'curator' | 'user' }) =>
      adminApi.updateUserRole(userId, role),
    onSuccess: () => {
      toast.success('User role updated successfully');
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.users() });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.userStats });
    },
    onError: (error: any) => {
      toast.error(`Failed to update user role: ${error.message}`);
    },
  });

  const activateUser = useMutation({
    mutationFn: adminApi.activateUser,
    onSuccess: () => {
      toast.success('User activated successfully');
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.users() });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.userStats });
    },
    onError: (error: any) => {
      toast.error(`Failed to activate user: ${error.message}`);
    },
  });

  const deactivateUser = useMutation({
    mutationFn: adminApi.deactivateUser,
    onSuccess: () => {
      toast.success('User deactivated successfully');
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.users() });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.userStats });
    },
    onError: (error: any) => {
      toast.error(`Failed to deactivate user: ${error.message}`);
    },
  });

  const bulkUpdateUsers = useMutation({
    mutationFn: ({ userIds, updates }: { userIds: string[]; updates: { role?: string; status?: string } }) =>
      adminApi.bulkUpdateUsers(userIds, updates),
    onSuccess: (_, { userIds }) => {
      toast.success(`${userIds.length} users updated successfully`);
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.users() });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.userStats });
    },
    onError: (error: any) => {
      toast.error(`Failed to update users: ${error.message}`);
    },
  });

  return {
    updateUserRole,
    activateUser,
    deactivateUser,
    bulkUpdateUsers,
  };
};

// Content Allocation Hooks
export const useContentAllocations = () => {
  return useQuery({
    queryKey: adminQueryKeys.contentAllocations,
    queryFn: adminApi.getContentAllocations,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useContentAllocation = () => {
  const queryClient = useQueryClient();

  const allocateContent = useMutation({
    mutationFn: ({ contentId, organizationId, equipmentType }: { 
      contentId: string; 
      organizationId: string; 
      equipmentType: string; 
    }) => adminApi.allocateContent(contentId, organizationId, equipmentType),
    onSuccess: () => {
      toast.success('Content allocated successfully');
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.contentAllocations });
    },
    onError: (error: any) => {
      toast.error(`Failed to allocate content: ${error.message}`);
    },
  });

  const removeAllocation = useMutation({
    mutationFn: adminApi.removeContentAllocation,
    onSuccess: () => {
      toast.success('Content allocation removed');
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.contentAllocations });
    },
    onError: (error: any) => {
      toast.error(`Failed to remove allocation: ${error.message}`);
    },
  });

  return {
    allocateContent,
    removeAllocation,
  };
};

// System Management Hooks
export const useSystemManagement = () => {
  const queryClient = useQueryClient();

  const retryFailedProcessing = useMutation({
    mutationFn: adminApi.retryFailedProcessing,
    onSuccess: () => {
      toast.success('Processing job retried successfully');
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.systemHealth });
    },
    onError: (error: any) => {
      toast.error(`Failed to retry processing: ${error.message}`);
    },
  });

  const clearProcessingQueue = useMutation({
    mutationFn: adminApi.clearProcessingQueue,
    onSuccess: () => {
      toast.success('Processing queue cleared');
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.systemHealth });
    },
    onError: (error: any) => {
      toast.error(`Failed to clear processing queue: ${error.message}`);
    },
  });

  return {
    retryFailedProcessing,
    clearProcessingQueue,
  };
};

export const useSystemLogs = (filters?: { level?: string; dateFrom?: string; dateTo?: string }) => {
  return useQuery({
    queryKey: adminQueryKeys.systemLogs(filters),
    queryFn: () => adminApi.getSystemLogs(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Global Search Hook
export const useGlobalSearch = (query: string, filters?: { type?: string; dateFrom?: string; dateTo?: string }) => {
  return useQuery({
    queryKey: adminQueryKeys.globalSearch(query, filters),
    queryFn: () => adminApi.globalSearch(query, filters),
    enabled: !!query && query.length >= 2,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Report Generation Hook
export const useReportGeneration = () => {
  const generateReport = useMutation({
    mutationFn: ({ type, filters }: { type: string; filters: any }) =>
      adminApi.generateReport(type, filters),
    onSuccess: (data) => {
      toast.success('Report generated successfully');
      // Open download URL
      window.open(data.downloadUrl, '_blank');
    },
    onError: (error: any) => {
      toast.error(`Failed to generate report: ${error.message}`);
    },
  });

  return {
    generateReport,
  };
};