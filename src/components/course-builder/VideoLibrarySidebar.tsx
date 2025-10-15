import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  X, 
  Play, 
  Eye, 
  ThumbsUp,
  Grid3X3,
  List,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { clipsApi } from '@/lib/api';
import type { VideoClip } from '@/types';

interface VideoLibrarySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVideo: (video: VideoClip) => void;
}

export function VideoLibrarySidebar({ isOpen, onClose, onSelectVideo }: VideoLibrarySidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Fetch video clips
  const { data: videoClips = [], isLoading } = useQuery({
    queryKey: ['video-clips', searchQuery, selectedTags],
    queryFn: async () => {
      const result = await clipsApi.getAll({
        search: searchQuery,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
      });
      return result as VideoClip[];
    },
  });

  // Get unique tags from all videos
  const allTags = Array.from(
    new Set(videoClips.flatMap((video: VideoClip) => video.tags))
  ).sort();

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
  };

  if (!isOpen) {
    return (
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Play className="h-5 w-5" />
            Video Library
          </CardTitle>
          <CardDescription>
            Select videos to add to your course
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => {/* This would open the sidebar */}}
            className="w-full"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            Browse Videos
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Play className="h-5 w-5" />
            Video Library
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8 w-8 p-0"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            
            {(searchQuery || selectedTags.length > 0) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs"
              >
                Clear filters
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      {/* Tags Filter */}
      {allTags.length > 0 && (
        <div className="px-6 pb-3">
          <div className="flex flex-wrap gap-2">
            {allTags.slice(0, 8).map((tag: string) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                className={cn(
                  "cursor-pointer text-xs",
                  selectedTags.includes(tag) 
                    ? "bg-blue-500 hover:bg-blue-600" 
                    : "hover:bg-slate-100"
                )}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
            {allTags.length > 8 && (
              <Badge variant="outline" className="text-xs">
                +{allTags.length - 8} more
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Video List */}
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full px-6">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex gap-3 p-3">
                    <div className="w-16 h-12 bg-slate-200 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : videoClips.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <Play className="h-8 w-8 text-slate-400 mb-2" />
              <p className="text-sm text-slate-600">No videos found</p>
              <p className="text-xs text-slate-500">
                {searchQuery || selectedTags.length > 0 
                  ? 'Try adjusting your filters' 
                  : 'Upload some videos to get started'
                }
              </p>
            </div>
          ) : (
            <div className={cn(
              "space-y-3",
              viewMode === 'grid' && "grid grid-cols-1 gap-3"
            )}>
              {videoClips.map((video: VideoClip) => (
                <div
                  key={video.id}
                  className={cn(
                    "group cursor-pointer transition-all duration-200 hover:shadow-md",
                    viewMode === 'grid' 
                      ? "p-3 border rounded-lg hover:border-blue-300" 
                      : "flex gap-3 p-3 border rounded-lg hover:border-blue-300"
                  )}
                  onClick={() => onSelectVideo(video)}
                >
                  {/* Thumbnail */}
                  <div className={cn(
                    "relative overflow-hidden rounded bg-slate-100",
                    viewMode === 'grid' ? "w-full h-24" : "w-16 h-12 flex-shrink-0"
                  )}>
                    {video.thumbnail_url ? (
                      <img
                        src={video.thumbnail_url}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Play className="h-6 w-6 text-slate-400" />
                      </div>
                    )}
                    <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                      {formatDuration(video.duration)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className={cn(
                    "flex-1 min-w-0",
                    viewMode === 'grid' && "mt-2"
                  )}>
                    <h4 className="font-medium text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {video.title}
                    </h4>
                    
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {video.view_count}
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        {video.like_count}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {video.tags.slice(0, 2).map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {video.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{video.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
