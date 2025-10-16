import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { 
  ChevronLeft,
  Eye,
} from "lucide-react";
import { useVideoPlayer } from "@/hooks/use-video-player";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { VideoMetadata } from "@/components/video/VideoMetadata";
import { VideoActions } from "@/components/video/VideoActions";
import { TranscriptPanel } from "@/components/video/TranscriptPanel";
import { RelatedClips } from "@/components/video/RelatedClips";
import { CommentSystem } from "@/components/video/CommentSystem";
import { videosApi, convertVideoClipToVideo } from "@/api/videos";
import type { VideoClip } from "@/types";

export function VideoPlayerPage() {
  const { id } = useParams<{ id: string }>();
  const [currentTime, setCurrentTime] = useState(0);
  
  // Video player hook
  const { videoRef, state, actions } = useVideoPlayer(id || '');

  // Fetch video data
  const { data: video, isLoading: videoLoading, error: videoError } = useQuery({
    queryKey: ['video', id],
    queryFn: () => videosApi.getById(id!),
    enabled: !!id,
  });

  // Fetch related videos
  const { data: relatedVideos = [] } = useQuery({
    queryKey: ['related-videos', id],
    queryFn: () => videosApi.getRelated(id!),
    enabled: !!id,
  });

  // Mock video data for fallback
  const mockVideo: VideoClip = {
    id: id || '1',
    title: 'Machine Setup - Part 1',
    description: 'Step-by-step guide for initial machine setup and calibration. This comprehensive tutorial covers all the essential steps needed to properly configure your CNC machine for optimal performance.',
    duration: 32,
    file_url: '/videos/machine-setup-1.mp4',
    thumbnail_url: 'https://via.placeholder.com/800x450/4F46E5/FFFFFF?text=Machine+Setup',
    transcript: 'First, we need to ensure the machine is properly calibrated. Start by checking the spindle alignment and verifying that all safety systems are functioning correctly. Next, we\'ll proceed with the workpiece setup and tool installation.',
    tags: ['Machining', 'Setup', 'Calibration', 'CNC', 'Safety'],
    machine_model: 'CNC-2000',
    process: 'Milling',
    tooling: ['End Mill', 'Vise', 'Measuring Tools'],
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
  };

  // Use API data or fallback to mock data
  const currentVideo = video || convertVideoClipToVideo(mockVideo);

  // Update current time for transcript synchronization
  useEffect(() => {
    setCurrentTime(state.currentTime);
  }, [state.currentTime]);

  const handleSeek = (time: number) => {
    actions.seek(time);
  };

  // Loading and error states
  if (videoLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading video...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (videoError || !currentVideo) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-destructive mb-4">Failed to load video</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/library">Library</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{currentVideo.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </nav>

        {/* Back Button and View Count */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/library">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Library
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Eye className="h-4 w-4" />
            {currentVideo.viewCount.toLocaleString()} views
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Player Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <VideoPlayer
              ref={videoRef}
              videoUrl={currentVideo.streamingUrl}
              posterUrl={currentVideo.thumbnailUrl}
              state={state}
              actions={actions}
              onMouseEnter={() => actions.setShowControls(true)}
              onMouseLeave={() => actions.setShowControls(false)}
              onClick={actions.togglePlay}
            />

            {/* Video Metadata */}
            <VideoMetadata video={currentVideo} />

            {/* Video Actions */}
            <VideoActions
              videoId={currentVideo.id}
              isBookmarked={currentVideo.isBookmarked}
              isLiked={currentVideo.isLiked}
              likeCount={currentVideo.likeCount}
              canDownload={currentVideo.permissions.download}
              canShare={currentVideo.permissions.share}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Tabs defaultValue="transcript" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="transcript">Transcript</TabsTrigger>
                <TabsTrigger value="related">Related</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
              </TabsList>

              <TabsContent value="transcript" className="mt-4">
                <TranscriptPanel
                  transcript={currentVideo.transcript || []}
                  currentTime={currentTime}
                  onSeek={handleSeek}
                />
              </TabsContent>

              <TabsContent value="related" className="mt-4">
                <RelatedClips
                  videos={relatedVideos}
                  currentVideoId={currentVideo.id}
                />
              </TabsContent>

              <TabsContent value="comments" className="mt-4">
                <CommentSystem
                  videoId={currentVideo.id}
                  canComment={currentVideo.permissions.comment}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
