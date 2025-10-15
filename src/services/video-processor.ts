import { videoProcessingApi, type VideoProcessingStatus, type ProcessingStage } from "@/api/video-processing";

export interface TranscodingJob {
  videoId: string;
  inputPath: string;
  outputFormats: VideoFormat[];
  priority: 'high' | 'normal' | 'low';
  metadata: {
    title: string;
    description?: string;
    duration?: number;
    resolution?: { width: number; height: number };
  };
}

export interface VideoFormat {
  format: 'hls' | 'dash' | 'mp4';
  quality: '360p' | '720p' | '1080p' | '4k';
  bitrate: number;
  resolution: { width: number; height: number };
}

export interface ThumbnailGenerationOptions {
  timestamps: number[]; // Array of timestamps in seconds
  width: number;
  height: number;
  quality: number; // 0-100
}

export interface ProcessingJobStatus {
  jobId: string;
  videoId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  currentStage: string;
  stages: ProcessingStage[];
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

export class VideoProcessor {
  private static readonly DEFAULT_FORMATS: VideoFormat[] = [
    {
      format: 'hls',
      quality: '360p',
      bitrate: 500000,
      resolution: { width: 640, height: 360 }
    },
    {
      format: 'hls',
      quality: '720p',
      bitrate: 1500000,
      resolution: { width: 1280, height: 720 }
    },
    {
      format: 'hls',
      quality: '1080p',
      bitrate: 3000000,
      resolution: { width: 1920, height: 1080 }
    },
    {
      format: 'dash',
      quality: '720p',
      bitrate: 1500000,
      resolution: { width: 1280, height: 720 }
    },
    {
      format: 'dash',
      quality: '1080p',
      bitrate: 3000000,
      resolution: { width: 1920, height: 1080 }
    },
    {
      format: 'mp4',
      quality: '720p',
      bitrate: 1500000,
      resolution: { width: 1280, height: 720 }
    }
  ];

  private static readonly THUMBNAIL_TIMESTAMPS = [0.1, 0.25, 0.5, 0.75, 0.9]; // Generate thumbnails at these percentages

  /**
   * Queue a video for transcoding
   */
  async queueTranscoding(job: TranscodingJob): Promise<string> {
    try {
      const response = await videoProcessingApi.completeUpload({
        videoId: job.videoId,
        uploadId: '', // This would be set during upload
        metadata: {
          title: job.metadata.title,
          description: job.metadata.description,
          machineModel: '', // This would be set from metadata
          process: '', // This would be set from metadata
          tags: [], // This would be set from metadata
          customerAccess: []
        }
      });

      return response.processingJobId;
    } catch (error) {
      console.error('Failed to queue transcoding job:', error);
      throw new Error('Failed to queue video for processing');
    }
  }

  /**
   * Get processing job status
   */
  async getJobStatus(videoId: string): Promise<VideoProcessingStatus> {
    try {
      return await videoProcessingApi.getProcessingStatus(videoId);
    } catch (error) {
      console.error('Failed to get job status:', error);
      throw new Error('Failed to get processing status');
    }
  }

  /**
   * Generate thumbnails for a video
   */
  async generateThumbnails(
    videoId: string,
    options: ThumbnailGenerationOptions = {
      timestamps: VideoProcessor.THUMBNAIL_TIMESTAMPS,
      width: 300,
      height: 200,
      quality: 85
    }
  ): Promise<string[]> {
    try {
      // In a real implementation, this would call the backend to generate thumbnails
      // For now, we'll return mock thumbnail URLs
      const thumbnails: string[] = [];
      
      for (let i = 0; i < options.timestamps.length; i++) {
        const timestamp = options.timestamps[i];
        const thumbnailUrl = `${import.meta.env.VITE_CDN_URL || 'https://cdn.example.com'}/thumbnails/${videoId}/${timestamp}.jpg`;
        thumbnails.push(thumbnailUrl);
      }

      return thumbnails;
    } catch (error) {
      console.error('Failed to generate thumbnails:', error);
      throw new Error('Failed to generate thumbnails');
    }
  }

  /**
   * Get processing stages for a video
   */
  getProcessingStages(): ProcessingStage[] {
    return [
      {
        name: 'Upload Validation',
        status: 'pending',
        progress: 0,
        message: 'Validating uploaded file'
      },
      {
        name: 'Video Analysis',
        status: 'pending',
        progress: 0,
        message: 'Analyzing video properties'
      },
      {
        name: 'Transcoding',
        status: 'pending',
        progress: 0,
        message: 'Converting to multiple formats'
      },
      {
        name: 'Thumbnail Generation',
        status: 'pending',
        progress: 0,
        message: 'Generating preview thumbnails'
      },
      {
        name: 'Quality Check',
        status: 'pending',
        progress: 0,
        message: 'Verifying output quality'
      },
      {
        name: 'CDN Distribution',
        status: 'pending',
        progress: 0,
        message: 'Distributing to CDN'
      }
    ];
  }

  /**
   * Estimate processing time based on video duration and resolution
   */
  estimateProcessingTime(
    resolution: { width: number; height: number },
    formats: VideoFormat[] = VideoProcessor.DEFAULT_FORMATS
  ): number {
    // Base processing time calculation
    const baseTime = 60; // 1 minute base
    const resolutionMultiplier = (resolution.width * resolution.height) / (1920 * 1080); // Normalize to 1080p
    const formatMultiplier = formats.length * 0.5; // Each format adds 50% time
    
    return Math.ceil(baseTime * resolutionMultiplier * formatMultiplier);
  }

  /**
   * Get recommended formats for a video
   */
  getRecommendedFormats(
    resolution: { width: number; height: number }
  ): VideoFormat[] {
    const formats: VideoFormat[] = [];
    
    // Always include HLS for streaming
    if (resolution.height >= 360) {
      formats.push({
        format: 'hls',
        quality: '360p',
        bitrate: 500000,
        resolution: { width: 640, height: 360 }
      });
    }
    
    if (resolution.height >= 720) {
      formats.push({
        format: 'hls',
        quality: '720p',
        bitrate: 1500000,
        resolution: { width: 1280, height: 720 }
      });
    }
    
    if (resolution.height >= 1080) {
      formats.push({
        format: 'hls',
        quality: '1080p',
        bitrate: 3000000,
        resolution: { width: 1920, height: 1080 }
      });
    }
    
    // Add DASH for better compatibility
    if (resolution.height >= 720) {
      formats.push({
        format: 'dash',
        quality: '720p',
        bitrate: 1500000,
        resolution: { width: 1280, height: 720 }
      });
    }
    
    // Add MP4 for download
    if (resolution.height >= 720) {
      formats.push({
        format: 'mp4',
        quality: '720p',
        bitrate: 1500000,
        resolution: { width: 1280, height: 720 }
      });
    }
    
    return formats;
  }

  /**
   * Retry failed processing job
   */
  async retryProcessing(videoId: string, reason?: string): Promise<string> {
    try {
      const response = await videoProcessingApi.retryProcessing({
        videoId,
        reason
      });
      return response.processingJobId;
    } catch (error) {
      console.error('Failed to retry processing:', error);
      throw new Error('Failed to retry video processing');
    }
  }

  /**
   * Get processing queue status
   */
  async getQueueStatus(): Promise<{
    totalJobs: number;
    pendingJobs: number;
    processingJobs: number;
    completedJobs: number;
    failedJobs: number;
    estimatedWaitTime: number;
  }> {
    try {
      return await videoProcessingApi.getQueueStatus();
    } catch (error) {
      console.error('Failed to get queue status:', error);
      throw new Error('Failed to get processing queue status');
    }
  }

  /**
   * Get user's processing jobs
   */
  async getUserProcessingJobs(filters?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<{
    jobs: VideoProcessingStatus[];
    total: number;
    hasMore: boolean;
  }> {
    try {
      return await videoProcessingApi.getUserProcessingJobs(filters);
    } catch (error) {
      console.error('Failed to get user processing jobs:', error);
      throw new Error('Failed to get processing jobs');
    }
  }

  /**
   * Cancel a processing job
   */
  async cancelProcessing(videoId: string): Promise<void> {
    try {
      // In a real implementation, this would call the backend to cancel the job
      console.log(`Cancelling processing for video ${videoId}`);
    } catch (error) {
      console.error('Failed to cancel processing:', error);
      throw new Error('Failed to cancel video processing');
    }
  }

  /**
   * Get video details with all formats and thumbnails
   */
  async getVideoDetails(videoId: string) {
    try {
      return await videoProcessingApi.getVideoDetails(videoId);
    } catch (error) {
      console.error('Failed to get video details:', error);
      throw new Error('Failed to get video details');
    }
  }

  /**
   * Get video preview URL
   */
  async getVideoPreviewUrl(
    videoId: string,
    format: 'hls' | 'dash' | 'mp4' = 'hls',
    quality: '360p' | '720p' | '1080p' | '4k' = '720p'
  ): Promise<string> {
    try {
      const response = await videoProcessingApi.getPreviewUrl(videoId, format, quality);
      return response.url;
    } catch (error) {
      console.error('Failed to get video preview URL:', error);
      throw new Error('Failed to get video preview URL');
    }
  }
}

// Export singleton instance
export const videoProcessor = new VideoProcessor();