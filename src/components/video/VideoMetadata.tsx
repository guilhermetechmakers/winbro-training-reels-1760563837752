import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Eye, 
  Clock, 
  Calendar, 
  User, 
  Tag, 
  Cog,
  Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Video } from '@/api/videos';

interface VideoMetadataProps {
  video: Video;
  className?: string;
}

export function VideoMetadata({ video, className }: VideoMetadataProps) {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6 space-y-4">
        {/* Title and Basic Info */}
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-foreground line-clamp-2">
            {video.title}
          </h1>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {video.viewCount.toLocaleString()} views
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatTime(video.duration)}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(video.createdAt)}
            </div>
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {video.createdBy.full_name || video.createdBy.email}
            </div>
          </div>
        </div>

        {/* Description */}
        {video.description && (
          <p className="text-muted-foreground leading-relaxed">
            {video.description}
          </p>
        )}

        {/* Tags */}
        {video.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {video.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Technical Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                Machine Model
              </label>
              <p className="text-sm font-medium">{video.machineModel}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Cog className="h-4 w-4" />
                Process
              </label>
              <p className="text-sm font-medium">{video.process}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Privacy Level
              </label>
              <div className="mt-1">
                <Badge 
                  variant={video.permissions.download ? "default" : "secondary"}
                  className="text-xs"
                >
                  {video.permissions.download ? "Public" : "Private"}
                </Badge>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Permissions
              </label>
              <div className="flex flex-wrap gap-1 mt-1">
                {video.permissions.download && (
                  <Badge variant="outline" className="text-xs">Download</Badge>
                )}
                {video.permissions.share && (
                  <Badge variant="outline" className="text-xs">Share</Badge>
                )}
                {video.permissions.comment && (
                  <Badge variant="outline" className="text-xs">Comment</Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}