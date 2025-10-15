import { useReducer, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { coursesApi } from '@/api/courses';
import type { 
  Course, 
  CourseModule, 
  CourseLesson, 
  CourseQuiz, 
  QuizQuestion,
  CourseBuilderState,
  CourseBuilderAction
} from '@/types';

// Initial state
const initialState: CourseBuilderState = {
  course: {
    title: '',
    description: '',
    status: 'draft',
    visibility: 'organization',
    passing_score: 80,
    modules: []
  },
  selectedModule: null,
  selectedLesson: null,
  selectedQuiz: null,
  isPreviewMode: false,
  isDirty: false,
};

// Reducer
function courseBuilderReducer(state: CourseBuilderState, action: CourseBuilderAction): CourseBuilderState {
  switch (action.type) {
    case 'SET_COURSE':
      return {
        ...state,
        course: action.payload,
        isDirty: false,
      };

    case 'UPDATE_COURSE':
      return {
        ...state,
        course: { ...state.course, ...action.payload },
        isDirty: true,
      };

    case 'ADD_MODULE':
      const newModule = {
        id: `module-${Date.now()}`,
        course_id: state.course.id || '',
        title: 'New Module',
        description: '',
        sort_order: state.course.modules?.length || 0,
        lessons: [],
        quizzes: [],
        created_at: new Date().toISOString(),
      };
      return {
        ...state,
        course: {
          ...state.course,
          modules: [...(state.course.modules || []), newModule]
        },
        selectedModule: newModule.id,
        isDirty: true,
      };

    case 'UPDATE_MODULE':
      return {
        ...state,
        course: {
          ...state.course,
          modules: state.course.modules?.map(module =>
            module.id === action.payload.id ? { ...module, ...action.payload.updates } : module
          ) || []
        },
        isDirty: true,
      };

    case 'DELETE_MODULE':
      return {
        ...state,
        course: {
          ...state.course,
          modules: state.course.modules?.filter(module => module.id !== action.payload) || []
        },
        selectedModule: state.selectedModule === action.payload ? null : state.selectedModule,
        isDirty: true,
      };

    case 'ADD_LESSON':
      const { moduleId, lesson } = action.payload;
      return {
        ...state,
        course: {
          ...state.course,
          modules: state.course.modules?.map(module =>
            module.id === moduleId
              ? { ...module, lessons: [...module.lessons, lesson] }
              : module
          ) || []
        },
        selectedLesson: lesson.id,
        isDirty: true,
      };

    case 'UPDATE_LESSON':
      const { moduleId: updateModuleId, lessonId, updates } = action.payload;
      return {
        ...state,
        course: {
          ...state.course,
          modules: state.course.modules?.map(module =>
            module.id === updateModuleId
              ? {
                  ...module,
                  lessons: module.lessons.map(lesson =>
                    lesson.id === lessonId ? { ...lesson, ...updates } : lesson
                  )
                }
              : module
          ) || []
        },
        isDirty: true,
      };

    case 'DELETE_LESSON':
      const { moduleId: deleteModuleId, lessonId: deleteLessonId } = action.payload;
      return {
        ...state,
        course: {
          ...state.course,
          modules: state.course.modules?.map(module =>
            module.id === deleteModuleId
              ? { ...module, lessons: module.lessons.filter(lesson => lesson.id !== deleteLessonId) }
              : module
          ) || []
        },
        selectedLesson: state.selectedLesson === deleteLessonId ? null : state.selectedLesson,
        isDirty: true,
      };

    case 'REORDER_LESSONS':
      const { moduleId: reorderModuleId, lessonIds } = action.payload;
      return {
        ...state,
        course: {
          ...state.course,
          modules: state.course.modules?.map(module =>
            module.id === reorderModuleId
              ? {
                  ...module,
                  lessons: lessonIds.map((id: string, index: number) => {
                    const lesson = module.lessons.find(l => l.id === id);
                    return lesson ? { ...lesson, sort_order: index } : lesson;
                  }).filter(Boolean) as CourseLesson[]
                }
              : module
          ) || []
        },
        isDirty: true,
      };

    case 'ADD_QUIZ':
      const { quiz } = action.payload;
      return {
        ...state,
        course: {
          ...state.course,
          modules: state.course.modules?.map(module =>
            module.id === quiz.module_id
              ? { ...module, quizzes: [...module.quizzes, quiz] }
              : module
          ) || []
        },
        selectedQuiz: quiz.id,
        isDirty: true,
      };

    case 'UPDATE_QUIZ':
      const { quizId, updates: quizUpdates } = action.payload;
      return {
        ...state,
        course: {
          ...state.course,
          modules: state.course.modules?.map(module => ({
            ...module,
            quizzes: module.quizzes.map(quiz =>
              quiz.id === quizId ? { ...quiz, ...quizUpdates } : quiz
            )
          })) || []
        },
        isDirty: true,
      };

    case 'DELETE_QUIZ':
      const { quizId: deleteQuizId } = action.payload;
      return {
        ...state,
        course: {
          ...state.course,
          modules: state.course.modules?.map(module => ({
            ...module,
            quizzes: module.quizzes.filter(quiz => quiz.id !== deleteQuizId)
          })) || []
        },
        selectedQuiz: state.selectedQuiz === deleteQuizId ? null : state.selectedQuiz,
        isDirty: true,
      };

    case 'ADD_QUESTION':
      const { quizId: addQuestionQuizId, question } = action.payload;
      return {
        ...state,
        course: {
          ...state.course,
          modules: state.course.modules?.map(module => ({
            ...module,
            quizzes: module.quizzes.map(quiz =>
              quiz.id === addQuestionQuizId
                ? { ...quiz, questions: [...quiz.questions, question] }
                : quiz
            )
          })) || []
        },
        isDirty: true,
      };

    case 'UPDATE_QUESTION':
      const { quizId: updateQuestionQuizId, questionId, updates: questionUpdates } = action.payload;
      return {
        ...state,
        course: {
          ...state.course,
          modules: state.course.modules?.map(module => ({
            ...module,
            quizzes: module.quizzes.map(quiz =>
              quiz.id === updateQuestionQuizId
                ? {
                    ...quiz,
                    questions: quiz.questions.map(q =>
                      q.id === questionId ? { ...q, ...questionUpdates } : q
                    )
                  }
                : quiz
            )
          })) || []
        },
        isDirty: true,
      };

    case 'DELETE_QUESTION':
      const { quizId: deleteQuestionQuizId, questionId: deleteQuestionId } = action.payload;
      return {
        ...state,
        course: {
          ...state.course,
          modules: state.course.modules?.map(module => ({
            ...module,
            quizzes: module.quizzes.map(quiz =>
              quiz.id === deleteQuestionQuizId
                ? { ...quiz, questions: quiz.questions.filter(q => q.id !== deleteQuestionId) }
                : quiz
            )
          })) || []
        },
        isDirty: true,
      };

    case 'SET_SELECTED':
      return {
        ...state,
        selectedModule: action.payload.moduleId || null,
        selectedLesson: action.payload.lessonId || null,
        selectedQuiz: action.payload.quizId || null,
      };

    case 'SET_PREVIEW_MODE':
      return {
        ...state,
        isPreviewMode: action.payload,
      };

    case 'SET_DIRTY':
      return {
        ...state,
        isDirty: action.payload,
      };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

export function useCourseBuilder() {
  const [state, dispatch] = useReducer(courseBuilderReducer, initialState);
  const queryClient = useQueryClient();

  // Mutations
  const createCourseMutation = useMutation({
    mutationFn: coursesApi.create,
    onSuccess: (data) => {
      dispatch({ type: 'SET_COURSE', payload: data });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create course');
      console.error('Create course error:', error);
    },
  });

  const updateCourseMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => coursesApi.update(id, data),
    onSuccess: () => {
      dispatch({ type: 'SET_DIRTY', payload: false });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update course');
      console.error('Update course error:', error);
    },
  });

  const publishCourseMutation = useMutation({
    mutationFn: coursesApi.publish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course published successfully');
    },
    onError: (error) => {
      toast.error('Failed to publish course');
      console.error('Publish course error:', error);
    },
  });

  // Actions
  const updateCourse = useCallback((updates: Partial<Course>) => {
    dispatch({ type: 'UPDATE_COURSE', payload: updates });
  }, []);

  const addModule = useCallback(() => {
    dispatch({ type: 'ADD_MODULE' });
  }, []);

  const updateModule = useCallback((moduleId: string, updates: Partial<CourseModule>) => {
    dispatch({ type: 'UPDATE_MODULE', payload: { id: moduleId, updates } });
  }, []);

  const deleteModule = useCallback((moduleId: string) => {
    dispatch({ type: 'DELETE_MODULE', payload: moduleId });
  }, []);

  const addLesson = useCallback((moduleId: string, videoClip?: any) => {
    const newLesson: CourseLesson = {
      id: `lesson-${Date.now()}`,
      module_id: moduleId,
      video_id: videoClip?.id || '',
      video_clip: videoClip,
      title: videoClip?.title || 'New Lesson',
      description: '',
      sort_order: state.course.modules?.find(m => m.id === moduleId)?.lessons.length || 0,
      is_required: true,
      duration: videoClip?.duration || 0,
      created_at: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_LESSON', payload: { moduleId, lesson: newLesson } });
  }, [state.course.modules]);

  const updateLesson = useCallback((moduleId: string, lessonId: string, updates: Partial<CourseLesson>) => {
    dispatch({ type: 'UPDATE_LESSON', payload: { moduleId, lessonId, updates } });
  }, []);

  const deleteLesson = useCallback((moduleId: string, lessonId: string) => {
    dispatch({ type: 'DELETE_LESSON', payload: { moduleId, lessonId } });
  }, []);

  const reorderLessons = useCallback((moduleId: string, lessonIds: string[]) => {
    dispatch({ type: 'REORDER_LESSONS', payload: { moduleId, lessonIds } });
  }, []);

  const addQuiz = useCallback((courseId: string, moduleId: string) => {
    const newQuiz: CourseQuiz = {
      id: `quiz-${Date.now()}`,
      course_id: courseId,
      module_id: moduleId,
      title: 'New Quiz',
      description: '',
      time_limit: undefined,
      sort_order: state.course.modules?.find(m => m.id === moduleId)?.quizzes.length || 0,
      questions: [],
      created_at: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_QUIZ', payload: { courseId, quiz: newQuiz } });
  }, [state.course.modules]);

  const updateQuiz = useCallback((quizId: string, updates: Partial<CourseQuiz>) => {
    dispatch({ type: 'UPDATE_QUIZ', payload: { quizId, updates } });
  }, []);

  const deleteQuiz = useCallback((quizId: string) => {
    dispatch({ type: 'DELETE_QUIZ', payload: { quizId } });
  }, []);

  const addQuestion = useCallback((quizId: string, question: Partial<QuizQuestion>) => {
    const newQuestion: QuizQuestion = {
      id: `question-${Date.now()}`,
      quiz_id: quizId,
      question_text: question.question_text || '',
      question_type: question.question_type || 'multiple_choice',
      correct_answer: question.correct_answer || '',
      answer_options: question.answer_options || [],
      points: question.points || 1,
      sort_order: question.sort_order || 0,
      explanation: question.explanation,
    };
    dispatch({ type: 'ADD_QUESTION', payload: { quizId, question: newQuestion } });
  }, []);

  const updateQuestion = useCallback((quizId: string, questionId: string, updates: Partial<QuizQuestion>) => {
    dispatch({ type: 'UPDATE_QUESTION', payload: { quizId, questionId, updates } });
  }, []);

  const deleteQuestion = useCallback((quizId: string, questionId: string) => {
    dispatch({ type: 'DELETE_QUESTION', payload: { quizId, questionId } });
  }, []);

  const setSelected = useCallback((moduleId?: string, lessonId?: string, quizId?: string) => {
    dispatch({ type: 'SET_SELECTED', payload: { moduleId, lessonId, quizId } });
  }, []);

  const setPreviewMode = useCallback((isPreview: boolean) => {
    dispatch({ type: 'SET_PREVIEW_MODE', payload: isPreview });
  }, []);

  const saveCourse = useCallback(() => {
    if (!state.course.id) {
      createCourseMutation.mutate(state.course as any);
    } else {
      updateCourseMutation.mutate({ id: state.course.id, data: state.course });
    }
  }, [state.course, createCourseMutation, updateCourseMutation]);

  const publishCourse = useCallback(() => {
    if (state.course.id) {
      publishCourseMutation.mutate(state.course.id);
    }
  }, [state.course.id, publishCourseMutation]);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return {
    // State
    course: state.course,
    selectedModule: state.selectedModule,
    selectedLesson: state.selectedLesson,
    selectedQuiz: state.selectedQuiz,
    isPreviewMode: state.isPreviewMode,
    isDirty: state.isDirty,
    isLoading: createCourseMutation.isPending || updateCourseMutation.isPending || publishCourseMutation.isPending,

    // Actions
    updateCourse,
    addModule,
    updateModule,
    deleteModule,
    addLesson,
    updateLesson,
    deleteLesson,
    reorderLessons,
    addQuiz,
    updateQuiz,
    deleteQuiz,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    setSelected,
    setPreviewMode,
    saveCourse,
    publishCourse,
    reset,
  };
}
