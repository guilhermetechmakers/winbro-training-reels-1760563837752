// User Types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: "admin" | "curator" | "user";
  organization_id: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface UpdateUserInput {
  id: string;
  full_name?: string;
  avatar_url?: string;
  role?: "admin" | "curator" | "user";
}

// Organization Types
export interface Organization {
  id: string;
  name: string;
  domain?: string;
  logo_url?: string;
  subscription_plan: "trial" | "basic" | "premium" | "enterprise";
  seats: number;
  created_at: string;
  updated_at: string;
}

// Video Clip Types
export interface VideoClip {
  id: string;
  title: string;
  description?: string;
  duration: number; // in seconds
  file_url: string;
  thumbnail_url?: string;
  transcript?: string;
  tags: string[];
  machine_model?: string;
  process?: string;
  tooling?: string[];
  step?: string;
  privacy_level: "public" | "organization" | "private";
  organization_id: string;
  uploaded_by: string;
  status: "draft" | "processing" | "ready" | "published" | "archived";
  created_at: string;
  updated_at: string;
  published_at?: string;
  view_count: number;
  like_count: number;
}

export interface CreateVideoClipInput {
  title: string;
  description?: string;
  file: File;
  machine_model?: string;
  process?: string;
  tooling?: string[];
  step?: string;
  tags: string[];
  privacy_level: "public" | "organization" | "private";
}

export interface UpdateVideoClipInput {
  id: string;
  title?: string;
  description?: string;
  tags?: string[];
  machine_model?: string;
  process?: string;
  tooling?: string[];
  step?: string;
  privacy_level?: "public" | "organization" | "private";
  status?: "draft" | "processing" | "ready" | "published" | "archived";
}

// Course Types
export interface Course {
  id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  organization_id: string;
  created_by: string;
  status: "draft" | "published" | "archived";
  visibility: "public" | "organization" | "private";
  modules: CourseModule[];
  estimated_duration: number; // in minutes
  enrolled_count: number;
  completion_rate: number;
  passing_score: number; // percentage required to pass
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  sort_order: number;
  lessons: CourseLesson[];
  quizzes: CourseQuiz[];
  created_at: string;
}

export interface CourseLesson {
  id: string;
  module_id: string;
  video_id: string;
  video_clip?: VideoClip;
  title: string;
  description?: string;
  sort_order: number;
  is_required: boolean;
  duration: number; // in seconds
  created_at: string;
}

export interface CourseQuiz {
  id: string;
  course_id: string;
  module_id?: string;
  title: string;
  description?: string;
  time_limit?: number; // in minutes
  sort_order: number;
  questions: QuizQuestion[];
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_text: string;
  question_type: "multiple_choice" | "true_false" | "short_answer";
  correct_answer: string;
  answer_options?: string[]; // For multiple choice
  points: number;
  sort_order: number;
  explanation?: string;
}

// Course Enrollment Types
export interface CourseEnrollment {
  id: string;
  course_id: string;
  user_id: string;
  enrolled_at: string;
  started_at?: string;
  completed_at?: string;
  current_lesson_id?: string;
  progress_percentage: number;
  final_score?: number;
  certificate_issued_at?: string;
  course?: Course;
  user?: User;
}

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  user_id: string;
  enrollment_id: string;
  started_at: string;
  completed_at?: string;
  score?: number;
  passed?: boolean;
  answers: Record<string, string>; // question_id -> answer
}

// Certificate Types
export interface Certificate {
  id: string;
  enrollment_id: string;
  user_id: string;
  course_id: string;
  certificate_number: string;
  issued_at: string;
  pdf_url: string;
  verification_code: string;
  course?: Course;
  user?: User;
}

export interface CertificateVerification {
  valid: boolean;
  certificate?: Certificate;
  error?: string;
  revoked?: boolean;
  revoked_reason?: string;
}

// Course Builder Types
export interface CourseBuilderState {
  course: Partial<Course>;
  selectedModule: string | null;
  selectedLesson: string | null;
  selectedQuiz: string | null;
  isPreviewMode: boolean;
  isDirty: boolean;
}

export interface CourseBuilderAction {
  type: 'SET_COURSE' | 'UPDATE_COURSE' | 'ADD_MODULE' | 'UPDATE_MODULE' | 'DELETE_MODULE' | 
        'ADD_LESSON' | 'UPDATE_LESSON' | 'DELETE_LESSON' | 'REORDER_LESSONS' |
        'ADD_QUIZ' | 'UPDATE_QUIZ' | 'DELETE_QUIZ' | 'ADD_QUESTION' | 'UPDATE_QUESTION' | 'DELETE_QUESTION' |
        'SET_SELECTED' | 'SET_PREVIEW_MODE' | 'SET_DIRTY' | 'RESET';
  payload?: any;
}

// Course Player Types
export interface CoursePlayerState {
  course: Course | null;
  enrollment: CourseEnrollment | null;
  currentModule: string | null;
  currentLesson: string | null;
  progress: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  completedLessons: string[];
  quizAttempts: Record<string, QuizAttempt>;
}

export interface CoursePlayerAction {
  type: 'SET_COURSE' | 'SET_ENROLLMENT' | 'SET_CURRENT' | 'UPDATE_PROGRESS' | 
        'SET_PLAYING' | 'SET_TIME' | 'COMPLETE_LESSON' | 'SET_QUIZ_ATTEMPT' | 'RESET';
  payload?: any;
}

// Course Assignment Types
export interface CourseAssignment {
  id: string;
  course_id: string;
  assigned_by: string;
  assigned_to: string; // user_id, team_id, or 'all'
  assignment_type: 'user' | 'team' | 'organization';
  due_date?: string;
  start_date?: string;
  created_at: string;
  course?: Course;
}

// Course Analytics Types
export interface CourseAnalytics {
  course_id: string;
  total_enrollments: number;
  completion_rate: number;
  average_score: number;
  average_completion_time: number; // in minutes
  module_completion: ModuleAnalytics[];
  recent_activity: CourseActivity[];
}

export interface ModuleAnalytics {
  module_id: string;
  title: string;
  completion_rate: number;
  average_time: number;
  quiz_scores: number[];
}

export interface CourseActivity {
  id: string;
  type: 'enrollment' | 'completion' | 'quiz_attempt' | 'certificate_issued';
  user_id: string;
  user?: User;
  description: string;
  created_at: string;
}

// Analytics Types
export interface Analytics {
  total_clips: number;
  total_courses: number;
  total_users: number;
  total_views: number;
  completion_rate: number;
  popular_clips: VideoClip[];
  recent_activity: Activity[];
}

export interface Activity {
  id: string;
  type: "clip_uploaded" | "course_completed" | "user_registered" | "clip_viewed";
  user_id: string;
  user?: User;
  description: string;
  created_at: string;
}

// Search and Filter Types
export interface SearchFilters {
  query?: string;
  tags?: string[];
  machine_model?: string;
  process?: string;
  duration_min?: number;
  duration_max?: number;
  privacy_level?: "public" | "organization" | "private";
  date_from?: string;
  date_to?: string;
  uploaded_by?: string;
}

export interface SearchResult {
  clips: VideoClip[];
  courses: Course[];
  total: number;
  page: number;
  limit: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Upload Types
export interface UploadFile {
  file: File;
  id: string;
  progress: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  uploadUrl?: string;
  processingJobId?: string;
  error?: string;
}

// Video Processing Types
export interface VideoProcessingStatus {
  id: string;
  videoId: string;
  status: 'uploading' | 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  message: string;
  estimatedTimeRemaining?: number;
  startedAt?: string;
  completedAt?: string;
  error?: string;
  processingStages: ProcessingStage[];
}

export interface ProcessingStage {
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number;
  message?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface VideoFormat {
  id: string;
  videoId: string;
  format: 'hls' | 'dash' | 'mp4';
  quality: '360p' | '720p' | '1080p' | '4k';
  filePath: string;
  fileSize: number;
  duration: number;
  bitrate: number;
  resolution: {
    width: number;
    height: number;
  };
  createdAt: string;
}

export interface VideoThumbnail {
  id: string;
  videoId: string;
  timestamp: number;
  filePath: string;
  fileSize: number;
  width: number;
  height: number;
  createdAt: string;
}

export interface ProcessedVideo {
  id: string;
  title: string;
  description?: string;
  duration: number;
  fileSize: number;
  status: 'processing' | 'completed' | 'failed';
  formats: VideoFormat[];
  thumbnails: VideoThumbnail[];
  processingStatus?: VideoProcessingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface VideoMetadata {
  title: string;
  machineModel: string;
  process: string;
  tooling: string[];
  step: string;
  tags: string[];
  isCustomerSpecific: boolean;
  thumbnailUrl?: string;
}

export interface AIProcessingResult {
  transcript: {
    text: string;
    segments: { start: number; end: number; text: string; }[];
  };
  suggestedTags: { tag: string; confidence: number; }[];
  thumbnails: string[];
}

export interface UploadProgress {
  file_id: string;
  filename: string;
  progress: number; // 0-100
  status: "uploading" | "processing" | "completed" | "error";
  error?: string;
}

export interface UploadInitiateResponse {
  uploadId: string;
  uploadUrl: string;
  resumeUrl?: string;
}

export interface UploadChunkResponse {
  chunkId: string;
  nextChunkOffset: number;
}

export interface UploadCompleteResponse {
  videoId: string;
  processingJobId: string;
}

export interface ProcessingStatusResponse {
  status: string;
  progress: number;
  result?: AIProcessingResult;
}

export interface VideoPublishResponse {
  videoId: string;
  status: 'published' | 'pending_review';
}

// Notification Types
export interface Notification {
  id: string;
  user_id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  action_url?: string;
}

// Settings Types
export interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    course_updates: boolean;
    new_clips: boolean;
  };
  playback: {
    autoplay: boolean;
    default_speed: number;
    quality: "auto" | "720p" | "1080p";
  };
  privacy: {
    profile_visibility: "public" | "organization" | "private";
    show_activity: boolean;
  };
}

export interface OrganizationSettings {
  name: string;
  domain?: string;
  logo_url?: string;
  sso_config?: SSOConfig;
  content_workflow: {
    require_approval: boolean;
    approvers: string[];
  };
  branding: {
    primary_color: string;
    logo_url?: string;
    custom_css?: string;
  };
}

export interface SSOConfig {
  provider: "saml" | "oidc";
  metadata_url?: string;
  client_id?: string;
  client_secret?: string;
  enabled: boolean;
}

// Billing Types
export interface Subscription {
  id: string;
  organization_id: string;
  plan: "trial" | "basic" | "premium" | "enterprise";
  status: "active" | "cancelled" | "past_due" | "incomplete";
  current_period_start: string;
  current_period_end: string;
  seats: number;
  price_per_seat: number;
  total_amount: number;
  currency: string;
}

export interface Invoice {
  id: string;
  organization_id: string;
  subscription_id: string;
  amount: number;
  currency: string;
  status: "paid" | "pending" | "failed";
  due_date: string;
  paid_at?: string;
  pdf_url: string;
  line_items: InvoiceLineItem[];
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface SignupForm {
  email: string;
  password: string;
  full_name: string;
  organization_name: string;
  role: "admin" | "curator" | "user";
}

export interface PasswordResetForm {
  email: string;
}

export interface PasswordUpdateForm {
  token: string;
  password: string;
  confirm_password: string;
}

// Password Reset API Types
export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetResponse {
  message: string;
  rateLimitInfo?: {
    remaining: number;
    resetTime: number;
  };
}

export interface PasswordReset {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordResetConfirmation {
  success: boolean;
  message: string;
}

export interface TokenValidation {
  valid: boolean;
  expired: boolean;
  email?: string;
}

export interface TokenValidation {
  valid: boolean;
  expired: boolean;
  email?: string;
}

// Password Reset Token Database Type
export interface PasswordResetToken {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  used_at?: string;
  created_at: string;
}

export interface EmailVerificationForm {
  token: string;
}

// Email Verification Types
export interface VerifyEmailRequest {
  token: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
  userId?: string;
}

export interface ResendVerificationRequest {
  email?: string;
}

export interface ResendVerificationResponse {
  success: boolean;
  message: string;
}

// Navigation Types
export interface NavItem {
  title: string;
  href: string;
  icon?: string;
  badge?: string;
  children?: NavItem[];
}

// Player Types
export interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  quality: string;
  captions: boolean;
  fullscreen: boolean;
}

// Offline Types
export interface OfflineClip {
  id: string;
  clip_id: string;
  user_id: string;
  downloaded_at: string;
  file_size: number;
  local_path: string;
}

export interface SyncStatus {
  last_sync: string;
  pending_uploads: number;
  pending_downloads: number;
  conflicts: SyncConflict[];
}

export interface SyncConflict {
  id: string;
  type: "quiz_attempt" | "progress" | "bookmark";
  local_data: any;
  server_data: any;
  resolved: boolean;
  created_at: string;
}
