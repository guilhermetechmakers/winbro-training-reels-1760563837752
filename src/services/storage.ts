import { videoProcessingApi, type UploadChunkRequest } from "@/api/video-processing";

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  speed: number; // bytes per second
  estimatedTimeRemaining: number; // seconds
}

export interface UploadOptions {
  chunkSize?: number;
  maxRetries?: number;
  onProgress?: (progress: UploadProgress) => void;
  onError?: (error: Error) => void;
  onComplete?: (videoId: string) => void;
}

export interface ResumableUploadState {
  videoId: string;
  uploadId: string;
  totalChunks: number;
  uploadedChunks: Set<number>;
  isPaused: boolean;
  isCompleted: boolean;
  error?: string;
}

export class VideoStorageService {
  private static readonly DEFAULT_CHUNK_SIZE = 1024 * 1024; // 1MB
  private static readonly DEFAULT_MAX_RETRIES = 3;
  private static readonly RETRY_DELAY = 1000; // 1 second

  private uploadStates = new Map<string, ResumableUploadState>();
  private activeUploads = new Map<string, AbortController>();

  /**
   * Upload a video file with resumable chunked upload
   */
  async uploadVideo(
    file: File,
    metadata: {
      title: string;
      description?: string;
      machineModel: string;
      process: string;
      tags: string[];
      customerAccess?: string[];
    },
    options: UploadOptions = {}
  ): Promise<string> {
    const {
      chunkSize = VideoStorageService.DEFAULT_CHUNK_SIZE,
      maxRetries = VideoStorageService.DEFAULT_MAX_RETRIES,
      onProgress,
      onError,
      onComplete
    } = options;

    try {
      // Validate file before upload
      this.validateFile(file);

      // Initiate upload
      const uploadResponse = await videoProcessingApi.initiateUpload({
        fileName: file.name,
        fileSize: file.size,
        contentType: file.type,
        metadata
      });

      const videoId = uploadResponse.videoId;
      const uploadId = uploadResponse.uploadId;
      const actualChunkSize = uploadResponse.chunkSize || chunkSize;
      const totalChunks = Math.ceil(file.size / actualChunkSize);

      // Initialize upload state
      const uploadState: ResumableUploadState = {
        videoId,
        uploadId,
        totalChunks,
        uploadedChunks: new Set(),
        isPaused: false,
        isCompleted: false
      };

      this.uploadStates.set(videoId, uploadState);

      // Create abort controller for this upload
      const abortController = new AbortController();
      this.activeUploads.set(videoId, abortController);

      // Upload chunks
      await this.uploadChunks(
        file,
        videoId,
        uploadId,
        totalChunks,
        actualChunkSize,
        maxRetries,
        onProgress,
        onError,
        abortController.signal
      );

      // Complete upload and start processing
      await videoProcessingApi.completeUpload({
        videoId,
        uploadId,
        metadata
      });

      uploadState.isCompleted = true;
      this.uploadStates.set(videoId, uploadState);
      this.activeUploads.delete(videoId);

      onComplete?.(videoId);
      return videoId;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      onError?.(new Error(errorMessage));
      throw error;
    }
  }

  /**
   * Upload file chunks with retry logic
   */
  private async uploadChunks(
    file: File,
    videoId: string,
    uploadId: string,
    totalChunks: number,
    chunkSize: number,
    maxRetries: number,
    onProgress?: (progress: UploadProgress) => void,
    onError?: (error: Error) => void,
    signal?: AbortSignal
  ): Promise<void> {
    const uploadState = this.uploadStates.get(videoId);
    if (!uploadState) {
      throw new Error('Upload state not found');
    }

    let uploadedBytes = 0;
    const startTime = Date.now();

    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      // Check if upload was aborted
      if (signal?.aborted) {
        throw new Error('Upload aborted');
      }

      // Skip already uploaded chunks
      if (uploadState.uploadedChunks.has(chunkIndex)) {
        uploadedBytes += Math.min(chunkSize, file.size - chunkIndex * chunkSize);
        continue;
      }

      // Check if upload is paused
      if (uploadState.isPaused) {
        await this.waitForResume(videoId);
        if (signal?.aborted) {
          throw new Error('Upload aborted');
        }
      }

      const start = chunkIndex * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);

      let retryCount = 0;
      let chunkUploaded = false;

      while (retryCount < maxRetries && !chunkUploaded) {
        try {
          const chunkRequest: UploadChunkRequest = {
            videoId,
            chunkIndex,
            totalChunks,
            chunk,
            uploadId
          };

          await videoProcessingApi.uploadChunk(chunkRequest);
          
          // Mark chunk as uploaded
          uploadState.uploadedChunks.add(chunkIndex);
          uploadedBytes += chunk.size;

          // Update progress
          const progress: UploadProgress = {
            loaded: uploadedBytes,
            total: file.size,
            percentage: (uploadedBytes / file.size) * 100,
            speed: this.calculateUploadSpeed(uploadedBytes, startTime),
            estimatedTimeRemaining: this.calculateEstimatedTime(
              uploadedBytes,
              file.size,
              startTime
            )
          };

          onProgress?.(progress);

          chunkUploaded = true;

        } catch (error) {
          retryCount++;
          console.warn(`Chunk ${chunkIndex} upload failed (attempt ${retryCount}/${maxRetries}):`, error);

          if (retryCount >= maxRetries) {
            const errorMessage = `Failed to upload chunk ${chunkIndex} after ${maxRetries} attempts`;
            onError?.(new Error(errorMessage));
            throw new Error(errorMessage);
          }

          // Wait before retry
          await this.delay(VideoStorageService.RETRY_DELAY * retryCount);
        }
      }
    }
  }

  /**
   * Pause an active upload
   */
  pauseUpload(videoId: string): void {
    const uploadState = this.uploadStates.get(videoId);
    if (uploadState && !uploadState.isCompleted) {
      uploadState.isPaused = true;
      this.uploadStates.set(videoId, uploadState);
    }
  }

  /**
   * Resume a paused upload
   */
  resumeUpload(videoId: string): void {
    const uploadState = this.uploadStates.get(videoId);
    if (uploadState && uploadState.isPaused) {
      uploadState.isPaused = false;
      this.uploadStates.set(videoId, uploadState);
    }
  }

  /**
   * Cancel an active upload
   */
  cancelUpload(videoId: string): void {
    const uploadState = this.uploadStates.get(videoId);
    if (uploadState) {
      uploadState.isPaused = true;
      uploadState.isCompleted = true;
      this.uploadStates.set(videoId, uploadState);
    }

    const abortController = this.activeUploads.get(videoId);
    if (abortController) {
      abortController.abort();
      this.activeUploads.delete(videoId);
    }
  }

  /**
   * Get upload state for a video
   */
  getUploadState(videoId: string): ResumableUploadState | undefined {
    return this.uploadStates.get(videoId);
  }

  /**
   * Check if an upload is in progress
   */
  isUploadInProgress(videoId: string): boolean {
    const uploadState = this.uploadStates.get(videoId);
    return uploadState ? !uploadState.isCompleted && !uploadState.isPaused : false;
  }

  /**
   * Check if an upload is paused
   */
  isUploadPaused(videoId: string): boolean {
    const uploadState = this.uploadStates.get(videoId);
    return uploadState ? uploadState.isPaused : false;
  }

  /**
   * Generate signed URL for video access
   */
  async generateSignedUrl(videoPath: string, expiresIn: number = 3600): Promise<string> {
    // This would typically call your backend to generate a signed URL
    // For now, we'll return a mock URL
    return `${import.meta.env.VITE_CDN_URL || 'https://cdn.example.com'}/${videoPath}?expires=${Date.now() + expiresIn * 1000}`;
  }

  /**
   * Delete video and all associated files
   */
  async deleteVideo(videoId: string): Promise<void> {
    // Cancel any active upload
    this.cancelUpload(videoId);

    // Delete from storage
    await videoProcessingApi.deleteVideo(videoId);

    // Clean up local state
    this.uploadStates.delete(videoId);
    this.activeUploads.delete(videoId);
  }

  /**
   * Get video preview URL
   */
  async getVideoPreviewUrl(
    videoId: string,
    format: 'hls' | 'dash' | 'mp4' = 'hls',
    quality: '360p' | '720p' | '1080p' | '4k' = '720p'
  ): Promise<string> {
    const response = await videoProcessingApi.getPreviewUrl(videoId, format, quality);
    return response.url;
  }

  /**
   * Calculate upload speed in bytes per second
   */
  private calculateUploadSpeed(uploadedBytes: number, startTime: number): number {
    const elapsedTime = (Date.now() - startTime) / 1000; // seconds
    return elapsedTime > 0 ? uploadedBytes / elapsedTime : 0;
  }

  /**
   * Calculate estimated time remaining in seconds
   */
  private calculateEstimatedTime(uploadedBytes: number, totalBytes: number, startTime: number): number {
    const speed = this.calculateUploadSpeed(uploadedBytes, startTime);
    if (speed === 0) return 0;
    
    const remainingBytes = totalBytes - uploadedBytes;
    return remainingBytes / speed;
  }

  /**
   * Wait for upload to be resumed
   */
  private async waitForResume(videoId: string): Promise<void> {
    return new Promise((resolve) => {
      const checkResume = () => {
        const uploadState = this.uploadStates.get(videoId);
        if (uploadState && !uploadState.isPaused) {
          resolve();
        } else {
          setTimeout(checkResume, 100);
        }
      };
      checkResume();
    });
  }

  /**
   * Delay utility
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Validate file before upload
   */
  private validateFile(file: File): void {
    // Check file type
    const allowedTypes = [
      'video/mp4',
      'video/quicktime',
      'video/x-msvideo',
      'video/x-matroska',
      'video/webm',
      'video/avi',
      'video/mov'
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Unsupported file type: ${file.type}. Supported types: ${allowedTypes.join(', ')}`);
    }

    // Check file size (500MB limit)
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (file.size > maxSize) {
      throw new Error(`File size too large: ${this.formatFileSize(file.size)}. Maximum size: ${this.formatFileSize(maxSize)}`);
    }

    // Check minimum file size (1MB)
    const minSize = 1024 * 1024; // 1MB
    if (file.size < minSize) {
      throw new Error(`File size too small: ${this.formatFileSize(file.size)}. Minimum size: ${this.formatFileSize(minSize)}`);
    }
  }

  /**
   * Format file size for display
   */
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get upload statistics
   */
  getUploadStats(): {
    activeUploads: number;
    completedUploads: number;
    totalUploads: number;
  } {
    const uploads = Array.from(this.uploadStates.values());
    return {
      activeUploads: uploads.filter(u => !u.isCompleted && !u.isPaused).length,
      completedUploads: uploads.filter(u => u.isCompleted).length,
      totalUploads: uploads.length
    };
  }

  /**
   * Clean up completed uploads
   */
  cleanup(): void {
    // Remove completed uploads older than 1 hour
    for (const [videoId, uploadState] of this.uploadStates.entries()) {
      if (uploadState.isCompleted) {
        // In a real implementation, you'd check the completion timestamp
        // For now, we'll just clean up all completed uploads
        this.uploadStates.delete(videoId);
      }
    }
  }
}

// Export singleton instance
export const videoStorageService = new VideoStorageService();