import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useCoursePlayer } from '@/hooks/use-course-player';
import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '@/api/courses';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Maximize,
  BookOpen,
  Clock,
  Award,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function CoursePlayerPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime] = useState(0);
  const [duration] = useState(0);

  const {
    course,
    enrollment,
    currentModule,
    currentLesson,
    progress,
    isCourseCompleted,
    currentLessonDetails,
    nextLesson,
    previousLesson,
    isLoading,
    enroll,
    setCurrent,
    completeLesson,
    generateCertificate,
  } = useCoursePlayer(courseId!);

  // Load course data
  const { data: courseData, isLoading: isLoadingCourse } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => coursesApi.getById(courseId!),
    enabled: !!courseId,
  });

  useEffect(() => {
    if (courseData) {
      // Set course data in the hook
    }
  }, [courseData]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };


  const handleLessonComplete = () => {
    if (currentLesson) {
      completeLesson(currentLesson);
      toast.success('Lesson completed!');
    }
  };

  const handleNextLesson = () => {
    if (nextLesson) {
      setCurrent(nextLesson.module.id, nextLesson.id);
    }
  };

  const handlePreviousLesson = () => {
    if (previousLesson) {
      setCurrent(previousLesson.module.id, previousLesson.id);
    }
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

  if (!course) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <BookOpen className="h-12 w-12 text-slate-400 mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Course Not Found</h2>
          <p className="text-slate-600 mb-4">The course you're looking for doesn't exist or you don't have access to it.</p>
          <Button onClick={() => navigate('/courses')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
        </div>
      </MainLayout>
    );
  }

  if (!enrollment) {
    return (
      <MainLayout>
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            {/* Course Header */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-32 h-24 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0">
                    {course.thumbnail_url ? (
                      <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="h-8 w-8 text-slate-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">{course.title}</h1>
                    <p className="text-slate-600 mb-4">{course.description}</p>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDuration(course.estimated_duration * 60)}
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {course.modules?.length || 0} modules
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="h-4 w-4" />
                        Certificate included
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Content Preview */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
                <CardDescription>What you'll learn in this course</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {course.modules?.map((module, moduleIndex) => (
                    <div key={module.id} className="border rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        Module {moduleIndex + 1}: {module.title}
                      </h3>
                      {module.description && (
                        <p className="text-sm text-slate-600 mb-3">{module.description}</p>
                      )}
                      <div className="space-y-2">
                        {module.lessons.map((lesson) => (
                          <div key={lesson.id} className="flex items-center gap-3 p-2 bg-slate-50 rounded">
                            <Play className="h-4 w-4 text-slate-400" />
                            <span className="text-sm">{lesson.title}</span>
                            <span className="text-xs text-slate-500 ml-auto">
                              {formatDuration(lesson.duration)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Enrollment CTA */}
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Ready to Start Learning?</h3>
                <p className="text-slate-600 mb-4">
                  Enroll in this course to access all lessons, quizzes, and earn your certificate.
                </p>
                <Button 
                  onClick={enroll}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Enroll Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/courses')}
                className="hover:bg-slate-100"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-slate-900">{course.title}</h1>
                <p className="text-sm text-slate-600">
                  {currentModule && currentLesson ? 
                    `Module ${course.modules?.findIndex(m => m.id === currentModule) + 1} • Lesson ${(currentLessonDetails?.sort_order ?? 0) + 1}` :
                    'Select a lesson to begin'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-medium text-slate-900">{progress}% Complete</div>
                <Progress value={progress} className="w-32" />
              </div>
              {isCourseCompleted && (
                <Button onClick={generateCertificate} variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Download Certificate
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {currentLessonDetails ? (
              <>
                {/* Video Player */}
                <div className="flex-1 bg-black relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <Play className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{currentLessonDetails.title}</h3>
                      <p className="text-white/80">
                        {formatDuration(currentLessonDetails.duration)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Video Controls */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handlePlayPause}
                        className="text-white hover:bg-white/20"
                      >
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                      </Button>
                      <div className="flex-1">
                        <div className="w-full bg-white/30 rounded-full h-1">
                          <div 
                            className="bg-white h-1 rounded-full transition-all"
                            style={{ width: `${(currentTime / duration) * 100}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-white text-sm">
                        {formatDuration(currentTime)} / {formatDuration(duration)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/20"
                      >
                        <Volume2 className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/20"
                      >
                        <Maximize className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Lesson Actions */}
                <div className="bg-white border-t border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={handlePreviousLesson}
                        disabled={!previousLesson}
                      >
                        <SkipBack className="h-4 w-4 mr-2" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleNextLesson}
                        disabled={!nextLesson}
                      >
                        Next
                        <SkipForward className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                    <Button
                      onClick={handleLessonComplete}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Complete
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Select a Lesson</h3>
                  <p className="text-slate-600">Choose a lesson from the sidebar to begin learning</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-80 bg-white border-l border-slate-200 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-semibold text-slate-900 mb-4">Course Content</h3>
              <div className="space-y-4">
                {course.modules?.map((module, moduleIndex) => (
                  <div key={module.id}>
                    <h4 className="font-medium text-slate-900 mb-2">
                      Module {moduleIndex + 1}: {module.title}
                    </h4>
                    <div className="space-y-1">
                      {module.lessons.map((lesson) => (
                        <button
                          key={lesson.id}
                          onClick={() => setCurrent(module.id, lesson.id)}
                          className={cn(
                            "w-full text-left p-2 rounded text-sm transition-colors",
                            currentLesson === lesson.id
                              ? "bg-blue-100 text-blue-900 border border-blue-200"
                              : "hover:bg-slate-50 text-slate-700"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <Play className="h-4 w-4" />
                            <span className="flex-1">{lesson.title}</span>
                            <span className="text-xs text-slate-500">
                              {formatDuration(lesson.duration)}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
