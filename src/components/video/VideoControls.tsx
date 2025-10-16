import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  SkipBack, 
  SkipForward,
  Settings,
  RotateCcw,
  RotateCw,
  PlayCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { VideoQualitySelector } from './VideoQualitySelector';
import { VideoSpeedSelector } from './VideoSpeedSelector';
import type { VideoPlayerState, VideoPlayerActions } from '@/hooks/use-video-player';

interface VideoControlsProps {
  state: VideoPlayerState;
  actions: VideoPlayerActions;
  className?: string;
}

export function VideoControls({ state, actions, className }: VideoControlsProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (value: number[]) => {
    actions.seek(value[0]);
  };

  // Volume change is handled by the slider directly

  const speedOptions = [
    { value: 0.5, label: '0.5x', icon: RotateCcw },
    { value: 1, label: '1x', icon: PlayCircle },
    { value: 1.25, label: '1.25x', icon: RotateCw },
    { value: 1.5, label: '1.5x', icon: RotateCw },
    { value: 2, label: '2x', icon: RotateCw },
  ];

  return (
    <div className={cn("space-y-3", className)}>
      {/* Progress Bar */}
      <div className="relative">
        <Slider
          value={[state.currentTime]}
          max={state.duration || 0}
          step={0.1}
          onValueChange={handleSeek}
          className="w-full h-1 cursor-pointer"
        />
        {/* Buffered progress */}
        <div 
          className="absolute top-0 left-0 h-1 bg-white/30 rounded-full pointer-events-none"
          style={{ width: `${(state.buffered / state.duration) * 100}%` }}
        />
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Play/Pause */}
          <Button
            variant="ghost"
            size="icon"
            onClick={actions.togglePlay}
            className="text-white hover:bg-white/20 h-8 w-8"
          >
            {state.isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>

          {/* Skip Backward */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => actions.skip(-10)}
            className="text-white hover:bg-white/20 h-8 w-8"
          >
            <SkipBack className="h-4 w-4" />
          </Button>

          {/* Skip Forward */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => actions.skip(10)}
            className="text-white hover:bg-white/20 h-8 w-8"
          >
            <SkipForward className="h-4 w-4" />
          </Button>

          {/* Volume Control */}
          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={actions.toggleMute}
              className="text-white hover:bg-white/20 h-8 w-8"
            >
              {state.isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <div className="w-20">
              <Slider
                value={[state.isMuted ? 0 : state.volume]}
                max={1}
                step={0.1}
                onValueChange={(value) => actions.setVolume(value[0])}
                className="h-1"
              />
            </div>
          </div>

          {/* Time Display */}
          <div className="text-white text-sm ml-4 font-mono">
            {formatTime(state.currentTime)} / {formatTime(state.duration)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Speed Control */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              className="text-white hover:bg-white/20 h-8 px-2"
            >
              {state.playbackRate}x
            </Button>
            {showSpeedMenu && (
              <VideoSpeedSelector
                currentSpeed={state.playbackRate}
                onSpeedChange={actions.setPlaybackRate}
                onClose={() => setShowSpeedMenu(false)}
                speedOptions={speedOptions}
              />
            )}
          </div>

          {/* Quality Control */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowQualityMenu(!showQualityMenu)}
              className="text-white hover:bg-white/20 h-8 px-2"
            >
              Auto
            </Button>
            {showQualityMenu && (
              <VideoQualitySelector
                currentQuality="auto"
                onQualityChange={(quality) => {
                  console.log('Quality changed to:', quality);
                  setShowQualityMenu(false);
                }}
                onClose={() => setShowQualityMenu(false)}
              />
            )}
          </div>

          {/* Settings */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(!showSettings)}
            className="text-white hover:bg-white/20 h-8 w-8"
          >
            <Settings className="h-4 w-4" />
          </Button>

          {/* Fullscreen */}
          <Button
            variant="ghost"
            size="icon"
            onClick={actions.toggleFullscreen}
            className="text-white hover:bg-white/20 h-8 w-8"
          >
            {state.isFullscreen ? (
              <Minimize className="h-4 w-4" />
            ) : (
              <Maximize className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}