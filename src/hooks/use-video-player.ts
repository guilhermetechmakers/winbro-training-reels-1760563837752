import { useState, useRef, useCallback, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { videosApi } from '@/api/videos';

export interface VideoPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  isMuted: boolean;
  isFullscreen: boolean;
  showControls: boolean;
  buffered: number;
  isLoading: boolean;
  error: string | null;
}

export interface VideoPlayerActions {
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  toggleMute: () => void;
  toggleFullscreen: () => void;
  skip: (seconds: number) => void;
  setShowControls: (show: boolean) => void;
}

export function useVideoPlayer(videoId: string) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<VideoPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    playbackRate: 1,
    isMuted: false,
    isFullscreen: false,
    showControls: true,
    buffered: 0,
    isLoading: false,
    error: null,
  });

  // Update progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: ({ videoId, currentTime, duration }: { videoId: string; currentTime: number; duration: number }) =>
      videosApi.updateProgress(videoId, currentTime, duration),
    onError: (error) => {
      console.error('Failed to update video progress:', error);
    },
  });

  // Throttled progress update
  const throttledUpdateProgress = useCallback(
    (() => {
      let timeoutId: number;
      return (currentTime: number, duration: number) => {
        clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
          updateProgressMutation.mutate({ videoId, currentTime, duration });
        }, 1000); // Update every second
      };
    })(),
    [videoId, updateProgressMutation]
  );

  // Video event handlers
  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    setState(prev => ({
      ...prev,
      duration: video.duration,
      isLoading: false,
    }));
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const currentTime = video.currentTime;
    const duration = video.duration;
    const buffered = video.buffered.length > 0 ? video.buffered.end(video.buffered.length - 1) : 0;

    setState(prev => ({
      ...prev,
      currentTime,
      buffered,
    }));

    // Update progress on server
    throttledUpdateProgress(currentTime, duration);
  }, [throttledUpdateProgress]);

  const handlePlay = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: true }));
  }, []);

  const handlePause = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const handleEnded = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const handleError = useCallback((error: Event) => {
    console.error('Video error:', error);
    setState(prev => ({
      ...prev,
      error: 'Failed to load video',
      isLoading: false,
    }));
  }, []);

  const handleLoadStart = useCallback(() => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
  }, []);

  const handleCanPlay = useCallback(() => {
    setState(prev => ({ ...prev, isLoading: false }));
  }, []);

  // Actions
  const play = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch((error) => {
      console.error('Failed to play video:', error);
      setState(prev => ({ ...prev, error: 'Failed to play video' }));
    });
  }, []);

  const pause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
  }, []);

  const togglePlay = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [state.isPlaying, play, pause]);

  const seek = useCallback((time: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, Math.min(time, state.duration));
    setState(prev => ({ ...prev, currentTime: time }));
  }, [state.duration]);

  const setVolume = useCallback((volume: number) => {
    const video = videoRef.current;
    if (!video) return;

    const clampedVolume = Math.max(0, Math.min(1, volume));
    video.volume = clampedVolume;
    setState(prev => ({
      ...prev,
      volume: clampedVolume,
      isMuted: clampedVolume === 0,
    }));
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = rate;
    setState(prev => ({ ...prev, playbackRate: rate }));
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (state.isMuted) {
      video.volume = state.volume;
      setState(prev => ({ ...prev, isMuted: false }));
    } else {
      video.volume = 0;
      setState(prev => ({ ...prev, isMuted: true }));
    }
  }, [state.isMuted, state.volume]);

  const toggleFullscreen = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!state.isFullscreen) {
      if (video.requestFullscreen) {
        video.requestFullscreen().then(() => {
          setState(prev => ({ ...prev, isFullscreen: true }));
        }).catch((error) => {
          console.error('Failed to enter fullscreen:', error);
        });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setState(prev => ({ ...prev, isFullscreen: false }));
        }).catch((error) => {
          console.error('Failed to exit fullscreen:', error);
        });
      }
    }
  }, [state.isFullscreen]);

  const skip = useCallback((seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = Math.max(0, Math.min(video.currentTime + seconds, state.duration));
    seek(newTime);
  }, [seek, state.duration]);

  const setShowControls = useCallback((show: boolean) => {
    setState(prev => ({ ...prev, showControls: show }));
  }, []);

  // Format time helper
  const formatTime = useCallback((time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  // Get progress percentage
  const getProgressPercentage = useCallback(() => {
    if (state.duration === 0) return 0;
    return (state.currentTime / state.duration) * 100;
  }, [state.currentTime, state.duration]);

  // Get buffered percentage
  const getBufferedPercentage = useCallback(() => {
    if (state.duration === 0) return 0;
    return (state.buffered / state.duration) * 100;
  }, [state.buffered, state.duration]);

  // Setup video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [handleLoadedMetadata, handleTimeUpdate, handlePlay, handlePause, handleEnded, handleError, handleLoadStart, handleCanPlay]);

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setState(prev => ({
        ...prev,
        isFullscreen: !!document.fullscreenElement,
      }));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const actions: VideoPlayerActions = {
    play,
    pause,
    togglePlay,
    seek,
    setVolume,
    setPlaybackRate,
    toggleMute,
    toggleFullscreen,
    skip,
    setShowControls,
  };

  return {
    videoRef,
    state,
    actions,
    formatTime,
    getProgressPercentage,
    getBufferedPercentage,
  };
}