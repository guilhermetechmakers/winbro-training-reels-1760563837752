import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { videoProcessingApi, VideoProcessingWebSocket } from "@/api/video-processing";
import { videoProcessor } from "@/services/video-processor";
import type { VideoProcessingStatus } from "@/types";

export interface UseVideoProcessingOptions {
  videoId?: string;
  enableWebSocket?: boolean;
  pollingInterval?: number;
}

export function useVideoProcessing(options: UseVideoProcessingOptions = {}) {
  const { videoId, enableWebSocket = true, pollingInterval = 2000 } = options;
  const queryClient = useQueryClient();
  const wsRef = useRef<VideoProcessingWebSocket | null>(null);

  // Processing status query
  const {
    data: processingStatus,
    isLoading: isLoadingStatus,
    error: statusError,
    refetch: refetchStatus
  } = useQuery({
    queryKey: ['video-processing-status', videoId],
    queryFn: () => videoProcessingApi.getProcessingStatus(videoId!),
    enabled: !!videoId,
    refetchInterval: enableWebSocket ? false : pollingInterval,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Video details query
  const {
    data: videoDetails,
    isLoading: isLoadingDetails,
    error: detailsError
  } = useQuery({
    queryKey: ['video-details', videoId],
    queryFn: () => videoProcessingApi.getVideoDetails(videoId!),
    enabled: !!videoId && processingStatus?.status === 'completed',
    retry: 3,
  });

  // Queue status query
  const {
    data: queueStatus,
    isLoading: isLoadingQueue
  } = useQuery({
    queryKey: ['video-processing-queue'],
    queryFn: () => videoProcessor.getQueueStatus(),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // User processing jobs query
  const {
    data: userJobs,
    isLoading: isLoadingUserJobs
  } = useQuery({
    queryKey: ['user-processing-jobs'],
    queryFn: () => videoProcessor.getUserProcessingJobs({ limit: 50 }),
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Retry processing mutation
  const retryProcessingMutation = useMutation({
    mutationFn: (reason?: string) => {
      if (!videoId) throw new Error('Video ID is required');
      return videoProcessor.retryProcessing(videoId, reason);
    },
    onSuccess: () => {
      toast.success('Processing restarted successfully');
      queryClient.invalidateQueries({ queryKey: ['video-processing-status', videoId] });
    },
    onError: (error) => {
      toast.error('Failed to restart processing');
      console.error('Retry processing error:', error);
    }
  });

  // Cancel processing mutation
  const cancelProcessingMutation = useMutation({
    mutationFn: () => {
      if (!videoId) throw new Error('Video ID is required');
      return videoProcessor.cancelProcessing(videoId);
    },
    onSuccess: () => {
      toast.success('Processing cancelled');
      queryClient.invalidateQueries({ queryKey: ['video-processing-status', videoId] });
    },
    onError: (error) => {
      toast.error('Failed to cancel processing');
      console.error('Cancel processing error:', error);
    }
  });

  // WebSocket connection for real-time updates
  useEffect(() => {
    if (!videoId || !enableWebSocket) return;

    const onStatusUpdate = (status: VideoProcessingStatus) => {
      // Update the query cache with the new status
      queryClient.setQueryData(['video-processing-status', videoId], status);
      
      // Show toast notifications for status changes
      if (status.status === 'completed') {
        toast.success('Video processing completed!');
      } else if (status.status === 'failed') {
        toast.error(`Processing failed: ${status.error || 'Unknown error'}`);
      }
    };

    wsRef.current = new VideoProcessingWebSocket(videoId, onStatusUpdate);
    wsRef.current.connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.disconnect();
        wsRef.current = null;
      }
    };
  }, [videoId, enableWebSocket, queryClient]);

  // Helper functions
  const isProcessing = processingStatus?.status === 'processing' || processingStatus?.status === 'queued';
  const isCompleted = processingStatus?.status === 'completed';
  const isFailed = processingStatus?.status === 'failed';
  const isUploading = processingStatus?.status === 'uploading';

  const getCurrentStage = () => {
    if (!processingStatus?.processingStages) return null;
    return processingStatus.processingStages.find(stage => stage.status === 'in_progress') ||
           processingStatus.processingStages.find(stage => stage.status === 'pending');
  };

  const getOverallProgress = () => {
    if (!processingStatus?.processingStages) return processingStatus?.progress || 0;
    
    const totalStages = processingStatus.processingStages.length;
    const completedStages = processingStatus.processingStages.filter(stage => stage.status === 'completed').length;
    const currentStage = processingStatus.processingStages.find(stage => stage.status === 'in_progress');
    
    if (currentStage) {
      const stageProgress = currentStage.progress / 100;
      return ((completedStages + stageProgress) / totalStages) * 100;
    }
    
    return (completedStages / totalStages) * 100;
  };

  const retry = useCallback((reason?: string) => {
    retryProcessingMutation.mutate(reason);
  }, [retryProcessingMutation]);

  const cancel = useCallback(() => {
    cancelProcessingMutation.mutate();
  }, [cancelProcessingMutation]);

  const refresh = useCallback(() => {
    refetchStatus();
  }, [refetchStatus]);

  return {
    // Data
    processingStatus,
    videoDetails,
    queueStatus,
    userJobs,
    
    // Loading states
    isLoadingStatus,
    isLoadingDetails,
    isLoadingQueue,
    isLoadingUserJobs,
    
    // Error states
    statusError,
    detailsError,
    
    // Computed values
    isProcessing,
    isCompleted,
    isFailed,
    isUploading,
    currentStage: getCurrentStage(),
    overallProgress: getOverallProgress(),
    
    // Actions
    retry,
    cancel,
    refresh,
    
    // Mutation states
    isRetrying: retryProcessingMutation.isPending,
    isCancelling: cancelProcessingMutation.isPending,
    retryError: retryProcessingMutation.error,
    cancelError: cancelProcessingMutation.error,
  };
}

// Hook for managing multiple video processing jobs
export function useVideoProcessingJobs(filters?: {
  status?: string;
  limit?: number;
  offset?: number;
}) {
  const queryClient = useQueryClient();

  const {
    data: jobsData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['user-processing-jobs', filters],
    queryFn: () => videoProcessor.getUserProcessingJobs(filters),
    refetchInterval: 10000,
  });

  const retryJobMutation = useMutation({
    mutationFn: ({ videoId, reason }: { videoId: string; reason?: string }) =>
      videoProcessor.retryProcessing(videoId, reason),
    onSuccess: (_, { videoId }) => {
      toast.success('Processing restarted successfully');
      queryClient.invalidateQueries({ queryKey: ['user-processing-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['video-processing-status', videoId] });
    },
    onError: (error) => {
      toast.error('Failed to restart processing');
      console.error('Retry job error:', error);
    }
  });

  const cancelJobMutation = useMutation({
    mutationFn: (videoId: string) => videoProcessor.cancelProcessing(videoId),
    onSuccess: (_, videoId) => {
      toast.success('Processing cancelled');
      queryClient.invalidateQueries({ queryKey: ['user-processing-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['video-processing-status', videoId] });
    },
    onError: (error) => {
      toast.error('Failed to cancel processing');
      console.error('Cancel job error:', error);
    }
  });

  const retryJob = useCallback((videoId: string, reason?: string) => {
    retryJobMutation.mutate({ videoId, reason });
  }, [retryJobMutation]);

  const cancelJob = useCallback((videoId: string) => {
    cancelJobMutation.mutate(videoId);
  }, [cancelJobMutation]);

  return {
    jobs: jobsData?.jobs || [],
    total: jobsData?.total || 0,
    hasMore: jobsData?.hasMore || false,
    isLoading,
    error,
    refetch,
    retryJob,
    cancelJob,
    isRetrying: retryJobMutation.isPending,
    isCancelling: cancelJobMutation.isPending,
  };
}

// Hook for video upload with processing
export function useVideoUpload() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'completed' | 'error'>('idle');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);

  const uploadMutation = useMutation({
    mutationFn: async ({ file, metadata }: {
      file: File;
      metadata: {
        title: string;
        description?: string;
        machineModel: string;
        process: string;
        tags: string[];
        customerAccess?: string[];
      };
    }) => {
      setUploadStatus('uploading');
      setUploadError(null);
      setUploadProgress(0);

      try {
        // This would use the videoStorageService in a real implementation
        // For now, we'll simulate the upload process
        const response = await videoProcessingApi.initiateUpload({
          fileName: file.name,
          fileSize: file.size,
          contentType: file.type,
          metadata
        });

        setVideoId(response.videoId);
        setUploadStatus('processing');
        setUploadProgress(100);

        return response;
      } catch (error) {
        setUploadStatus('error');
        setUploadError(error instanceof Error ? error.message : 'Upload failed');
        throw error;
      }
    },
    onSuccess: () => {
      setUploadStatus('completed');
      toast.success('Video uploaded successfully');
    },
    onError: (error) => {
      setUploadStatus('error');
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
      toast.error('Upload failed');
    }
  });

  const reset = useCallback(() => {
    setUploadProgress(0);
    setUploadStatus('idle');
    setUploadError(null);
    setVideoId(null);
  }, []);

  return {
    uploadProgress,
    uploadStatus,
    uploadError,
    videoId,
    upload: uploadMutation.mutate,
    isUploading: uploadMutation.isPending,
    reset
  };
}