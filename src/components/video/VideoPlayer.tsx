import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { VideoControls } from './VideoControls';
import { VideoLoadingOverlay } from './VideoLoadingOverlay';
import { VideoErrorOverlay } from './VideoErrorOverlay';
import { VideoPlayButton } from './VideoPlayButton';
import type { VideoPlayerState, VideoPlayerActions } from '@/hooks/use-video-player';

interface VideoPlayerProps {
  videoUrl: string;
  posterUrl?: string;
  state: VideoPlayerState;
  actions: VideoPlayerActions;
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
}

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
  ({ videoUrl, posterUrl, state, actions, className, onMouseEnter, onMouseLeave, onClick }, ref) => {
    return (
      <div 
        className={cn(
          "relative bg-black rounded-lg overflow-hidden group",
          "hover:shadow-2xl transition-shadow duration-300",
          className
        )}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      >
        {/* Video Element */}
        <video
          ref={ref}
          className="w-full aspect-video object-cover"
          poster={posterUrl}
          preload="metadata"
          playsInline
          webkit-playsinline="true"
        >
          <source src={videoUrl} type="video/mp4" />
          <source src={videoUrl} type="video/webm" />
          Your browser does not support the video tag.
        </video>

        {/* Loading Overlay */}
        {state.isLoading && (
          <VideoLoadingOverlay />
        )}

        {/* Error Overlay */}
        {state.error && (
          <VideoErrorOverlay 
            error={state.error}
            onRetry={() => window.location.reload()}
          />
        )}

        {/* Play Button Overlay */}
        {!state.isPlaying && !state.isLoading && !state.error && (
          <VideoPlayButton 
            onClick={actions.togglePlay}
            size="large"
          />
        )}

        {/* Video Controls */}
        <VideoControls
          state={state}
          actions={actions}
          className={cn(
            "absolute bottom-0 left-0 right-0",
            "bg-gradient-to-t from-black/80 via-black/40 to-transparent",
            "p-4 transition-opacity duration-300",
            state.showControls ? "opacity-100" : "opacity-0"
          )}
        />
      </div>
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer';