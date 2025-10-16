import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Play, 
  Eye, 
  Heart, 
  Calendar, 
  User, 
  MoreVertical, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { VideoClip } from "@/types";

interface SearchResultsProps {
  videos: VideoClip[];
  viewMode: "grid" | "list";
  selectedVideos: string[];
  onSelectionChange: (selected: string[]) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
  error?: Error | null;
  searchTime?: number;
  onVideoClick?: (video: VideoClip) => void;
  onVideoAction?: (video: VideoClip, action: string) => void;
}

export function SearchResults({
  videos,
  viewMode,
  selectedVideos,
  onSelectionChange,
  onLoadMore,
  hasMore = false,
  isLoading = false,
  error = null,
  searchTime = 0,
  onVideoClick,
  onVideoAction,
}: SearchResultsProps) {
  const [showAllTags, setShowAllTags] = useState<Record<string, boolean>>({});

  const toggleVideoSelection = useCallback((videoId: string) => {
    if (selectedVideos.includes(videoId)) {
      onSelectionChange(selectedVideos.filter(id => id !== videoId));
    } else {
      onSelectionChange([...selectedVideos, videoId]);
    }
  }, [selectedVideos, onSelectionChange]);

  const selectAllVideos = useCallback(() => {
    if (selectedVideos.length === videos.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(videos.map(video => video.id));
    }
  }, [selectedVideos, videos, onSelectionChange]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processing":
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case "published":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "draft":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processing":
        return "bg-blue-500";
      case "published":
        return "bg-green-500";
      case "draft":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const toggleShowAllTags = (videoId: string) => {
    setShowAllTags(prev => ({
      ...prev,
      [videoId]: !prev[videoId]
    }));
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-semibold mb-2">Search Error</h3>
        <p className="text-muted-foreground mb-4">{error.message}</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  if (isLoading && videos.length === 0) {
    return (
      <div className={cn(
        "grid gap-6",
        viewMode === "grid" 
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
          : "grid-cols-1"
      )}>
        {Array.from({ length: 12 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <Skeleton className="aspect-video w-full" />
            <CardContent className="p-4 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-20 h-20 bg-gradient-to-br from-muted/50 to-muted/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <Play className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-3">No videos found</h3>
        <p className="text-muted-foreground mb-6 text-center max-w-md">
          Try adjusting your search criteria or filters to find what you are looking for.
        </p>
        <Button variant="outline">
          Clear all filters
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={selectedVideos.length === videos.length && videos.length > 0}
              onCheckedChange={() => selectAllVideos()}
              disabled={videos.length === 0}
            />
            <span className="text-sm text-muted-foreground">
              {selectedVideos.length > 0 
                ? `${selectedVideos.length} of ${videos.length} selected`
                : `${videos.length} video${videos.length !== 1 ? "s" : ""} found`
              }
            </span>
          </div>
          {searchTime > 0 && (
            <Badge variant="outline" className="text-xs">
              {searchTime}ms
            </Badge>
          )}
        </div>
      </div>

      {/* Video Grid/List */}
      <div className={cn(
        "grid gap-6",
        viewMode === "grid" 
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
          : "grid-cols-1"
      )}>
        {videos.map((video, index) => (
          <Card 
            key={video.id} 
            className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {viewMode === "grid" ? (
              // Grid View
              <>
                <div className="relative aspect-video bg-gradient-to-br from-muted/50 to-muted/30 overflow-hidden">
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                    <Button
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/95 hover:bg-white text-black shadow-lg hover:shadow-xl transform hover:scale-110"
                      onClick={() => onVideoClick?.(video)}
                    >
                      <Play className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Checkbox
                      checked={selectedVideos.includes(video.id)}
                      onCheckedChange={() => toggleVideoSelection(video.id)}
                      className="bg-white/90 border-white"
                    />
                  </div>
                  <div className="absolute top-3 left-3">
                    {video.status === "processing" ? (
                      <Badge variant="secondary" className="text-xs bg-blue-500 text-white shadow-lg">
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Processing
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs shadow-lg">
                        {formatDuration(video.duration)}
                      </Badge>
                    )}
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <Badge 
                      variant={video.privacy_level === "public" ? "default" : "secondary"}
                      className="text-xs shadow-lg"
                    >
                      {video.privacy_level}
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getStatusColor(video.status)} text-white shadow-lg`}
                    >
                      {getStatusIcon(video.status)}
                      <span className="ml-1 capitalize">{video.status}</span>
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-5">
                  <div className="space-y-3">
                    <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors duration-300 text-base">
                      {video.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 group-hover:text-foreground/80 transition-colors duration-300">
                      {video.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1 group-hover:text-primary transition-colors duration-300">
                        <Eye className="h-3 w-3" />
                        {video.view_count}
                      </div>
                      <div className="flex items-center gap-1 group-hover:text-primary transition-colors duration-300">
                        <Heart className="h-3 w-3" />
                        {video.like_count}
                      </div>
                      <div className="flex items-center gap-1 group-hover:text-primary transition-colors duration-300">
                        <Calendar className="h-3 w-3" />
                        {formatDate(video.created_at)}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {(showAllTags[video.id] ? video.tags : video.tags.slice(0, 3)).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs group-hover:bg-primary/10 group-hover:border-primary/50 transition-colors duration-300">
                          {tag}
                        </Badge>
                      ))}
                      {video.tags.length > 3 && !showAllTags[video.id] && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-6 px-2"
                          onClick={() => toggleShowAllTags(video.id)}
                        >
                          +{video.tags.length - 3}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              // List View
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="relative w-36 h-24 bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl flex-shrink-0 overflow-hidden">
                    <img
                      src={video.thumbnail_url}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center rounded-xl">
                      <Button
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/95 hover:bg-white text-black h-8 w-8 shadow-lg hover:shadow-xl transform hover:scale-110"
                        onClick={() => onVideoClick?.(video)}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Checkbox
                        checked={selectedVideos.includes(video.id)}
                        onCheckedChange={() => toggleVideoSelection(video.id)}
                        className="bg-white/90 border-white"
                      />
                    </div>
                    <div className="absolute bottom-2 right-2">
                      {video.status === "processing" ? (
                        <Badge variant="secondary" className="text-xs bg-blue-500 text-white shadow-lg">
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Processing
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs shadow-lg">
                          {formatDuration(video.duration)}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold group-hover:text-primary transition-colors duration-300 line-clamp-1 text-base">
                          {video.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1 group-hover:text-foreground/80 transition-colors duration-300">
                          {video.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
                          <div className="flex items-center gap-1 group-hover:text-primary transition-colors duration-300">
                            <Eye className="h-3 w-3" />
                            {video.view_count} views
                          </div>
                          <div className="flex items-center gap-1 group-hover:text-primary transition-colors duration-300">
                            <Heart className="h-3 w-3" />
                            {video.like_count} likes
                          </div>
                          <div className="flex items-center gap-1 group-hover:text-primary transition-colors duration-300">
                            <Calendar className="h-3 w-3" />
                            {formatDate(video.created_at)}
                          </div>
                          <div className="flex items-center gap-1 group-hover:text-primary transition-colors duration-300">
                            <User className="h-3 w-3" />
                            {video.uploaded_by}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {(showAllTags[video.id] ? video.tags : video.tags.slice(0, 5)).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs group-hover:bg-primary/10 group-hover:border-primary/50 transition-colors duration-300">
                              {tag}
                            </Badge>
                          ))}
                          {video.tags.length > 5 && !showAllTags[video.id] && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs h-6 px-2"
                              onClick={() => toggleShowAllTags(video.id)}
                            >
                              +{video.tags.length - 5}
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Badge 
                          variant={video.privacy_level === "public" ? "default" : "secondary"}
                          className="text-xs shadow-lg"
                        >
                          {video.privacy_level}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-all duration-200"
                          onClick={() => onVideoAction?.(video, "more")}
                        >
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

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center pt-6">
          <Button
            onClick={onLoadMore}
            disabled={isLoading}
            variant="outline"
            className="px-8"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-2" />
                Load More
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
