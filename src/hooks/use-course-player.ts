import { useReducer, useCallback, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { enrollmentApi } from '@/api/courses';
import { quizAttemptsApi } from '@/api/quiz';
import { certificatesApi } from '@/api/certificates';
import type { 
  Course, 
  CourseEnrollment, 
  CoursePlayerState,
  CoursePlayerAction
} from '@/types';

// Initial state
const initialState: CoursePlayerState = {
  course: null,
  enrollment: null,
  currentModule: null,
  currentLesson: null,
  progress: 0,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  completedLessons: [],
  quizAttempts: {},
};

// Reducer
function coursePlayerReducer(state: CoursePlayerState, action: CoursePlayerAction): CoursePlayerState {
  switch (action.type) {
    case 'SET_COURSE':
      return {
        ...state,
        course: action.payload,
      };

    case 'SET_ENROLLMENT':
      return {
        ...state,
        enrollment: action.payload,
        progress: action.payload?.progress_percentage || 0,
        completedLessons: action.payload?.completed_lessons || [],
        currentLesson: action.payload?.current_lesson_id || null,
      };

    case 'SET_CURRENT':
      return {
        ...state,
        currentModule: action.payload.moduleId || null,
        currentLesson: action.payload.lessonId || null,
      };

    case 'UPDATE_PROGRESS':
      return {
        ...state,
        progress: action.payload.progress || state.progress,
        completedLessons: action.payload.completedLessons || state.completedLessons,
        currentLesson: action.payload.currentLesson || state.currentLesson,
      };

    case 'SET_PLAYING':
      return {
        ...state,
        isPlaying: action.payload,
      };

    case 'SET_TIME':
      return {
        ...state,
        currentTime: action.payload.currentTime || state.currentTime,
        duration: action.payload.duration || state.duration,
      };

    case 'COMPLETE_LESSON':
      const lessonId = action.payload;
      return {
        ...state,
        completedLessons: [...state.completedLessons, lessonId],
        progress: Math.min(100, state.progress + (100 / (state.course?.modules?.reduce((total, module) => total + module.lessons.length, 0) || 1))),
      };

    case 'SET_QUIZ_ATTEMPT':
      const { quizId, attempt } = action.payload;
      return {
        ...state,
        quizAttempts: {
          ...state.quizAttempts,
          [quizId]: attempt,
        },
      };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

export function useCoursePlayer(courseId: string) {
  const [state, dispatch] = useReducer(coursePlayerReducer, initialState);
  const queryClient = useQueryClient();

  // Mutations
  const enrollMutation = useMutation({
    mutationFn: () => enrollmentApi.enroll(courseId),
    onSuccess: (data) => {
      dispatch({ type: 'SET_ENROLLMENT', payload: data });
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      toast.success('Successfully enrolled in course');
    },
    onError: (error) => {
      toast.error('Failed to enroll in course');
      console.error('Enroll error:', error);
    },
  });

  const updateProgressMutation = useMutation({
    mutationFn: ({ enrollmentId, data }: { enrollmentId: string; data: any }) => 
      enrollmentApi.updateProgress(enrollmentId, data),
    onSuccess: (data) => {
      dispatch({ type: 'SET_ENROLLMENT', payload: data });
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    },
    onError: (error) => {
      toast.error('Failed to update progress');
      console.error('Update progress error:', error);
    },
  });

  const completeCourseMutation = useMutation({
    mutationFn: (enrollmentId: string) => enrollmentApi.complete(enrollmentId),
    onSuccess: (data) => {
      dispatch({ type: 'SET_ENROLLMENT', payload: data });
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      toast.success('Congratulations! Course completed successfully');
    },
    onError: (error) => {
      toast.error('Failed to complete course');
      console.error('Complete course error:', error);
    },
  });

  const startQuizMutation = useMutation({
    mutationFn: ({ quizId, enrollmentId }: { quizId: string; enrollmentId?: string }) =>
      quizAttemptsApi.start(quizId, { enrollment_id: enrollmentId }),
    onSuccess: (data, variables) => {
      dispatch({ type: 'SET_QUIZ_ATTEMPT', payload: { quizId: variables.quizId, attempt: data } });
      toast.success('Quiz started');
    },
    onError: (error) => {
      toast.error('Failed to start quiz');
      console.error('Start quiz error:', error);
    },
  });

  const submitQuizMutation = useMutation({
    mutationFn: ({ attemptId, answers, timeSpent }: { attemptId: string; answers: Record<string, string>; timeSpent?: number }) =>
      quizAttemptsApi.submit(attemptId, { answers, time_spent: timeSpent }),
    onSuccess: (data, variables) => {
      const quizId = Object.keys(state.quizAttempts).find(id => 
        state.quizAttempts[id]?.id === variables.attemptId
      );
      if (quizId) {
        dispatch({ type: 'SET_QUIZ_ATTEMPT', payload: { quizId, attempt: data } });
      }
      queryClient.invalidateQueries({ queryKey: ['quiz-attempts'] });
      toast.success('Quiz submitted successfully');
    },
    onError: (error) => {
      toast.error('Failed to submit quiz');
      console.error('Submit quiz error:', error);
    },
  });

  const generateCertificateMutation = useMutation({
    mutationFn: (enrollmentId: string) => certificatesApi.generate(enrollmentId),
    onSuccess: (data) => {
      toast.success('Certificate generated successfully');
      // Optionally trigger download
      certificatesApi.download(data.id);
    },
    onError: (error) => {
      toast.error('Failed to generate certificate');
      console.error('Generate certificate error:', error);
    },
  });

  // Actions
  const setCourse = useCallback((course: Course) => {
    dispatch({ type: 'SET_COURSE', payload: course });
  }, []);

  const setEnrollment = useCallback((enrollment: CourseEnrollment) => {
    dispatch({ type: 'SET_ENROLLMENT', payload: enrollment });
  }, []);

  const setCurrent = useCallback((moduleId?: string, lessonId?: string) => {
    dispatch({ type: 'SET_CURRENT', payload: { moduleId, lessonId } });
  }, []);

  const updateProgress = useCallback((updates: {
    progress?: number;
    completedLessons?: string[];
    currentLesson?: string;
  }) => {
    dispatch({ type: 'UPDATE_PROGRESS', payload: updates });
  }, []);

  const setPlaying = useCallback((isPlaying: boolean) => {
    dispatch({ type: 'SET_PLAYING', payload: isPlaying });
  }, []);

  const setTime = useCallback((currentTime: number, duration: number) => {
    dispatch({ type: 'SET_TIME', payload: { currentTime, duration } });
  }, []);

  const completeLesson = useCallback((lessonId: string) => {
    dispatch({ type: 'COMPLETE_LESSON', payload: lessonId });
    
    // Update progress on server
    if (state.enrollment) {
      const newCompletedLessons = [...state.completedLessons, lessonId];
      const totalLessons = state.course?.modules?.reduce((total, module) => total + module.lessons.length, 0) || 1;
      const newProgress = Math.min(100, Math.round((newCompletedLessons.length / totalLessons) * 100));
      
      updateProgressMutation.mutate({
        enrollmentId: state.enrollment.id,
        data: {
          current_lesson_id: lessonId,
          progress_percentage: newProgress,
          completed_lessons: newCompletedLessons,
        },
      });
    }
  }, [state.enrollment, state.completedLessons, state.course, updateProgressMutation]);

  const startQuiz = useCallback((quizId: string) => {
    if (state.enrollment) {
      startQuizMutation.mutate({ quizId, enrollmentId: state.enrollment.id });
    }
  }, [state.enrollment, startQuizMutation]);

  const submitQuiz = useCallback((attemptId: string, answers: Record<string, string>, timeSpent?: number) => {
    submitQuizMutation.mutate({ attemptId, answers, timeSpent });
  }, [submitQuizMutation]);

  const generateCertificate = useCallback(() => {
    if (state.enrollment) {
      generateCertificateMutation.mutate(state.enrollment.id);
    }
  }, [state.enrollment, generateCertificateMutation]);

  const completeCourse = useCallback(() => {
    if (state.enrollment) {
      completeCourseMutation.mutate(state.enrollment.id);
    }
  }, [state.enrollment, completeCourseMutation]);

  const enroll = useCallback(() => {
    enrollMutation.mutate();
  }, [enrollMutation]);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  // Auto-save progress periodically
  useEffect(() => {
    if (!state.enrollment || !state.currentLesson) return;

    const interval = setInterval(() => {
      if (state.enrollment) {
        updateProgressMutation.mutate({
          enrollmentId: state.enrollment.id,
          data: {
            current_lesson_id: state.currentLesson,
            progress_percentage: state.progress,
            completed_lessons: state.completedLessons,
          },
        });
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(interval);
  }, [state.enrollment, state.currentLesson, state.progress, state.completedLessons, updateProgressMutation]);

  // Check if course is completed
  const isCourseCompleted = useCallback(() => {
    if (!state.course || !state.enrollment) return false;
    
    const totalLessons = state.course.modules?.reduce((total, module) => total + module.lessons.length, 0) || 0;
    return state.completedLessons.length >= totalLessons;
  }, [state.course, state.completedLessons]);

  // Get current lesson details
  const getCurrentLesson = useCallback(() => {
    if (!state.course || !state.currentLesson) return null;
    
    for (const module of state.course.modules || []) {
      const lesson = module.lessons.find(l => l.id === state.currentLesson);
      if (lesson) return { ...lesson, module };
    }
    return null;
  }, [state.course, state.currentLesson]);

  // Get next lesson
  const getNextLesson = useCallback(() => {
    if (!state.course || !state.currentLesson) return null;
    
    const allLessons = state.course.modules?.flatMap(module => 
      module.lessons.map(lesson => ({ ...lesson, module }))
    ) || [];
    
    const currentIndex = allLessons.findIndex(lesson => lesson.id === state.currentLesson);
    return currentIndex >= 0 && currentIndex < allLessons.length - 1 
      ? allLessons[currentIndex + 1] 
      : null;
  }, [state.course, state.currentLesson]);

  // Get previous lesson
  const getPreviousLesson = useCallback(() => {
    if (!state.course || !state.currentLesson) return null;
    
    const allLessons = state.course.modules?.flatMap(module => 
      module.lessons.map(lesson => ({ ...lesson, module }))
    ) || [];
    
    const currentIndex = allLessons.findIndex(lesson => lesson.id === state.currentLesson);
    return currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  }, [state.course, state.currentLesson]);

  return {
    // State
    course: state.course,
    enrollment: state.enrollment,
    currentModule: state.currentModule,
    currentLesson: state.currentLesson,
    progress: state.progress,
    isPlaying: state.isPlaying,
    currentTime: state.currentTime,
    duration: state.duration,
    completedLessons: state.completedLessons,
    quizAttempts: state.quizAttempts,
    isLoading: enrollMutation.isPending || updateProgressMutation.isPending || 
               completeCourseMutation.isPending || startQuizMutation.isPending || 
               submitQuizMutation.isPending || generateCertificateMutation.isPending,

    // Actions
    setCourse,
    setEnrollment,
    setCurrent,
    updateProgress,
    setPlaying,
    setTime,
    completeLesson,
    startQuiz,
    submitQuiz,
    generateCertificate,
    completeCourse,
    enroll,
    reset,

    // Computed values
    isCourseCompleted: isCourseCompleted(),
    currentLessonDetails: getCurrentLesson(),
    nextLesson: getNextLesson(),
    previousLesson: getPreviousLesson(),
  };
}
