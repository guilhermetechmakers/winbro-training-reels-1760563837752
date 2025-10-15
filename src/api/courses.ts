import { api } from "@/lib/api";
import type { 
  Course, 
  CourseModule, 
  CourseLesson, 
  CourseEnrollment, 
  CourseAssignment,
  CourseAnalytics
} from "@/types";

// Course Management API
export const coursesApi = {
  // Get all courses with optional filters
  getAll: async (filters?: {
    status?: string;
    visibility?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const queryString = params.toString();
    return api.get<Course[]>(`/courses${queryString ? `?${queryString}` : ""}`);
  },

  // Get course by ID with full details
  getById: async (id: string) => {
    return api.get<Course>(`/courses/${id}`);
  },

  // Get course structure for player
  getPlayerData: async (id: string) => {
    return api.get<Course>(`/courses/${id}/player`);
  },

  // Create new course
  create: async (data: CreateCourseInput) => {
    return api.post<Course>("/courses", data);
  },

  // Update course
  update: async (id: string, data: UpdateCourseInput) => {
    return api.put<Course>(`/courses/${id}`, data);
  },

  // Delete course
  delete: async (id: string) => {
    return api.delete(`/courses/${id}`);
  },

  // Publish course
  publish: async (id: string) => {
    return api.post<Course>(`/courses/${id}/publish`, {});
  },

  // Archive course
  archive: async (id: string) => {
    return api.post<Course>(`/courses/${id}/archive`, {});
  },

  // Assign course to users/teams
  assign: async (id: string, data: {
    assignment_type: 'user' | 'team' | 'organization';
    assigned_to: string[];
    due_date?: string;
    start_date?: string;
  }) => {
    return api.post<CourseAssignment[]>(`/courses/${id}/assign`, data);
  },

  // Get course assignments
  getAssignments: async (id: string) => {
    return api.get<CourseAssignment[]>(`/courses/${id}/assignments`);
  },

  // Get course analytics
  getAnalytics: async (id: string, filters?: {
    date_from?: string;
    date_to?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const queryString = params.toString();
    return api.get<CourseAnalytics>(`/courses/${id}/analytics${queryString ? `?${queryString}` : ""}`);
  },
};

// Course Modules API
export const modulesApi = {
  // Add module to course
  create: async (courseId: string, data: CreateModuleInput) => {
    return api.post<CourseModule>(`/courses/${courseId}/modules`, data);
  },

  // Update module
  update: async (courseId: string, moduleId: string, data: UpdateModuleInput) => {
    return api.put<CourseModule>(`/courses/${courseId}/modules/${moduleId}`, data);
  },

  // Delete module
  delete: async (courseId: string, moduleId: string) => {
    return api.delete(`/courses/${courseId}/modules/${moduleId}`);
  },

  // Reorder modules
  reorder: async (courseId: string, moduleIds: string[]) => {
    return api.put(`/courses/${courseId}/modules/reorder`, { moduleIds });
  },
};

// Course Lessons API
export const lessonsApi = {
  // Add lesson to module
  create: async (courseId: string, moduleId: string, data: CreateLessonInput) => {
    return api.post<CourseLesson>(`/courses/${courseId}/modules/${moduleId}/lessons`, data);
  },

  // Update lesson
  update: async (courseId: string, moduleId: string, lessonId: string, data: UpdateLessonInput) => {
    return api.put<CourseLesson>(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`, data);
  },

  // Delete lesson
  delete: async (courseId: string, moduleId: string, lessonId: string) => {
    return api.delete(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`);
  },

  // Reorder lessons within module
  reorder: async (courseId: string, moduleId: string, lessonIds: string[]) => {
    return api.put(`/courses/${courseId}/modules/${moduleId}/lessons/reorder`, { lessonIds });
  },
};

// Course Enrollment API
export const enrollmentApi = {
  // Enroll user in course
  enroll: async (courseId: string, data?: EnrollCourseInput) => {
    return api.post<CourseEnrollment>(`/courses/${courseId}/enroll`, data || {});
  },

  // Get user's enrollment for course
  getEnrollment: async (courseId: string) => {
    return api.get<CourseEnrollment>(`/courses/${courseId}/enrollment`);
  },

  // Get all user enrollments
  getUserEnrollments: async (filters?: {
    status?: 'active' | 'completed' | 'cancelled';
    page?: number;
    limit?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const queryString = params.toString();
    return api.get<CourseEnrollment[]>(`/enrollments${queryString ? `?${queryString}` : ""}`);
  },

  // Update enrollment progress
  updateProgress: async (enrollmentId: string, data: UpdateProgressInput) => {
    return api.put<CourseEnrollment>(`/enrollments/${enrollmentId}/progress`, data);
  },

  // Complete course
  complete: async (enrollmentId: string) => {
    return api.post<CourseEnrollment>(`/enrollments/${enrollmentId}/complete`, {});
  },

  // Unenroll from course
  unenroll: async (enrollmentId: string) => {
    return api.delete(`/enrollments/${enrollmentId}`);
  },
};

// Course Search API
export const courseSearchApi = {
  // Search courses
  search: async (query: string, filters?: {
    tags?: string[];
    difficulty?: string;
    duration_min?: number;
    duration_max?: number;
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const params = new URLSearchParams({ q: query });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v));
          } else {
            params.append(key, String(value));
          }
        }
      });
    }
    return api.get<{
      courses: Course[];
      total: number;
      page: number;
      limit: number;
    }>(`/courses/search?${params.toString()}`);
  },

  // Get popular courses
  getPopular: async (limit = 10) => {
    return api.get<Course[]>(`/courses/popular?limit=${limit}`);
  },

  // Get recommended courses for user
  getRecommended: async (limit = 10) => {
    return api.get<Course[]>(`/courses/recommended?limit=${limit}`);
  },
};

// Input Types
export interface CreateCourseInput {
  title: string;
  description?: string;
  thumbnail_url?: string;
  visibility: 'public' | 'organization' | 'private';
  passing_score?: number;
}

export interface UpdateCourseInput {
  title?: string;
  description?: string;
  thumbnail_url?: string;
  visibility?: 'public' | 'organization' | 'private';
  passing_score?: number;
  status?: 'draft' | 'published' | 'archived';
}

export interface CreateModuleInput {
  title: string;
  description?: string;
  sort_order: number;
}

export interface UpdateModuleInput {
  title?: string;
  description?: string;
  sort_order?: number;
}

export interface CreateLessonInput {
  video_id: string;
  title: string;
  description?: string;
  sort_order: number;
  is_required?: boolean;
}

export interface UpdateLessonInput {
  video_id?: string;
  title?: string;
  description?: string;
  sort_order?: number;
  is_required?: boolean;
}

export interface EnrollCourseInput {
  auto_start?: boolean;
}

export interface UpdateProgressInput {
  current_lesson_id?: string;
  progress_percentage?: number;
  completed_lessons?: string[];
}
