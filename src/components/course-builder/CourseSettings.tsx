import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Settings, 
  Globe, 
  Lock, 
  Users, 
  Award, 
  Clock,
  Upload,
  Eye,
  EyeOff
} from 'lucide-react';
import type { Course } from '@/types';

interface CourseSettingsProps {
  course: Partial<Course>;
  onUpdateCourse: (updates: Partial<Course>) => void;
}

export function CourseSettings({ course, onUpdateCourse }: CourseSettingsProps) {
  const handleVisibilityChange = (visibility: string) => {
    onUpdateCourse({ visibility: visibility as 'public' | 'organization' | 'private' });
  };

  const handleStatusChange = (status: string) => {
    onUpdateCourse({ status: status as 'draft' | 'published' | 'archived' });
  };

  const handlePassingScoreChange = (value: string) => {
    const score = parseInt(value);
    if (!isNaN(score) && score >= 0 && score <= 100) {
      onUpdateCourse({ passing_score: score });
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Basic Settings
          </CardTitle>
          <CardDescription>
            Configure the basic information for your course
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="course-title">Course Title</Label>
            <Input
              id="course-title"
              value={course.title || ''}
              onChange={(e) => onUpdateCourse({ title: e.target.value })}
              placeholder="Enter course title..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="course-description">Description</Label>
            <Textarea
              id="course-description"
              value={course.description || ''}
              onChange={(e) => onUpdateCourse({ description: e.target.value })}
              placeholder="Enter course description..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="course-thumbnail">Thumbnail URL</Label>
            <div className="flex gap-2">
              <Input
                id="course-thumbnail"
                value={course.thumbnail_url || ''}
                onChange={(e) => onUpdateCourse({ thumbnail_url: e.target.value })}
                placeholder="https://example.com/thumbnail.jpg"
              />
              <Button variant="outline" size="icon">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visibility & Access */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Visibility & Access
          </CardTitle>
          <CardDescription>
            Control who can see and access your course
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Visibility</Label>
            <Select value={course.visibility || 'organization'} onValueChange={handleVisibilityChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Public</div>
                      <div className="text-xs text-slate-500">Anyone can find and enroll</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="organization">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Organization</div>
                      <div className="text-xs text-slate-500">Only your organization members</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="private">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Private</div>
                      <div className="text-xs text-slate-500">Only invited users</div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={course.status || 'draft'} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">
                  <div className="flex items-center gap-2">
                    <EyeOff className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Draft</div>
                      <div className="text-xs text-slate-500">Not visible to learners</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="published">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Published</div>
                      <div className="text-xs text-slate-500">Visible and available for enrollment</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="archived">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Archived</div>
                      <div className="text-xs text-slate-500">Hidden from all users</div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Assessment Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="h-5 w-5" />
            Assessment Settings
          </CardTitle>
          <CardDescription>
            Configure how learners are assessed and certified
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="passing-score">Passing Score (%)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="passing-score"
                type="number"
                min="0"
                max="100"
                value={course.passing_score || 80}
                onChange={(e) => handlePassingScoreChange(e.target.value)}
                className="w-24"
              />
              <span className="text-sm text-slate-500">out of 100</span>
            </div>
            <p className="text-xs text-slate-500">
              Minimum score required to pass the course and receive a certificate
            </p>
          </div>

          <div className="space-y-2">
            <Label>Certificate Requirements</Label>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Complete all lessons</div>
                  <div className="text-xs text-slate-500">Learners must watch all video lessons</div>
                </div>
                <Switch defaultChecked disabled />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Pass all quizzes</div>
                  <div className="text-xs text-slate-500">Achieve passing score on all assessments</div>
                </div>
                <Switch defaultChecked disabled />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Sequential completion</div>
                  <div className="text-xs text-slate-500">Lessons must be completed in order</div>
                </div>
                <Switch defaultChecked disabled />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Course Statistics
          </CardTitle>
          <CardDescription>
            Overview of your course content and structure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-slate-50 rounded-lg">
              <div className="text-2xl font-bold text-slate-900">
                {course.modules?.length || 0}
              </div>
              <div className="text-sm text-slate-600">Modules</div>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-lg">
              <div className="text-2xl font-bold text-slate-900">
                {course.modules?.reduce((total, module) => total + module.lessons.length, 0) || 0}
              </div>
              <div className="text-sm text-slate-600">Lessons</div>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-lg">
              <div className="text-2xl font-bold text-slate-900">
                {course.modules?.reduce((total, module) => total + module.quizzes.length, 0) || 0}
              </div>
              <div className="text-sm text-slate-600">Quizzes</div>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-lg">
              <div className="text-2xl font-bold text-slate-900">
                {Math.floor((course.modules?.reduce((total, module) => 
                  total + module.lessons.reduce((moduleTotal, lesson) => 
                    moduleTotal + lesson.duration, 0
                  ), 0) || 0) / 60)}m
              </div>
              <div className="text-sm text-slate-600">Duration</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Advanced Settings</CardTitle>
          <CardDescription>
            Additional configuration options for your course
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-sm font-medium">Allow lesson skipping</div>
                <div className="text-xs text-slate-500">Let learners skip ahead to any lesson</div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-sm font-medium">Enable discussion forums</div>
                <div className="text-xs text-slate-500">Allow learners to discuss course content</div>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-sm font-medium">Send completion emails</div>
                <div className="text-xs text-slate-500">Notify learners when they complete the course</div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-sm font-medium">Require video completion</div>
                <div className="text-xs text-slate-500">Learners must watch videos to completion</div>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
