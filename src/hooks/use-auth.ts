import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi } from "@/lib/api";
import type { User } from "@/types";

// Auth state management
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) return null;
      
      try {
        const response = await authApi.getCurrentUser();
        return response;
      } catch (error) {
        localStorage.removeItem("auth_token");
        return null;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });
};

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
        queryClient.setQueryData(["currentUser"], data.user);
        toast.success("Welcome back!");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Login failed");
    },
  });
};

// Register mutation
export const useRegister = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
        queryClient.setQueryData(["currentUser"], data.user);
        toast.success("Account created successfully!");
      } else {
        toast.success("Account created! Please check your email to verify your account.");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Registration failed");
    },
  });
};

// Logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      localStorage.removeItem("auth_token");
      queryClient.clear();
      toast.success("Logged out successfully");
    },
    onError: (error: any) => {
      // Even if logout fails on server, clear local state
      localStorage.removeItem("auth_token");
      queryClient.clear();
      toast.error(error.message || "Logout failed");
    },
  });
};

// Email verification mutation
export const useEmailVerification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authApi.verifyEmail,
    onSuccess: (data: any) => {
      if (data.success) {
        // Update user verification status in cache
        queryClient.setQueryData(["currentUser"], (oldData: User | null) => {
          if (oldData) {
            return { ...oldData, is_verified: true };
          }
          return oldData;
        });
        toast.success("Email verified successfully!");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Email verification failed");
    },
  });
};

// Resend verification mutation
export const useResendVerification = () => {
  return useMutation({
    mutationFn: authApi.resendVerification,
    onSuccess: () => {
      toast.success("Verification email sent! Please check your inbox.");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to resend verification email");
    },
  });
};

// Password reset request mutation
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => {
      toast.success("Password reset email sent! Please check your inbox.");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to send password reset email");
    },
  });
};

// Password reset mutation
export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      authApi.resetPassword(token, password),
    onSuccess: () => {
      toast.success("Password reset successfully! You can now log in with your new password.");
    },
    onError: (error: any) => {
      toast.error(error.message || "Password reset failed");
    },
  });
};

// Check if user is authenticated
export const useIsAuthenticated = () => {
  const { data: user, isLoading } = useCurrentUser();
  return {
    isAuthenticated: !!user,
    isLoading,
    user,
  };
};

// Check if user is verified
export const useIsVerified = () => {
  const { data: user, isLoading } = useCurrentUser();
  return {
    isVerified: (user as User)?.is_verified || false,
    isLoading,
    user,
  };
};
