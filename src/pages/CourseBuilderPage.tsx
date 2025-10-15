import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useCourseBuilder } from '@/hooks/use-course-builder';
import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '@/api/courses';
import { CourseCanvas } from '@/components/course-builder/CourseCanvas';
import { VideoLibrarySidebar } from '@/components/course-builder/VideoLibrarySidebar';
import { CourseSettings } from '@/components/course-builder/CourseSettings';
import { CoursePreview } from '@/components/course-builder/CoursePreview';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  Eye, 
  Play, 
  BookOpen,
  Video,
  Clock,
  Award,
  Plus,
  ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function CourseBuilderPage() {
  const { courseId } = useParams<{ courseId?: string }>();
  const [activeTab, setActiveTab] = useState<'canvas' | 'settings' | 'preview'>('canvas');
  const [showVideoLibrary, setShowVideoLibrary] = useState(false);
  
  const {
    course,
    selectedModule,
    selectedLesson,
    selectedQuiz,
    isPreviewMode,
    isDirty,
    isLoading,
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
  } = useCourseBuilder();

  // Load existing course if courseId is provided
  const { data: existingCourse, isLoading: isLoadingCourse } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => coursesApi.getById(courseId!),
    enabled: !!courseId,
  });

  useEffect(() => {
    if (existingCourse) {
      updateCourse(existingCourse);
    }
  }, [existingCourse, updateCourse]);

  const handleSave = () => {
    if (!course.title?.trim()) {
      toast.error('Please enter a course title');
      return;
    }
    saveCourse();
  };

  const handlePublish = () => {
    if (!course.title?.trim()) {
      toast.error('Please enter a course title');
      return;
    }
    if (!course.modules?.length) {
      toast.error('Please add at least one module to the course');
      return;
    }
    publishCourse();
  };

  const getTotalDuration = () => {
    return course.modules?.reduce((total, module) => 
      total + module.lessons.reduce((moduleTotal, lesson) => 
        moduleTotal + lesson.duration, 0
      ), 0
    ) || 0;
  };

  const getTotalLessons = () => {
    return course.modules?.reduce((total, module) => total + module.lessons.length, 0) || 0;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoadingCourse) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-slate-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.history.back()}
                  className="hover:bg-slate-100"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                    {courseId ? 'Edit Course' : 'Create New Course'}
                  </h1>
                  <p className="text-sm text-slate-600 mt-1">
                    {courseId ? 'Modify your existing course' : 'Build a comprehensive training program'}
                  </p>
                </div>
                {isDirty && (
                  <Badge variant="outline" className="text-amber-600 border-amber-200">
                    Unsaved changes
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => setPreviewMode(!isPreviewMode)}
                  className="hover:bg-slate-50"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {isPreviewMode ? 'Edit' : 'Preview'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSave}
                  disabled={isLoading || !isDirty}
                  className="hover:bg-slate-50"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Draft'}
                </Button>
                <Button
                  onClick={handlePublish}
                  disabled={isLoading || !course.modules?.length}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Publish Course
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Course Stats */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-700">Modules</p>
                    <p className="text-2xl font-bold text-blue-900">{course.modules?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <Video className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-700">Lessons</p>
                    <p className="text-2xl font-bold text-green-900">{getTotalLessons()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-purple-700">Duration</p>
                    <p className="text-2xl font-bold text-purple-900">{formatDuration(getTotalDuration())}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500 rounded-lg">
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-orange-700">Status</p>
                    <p className="text-sm font-bold text-orange-900 capitalize">{course.status || 'Draft'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar - Video Library */}
            <div className="lg:col-span-3">
              <VideoLibrarySidebar
                isOpen={showVideoLibrary}
                onClose={() => setShowVideoLibrary(false)}
                onSelectVideo={(video) => {
                  if (selectedModule) {
                    addLesson(selectedModule, video);
                    setShowVideoLibrary(false);
                  }
                }}
              />
            </div>

            {/* Main Canvas Area */}
            <div className="lg:col-span-6">
              {isPreviewMode ? (
                <CoursePreview course={course} />
              ) : (
                <CourseCanvas
                  course={course}
                  selectedModule={selectedModule}
                  selectedLesson={selectedLesson}
                  selectedQuiz={selectedQuiz}
                  onUpdateCourse={updateCourse}
                  onAddModule={addModule}
                  onUpdateModule={updateModule}
                  onDeleteModule={deleteModule}
                  onAddLesson={addLesson}
                  onUpdateLesson={updateLesson}
                  onDeleteLesson={deleteLesson}
                  onReorderLessons={reorderLessons}
                  onAddQuiz={addQuiz}
                  onUpdateQuiz={updateQuiz}
                  onDeleteQuiz={deleteQuiz}
                  onAddQuestion={addQuestion}
                  onUpdateQuestion={updateQuestion}
                  onDeleteQuestion={deleteQuestion}
                  onSelectItem={setSelected}
                  onOpenVideoLibrary={() => setShowVideoLibrary(true)}
                />
              )}
            </div>

            {/* Right Sidebar - Settings & Editor */}
            <div className="lg:col-span-3">
              <div className="space-y-4">
                {/* Tab Navigation */}
                <div className="flex bg-slate-100 rounded-lg p-1">
                  <button
                    onClick={() => setActiveTab('canvas')}
                    className={cn(
                      "flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      activeTab === 'canvas'
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    Canvas
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={cn(
                      "flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      activeTab === 'settings'
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    Settings
                  </button>
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={cn(
                      "flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      activeTab === 'preview'
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    Preview
                  </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'canvas' && (
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Button
                          onClick={addModule}
                          className="w-full justify-start"
                          variant="outline"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Module
                        </Button>
                        <Button
                          onClick={() => setShowVideoLibrary(true)}
                          className="w-full justify-start"
                          variant="outline"
                          disabled={!selectedModule}
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Add Video Lesson
                        </Button>
                        <Button
                          onClick={() => selectedModule && addQuiz(course.id || '', selectedModule)}
                          className="w-full justify-start"
                          variant="outline"
                          disabled={!selectedModule}
                        >
                          <Award className="h-4 w-4 mr-2" />
                          Add Quiz
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <CourseSettings
                    course={course}
                    onUpdateCourse={updateCourse}
                  />
                )}

                {activeTab === 'preview' && (
                  <CoursePreview course={course} compact />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
