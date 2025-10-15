import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { clipsApi, coursesApi, usersApi, authApi, analyticsApi } from "@/lib/api";
import type { 
  UpdateVideoClipInput,
  SearchFilters
} from "@/types";

// Query Keys
export const queryKeys = {
  clips: ["clips"] as const,
  clipsList: (filters?: SearchFilters) => [...queryKeys.clips, "list", filters] as const,
  clip: (id: string) => [...queryKeys.clips, "detail", id] as const,
  courses: ["courses"] as const,
  coursesList: (filters?: any) => [...queryKeys.courses, "list", filters] as const,
  course: (id: string) => [...queryKeys.courses, "detail", id] as const,
  users: ["users"] as const,
  usersList: (filters?: any) => [...queryKeys.users, "list", filters] as const,
  user: (id: string) => [...queryKeys.users, "detail", id] as const,
  currentUser: ["currentUser"] as const,
  analytics: ["analytics"] as const,
  analyticsOverview: () => [...queryKeys.analytics, "overview"] as const,
};

// Video Clips Hooks
export const useClips = (filters?: SearchFilters) => {
  return useQuery({
    queryKey: queryKeys.clipsList(filters),
    queryFn: () => clipsApi.getAll(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useClip = (id: string) => {
  return useQuery({
    queryKey: queryKeys.clip(id),
    queryFn: () => clipsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateClip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clipsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clips });
      toast.success("Video clip created successfully!");
    },
    onError: (error: any) => {
      toast.error(`Failed to create clip: ${error.message}`);
    },
  });
};

export const useUpdateClip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVideoClipInput }) =>
      clipsApi.update(id, data),
    onSuccess: (updatedClip: any) => {
      queryClient.setQueryData(queryKeys.clip(updatedClip.id), updatedClip);
      queryClient.invalidateQueries({ queryKey: queryKeys.clips });
      toast.success("Video clip updated successfully!");
    },
    onError: (error: any) => {
      toast.error(`Failed to update clip: ${error.message}`);
    },
  });
};

export const useDeleteClip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clipsApi.delete,
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: queryKeys.clip(deletedId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.clips });
      toast.success("Video clip deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(`Failed to delete clip: ${error.message}`);
    },
  });
};

export const useSearchClips = (query: string, filters?: SearchFilters) => {
  return useQuery({
    queryKey: ["clips", "search", query, filters],
    queryFn: () => clipsApi.search(query, filters),
    enabled: !!query,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useUploadClip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, onProgress }: { file: File; onProgress?: (progress: number) => void }) =>
      clipsApi.upload(file, onProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clips });
      toast.success("Video uploaded successfully!");
    },
    onError: (error: any) => {
      toast.error(`Upload failed: ${error.message}`);
    },
  });
};

// Courses Hooks
export const useCourses = (filters?: any) => {
  return useQuery({
    queryKey: queryKeys.coursesList(filters),
    queryFn: () => coursesApi.getAll(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCourse = (id: string) => {
  return useQuery({
    queryKey: queryKeys.course(id),
    queryFn: () => coursesApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: coursesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses });
      toast.success("Course created successfully!");
    },
    onError: (error: any) => {
      toast.error(`Failed to create course: ${error.message}`);
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      coursesApi.update(id, data),
    onSuccess: (updatedCourse: any) => {
      queryClient.setQueryData(queryKeys.course(updatedCourse.id), updatedCourse);
      queryClient.invalidateQueries({ queryKey: queryKeys.courses });
      toast.success("Course updated successfully!");
    },
    onError: (error: any) => {
      toast.error(`Failed to update course: ${error.message}`);
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: coursesApi.delete,
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: queryKeys.course(deletedId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.courses });
      toast.success("Course deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(`Failed to delete course: ${error.message}`);
    },
  });
};

export const useEnrollCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: coursesApi.enroll,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses });
      toast.success("Successfully enrolled in course!");
    },
    onError: (error: any) => {
      toast.error(`Failed to enroll: ${error.message}`);
    },
  });
};

// Users Hooks
export const useCurrentUser = () => {
  return useQuery({
    queryKey: queryKeys.currentUser,
    queryFn: usersApi.getCurrent,
    retry: false,
    staleTime: 1000 * 60 * 10, // 10 minutes
    enabled: !!localStorage.getItem("auth_token"),
  });
};

export const useUsers = (filters?: any) => {
  return useQuery({
    queryKey: queryKeys.usersList(filters),
    queryFn: () => usersApi.getAll(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: queryKeys.user(id),
    queryFn: () => usersApi.getById(id),
    enabled: !!id,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      usersApi.update(id, data),
    onSuccess: (updatedUser: any) => {
      queryClient.setQueryData(queryKeys.user(updatedUser.id), updatedUser);
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      if (updatedUser.id === (queryClient.getQueryData(queryKeys.currentUser) as any)?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.currentUser });
      }
      toast.success("User updated successfully!");
    },
    onError: (error: any) => {
      toast.error(`Failed to update user: ${error.message}`);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersApi.delete,
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: queryKeys.user(deletedId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      toast.success("User deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(`Failed to delete user: ${error.message}`);
    },
  });
};

// Auth Hooks
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data: any) => {
      if (data.user) {
        queryClient.setQueryData(queryKeys.currentUser, data.user);
      }
      toast.success("Signed in successfully!");
    },
    onError: (error: any) => {
      toast.error(`Sign in failed: ${error.response?.data?.message || error.message}`);
    },
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      toast.success("Account created! Please check your email to verify your account.");
    },
    onError: (error: any) => {
      toast.error(`Sign up failed: ${error.response?.data?.message || error.message}`);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.clear();
      toast.success("Signed out successfully!");
    },
    onError: (error: any) => {
      toast.error(`Sign out failed: ${error.response?.data?.message || error.message}`);
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => {
      toast.success("Password reset email sent! Check your inbox.");
    },
    onError: (error: any) => {
      toast.error(`Password reset failed: ${error.response?.data?.message || error.message}`);
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      authApi.resetPassword(token, password),
    onSuccess: () => {
      toast.success("Password reset successfully!");
    },
    onError: (error: any) => {
      toast.error(`Password reset failed: ${error.response?.data?.message || error.message}`);
    },
  });
};

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: authApi.verifyEmail,
    onSuccess: () => {
      toast.success("Email verified successfully!");
    },
    onError: (error: any) => {
      toast.error(`Email verification failed: ${error.response?.data?.message || error.message}`);
    },
  });
};

export const useResendVerification = () => {
  return useMutation({
    mutationFn: authApi.resendVerification,
    onSuccess: () => {
      toast.success("Verification email sent!");
    },
    onError: (error: any) => {
      toast.error(`Failed to send verification email: ${error.response?.data?.message || error.message}`);
    },
  });
};

// Analytics Hooks
export const useAnalyticsOverview = () => {
  return useQuery({
    queryKey: queryKeys.analyticsOverview(),
    queryFn: analyticsApi.getOverview,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useClipsAnalytics = (filters?: any) => {
  return useQuery({
    queryKey: ["analytics", "clips", filters],
    queryFn: () => analyticsApi.getClipsAnalytics(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCoursesAnalytics = (filters?: any) => {
  return useQuery({
    queryKey: ["analytics", "courses", filters],
    queryFn: () => analyticsApi.getCoursesAnalytics(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
