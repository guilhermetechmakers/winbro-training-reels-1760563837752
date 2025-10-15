import { Navigate } from "react-router-dom";
import { useCurrentUser } from "@/hooks/use-api";
import { Skeleton } from "@/components/ui/skeleton";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "curator" | "user";
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { data: user, isLoading, error } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  if (error || !user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && (user as any)?.role !== requiredRole && (user as any)?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
