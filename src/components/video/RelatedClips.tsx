import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Clock, 
  Eye, 
  TrendingUp,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Video } from '@/api/videos';

interface RelatedClipsProps {
  videos: Video[];
  currentVideoId: string;
  className?: string;
}

export function RelatedClips({ videos, currentVideoId, className }: RelatedClipsProps) {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatViewCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  if (videos.length === 0) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader>
          <CardTitle className="text-lg">Related Videos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No related videos found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <CardTitle className="text-lg">Related Videos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {videos.map((video) => (
            <Link
              key={video.id}
              to={`/videos/${video.id}`}
              className={cn(
                "block group",
                video.id === currentVideoId && "opacity-50 pointer-events-none"
              )}
            >
              <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200">
                {/* Thumbnail */}
                <div className="relative w-20 h-12 bg-muted rounded flex-shrink-0 overflow-hidden">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                    <Play className="h-4 w-4 text-white" />
                  </div>
                  
                  {/* Duration Badge */}
                  <div className="absolute bottom-1 right-1">
                    <Badge variant="secondary" className="text-xs px-1 py-0">
                      {formatTime(video.duration)}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                    {video.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {formatViewCount(video.viewCount)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTime(video.duration)}
                    </div>
                  </div>

                  {/* Tags */}
                  {video.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {video.tags.slice(0, 2).map((tag) => (
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
                  )}

                  {/* Machine Model & Process */}
                  <div className="text-xs text-muted-foreground">
                    {video.machineModel} • {video.process}
                  </div>
                </div>

                {/* External Link Icon */}
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}