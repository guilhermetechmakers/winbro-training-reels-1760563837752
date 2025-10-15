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
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface CourseModule {
  id: string;
  title: string;
  description?: string;
  order: number;
  lessons: CourseLesson[];
}

export interface CourseLesson {
  id: string;
  title: string;
  description?: string;
  video_clip_id: string;
  video_clip?: VideoClip;
  order: number;
  duration: number; // in seconds
  quiz?: Quiz;
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
  pass_score: number; // percentage
  time_limit?: number; // in minutes
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: "multiple_choice" | "true_false" | "text";
  options?: string[];
  correct_answer: string | number;
  explanation?: string;
  order: number;
}

// Certificate Types
export interface Certificate {
  id: string;
  user_id: string;
  course_id: string;
  course?: Course;
  user?: User;
  issued_at: string;
  verification_code: string;
  pdf_url: string;
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

export interface EmailVerificationForm {
  token: string;
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
