import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Bookmark, 
  Share2, 
  Download, 
  Flag,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { videosApi } from '@/api/videos';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface VideoActionsProps {
  videoId: string;
  isBookmarked: boolean;
  isLiked: boolean;
  likeCount: number;
  canDownload: boolean;
  canShare: boolean;
  className?: string;
}

export function VideoActions({ 
  videoId, 
  isBookmarked, 
  isLiked, 
  likeCount,
  canDownload, 
  canShare, 
  className 
}: VideoActionsProps) {
  const [localIsLiked, setLocalIsLiked] = useState(isLiked);
  const [localIsBookmarked, setLocalIsBookmarked] = useState(isBookmarked);
  const [localLikeCount, setLocalLikeCount] = useState(likeCount);
  
  const queryClient = useQueryClient();

  // Like/Unlike mutation
  const likeMutation = useMutation({
    mutationFn: () => localIsLiked ? videosApi.unlike(videoId) : videosApi.like(videoId),
    onMutate: () => {
      setLocalIsLiked(!localIsLiked);
      setLocalLikeCount(prev => prev + (localIsLiked ? -1 : 1));
    },
    onError: () => {
      // Revert on error
      setLocalIsLiked(isLiked);
      setLocalLikeCount(likeCount);
      toast.error('Failed to update like status');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['video', videoId] });
    },
  });

  // Bookmark mutation
  const bookmarkMutation = useMutation({
    mutationFn: () => localIsBookmarked ? videosApi.unbookmark(videoId) : videosApi.bookmark(videoId),
    onMutate: () => {
      setLocalIsBookmarked(!localIsBookmarked);
    },
    onError: () => {
      setLocalIsBookmarked(isBookmarked);
      toast.error('Failed to update bookmark status');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['video', videoId] });
      toast.success(localIsBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
    },
  });

  // Share mutation
  const shareMutation = useMutation({
    mutationFn: () => videosApi.share(videoId, 'link'),
    onSuccess: (data) => {
      navigator.clipboard.writeText(data.url);
      toast.success('Link copied to clipboard');
    },
    onError: () => {
      toast.error('Failed to generate share link');
    },
  });

  // Download mutation
  const downloadMutation = useMutation({
    mutationFn: () => videosApi.getDownloadUrl(videoId),
    onSuccess: (data) => {
      const link = document.createElement('a');
      link.href = data.downloadUrl;
      link.download = '';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Download started');
    },
    onError: () => {
      toast.error('Failed to start download');
    },
  });

  // Report mutation
  const reportMutation = useMutation({
    mutationFn: (reason: string) => videosApi.report(videoId, reason),
    onSuccess: () => {
      toast.success('Video reported successfully');
    },
    onError: () => {
      toast.error('Failed to report video');
    },
  });

  const handleLike = () => {
    likeMutation.mutate();
  };

  const handleBookmark = () => {
    bookmarkMutation.mutate();
  };

  const handleShare = () => {
    shareMutation.mutate();
  };

  const handleDownload = () => {
    downloadMutation.mutate();
  };

  const handleReport = (reason: string) => {
    reportMutation.mutate(reason);
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Like Button */}
      <Button
        variant={localIsLiked ? "default" : "outline"}
        size="sm"
        onClick={handleLike}
        disabled={likeMutation.isPending}
        className={cn(
          "transition-all duration-200",
          localIsLiked && "bg-red-500 hover:bg-red-600 text-white"
        )}
      >
        <Heart className={cn("h-4 w-4 mr-2", localIsLiked && "fill-current")} />
        {localLikeCount}
      </Button>

      {/* Bookmark Button */}
      <Button
        variant={localIsBookmarked ? "default" : "outline"}
        size="sm"
        onClick={handleBookmark}
        disabled={bookmarkMutation.isPending}
        className={cn(
          "transition-all duration-200",
          localIsBookmarked && "bg-blue-500 hover:bg-blue-600 text-white"
        )}
      >
        <Bookmark className={cn("h-4 w-4 mr-2", localIsBookmarked && "fill-current")} />
        {localIsBookmarked ? "Saved" : "Save"}
      </Button>

      {/* Share Button */}
      {canShare && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          disabled={shareMutation.isPending}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      )}

      {/* Download Button */}
      {canDownload && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          disabled={downloadMutation.isPending}
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      )}

      {/* More Actions Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => handleReport('inappropriate')}>
            <Flag className="h-4 w-4 mr-2" />
            Report Inappropriate Content
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleReport('spam')}>
            <Flag className="h-4 w-4 mr-2" />
            Report Spam
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleReport('copyright')}>
            <Flag className="h-4 w-4 mr-2" />
            Report Copyright Issue
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}