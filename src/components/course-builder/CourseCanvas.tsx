import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  GripVertical, 
  Play, 
  Trash2, 
  Plus, 
  Award,
  Video,
  BookOpen,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { 
  Course, 
  CourseModule, 
  CourseLesson, 
  CourseQuiz,
  VideoClip 
} from '@/types';

interface CourseCanvasProps {
  course: Partial<Course>;
  selectedModule: string | null;
  selectedLesson: string | null;
  selectedQuiz: string | null;
  onUpdateCourse: (updates: Partial<Course>) => void;
  onAddModule: () => void;
  onUpdateModule: (moduleId: string, updates: Partial<CourseModule>) => void;
  onDeleteModule: (moduleId: string) => void;
  onAddLesson: (moduleId: string, videoClip?: VideoClip) => void;
  onUpdateLesson: (moduleId: string, lessonId: string, updates: Partial<CourseLesson>) => void;
  onDeleteLesson: (moduleId: string, lessonId: string) => void;
  onReorderLessons: (moduleId: string, lessonIds: string[]) => void;
  onAddQuiz: (courseId: string, moduleId: string) => void;
  onUpdateQuiz: (quizId: string, updates: Partial<CourseQuiz>) => void;
  onDeleteQuiz: (quizId: string) => void;
  onAddQuestion: (quizId: string, question: any) => void;
  onUpdateQuestion: (quizId: string, questionId: string, updates: any) => void;
  onDeleteQuestion: (quizId: string, questionId: string) => void;
  onSelectItem: (moduleId?: string, lessonId?: string, quizId?: string) => void;
  onOpenVideoLibrary: () => void;
}

export function CourseCanvas({
  course,
  selectedModule,
  selectedLesson,
  selectedQuiz,
  onUpdateCourse,
  onAddModule,
  onUpdateModule,
  onDeleteModule,
  onAddLesson,
  onUpdateLesson,
  onDeleteLesson,
  onAddQuiz,
  onDeleteQuiz,
  onSelectItem,
  onOpenVideoLibrary,
}: CourseCanvasProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [editingModule, setEditingModule] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<string | null>(null);

  const toggleModuleExpansion = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getModuleDuration = (module: CourseModule) => {
    return module.lessons.reduce((total, lesson) => total + lesson.duration, 0);
  };

  const getTotalDuration = () => {
    return course.modules?.reduce((total, module) => total + getModuleDuration(module), 0) || 0;
  };

  const getTotalLessons = () => {
    return course.modules?.reduce((total, module) => total + module.lessons.length, 0) || 0;
  };


  if (!course.modules?.length) {
    return (
      <Card className="h-96">
        <CardContent className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Start Building Your Course</h3>
          <p className="text-slate-600 mb-6 max-w-md">
            Create your first module to begin organizing your training content. 
            You can add video lessons, quizzes, and more.
          </p>
          <Button onClick={onAddModule} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Module
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <Card className="bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <Input
                value={course.title || ''}
                onChange={(e) => onUpdateCourse({ title: e.target.value })}
                placeholder="Enter course title..."
                className="text-2xl font-bold border-none bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Textarea
                value={course.description || ''}
                onChange={(e) => onUpdateCourse({ description: e.target.value })}
                placeholder="Enter course description..."
                className="mt-2 border-none bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none"
                rows={2}
              />
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-slate-600">
                {course.modules?.length || 0} modules
              </Badge>
              <Badge variant="outline" className="text-slate-600">
                {getTotalLessons()} lessons
              </Badge>
              <Badge variant="outline" className="text-slate-600">
                {formatDuration(getTotalDuration())}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modules */}
      <div className="space-y-4">
        {course.modules?.map((module, moduleIndex) => (
          <Card 
            key={module.id} 
            className={cn(
              "transition-all duration-200 hover:shadow-md",
              selectedModule === module.id && "ring-2 ring-blue-500 shadow-lg"
            )}
          >
            <CardHeader 
              className="pb-3 cursor-pointer"
              onClick={() => onSelectItem(module.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleModuleExpansion(module.id);
                    }}
                  >
                    {expandedModules.has(module.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                  <GripVertical className="h-4 w-4 text-slate-400" />
                  <div className="flex-1">
                    {editingModule === module.id ? (
                      <Input
                        value={module.title}
                        onChange={(e) => onUpdateModule(module.id, { title: e.target.value })}
                        onBlur={() => setEditingModule(null)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setEditingModule(null);
                          }
                        }}
                        className="text-lg font-semibold border-none bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        autoFocus
                      />
                    ) : (
                      <h3 
                        className="text-lg font-semibold text-slate-900"
                        onClick={() => setEditingModule(module.id)}
                      >
                        Module {moduleIndex + 1}: {module.title}
                      </h3>
                    )}
                    <p className="text-sm text-slate-600 mt-1">
                      {module.lessons.length} lessons • {module.quizzes.length} quizzes • {formatDuration(getModuleDuration(module))}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddLesson(module.id);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteModule(module.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {expandedModules.has(module.id) && (
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Module Description */}
                  <div className="ml-8">
                    <Textarea
                      value={module.description || ''}
                      onChange={(e) => onUpdateModule(module.id, { description: e.target.value })}
                      placeholder="Add module description..."
                      className="text-sm border-slate-200 focus:border-blue-300"
                      rows={2}
                    />
                  </div>

                  {/* Lessons */}
                  {module.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className={cn(
                        "ml-8 p-3 rounded-lg border transition-all duration-200 hover:shadow-sm cursor-pointer",
                        selectedLesson === lesson.id 
                          ? "border-blue-500 bg-blue-50" 
                          : "border-slate-200 hover:border-slate-300"
                      )}
                      onClick={() => onSelectItem(module.id, lesson.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <GripVertical className="h-4 w-4 text-slate-400" />
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <Play className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="flex-1">
                            {editingLesson === lesson.id ? (
                              <Input
                                value={lesson.title}
                                onChange={(e) => onUpdateLesson(module.id, lesson.id, { title: e.target.value })}
                                onBlur={() => setEditingLesson(null)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    setEditingLesson(null);
                                  }
                                }}
                                className="font-medium border-none bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                autoFocus
                              />
                            ) : (
                              <h4 
                                className="font-medium text-slate-900"
                                onClick={() => setEditingLesson(lesson.id)}
                              >
                                {lesson.title}
                              </h4>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-slate-500">
                                {formatDuration(lesson.duration)}
                              </span>
                              {lesson.video_clip && (
                                <Badge variant="outline" className="text-xs">
                                  Video
                                </Badge>
                              )}
                              {lesson.is_required && (
                                <Badge variant="outline" className="text-xs text-amber-600">
                                  Required
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteLesson(module.id, lesson.id);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Quizzes */}
                  {module.quizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      className={cn(
                        "ml-8 p-3 rounded-lg border transition-all duration-200 hover:shadow-sm cursor-pointer",
                        selectedQuiz === quiz.id 
                          ? "border-purple-500 bg-purple-50" 
                          : "border-slate-200 hover:border-slate-300"
                      )}
                      onClick={() => onSelectItem(module.id, undefined, quiz.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <GripVertical className="h-4 w-4 text-slate-400" />
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <Award className="h-4 w-4 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-900">{quiz.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-slate-500">
                                {quiz.questions.length} questions
                              </span>
                              {quiz.time_limit && (
                                <span className="text-xs text-slate-500">
                                  {quiz.time_limit} min limit
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteQuiz(quiz.id);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add Content Buttons */}
                  <div className="ml-8 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onOpenVideoLibrary()}
                      className="text-xs"
                    >
                      <Video className="h-3 w-3 mr-1" />
                      Add Video
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAddQuiz(course.id || '', module.id)}
                      className="text-xs"
                    >
                      <Award className="h-3 w-3 mr-1" />
                      Add Quiz
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}

        {/* Add Module Button */}
        <Card className="border-dashed border-2 border-slate-300 hover:border-slate-400 transition-colors">
          <CardContent className="p-6">
            <Button
              variant="ghost"
              onClick={onAddModule}
              className="w-full h-16 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add New Module
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
