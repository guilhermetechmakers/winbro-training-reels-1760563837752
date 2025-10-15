import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { uploadApi } from "@/lib/api";
import type { 
  UploadFile, 
  VideoMetadata, 
  AIProcessingResult,
  UploadInitiateResponse,
  UploadCompleteResponse
} from "@/types";

interface UploadState {
  files: UploadFile[];
  currentFile?: UploadFile;
  metadata?: VideoMetadata;
  aiResults?: AIProcessingResult;
  selectedThumbnail?: string;
}

export function useUpload() {
  const [uploadState, setUploadState] = useState<UploadState>({
    files: []
  });

  // Upload initiation mutation
  const initiateUploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const response = await uploadApi.initiate({
        fileName: file.name,
        fileSize: file.size,
        contentType: file.type
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

  // Chunked upload mutation
  const uploadChunkMutation = useMutation({
    mutationFn: async ({ file, uploadId, onProgress }: { 
      file: File; 
      uploadId: string; 
      onProgress: (progress: number) => void;
    }) => {
      const chunkSize = 1024 * 1024; // 1MB chunks
      const totalChunks = Math.ceil(file.size / chunkSize);
      
      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);
        
        const formData = new FormData();
        formData.append('chunk', chunk);
        formData.append('uploadId', uploadId);
        formData.append('chunkIndex', i.toString());
        formData.append('totalChunks', totalChunks.toString());
        
        await uploadApi.uploadChunk(formData);
        
        const progress = ((i + 1) / totalChunks) * 100;
        onProgress(progress);
      }
      
      return { uploadId, success: true };
    },
    onSuccess: () => {
      setUploadState(prev => ({
        ...prev,
        currentFile: prev.currentFile ? {
          ...prev.currentFile,
          progress: 100,
          status: 'complete'
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
          error: "Upload failed"
        } : undefined
      }));
      console.error("Upload error:", error);
    }
  });

  // Complete upload mutation
  const completeUploadMutation = useMutation({
    mutationFn: async ({ uploadId, metadata }: { uploadId: string; metadata: VideoMetadata }) => {
      const response = await uploadApi.complete({ uploadId, metadata });
      return response as UploadCompleteResponse;
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
    mutationFn: async ({ uploadId, metadata, publishNow }: { 
      uploadId: string; 
      metadata: VideoMetadata; 
      publishNow: boolean;
    }) => {
      const response = await uploadApi.publishVideo({ uploadId, metadata, publishNow });
      return response;
    },
    onSuccess: (data: any) => {
      toast.success(
        data.status === 'published' 
          ? "Video published successfully!" 
          : "Video submitted for review"
      );
      // Reset upload state
      setUploadState({ files: [] });
    },
    onError: (error) => {
      toast.error("Failed to publish video");
      console.error("Publish error:", error);
    }
  });

  // Upload file function
  const uploadFile = useCallback(async (file: File) => {
    try {
      // Validate file
      if (!file.type.startsWith('video/')) {
        toast.error("Please select a video file");
        return;
      }
      
      if (file.size > 500 * 1024 * 1024) { // 500MB limit
        toast.error("File size must be less than 500MB");
        return;
      }

      // Initiate upload
      const initiateData = await initiateUploadMutation.mutateAsync(file);
      
      // Upload chunks
      await uploadChunkMutation.mutateAsync({
        file,
        uploadId: initiateData.uploadId,
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
    } catch (error) {
      console.error("Upload error:", error);
    }
  }, [initiateUploadMutation, uploadChunkMutation]);

  // Complete upload with metadata
  const completeUpload = useCallback(async (metadata: VideoMetadata) => {
    if (!uploadState.currentFile) return;
    
    await completeUploadMutation.mutateAsync({
      uploadId: uploadState.currentFile.id,
      metadata
    });
  }, [uploadState.currentFile, completeUploadMutation]);

  // Publish video
  const publishVideo = useCallback(async (publishNow: boolean) => {
    if (!uploadState.currentFile || !uploadState.metadata) return;
    
    await publishVideoMutation.mutateAsync({
      uploadId: uploadState.currentFile.id,
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
