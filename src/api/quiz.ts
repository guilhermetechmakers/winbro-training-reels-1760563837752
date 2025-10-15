import { api } from "@/lib/api";
import type { 
  CourseQuiz, 
  QuizQuestion, 
  QuizAttempt
} from "@/types";

// Quiz Management API
export const quizApi = {
  // Get quiz by ID
  getById: async (id: string) => {
    return api.get<CourseQuiz>(`/quizzes/${id}`);
  },

  // Create quiz
  create: async (courseId: string, data: CreateQuizInput) => {
    return api.post<CourseQuiz>(`/courses/${courseId}/quizzes`, data);
  },

  // Update quiz
  update: async (id: string, data: UpdateQuizInput) => {
    return api.put<CourseQuiz>(`/quizzes/${id}`, data);
  },

  // Delete quiz
  delete: async (id: string) => {
    return api.delete(`/quizzes/${id}`);
  },

  // Reorder quizzes
  reorder: async (courseId: string, quizIds: string[]) => {
    return api.put(`/courses/${courseId}/quizzes/reorder`, { quizIds });
  },
};

// Quiz Questions API
export const questionsApi = {
  // Add question to quiz
  create: async (quizId: string, data: CreateQuestionInput) => {
    return api.post<QuizQuestion>(`/quizzes/${quizId}/questions`, data);
  },

  // Update question
  update: async (quizId: string, questionId: string, data: UpdateQuestionInput) => {
    return api.put<QuizQuestion>(`/quizzes/${quizId}/questions/${questionId}`, data);
  },

  // Delete question
  delete: async (quizId: string, questionId: string) => {
    return api.delete(`/quizzes/${quizId}/questions/${questionId}`);
  },

  // Reorder questions
  reorder: async (quizId: string, questionIds: string[]) => {
    return api.put(`/quizzes/${quizId}/questions/reorder`, { questionIds });
  },
};

// Quiz Attempts API
export const quizAttemptsApi = {
  // Start quiz attempt
  start: async (quizId: string, data?: StartQuizAttemptInput) => {
    return api.post<QuizAttempt>(`/quizzes/${quizId}/attempt`, data || {});
  },

  // Get quiz attempt
  getById: async (attemptId: string) => {
    return api.get<QuizAttempt>(`/quiz-attempts/${attemptId}`);
  },

  // Get user's attempts for quiz
  getUserAttempts: async (quizId: string) => {
    return api.get<QuizAttempt[]>(`/quizzes/${quizId}/attempts`);
  },

  // Submit quiz attempt
  submit: async (attemptId: string, data: SubmitQuizAttemptInput) => {
    return api.put<QuizAttempt>(`/quiz-attempts/${attemptId}/submit`, data);
  },

  // Get attempt results
  getResults: async (attemptId: string) => {
    return api.get<{
      attempt: QuizAttempt;
      score: number;
      passed: boolean;
      correct_answers: number;
      total_questions: number;
      feedback: Record<string, {
        correct: boolean;
        user_answer: string;
        correct_answer: string;
        explanation?: string;
      }>;
    }>(`/quiz-attempts/${attemptId}/results`);
  },

  // Retake quiz (if allowed)
  retake: async (quizId: string) => {
    return api.post<QuizAttempt>(`/quizzes/${quizId}/retake`, {});
  },
};

// Quiz Analytics API
export const quizAnalyticsApi = {
  // Get quiz analytics
  getQuizAnalytics: async (quizId: string, filters?: {
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
    return api.get<{
      total_attempts: number;
      pass_rate: number;
      average_score: number;
      average_time: number;
      question_analytics: Array<{
        question_id: string;
        question_text: string;
        correct_rate: number;
        common_wrong_answers: Array<{
          answer: string;
          count: number;
        }>;
      }>;
    }>(`/quizzes/${quizId}/analytics${queryString ? `?${queryString}` : ""}`);
  },

  // Get course quiz analytics
  getCourseQuizAnalytics: async (courseId: string) => {
    return api.get<{
      course_id: string;
      total_quizzes: number;
      total_attempts: number;
      overall_pass_rate: number;
      quiz_breakdown: Array<{
        quiz_id: string;
        quiz_title: string;
        attempts: number;
        pass_rate: number;
        average_score: number;
      }>;
    }>(`/courses/${courseId}/quiz-analytics`);
  },
};

// Input Types
export interface CreateQuizInput {
  title: string;
  description?: string;
  module_id?: string;
  time_limit?: number; // in minutes
  sort_order: number;
}

export interface UpdateQuizInput {
  title?: string;
  description?: string;
  time_limit?: number;
  sort_order?: number;
}

export interface CreateQuestionInput {
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer';
  correct_answer: string;
  answer_options?: string[]; // For multiple choice
  points?: number;
  sort_order: number;
  explanation?: string;
}

export interface UpdateQuestionInput {
  question_text?: string;
  question_type?: 'multiple_choice' | 'true_false' | 'short_answer';
  correct_answer?: string;
  answer_options?: string[];
  points?: number;
  sort_order?: number;
  explanation?: string;
}

export interface StartQuizAttemptInput {
  enrollment_id?: string;
}

export interface SubmitQuizAttemptInput {
  answers: Record<string, string>; // question_id -> answer
  time_spent?: number; // in seconds
}
