import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Trash2, 
  Eye, 
  Save, 
  Play, 
  Clock, 
  BookOpen,
  Video,
  GripVertical,
  Search,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Course, CourseModule, CourseLesson, VideoClip } from "@/types";


export function CourseBuilderPage() {
  const [course, setCourse] = useState<Partial<Course>>({
    title: '',
    description: '',
    status: 'draft',
    visibility: 'organization',
    modules: []
  });
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showVideoLibrary, setShowVideoLibrary] = useState(false);

  // Mock video clips for selection
  const mockVideoClips: VideoClip[] = [
    {
      id: '1',
      title: 'Machine Setup - Part 1',
      duration: 32,
      thumbnail_url: 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Machine+Setup',
      tags: ['Machining', 'Setup'],
      view_count: 156,
      like_count: 12,
      status: 'published',
      privacy_level: 'organization',
      organization_id: 'org-1',
      uploaded_by: 'user-1',
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T10:30:00Z',
      file_url: '/videos/machine-setup-1.mp4',
      transcript: 'Sample transcript...',
      machine_model: 'CNC-2000',
      process: 'Milling',
      tooling: ['End Mill'],
      step: 'Initial Setup'
    },
    {
      id: '2',
      title: 'Safety Protocol Overview',
      duration: 28,
      thumbnail_url: 'https://via.placeholder.com/300x200/059669/FFFFFF?text=Safety+Protocol',
      tags: ['Safety', 'Protocol'],
      view_count: 89,
      like_count: 8,
      status: 'published',
      privacy_level: 'organization',
      organization_id: 'org-1',
      uploaded_by: 'user-2',
      created_at: '2024-01-14T14:20:00Z',
      updated_at: '2024-01-14T14:20:00Z',
      file_url: '/videos/safety-protocol.mp4',
      transcript: 'Sample transcript...',
      machine_model: 'CNC-2000',
      process: 'General',
      tooling: [],
      step: 'Pre-Operation'
    },
    {
      id: '3',
      title: 'Maintenance Checklist',
      duration: 45,
      thumbnail_url: 'https://via.placeholder.com/300x200/DC2626/FFFFFF?text=Maintenance',
      tags: ['Maintenance', 'Checklist'],
      view_count: 234,
      like_count: 18,
      status: 'published',
      privacy_level: 'organization',
      organization_id: 'org-1',
      uploaded_by: 'user-1',
      created_at: '2024-01-13T09:15:00Z',
      updated_at: '2024-01-13T09:15:00Z',
      file_url: '/videos/maintenance-checklist.mp4',
      transcript: 'Sample transcript...',
      machine_model: 'CNC-2000',
      process: 'Maintenance',
      tooling: ['Cleaning Supplies'],
      step: 'Daily Maintenance'
    }
  ];

  const addModule = () => {
    const newModule: CourseModule = {
      id: `module-${Date.now()}`,
      title: 'New Module',
      description: '',
      order: course.modules?.length || 0,
      lessons: []
    };
    setCourse(prev => ({
      ...prev,
      modules: [...(prev.modules || []), newModule]
    }));
    setSelectedModule(newModule.id);
  };

  const updateModule = (moduleId: string, updates: Partial<CourseModule>) => {
    setCourse(prev => ({
      ...prev,
      modules: prev.modules?.map(module => 
        module.id === moduleId ? { ...module, ...updates } : module
      ) || []
    }));
  };

  const deleteModule = (moduleId: string) => {
    setCourse(prev => ({
      ...prev,
      modules: prev.modules?.filter(module => module.id !== moduleId) || []
    }));
    if (selectedModule === moduleId) {
      setSelectedModule(null);
    }
  };

  const addLesson = (moduleId: string, videoClip?: VideoClip) => {
    const module = course.modules?.find(m => m.id === moduleId);
    if (!module) return;

    const newLesson: CourseLesson = {
      id: `lesson-${Date.now()}`,
      title: videoClip?.title || 'New Lesson',
      description: '',
      video_clip_id: videoClip?.id || '',
      video_clip: videoClip,
      order: module.lessons.length,
      duration: videoClip?.duration || 0
    };

    updateModule(moduleId, {
      lessons: [...module.lessons, newLesson]
    });
    setSelectedLesson(newLesson.id);
  };

  const updateLesson = (moduleId: string, lessonId: string, updates: Partial<CourseLesson>) => {
    const module = course.modules?.find(m => m.id === moduleId);
    if (!module) return;
    
    updateModule(moduleId, {
      lessons: module.lessons.map(lesson => 
        lesson.id === lessonId ? { ...lesson, ...updates } : lesson
      )
    });
  };

  const deleteLesson = (moduleId: string, lessonId: string) => {
    const module = course.modules?.find(m => m.id === moduleId);
    if (!module) return;
    
    updateModule(moduleId, {
      lessons: module.lessons.filter(lesson => lesson.id !== lessonId)
    });
    if (selectedLesson === lessonId) {
      setSelectedLesson(null);
    }
  };


  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
  };


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

  const filteredVideoClips = mockVideoClips.filter(clip =>
    clip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    clip.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Course Builder</h1>
            <p className="text-muted-foreground mt-1">
              Create and organize your training courses
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {showPreview ? 'Edit' : 'Preview'}
            </Button>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save Course
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Course Structure Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Course Structure</CardTitle>
                <Button onClick={addModule} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Module
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {course.modules?.map((module) => (
                  <div key={module.id} className="space-y-1">
                    <div
                      className={cn(
                        "p-3 rounded-lg border cursor-pointer transition-colors",
                        selectedModule === module.id ? "border-primary bg-primary/5" : "border-muted hover:bg-muted/50"
                      )}
                      onClick={() => setSelectedModule(module.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-sm">{module.title}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground">
                            {module.lessons.length} lessons
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteModule(module.id);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Module Lessons */}
                    {module.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className={cn(
                          "ml-6 p-2 rounded border cursor-pointer transition-colors",
                          selectedLesson === lesson.id ? "border-primary bg-primary/5" : "border-muted/50 hover:bg-muted/30"
                        )}
                        onClick={() => setSelectedLesson(lesson.id)}
                        draggable
                        onDragStart={handleDragStart}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Play className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs">{lesson.title}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">
                              {formatDuration(lesson.duration)}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteLesson(module.id, lesson.id);
                              }}
                            >
                              <Trash2 className="h-2 w-2" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Add Lesson Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full ml-6 text-xs"
                      onClick={() => setShowVideoLibrary(true)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Lesson
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Course Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Course Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Modules</span>
                  <span className="font-medium">{course.modules?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Lessons</span>
                  <span className="font-medium">{getTotalLessons()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Duration</span>
                  <span className="font-medium">{formatDuration(getTotalDuration())}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {showPreview ? (
              /* Preview Mode */
              <Card>
                <CardHeader>
                  <CardTitle>Course Preview</CardTitle>
                  <CardDescription>
                    How your course will appear to learners
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{course.title || 'Untitled Course'}</h2>
                      <p className="text-muted-foreground">{course.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 border rounded-lg">
                        <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <div className="text-2xl font-bold">{course.modules?.length || 0}</div>
                        <div className="text-sm text-muted-foreground">Modules</div>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <Video className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <div className="text-2xl font-bold">{getTotalLessons()}</div>
                        <div className="text-sm text-muted-foreground">Lessons</div>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <div className="text-2xl font-bold">{formatDuration(getTotalDuration())}</div>
                        <div className="text-sm text-muted-foreground">Duration</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {course.modules?.map((module, moduleIndex) => (
                        <Card key={module.id}>
                          <CardHeader>
                            <CardTitle className="text-lg">
                              Module {moduleIndex + 1}: {module.title}
                            </CardTitle>
                            <CardDescription>{module.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {module.lessons.map((lesson) => (
                                <div key={lesson.id} className="flex items-center gap-3 p-3 border rounded-lg">
                                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Play className="h-4 w-4 text-primary" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-medium">{lesson.title}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {formatDuration(lesson.duration)}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* Edit Mode */
              <div className="space-y-6">
                {/* Course Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Course Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Course Title</label>
                      <Input
                        value={course.title || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCourse(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter course title"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        value={course.description || ''}
                        onChange={(e) => setCourse(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter course description"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Status</label>
                        <Select
                          value={course.status || 'draft'}
                          onValueChange={(value) => setCourse(prev => ({ ...prev, status: value as any }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Visibility</label>
                        <Select
                          value={course.visibility || 'organization'}
                          onValueChange={(value) => setCourse(prev => ({ ...prev, visibility: value as any }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="organization">Organization</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Selected Module/Lesson Editor */}
                {selectedModule && (
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {selectedLesson ? 'Edit Lesson' : 'Edit Module'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedLesson ? (
                        /* Lesson Editor */
                        (() => {
                          const module = course.modules?.find(m => m.id === selectedModule);
                          const lesson = module?.lessons.find(l => l.id === selectedLesson);
                          if (!lesson) return null;

                          return (
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium">Lesson Title</label>
                                <Input
                                  value={lesson.title}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateLesson(selectedModule, selectedLesson, { title: e.target.value })}
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Description</label>
                                <Textarea
                                  value={lesson.description || ''}
                                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateLesson(selectedModule, selectedLesson, { description: e.target.value })}
                                  rows={2}
                                />
                              </div>
                              {lesson.video_clip && (
                                <div className="p-4 border rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={lesson.video_clip.thumbnail_url}
                                      alt={lesson.video_clip.title}
                                      className="w-16 h-12 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                      <div className="font-medium">{lesson.video_clip.title}</div>
                                      <div className="text-sm text-muted-foreground">
                                        {formatDuration(lesson.video_clip.duration)}
                                      </div>
                                    </div>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setShowVideoLibrary(true)}
                                    >
                                      Change Video
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })()
                      ) : (
                        /* Module Editor */
                        (() => {
                          const module = course.modules?.find(m => m.id === selectedModule);
                          if (!module) return null;

                          return (
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium">Module Title</label>
                                <Input
                                  value={module.title}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateModule(selectedModule, { title: e.target.value })}
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Description</label>
                                <Textarea
                                  value={module.description || ''}
                                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateModule(selectedModule, { description: e.target.value })}
                                  rows={3}
                                />
                              </div>
                            </div>
                          );
                        })()
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Video Library Modal */}
        {showVideoLibrary && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Select Video</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowVideoLibrary(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search videos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="max-h-96 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredVideoClips.map(clip => (
                    <div
                      key={clip.id}
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => {
                        if (selectedModule) {
                          addLesson(selectedModule, clip);
                          setShowVideoLibrary(false);
                        }
                      }}
                    >
                      <img
                        src={clip.thumbnail_url}
                        alt={clip.title}
                        className="w-16 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm line-clamp-1">{clip.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatDuration(clip.duration)} • {clip.view_count} views
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {clip.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
