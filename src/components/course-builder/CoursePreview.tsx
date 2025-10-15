import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Clock, 
  BookOpen, 
  Video, 
  Award, 
  CheckCircle,
  Lock
} from 'lucide-react';
import type { Course } from '@/types';

interface CoursePreviewProps {
  course: Partial<Course>;
  compact?: boolean;
}

export function CoursePreview({ course, compact = false }: CoursePreviewProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

  const getTotalQuizzes = () => {
    return course.modules?.reduce((total, module) => total + module.quizzes.length, 0) || 0;
  };

  const getDifficultyLevel = () => {
    const totalLessons = getTotalLessons();
    const totalDuration = getTotalDuration();
    
    if (totalLessons < 5 && totalDuration < 1800) return 'Beginner';
    if (totalLessons < 10 && totalDuration < 3600) return 'Intermediate';
    return 'Advanced';
  };

  if (compact) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Course Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {course.title || 'Untitled Course'}
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              {course.description || 'No description provided'}
            </p>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{course.modules?.length || 0}</div>
                <div className="text-xs text-slate-500">Modules</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{getTotalLessons()}</div>
                <div className="text-xs text-slate-500">Lessons</div>
              </div>
            </div>
          </div>
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
            {/* Thumbnail */}
            <div className="w-32 h-24 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0">
              {course.thumbnail_url ? (
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Video className="h-8 w-8 text-slate-400" />
                </div>
              )}
            </div>

            {/* Course Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">
                    {course.title || 'Untitled Course'}
                  </h1>
                  <p className="text-slate-600 mb-4">
                    {course.description || 'No description provided'}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDuration(getTotalDuration())}
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {course.modules?.length || 0} modules
                    </div>
                    <div className="flex items-center gap-1">
                      <Video className="h-4 w-4" />
                      {getTotalLessons()} lessons
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="h-4 w-4" />
                      {getTotalQuizzes()} quizzes
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <Badge 
                    variant={course.status === 'published' ? 'default' : 'outline'}
                    className="mb-2"
                  >
                    {course.status || 'Draft'}
                  </Badge>
                  <div className="text-sm text-slate-500">
                    {getDifficultyLevel()} Level
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 text-center">
            <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-900">{course.modules?.length || 0}</div>
            <div className="text-sm text-blue-700">Modules</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 text-center">
            <Video className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-900">{getTotalLessons()}</div>
            <div className="text-sm text-green-700">Lessons</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-900">{getTotalQuizzes()}</div>
            <div className="text-sm text-purple-700">Quizzes</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-900">{formatDuration(getTotalDuration())}</div>
            <div className="text-sm text-orange-700">Duration</div>
          </CardContent>
        </Card>
      </div>

      {/* Course Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Course Content</CardTitle>
          <CardDescription>
            How your course will appear to learners
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {course.modules?.map((module, moduleIndex) => (
              <div key={module.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Module {moduleIndex + 1}: {module.title}
                  </h3>
                  <Badge variant="outline">
                    {module.lessons.length} lessons
                  </Badge>
                </div>
                
                {module.description && (
                  <p className="text-sm text-slate-600 mb-3">{module.description}</p>
                )}

                <div className="space-y-2">
                  {module.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Play className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-slate-900">{lesson.title}</div>
                        <div className="text-sm text-slate-500">
                          {formatDuration(lesson.duration)}
                          {lesson.is_required && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              Required
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-slate-400">
                        <Lock className="h-4 w-4" />
                      </div>
                    </div>
                  ))}

                  {module.quizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg"
                    >
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Award className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-slate-900">{quiz.title}</div>
                        <div className="text-sm text-slate-500">
                          {quiz.questions.length} questions
                          {quiz.time_limit && ` • ${quiz.time_limit} min limit`}
                        </div>
                      </div>
                      <div className="text-slate-400">
                        <Lock className="h-4 w-4" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {(!course.modules || course.modules.length === 0) && (
              <div className="text-center py-8 text-slate-500">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <p>No modules added yet</p>
                <p className="text-sm">Add modules and lessons to see the preview</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Course Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Course Requirements</CardTitle>
          <CardDescription>
            What learners need to complete to earn a certificate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm">Complete all video lessons</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm">Pass all quizzes with {course.passing_score || 80}% or higher</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm">Complete lessons in sequential order</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm">Watch videos to completion</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
