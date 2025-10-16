import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { CookieConsentBanner } from "@/components/legal/CookieConsentBanner";
import { LandingPage } from "@/pages/LandingPage";
import { LoginPage } from "@/pages/LoginPage";
import { SignupPage } from "@/pages/SignupPage";
import { EmailVerificationPage } from "@/pages/EmailVerificationPage";
import { PasswordResetPage } from "@/pages/PasswordResetPage";
import { PasswordResetRequestPage } from "@/pages/PasswordResetRequestPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { ContentLibraryPage } from "@/pages/ContentLibraryPage";
import { UploadPage } from "@/pages/UploadPage";
import { VideoPlayerPage } from "@/pages/VideoPlayerPage";
import { CourseBuilderPage } from "@/pages/CourseBuilderPage";
import { CoursePlayerPage } from "@/pages/CoursePlayerPage";
import { UserManagementPage } from "@/pages/UserManagementPage";
import { AnalyticsPage } from "@/pages/AnalyticsPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { CheckoutPage } from "@/pages/CheckoutPage";
import { OrderHistoryPage } from "@/pages/OrderHistoryPage";
import { AdminDashboardPage } from "@/pages/AdminDashboardPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { CookiePolicyPage } from "@/pages/CookiePolicyPage";
import { AboutHelpPage } from "@/pages/AboutHelpPage";
import { TermsOfServicePage } from "@/pages/TermsOfServicePage";
import { PrivacyPolicyPage } from "@/pages/PrivacyPolicyPage";
import { ServerErrorPage } from "@/pages/ServerErrorPage";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// React Query client with optimal defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/verify-email/:token" element={<EmailVerificationPage />} />
            <Route path="/reset-password-request" element={<PasswordResetRequestPage />} />
            <Route path="/reset-password/:token" element={<PasswordResetPage />} />
            
            {/* Legal and Support Pages */}
            <Route path="/cookie-policy" element={<CookiePolicyPage />} />
            <Route path="/help" element={<AboutHelpPage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/500" element={<ServerErrorPage />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/library" element={
              <ProtectedRoute>
                <ContentLibraryPage />
              </ProtectedRoute>
            } />
            <Route path="/upload" element={
              <ProtectedRoute>
                <UploadPage />
              </ProtectedRoute>
            } />
            <Route path="/videos/:id" element={
              <ProtectedRoute>
                <VideoPlayerPage />
              </ProtectedRoute>
            } />
            <Route path="/course-builder" element={
              <ProtectedRoute>
                <CourseBuilderPage />
              </ProtectedRoute>
            } />
            <Route path="/course/:id" element={
              <ProtectedRoute>
                <CoursePlayerPage />
              </ProtectedRoute>
            } />
            <Route path="/users" element={
              <ProtectedRoute>
                <UserManagementPage />
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute>
                <AnalyticsPage />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/checkout" element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <OrderHistoryPage />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboardPage />
              </ProtectedRoute>
            } />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
        <Toaster />
        <CookieConsentBanner
          onSavePreferences={async (preferences) => {
            // Handle cookie preferences saving
            console.log('Cookie preferences:', preferences);
          }}
          onAcceptAll={() => {
            // Handle accept all cookies
            console.log('Accept all cookies');
          }}
          onRejectAll={() => {
            // Handle reject all cookies
            console.log('Reject all cookies');
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
