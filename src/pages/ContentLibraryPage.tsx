import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Play, 
  Eye, 
  Heart,
  MoreVertical,
  Upload,
  Tag,
  Calendar,
  User,
  Loader2,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProcessingStatus } from "@/components/upload/ProcessingStatus";
import { useVideoProcessingJobs } from "@/hooks/use-video-processing";
import type { VideoClip } from "@/types";

type ViewMode = 'grid' | 'list';
type SortOption = 'newest' | 'oldest' | 'title' | 'duration' | 'views' | 'likes';

export function ContentLibraryPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [durationFilter, setDurationFilter] = useState<string>('all');
  const [privacyFilter, setPrivacyFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showProcessingJobs, setShowProcessingJobs] = useState(false);

  // Get processing jobs
  const { jobs: processingJobs } = useVideoProcessingJobs({
    status: 'processing',
    limit: 10
  });

  // Mock data - in real app this would come from API
  const mockClips: VideoClip[] = [
    // Add some processing videos to the mock data
    {
      id: 'processing-1',
      title: 'Advanced Milling Techniques',
      description: 'Advanced milling techniques for complex parts',
      duration: 0, // Will be set after processing
      file_url: '',
      thumbnail_url: '',
      transcript: '',
      tags: ['Milling', 'Advanced', 'Techniques'],
      machine_model: 'CNC-3000',
      process: 'Milling',
      tooling: ['End Mill', 'Ball Mill'],
      step: 'Advanced Techniques',
      privacy_level: 'organization',
      organization_id: 'org-1',
      uploaded_by: 'user-1',
      status: 'processing',
      created_at: '2024-01-16T10:30:00Z',
      updated_at: '2024-01-16T10:30:00Z',
      view_count: 0,
      like_count: 0
    },
    {
      id: 'processing-2',
      title: 'Safety Equipment Overview',
      description: 'Comprehensive overview of safety equipment usage',
      duration: 0,
      file_url: '',
      thumbnail_url: '',
      transcript: '',
      tags: ['Safety', 'Equipment', 'Overview'],
      machine_model: 'CNC-2000',
      process: 'Safety',
      tooling: ['Safety Glasses', 'Gloves'],
      step: 'Equipment Check',
      privacy_level: 'organization',
      organization_id: 'org-1',
      uploaded_by: 'user-2',
      status: 'processing',
      created_at: '2024-01-16T09:15:00Z',
      updated_at: '2024-01-16T09:15:00Z',
      view_count: 0,
      like_count: 0
    },
    {
      id: '1',
      title: 'Machine Setup - Part 1',
      description: 'Step-by-step guide for initial machine setup and calibration',
      duration: 32,
      file_url: '/videos/machine-setup-1.mp4',
      thumbnail_url: 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Machine+Setup',
      transcript: 'First, we need to ensure the machine is properly calibrated...',
      tags: ['Machining', 'Setup', 'Calibration'],
      machine_model: 'CNC-2000',
      process: 'Milling',
      tooling: ['End Mill', 'Vise'],
      step: 'Initial Setup',
      privacy_level: 'organization',
      organization_id: 'org-1',
      uploaded_by: 'user-1',
      status: 'published',
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T10:30:00Z',
      published_at: '2024-01-15T10:30:00Z',
      view_count: 156,
      like_count: 12
    },
    {
      id: '2',
      title: 'Safety Protocol Overview',
      description: 'Essential safety procedures for machine operation',
      duration: 28,
      file_url: '/videos/safety-protocol.mp4',
      thumbnail_url: 'https://via.placeholder.com/300x200/059669/FFFFFF?text=Safety+Protocol',
      transcript: 'Safety is our top priority in all machine operations...',
      tags: ['Safety', 'Protocol', 'Training'],
      machine_model: 'CNC-2000',
      process: 'General',
      tooling: [],
      step: 'Pre-Operation',
      privacy_level: 'organization',
      organization_id: 'org-1',
      uploaded_by: 'user-2',
      status: 'published',
      created_at: '2024-01-14T14:20:00Z',
      updated_at: '2024-01-14T14:20:00Z',
      published_at: '2024-01-14T14:20:00Z',
      view_count: 89,
      like_count: 8
    },
    {
      id: '3',
      title: 'Maintenance Checklist',
      description: 'Daily maintenance procedures to keep machines running smoothly',
      duration: 45,
      file_url: '/videos/maintenance-checklist.mp4',
      thumbnail_url: 'https://via.placeholder.com/300x200/DC2626/FFFFFF?text=Maintenance',
      transcript: 'Regular maintenance is crucial for machine longevity...',
      tags: ['Maintenance', 'Checklist', 'Preventive'],
      machine_model: 'CNC-2000',
      process: 'Maintenance',
      tooling: ['Cleaning Supplies', 'Lubricant'],
      step: 'Daily Maintenance',
      privacy_level: 'organization',
      organization_id: 'org-1',
      uploaded_by: 'user-1',
      status: 'published',
      created_at: '2024-01-13T09:15:00Z',
      updated_at: '2024-01-13T09:15:00Z',
      published_at: '2024-01-13T09:15:00Z',
      view_count: 234,
      like_count: 18
    },
    {
      id: '4',
      title: 'Tool Change Procedure',
      description: 'How to safely change cutting tools during operation',
      duration: 38,
      file_url: '/videos/tool-change.mp4',
      thumbnail_url: 'https://via.placeholder.com/300x200/7C3AED/FFFFFF?text=Tool+Change',
      transcript: 'Tool changes require careful attention to safety...',
      tags: ['Tool Change', 'Safety', 'Procedure'],
      machine_model: 'CNC-2000',
      process: 'Milling',
      tooling: ['End Mill', 'Wrench Set'],
      step: 'Tool Change',
      privacy_level: 'organization',
      organization_id: 'org-1',
      uploaded_by: 'user-3',
      status: 'published',
      created_at: '2024-01-12T16:45:00Z',
      updated_at: '2024-01-12T16:45:00Z',
      published_at: '2024-01-12T16:45:00Z',
      view_count: 167,
      like_count: 14
    },
    {
      id: '5',
      title: 'Quality Control Inspection',
      description: 'Final inspection procedures for finished parts',
      duration: 42,
      file_url: '/videos/quality-control.mp4',
      thumbnail_url: 'https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=Quality+Control',
      transcript: 'Quality control ensures every part meets specifications...',
      tags: ['Quality Control', 'Inspection', 'Measurement'],
      machine_model: 'CNC-2000',
      process: 'Inspection',
      tooling: ['Calipers', 'Micrometer'],
      step: 'Final Inspection',
      privacy_level: 'organization',
      organization_id: 'org-1',
      uploaded_by: 'user-2',
      status: 'published',
      created_at: '2024-01-11T11:30:00Z',
      updated_at: '2024-01-11T11:30:00Z',
      published_at: '2024-01-11T11:30:00Z',
      view_count: 198,
      like_count: 16
    },
    {
      id: '6',
      title: 'Troubleshooting Common Issues',
      description: 'How to identify and resolve common machine problems',
      duration: 55,
      file_url: '/videos/troubleshooting.mp4',
      thumbnail_url: 'https://via.placeholder.com/300x200/EF4444/FFFFFF?text=Troubleshooting',
      transcript: 'When issues arise, systematic troubleshooting is key...',
      tags: ['Troubleshooting', 'Diagnostics', 'Repair'],
      machine_model: 'CNC-2000',
      process: 'Troubleshooting',
      tooling: ['Multimeter', 'Screwdriver Set'],
      step: 'Problem Resolution',
      privacy_level: 'organization',
      organization_id: 'org-1',
      uploaded_by: 'user-1',
      status: 'published',
      created_at: '2024-01-10T13:20:00Z',
      updated_at: '2024-01-10T13:20:00Z',
      published_at: '2024-01-10T13:20:00Z',
      view_count: 145,
      like_count: 11
    }
  ];

  // Get all unique tags for filter
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    mockClips.forEach(clip => {
      clip.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, []);

  // Filter and sort clips
  const filteredClips = useMemo(() => {
    let filtered = mockClips.filter(clip => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = clip.title.toLowerCase().includes(query);
        const matchesDescription = clip.description?.toLowerCase().includes(query) || false;
        const matchesTags = clip.tags.some(tag => tag.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDescription && !matchesTags) return false;
      }

      // Tag filter
      if (selectedTags.length > 0) {
        const hasSelectedTag = selectedTags.some(tag => clip.tags.includes(tag));
        if (!hasSelectedTag) return false;
      }

      // Duration filter
      if (durationFilter !== 'all') {
        const duration = clip.duration;
        switch (durationFilter) {
          case 'short':
            if (duration > 30) return false;
            break;
          case 'medium':
            if (duration <= 30 || duration > 60) return false;
            break;
          case 'long':
            if (duration <= 60) return false;
            break;
        }
      }

      // Privacy filter
      if (privacyFilter !== 'all') {
        if (clip.privacy_level !== privacyFilter) return false;
      }

      return true;
    });

    // Sort clips
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'duration':
          return a.duration - b.duration;
        case 'views':
          return b.view_count - a.view_count;
        case 'likes':
          return b.like_count - a.like_count;
        default:
          return 0;
      }
    });

    return filtered;
  }, [mockClips, searchQuery, selectedTags, durationFilter, privacyFilter, sortBy]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'published':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'draft':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-blue-500';
      case 'published':
        return 'bg-green-500';
      case 'draft':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Content Library</h1>
            <p className="text-muted-foreground mt-1">
              Manage and organize your training videos
            </p>
          </div>
          <div className="flex items-center gap-2">
            {processingJobs.length > 0 && (
              <Button
                variant="outline"
                onClick={() => setShowProcessingJobs(!showProcessingJobs)}
                className="relative"
              >
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing ({processingJobs.length})
                <Badge 
                  variant="secondary" 
                  className="ml-2 bg-blue-500 text-white"
                >
                  {processingJobs.length}
                </Badge>
              </Button>
            )}
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Video
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search videos, descriptions, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(showFilters && "bg-muted")}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Sort by</label>
                    <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="title">Title A-Z</SelectItem>
                        <SelectItem value="duration">Duration</SelectItem>
                        <SelectItem value="views">Most Viewed</SelectItem>
                        <SelectItem value="likes">Most Liked</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Duration</label>
                    <Select value={durationFilter} onValueChange={setDurationFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Durations</SelectItem>
                        <SelectItem value="short">Short (≤30s)</SelectItem>
                        <SelectItem value="medium">Medium (30-60s)</SelectItem>
                        <SelectItem value="long">Long ({'>'}60s)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Privacy</label>
                    <Select value={privacyFilter} onValueChange={setPrivacyFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Privacy Levels</SelectItem>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="organization">Organization</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map(tag => (
                        <Badge
                          key={tag}
                          variant={selectedTags.includes(tag) ? "default" : "outline"}
                          className="cursor-pointer hover:bg-primary/10"
                          onClick={() => handleTagToggle(tag)}
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Processing Jobs Panel */}
        {showProcessingJobs && processingJobs.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Processing Videos</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowProcessingJobs(false)}
                  >
                    Hide
                  </Button>
                </div>
                <div className="space-y-3">
                  {processingJobs.map((job) => (
                    <ProcessingStatus
                      key={job.videoId}
                      videoId={job.videoId}
                      compact={true}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredClips.length} video{filteredClips.length !== 1 ? 's' : ''} found
          </p>
          {(selectedTags.length > 0 || searchQuery || durationFilter !== 'all' || privacyFilter !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedTags([]);
                setDurationFilter('all');
                setPrivacyFilter('all');
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Video Grid/List */}
        {filteredClips.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No videos found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or filters
              </p>
              <Button onClick={() => {
                setSearchQuery('');
                setSelectedTags([]);
                setDurationFilter('all');
                setPrivacyFilter('all');
              }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className={cn(
            "grid gap-6",
            viewMode === 'grid' 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-1"
          )}>
            {filteredClips.map((clip) => (
              <Card key={clip.id} className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
                {viewMode === 'grid' ? (
                  // Grid View
                  <>
                    <div className="relative aspect-video bg-muted">
                      <img
                        src={clip.thumbnail_url}
                        alt={clip.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                        <Button
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 hover:bg-white text-black"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="absolute top-2 right-2">
                        {clip.status === 'processing' ? (
                          <Badge variant="secondary" className="text-xs bg-blue-500 text-white">
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            Processing
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            {formatDuration(clip.duration)}
                          </Badge>
                        )}
                      </div>
                      <div className="absolute top-2 left-2">
                        <Badge 
                          variant={clip.privacy_level === 'public' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {clip.privacy_level}
                        </Badge>
                      </div>
                      <div className="absolute bottom-2 left-2">
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getStatusColor(clip.status)} text-white`}
                        >
                          {getStatusIcon(clip.status)}
                          <span className="ml-1 capitalize">{clip.status}</span>
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                          {clip.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {clip.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {clip.view_count}
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {clip.like_count}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(clip.created_at)}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {clip.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {clip.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{clip.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </>
                ) : (
                  // List View
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-32 h-20 bg-muted rounded-lg flex-shrink-0">
                        <img
                          src={clip.thumbnail_url}
                          alt={clip.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center rounded-lg">
                          <Button
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 hover:bg-white text-black h-8 w-8"
                          >
                            <Play className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="absolute bottom-1 right-1">
                          {clip.status === 'processing' ? (
                            <Badge variant="secondary" className="text-xs bg-blue-500 text-white">
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                              Processing
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              {formatDuration(clip.duration)}
                            </Badge>
                          )}
                        </div>
                        <div className="absolute bottom-1 left-1">
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${getStatusColor(clip.status)} text-white`}
                          >
                            {getStatusIcon(clip.status)}
                            <span className="ml-1 capitalize">{clip.status}</span>
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-1">
                              {clip.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {clip.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                              <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {clip.view_count} views
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                {clip.like_count} likes
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(clip.created_at)}
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {clip.uploaded_by}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {clip.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 ml-4">
                            <Badge 
                              variant={clip.privacy_level === 'public' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {clip.privacy_level}
                            </Badge>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
