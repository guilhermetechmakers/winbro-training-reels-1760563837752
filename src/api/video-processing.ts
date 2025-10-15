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

// Video Processing API
export const videoProcessingApi = {
  // Initiate video upload
  initiateUpload: async (data: {
    fileName: string;
    fileSize: number;
    contentType: string;
    metadata: VideoUploadRequest['metadata'];
  }): Promise<VideoUploadResponse> => {
    return api.post('/videos/upload/initiate', data);
  },

  // Upload file chunk
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
      throw new Error(`Upload chunk failed: ${response.status}`);
    }

    return response.json();
  },

  // Complete upload and start processing
  completeUpload: async (data: {
    videoId: string;
    uploadId: string;
    metadata: VideoUploadRequest['metadata'];
  }): Promise<{ processingJobId: string }> => {
    return api.post('/videos/upload/complete', data);
  },

  // Get processing status
  getProcessingStatus: async (videoId: string): Promise<VideoProcessingStatus> => {
    return api.get(`/videos/${videoId}/processing-status`);
  },

  // Get video details with formats and thumbnails
  getVideoDetails: async (videoId: string): Promise<ProcessedVideo> => {
    return api.get(`/videos/${videoId}`);
  },

  // Retry failed processing
  retryProcessing: async (data: RetryProcessingRequest): Promise<{ processingJobId: string }> => {
    return api.post(`/videos/${data.videoId}/retry-processing`, data);
  },

  // Get video preview URL
  getPreviewUrl: async (videoId: string, format?: string, quality?: string): Promise<{ url: string; expiresAt: string }> => {
    const params = new URLSearchParams();
    if (format) params.append('format', format);
    if (quality) params.append('quality', quality);
    
    return api.get(`/videos/${videoId}/preview?${params.toString()}`);
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
    return api.get('/videos/processing/queue-status');
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
    
    return api.get(`/videos/processing/jobs?${params.toString()}`);
  },
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