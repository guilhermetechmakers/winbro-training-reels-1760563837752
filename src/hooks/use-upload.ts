import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { videoStorageService } from "@/services/storage";
import { videoProcessingApi } from "@/api/video-processing";
import type { 
  UploadFile, 
  VideoMetadata, 
  AIProcessingResult,
  UploadInitiateResponse
} from "@/types";

interface UploadState {
  files: UploadFile[];
  currentFile?: UploadFile;
  metadata?: VideoMetadata;
  aiResults?: AIProcessingResult;
  selectedThumbnail?: string;
}

export function useUpload() {
  const queryClient = useQueryClient();
  const [uploadState, setUploadState] = useState<UploadState>({
    files: []
  });

  // Upload initiation mutation
  const initiateUploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const response = await videoProcessingApi.initiateUpload({
        fileName: file.name,
        fileSize: file.size,
        contentType: file.type,
        metadata: {
          title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
          description: "",
          machineModel: "",
          process: "",
          tags: [],
          customerAccess: []
        }
      });
      return response as UploadInitiateResponse;
    },
    onSuccess: (data, file) => {
      const uploadFile: UploadFile = {
        file,
        id: data.uploadId,
        progress: 0,
        status: 'uploading',
        uploadUrl: data.uploadUrl
      };
      
      setUploadState(prev => ({
        ...prev,
        currentFile: uploadFile,
        files: [...prev.files, uploadFile]
      }));
    },
    onError: (error) => {
      toast.error("Failed to initiate upload");
      console.error("Upload initiation error:", error);
    }
  });

  // Chunked upload mutation using video storage service
  const uploadChunkMutation = useMutation({
    mutationFn: async ({ file, metadata, onProgress }: { 
      file: File; 
      metadata: VideoMetadata;
      onProgress: (progress: number) => void;
    }) => {
      return await videoStorageService.uploadVideo(file, metadata, {
        onProgress: (progress) => {
          onProgress(progress.percentage);
        },
        onError: (error) => {
          throw error;
        },
        onComplete: () => {
          // Upload completed, video processing will start automatically
        }
      });
    },
    onSuccess: (videoId) => {
      setUploadState(prev => ({
        ...prev,
        currentFile: prev.currentFile ? {
          ...prev.currentFile,
          progress: 100,
          status: 'complete',
          processingJobId: videoId
        } : undefined
      }));
      toast.success("Upload completed successfully");
    },
    onError: (error) => {
      toast.error("Upload failed");
      setUploadState(prev => ({
        ...prev,
        currentFile: prev.currentFile ? {
          ...prev.currentFile,
          status: 'error',
          error: error.message || "Upload failed"
        } : undefined
      }));
      console.error("Upload error:", error);
    }
  });

  // Complete upload mutation
  const completeUploadMutation = useMutation({
    mutationFn: async ({ uploadId }: { uploadId: string; metadata: VideoMetadata }) => {
      // This is now handled by the video storage service during upload
      // We just need to return the video ID for processing
      return { processingJobId: uploadId };
    },
    onSuccess: (data) => {
      setUploadState(prev => ({
        ...prev,
        currentFile: prev.currentFile ? {
          ...prev.currentFile,
          processingJobId: data.processingJobId,
          status: 'processing'
        } : undefined
      }));
      toast.success("Video processing started");
    },
    onError: (error) => {
      toast.error("Failed to complete upload");
      console.error("Complete upload error:", error);
    }
  });

  // Publish video mutation
  const publishVideoMutation = useMutation({
    mutationFn: async ({ videoId, metadata, publishNow }: { 
      videoId: string; 
      metadata: VideoMetadata; 
      publishNow: boolean;
    }) => {
      // Update video metadata and publish status
      await videoProcessingApi.updateVideoMetadata(videoId, metadata);
      
      // In a real implementation, this would call a publish endpoint
      return { videoId, status: publishNow ? 'published' : 'pending_review' };
    },
    onSuccess: (data: any) => {
      toast.success(
        data.status === 'published' 
          ? "Video published successfully!" 
          : "Video submitted for review"
      );
      // Reset upload state
      setUploadState({ files: [] });
      // Invalidate videos query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
    onError: (error) => {
      toast.error("Failed to publish video");
      console.error("Publish error:", error);
    }
  });

  // Upload file function
  const uploadFile = useCallback(async (file: File, metadata?: VideoMetadata) => {
    try {
      // Use default metadata if not provided
      const videoMetadata = metadata || {
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
        description: "",
        machineModel: "",
        process: "",
        tooling: [],
        step: "",
        tags: [],
        isCustomerSpecific: false
      };

      // Upload using video storage service
      const videoId = await uploadChunkMutation.mutateAsync({
        file,
        metadata: videoMetadata,
        onProgress: (progress) => {
          setUploadState(prev => ({
            ...prev,
            currentFile: prev.currentFile ? {
              ...prev.currentFile,
              progress
            } : undefined
          }));
        }
      });

      return videoId;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  }, [uploadChunkMutation]);

  // Complete upload with metadata
  const completeUpload = useCallback(async (metadata: VideoMetadata) => {
    if (!uploadState.currentFile) return;
    
    // Update metadata in the upload state
    setUploadState(prev => ({
      ...prev,
      metadata
    }));

    // The upload is already completed by the video storage service
    // We just need to update the metadata
    await completeUploadMutation.mutateAsync({
      uploadId: uploadState.currentFile.id,
      metadata
    });
  }, [uploadState.currentFile, completeUploadMutation]);

  // Publish video
  const publishVideo = useCallback(async (publishNow: boolean) => {
    if (!uploadState.currentFile || !uploadState.metadata) return;
    
    // Get the video ID from the processing job ID
    const videoId = uploadState.currentFile.processingJobId || uploadState.currentFile.id;
    
    await publishVideoMutation.mutateAsync({
      videoId,
      metadata: uploadState.metadata,
      publishNow
    });
  }, [uploadState.currentFile, uploadState.metadata, publishVideoMutation]);

  // Update metadata
  const updateMetadata = useCallback((metadata: VideoMetadata) => {
    setUploadState(prev => ({ ...prev, metadata }));
  }, []);

  // Update AI results
  const updateAIResults = useCallback((aiResults: AIProcessingResult) => {
    setUploadState(prev => ({ ...prev, aiResults }));
  }, []);

  // Select thumbnail
  const selectThumbnail = useCallback((thumbnailUrl: string) => {
    setUploadState(prev => ({ ...prev, selectedThumbnail: thumbnailUrl }));
  }, []);

  // Reset upload state
  const resetUpload = useCallback(() => {
    setUploadState({ files: [] });
  }, []);

  return {
    uploadState,
    uploadFile,
    completeUpload,
    publishVideo,
    updateMetadata,
    updateAIResults,
    selectThumbnail,
    resetUpload,
    isUploading: initiateUploadMutation.isPending || uploadChunkMutation.isPending,
    isCompleting: completeUploadMutation.isPending,
    isPublishing: publishVideoMutation.isPending,
    uploadError: initiateUploadMutation.error || uploadChunkMutation.error,
    completeError: completeUploadMutation.error,
    publishError: publishVideoMutation.error
  };
}
