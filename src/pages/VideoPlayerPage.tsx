import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  SkipBack, 
  SkipForward,
  Download,
  Share2,
  Heart,
  Bookmark,
  Clock,
  Eye,
  User,
  Calendar,
  Tag,
  ChevronLeft,
  RotateCcw,
  RotateCw,
  PlayCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { VideoClip } from "@/types";

export function VideoPlayerPage() {
  const { id } = useParams<{ id: string }>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [activeTranscriptSegment, setActiveTranscriptSegment] = useState<number | null>(null);
  const [showTranscript, setShowTranscript] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Mock video data - in real app this would come from API
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

  const transcriptSegments = [
    { start: 0, end: 8, text: "First, we need to ensure the machine is properly calibrated." },
    { start: 8, end: 15, text: "Start by checking the spindle alignment and verifying that all safety systems are functioning correctly." },
    { start: 15, end: 22, text: "Next, we'll proceed with the workpiece setup and tool installation." },
    { start: 22, end: 32, text: "Finally, perform a test run to ensure everything is working as expected." }
  ];

  const relatedVideos = [
    {
      id: '2',
      title: 'Machine Setup - Part 2',
      duration: 28,
      thumbnail_url: 'https://via.placeholder.com/300x200/059669/FFFFFF?text=Setup+Part+2',
      views: 89
    },
    {
      id: '3',
      title: 'Safety Protocol Overview',
      duration: 45,
      thumbnail_url: 'https://via.placeholder.com/300x200/DC2626/FFFFFF?text=Safety+Protocol',
      views: 234
    },
    {
      id: '4',
      title: 'Tool Change Procedure',
      duration: 38,
      thumbnail_url: 'https://via.placeholder.com/300x200/7C3AED/FFFFFF?text=Tool+Change',
      views: 167
    }
  ];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    // Update active transcript segment based on current time
    const segment = transcriptSegments.find(
      seg => currentTime >= seg.start && currentTime < seg.end
    );
    if (segment) {
      const index = transcriptSegments.indexOf(segment);
      setActiveTranscriptSegment(index);
    } else {
      setActiveTranscriptSegment(null);
    }
  }, [currentTime]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const time = parseFloat(e.target.value);
    video.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const changePlaybackRate = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const skipTime = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + seconds));
  };

  const seekToTranscriptSegment = (segmentIndex: number) => {
    const video = videoRef.current;
    if (!video) return;

    const segment = transcriptSegments[segmentIndex];
    video.currentTime = segment.start;
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!isFullscreen) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Back Button */}
        <div className="flex items-center gap-4">
          <Link to="/library">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Library
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Eye className="h-4 w-4" />
            {mockVideo.view_count} views
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Player */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Container */}
            <Card className="overflow-hidden">
              <div className="relative aspect-video bg-black group">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  poster={mockVideo.thumbnail_url}
                  onMouseEnter={() => setShowControls(true)}
                  onMouseLeave={() => setShowControls(false)}
                  onClick={togglePlay}
                >
                  <source src={mockVideo.file_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                {/* Play Button Overlay */}
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      size="lg"
                      className="h-16 w-16 rounded-full bg-white/90 hover:bg-white text-black"
                      onClick={togglePlay}
                    >
                      <Play className="h-8 w-8" />
                    </Button>
                  </div>
                )}

                {/* Video Controls */}
                <div className={cn(
                  "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300",
                  showControls ? "opacity-100" : "opacity-0"
                )}>
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={togglePlay}
                        className="text-white hover:bg-white/20"
                      >
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => skipTime(-10)}
                        className="text-white hover:bg-white/20"
                      >
                        <SkipBack className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => skipTime(10)}
                        className="text-white hover:bg-white/20"
                      >
                        <SkipForward className="h-4 w-4" />
                      </Button>

                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={toggleMute}
                          className="text-white hover:bg-white/20"
                        >
                          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        </Button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={isMuted ? 0 : volume}
                          onChange={handleVolumeChange}
                          className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer slider"
                        />
                      </div>

                      <div className="text-white text-sm ml-4">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => changePlaybackRate(0.5)}
                          className={cn("text-white hover:bg-white/20", playbackRate === 0.5 && "bg-white/20")}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => changePlaybackRate(1)}
                          className={cn("text-white hover:bg-white/20", playbackRate === 1 && "bg-white/20")}
                        >
                          <PlayCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => changePlaybackRate(1.5)}
                          className={cn("text-white hover:bg-white/20", playbackRate === 1.5 && "bg-white/20")}
                        >
                          <RotateCw className="h-4 w-4" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleFullscreen}
                        className="text-white hover:bg-white/20"
                      >
                        {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Video Info */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h1 className="text-2xl font-bold mb-2">{mockVideo.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {mockVideo.view_count} views
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatTime(mockVideo.duration)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(mockVideo.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {mockVideo.uploaded_by}
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground">{mockVideo.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {mockVideo.tags.map(tag => (
                      <Badge key={tag} variant="outline">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-4">
                    <Button
                      variant={isLiked ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIsLiked(!isLiked)}
                    >
                      <Heart className={cn("h-4 w-4 mr-2", isLiked && "fill-current")} />
                      {isLiked ? mockVideo.like_count + 1 : mockVideo.like_count}
                    </Button>
                    <Button
                      variant={isBookmarked ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIsBookmarked(!isBookmarked)}
                    >
                      <Bookmark className={cn("h-4 w-4 mr-2", isBookmarked && "fill-current")} />
                      {isBookmarked ? "Saved" : "Save"}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transcript */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Transcript</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowTranscript(!showTranscript)}
                  >
                    {showTranscript ? "Hide" : "Show"} Transcript
                  </Button>
                </div>
              </CardHeader>
              {showTranscript && (
                <CardContent>
                  <div className="space-y-2">
                    {transcriptSegments.map((segment, index) => (
                      <div
                        key={index}
                        className={cn(
                          "p-3 rounded-lg cursor-pointer transition-colors",
                          activeTranscriptSegment === index
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        )}
                        onClick={() => seekToTranscriptSegment(index)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-sm font-mono text-muted-foreground">
                            {formatTime(segment.start)}
                          </div>
                          <div className="flex-1 text-sm">
                            {segment.text}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Video Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Video Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Machine Model</label>
                  <p className="text-sm">{mockVideo.machine_model}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Process</label>
                  <p className="text-sm">{mockVideo.process}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Step</label>
                  <p className="text-sm">{mockVideo.step}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tooling</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {mockVideo.tooling?.map(tool => (
                      <Badge key={tool} variant="secondary" className="text-xs">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Privacy</label>
                  <Badge 
                    variant={mockVideo.privacy_level === 'public' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {mockVideo.privacy_level}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Related Videos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related Videos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {relatedVideos.map(video => (
                    <Link key={video.id} to={`/clip/${video.id}`}>
                      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors">
                        <div className="relative w-20 h-12 bg-muted rounded flex-shrink-0">
                          <img
                            src={video.thumbnail_url}
                            alt={video.title}
                            className="w-full h-full object-cover rounded"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Play className="h-4 w-4 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-2">{video.title}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(video.duration)}
                            <Eye className="h-3 w-3 ml-2" />
                            {video.views} views
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
