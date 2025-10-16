import { api } from "@/lib/api";

// Video Processing Types
export interface VideoUploadRequest {
  file: File;
  metadata: {
    title: string;
    description?: string;
    machineModel: string;
    process: string;
    tags: string[];
    customerAccess?: string[];
  };
}

export interface VideoProcessingStatus {
  id: string;
  videoId: string;
  status: 'uploading' | 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  message: string;
  estimatedTimeRemaining?: number;
  startedAt?: string;
  completedAt?: string;
  error?: string;
  processingStages: ProcessingStage[];
}

export interface ProcessingStage {
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number;
  message?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface VideoFormat {
  id: string;
  videoId: string;
  format: 'hls' | 'dash' | 'mp4';
  quality: '360p' | '720p' | '1080p' | '4k';
  filePath: string;
  fileSize: number;
  duration: number;
  bitrate: number;
  resolution: {
    width: number;
    height: number;
  };
  createdAt: string;
}

export interface VideoThumbnail {
  id: string;
  videoId: string;
  timestamp: number;
  filePath: string;
  fileSize: number;
  width: number;
  height: number;
  createdAt: string;
}

export interface ProcessedVideo {
  id: string;
  title: string;
  description?: string;
  duration: number;
  fileSize: number;
  status: 'processing' | 'completed' | 'failed';
  formats: VideoFormat[];
  thumbnails: VideoThumbnail[];
  processingStatus?: VideoProcessingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UploadChunkRequest {
  videoId: string;
  chunkIndex: number;
  totalChunks: number;
  chunk: Blob;
  uploadId: string;
}

export interface UploadChunkResponse {
  chunkId: string;
  nextChunkOffset: number;
  isComplete: boolean;
}

export interface VideoUploadResponse {
  videoId: string;
  uploadId: string;
  uploadUrl: string;
  resumeUrl?: string;
  chunkSize: number;
  maxFileSize: number;
}

export interface RetryProcessingRequest {
  videoId: string;
  reason?: string;
}

// API Response Types
interface InitiateUploadResponse {
  videoId: string;
  uploadId: string;
  uploadUrl: string;
  resumeUrl?: string;
  chunkSize?: number;
  maxFileSize?: number;
}

interface CompleteUploadResponse {
  processingJobId?: string;
  jobId?: string;
}

interface ProcessingStatusResponse {
  jobId?: string;
  id?: string;
  videoId: string;
  status: string;
  progress?: number;
  message?: string;
  estimatedTimeRemaining?: number;
  startedAt?: string;
  completedAt?: string;
  error?: string;
  errorDetails?: { message?: string };
  stages?: ProcessingStage[];
  processingStages?: ProcessingStage[];
}

interface VideoDetailsResponse {
  id: string;
  title: string;
  description?: string;
  duration?: number;
  fileSize?: number;
  status?: string;
  formats?: VideoFormat[];
  thumbnails?: VideoThumbnail[];
  processingStatus?: VideoProcessingStatus;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
}

interface RetryProcessingResponse {
  processingJobId?: string;
  jobId?: string;
}

interface PreviewUrlResponse {
  url?: string;
  previewUrl?: string;
  expiresAt?: string;
  expires_at?: string;
}

interface QueueStatusResponse {
  totalJobs?: number;
  total_jobs?: number;
  pendingJobs?: number;
  pending_jobs?: number;
  processingJobs?: number;
  processing_jobs?: number;
  completedJobs?: number;
  completed_jobs?: number;
  failedJobs?: number;
  failed_jobs?: number;
  estimatedWaitTime?: number;
  estimated_wait_time?: number;
}

interface UserProcessingJobsResponse {
  jobs?: VideoProcessingStatus[];
  data?: VideoProcessingStatus[];
  total?: number;
  count?: number;
  hasMore?: boolean;
  has_more?: boolean;
}

interface StreamingUrlResponse {
  url?: string;
  streamUrl?: string;
  expiresAt?: string;
  expires_at?: string;
}

interface ThumbnailsResponse {
  thumbnails?: VideoThumbnail[];
  data?: VideoThumbnail[];
}

interface TranscriptResponse {
  content?: string;
  text?: string;
  segments?: Array<{ start: number; end: number; text: string }>;
  language?: string;
  confidence?: number;
  confidence_score?: number;
}

interface VideoAnalyticsResponse {
  views?: number;
  processingTime?: number;
  processing_time?: number;
  fileSize?: number;
  file_size?: number;
  formats?: Array<{ format: string; quality: string; views: number }>;
}

// Video Processing API
export const videoProcessingApi = {
  // Initiate video upload with chunked support
  initiateUpload: async (data: {
    fileName: string;
    fileSize: number;
    contentType: string;
    metadata: VideoUploadRequest['metadata'];
  }): Promise<VideoUploadResponse> => {
    const response = await api.post<InitiateUploadResponse>('/videos/upload/initiate', {
      fileName: data.fileName,
      fileSize: data.fileSize,
      contentType: data.contentType,
      metadata: {
        title: data.metadata.title,
        description: data.metadata.description,
        machineModel: data.metadata.machineModel,
        process: data.metadata.process,
        tags: data.metadata.tags,
        customerAccess: data.metadata.customerAccess || []
      }
    });
    
    return {
      videoId: response.videoId,
      uploadId: response.uploadId,
      uploadUrl: response.uploadUrl,
      resumeUrl: response.resumeUrl,
      chunkSize: response.chunkSize || 1024 * 1024, // 1MB default
      maxFileSize: response.maxFileSize || 500 * 1024 * 1024 // 500MB default
    };
  },

  // Upload file chunk with retry logic
  uploadChunk: async (data: UploadChunkRequest): Promise<UploadChunkResponse> => {
    const formData = new FormData();
    formData.append('videoId', data.videoId);
    formData.append('chunkIndex', data.chunkIndex.toString());
    formData.append('totalChunks', data.totalChunks.toString());
    formData.append('uploadId', data.uploadId);
    formData.append('chunk', data.chunk);

    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/videos/upload/chunk`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload chunk failed: ${response.status} - ${errorText}`);
    }

    return response.json();
  },

  // Complete upload and start processing
  completeUpload: async (data: {
    videoId: string;
    uploadId: string;
    metadata: VideoUploadRequest['metadata'];
  }): Promise<{ processingJobId: string }> => {
    const response = await api.post<CompleteUploadResponse>('/videos/upload/complete', {
      videoId: data.videoId,
      uploadId: data.uploadId,
      metadata: {
        title: data.metadata.title,
        description: data.metadata.description,
        machineModel: data.metadata.machineModel,
        process: data.metadata.process,
        tags: data.metadata.tags,
        customerAccess: data.metadata.customerAccess || []
      }
    });
    
    return {
      processingJobId: response.processingJobId || response.jobId || ''
    };
  },

  // Get processing status with real-time updates
  getProcessingStatus: async (videoId: string): Promise<VideoProcessingStatus> => {
    const response = await api.get<ProcessingStatusResponse>(`/videos/${videoId}/processing-status`);
    
    return {
      id: response.jobId || response.id || '',
      videoId: response.videoId,
      status: response.status as VideoProcessingStatus['status'],
      progress: response.progress || 0,
      message: response.message || 'Processing...',
      estimatedTimeRemaining: response.estimatedTimeRemaining,
      startedAt: response.startedAt,
      completedAt: response.completedAt,
      error: response.error || response.errorDetails?.message,
      processingStages: response.stages || response.processingStages || []
    };
  },

  // Get video details with formats and thumbnails
  getVideoDetails: async (videoId: string): Promise<ProcessedVideo> => {
    const response = await api.get<VideoDetailsResponse>(`/videos/${videoId}`);
    
    return {
      id: response.id,
      title: response.title,
      description: response.description,
      duration: response.duration || 0,
      fileSize: response.fileSize || 0,
      status: (response.status as ProcessedVideo['status']) || 'processing',
      formats: response.formats || [],
      thumbnails: response.thumbnails || [],
      processingStatus: response.processingStatus,
      createdAt: response.createdAt || response.created_at || '',
      updatedAt: response.updatedAt || response.updated_at || ''
    };
  },

  // Retry failed processing
  retryProcessing: async (data: RetryProcessingRequest): Promise<{ processingJobId: string }> => {
    const response = await api.post<RetryProcessingResponse>(`/videos/${data.videoId}/retry-processing`, {
      reason: data.reason
    });
    
    return {
      processingJobId: response.processingJobId || response.jobId || ''
    };
  },

  // Get video preview URL with CDN support
  getPreviewUrl: async (videoId: string, format?: string, quality?: string): Promise<{ url: string; expiresAt: string }> => {
    const params = new URLSearchParams();
    if (format) params.append('format', format);
    if (quality) params.append('quality', quality);
    
    const response = await api.get<PreviewUrlResponse>(`/videos/${videoId}/preview?${params.toString()}`);
    
    return {
      url: response.url || response.previewUrl || '',
      expiresAt: response.expiresAt || response.expires_at || ''
    };
  },

  // Delete video and all associated files
  deleteVideo: async (videoId: string): Promise<void> => {
    await api.delete(`/videos/${videoId}`);
  },

  // Get processing queue status
  getQueueStatus: async (): Promise<{
    totalJobs: number;
    pendingJobs: number;
    processingJobs: number;
    completedJobs: number;
    failedJobs: number;
    estimatedWaitTime: number;
  }> => {
    const response = await api.get<QueueStatusResponse>('/videos/processing/queue-status');
    
    return {
      totalJobs: response.totalJobs || response.total_jobs || 0,
      pendingJobs: response.pendingJobs || response.pending_jobs || 0,
      processingJobs: response.processingJobs || response.processing_jobs || 0,
      completedJobs: response.completedJobs || response.completed_jobs || 0,
      failedJobs: response.failedJobs || response.failed_jobs || 0,
      estimatedWaitTime: response.estimatedWaitTime || response.estimated_wait_time || 0
    };
  },

  // Get user's processing jobs
  getUserProcessingJobs: async (filters?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<{
    jobs: VideoProcessingStatus[];
    total: number;
    hasMore: boolean;
  }> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    
    const response = await api.get<UserProcessingJobsResponse>(`/videos/processing/jobs?${params.toString()}`);
    
    return {
      jobs: response.jobs || response.data || [],
      total: response.total || response.count || 0,
      hasMore: response.hasMore || response.has_more || false
    };
  },

  // Cancel processing job
  cancelProcessing: async (videoId: string): Promise<void> => {
    await api.post(`/videos/${videoId}/cancel-processing`, {});
  },

  // Get video streaming URL
  getStreamingUrl: async (videoId: string, format: 'hls' | 'dash' = 'hls', quality?: string): Promise<{ url: string; expiresAt: string }> => {
    const params = new URLSearchParams();
    params.append('format', format);
    if (quality) params.append('quality', quality);
    
    const response = await api.get<StreamingUrlResponse>(`/videos/${videoId}/stream?${params.toString()}`);
    
    return {
      url: response.url || response.streamUrl || '',
      expiresAt: response.expiresAt || response.expires_at || ''
    };
  },

  // Get video thumbnails
  getThumbnails: async (videoId: string): Promise<VideoThumbnail[]> => {
    const response = await api.get<ThumbnailsResponse>(`/videos/${videoId}/thumbnails`);
    return response.thumbnails || response.data || [];
  },

  // Get video transcript
  getTranscript: async (videoId: string): Promise<{
    content: string;
    segments: Array<{ start: number; end: number; text: string }>;
    language: string;
    confidence: number;
  }> => {
    const response = await api.get<TranscriptResponse>(`/videos/${videoId}/transcript`);
    
    return {
      content: response.content || response.text || '',
      segments: response.segments || [],
      language: response.language || 'en',
      confidence: response.confidence || response.confidence_score || 0
    };
  },

  // Update video metadata
  updateVideoMetadata: async (videoId: string, metadata: Partial<VideoUploadRequest['metadata']>): Promise<void> => {
    await api.put(`/videos/${videoId}/metadata`, metadata);
  },

  // Get video analytics
  getVideoAnalytics: async (videoId: string): Promise<{
    views: number;
    processingTime: number;
    fileSize: number;
    formats: Array<{ format: string; quality: string; views: number }>;
  }> => {
    const response = await api.get<VideoAnalyticsResponse>(`/videos/${videoId}/analytics`);
    
    return {
      views: response.views || 0,
      processingTime: response.processingTime || response.processing_time || 0,
      fileSize: response.fileSize || response.file_size || 0,
      formats: response.formats || []
    };
  }
};

// WebSocket connection for real-time updates
export class VideoProcessingWebSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  private videoId: string;
  private onStatusUpdate: (status: VideoProcessingStatus) => void;

  constructor(videoId: string, onStatusUpdate: (status: VideoProcessingStatus) => void) {
    this.videoId = videoId;
    this.onStatusUpdate = onStatusUpdate;
  }

  connect(): void {
    const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:3000'}/videos/${this.videoId}/processing-status`;
    const token = localStorage.getItem('auth_token');
    
    this.ws = new WebSocket(`${wsUrl}?token=${token}`);

    this.ws.onopen = () => {
      console.log('Video processing WebSocket connected');
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      try {
        const status: VideoProcessingStatus = JSON.parse(event.data);
        this.onStatusUpdate(status);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('Video processing WebSocket disconnected');
      this.attemptReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('Video processing WebSocket error:', error);
    };
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}