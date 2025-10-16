import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LazyVideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
}

export function LazyVideoPlayer({ 
  src, 
  poster, 
  className = "",
  autoPlay = false,
  muted = true,
  loop = true
}: LazyVideoPlayerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [isInView, setIsInView] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoLoad = () => {
    setIsLoaded(true);
    if (autoPlay && videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div ref={containerRef} className={`relative group ${className}`}>
      {isInView ? (
        <div className="relative aspect-video bg-gradient-to-br from-muted/20 to-muted/40 rounded-2xl border-2 border-dashed border-muted-foreground/20 overflow-hidden">
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            className="w-full h-full object-cover"
            muted={isMuted}
            loop={loop}
            onLoadedData={handleVideoLoad}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
          
          {/* Video Controls Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="flex items-center space-x-4">
              <Button
                onClick={handlePlayPause}
                size="lg"
                className="w-16 h-16 rounded-full bg-white/90 hover:bg-white text-black shadow-lg"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-1" />
                )}
              </Button>
              
              <Button
                onClick={handleMuteToggle}
                size="lg"
                variant="outline"
                className="w-12 h-12 rounded-full bg-white/90 hover:bg-white text-black border-white/50"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
          
          {/* Loading State */}
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Play className="w-10 h-10 text-primary" />
                </div>
                <p className="text-lg font-medium text-muted-foreground">
                  Loading Video...
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="aspect-video bg-gradient-to-br from-muted/20 to-muted/40 rounded-2xl border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="w-10 h-10 text-primary" />
            </div>
            <p className="text-lg font-medium text-muted-foreground">
              Watch Sample Training Reel
            </p>
            <p className="text-sm text-muted-foreground/70 mt-2">
              Auto-play, muted, 15-20 seconds
            </p>
          </div>
        </div>
      )}
    </div>
  );
}