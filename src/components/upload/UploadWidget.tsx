import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  Camera, 
  FileVideo, 
  Pause, 
  Play,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  X,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUpload } from "@/hooks/use-upload";
import type { VideoMetadata } from "@/types";

interface UploadWidgetProps {
  onFileSelect: (file: File) => void;
  onCameraCapture: () => void;
  onUploadComplete?: (videoId: string) => void;
  onUploadError?: (error: string) => void;
  uploadProgress?: number;
  uploadStatus?: 'idle' | 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
  onRetry?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  isPaused?: boolean;
  metadata?: VideoMetadata;
  maxFileSize?: number; // in bytes
  allowedFormats?: string[];
}

export function UploadWidget({
  onFileSelect,
  onCameraCapture,
  onUploadComplete,
  onUploadError,
  uploadProgress = 0,
  uploadStatus = 'idle',
  error,
  onRetry,
  onPause,
  onResume,
  isPaused = false,
  metadata,
  maxFileSize = 500 * 1024 * 1024, // 500MB default
  allowedFormats = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'video/webm']
}: UploadWidgetProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    uploadState,
    uploadFile,
    resetUpload,
    isUploading: isHookUploading,
    uploadError: hookError
  } = useUpload();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    const videoFile = files.find(file => file.type.startsWith('video/'));
    
    if (videoFile) {
      onFileSelect(videoFile);
    }
  }, [onFileSelect]);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    // Validate file
    if (!allowedFormats.includes(file.type)) {
      onUploadError?.('Unsupported file format. Please select a video file.');
      return;
    }

    if (file.size > maxFileSize) {
      onUploadError?.(`File size must be less than ${formatFileSize(maxFileSize)}`);
      return;
    }

    setSelectedFile(file);

    try {
      if (metadata) {
        // Use the enhanced upload with processing
        const videoId = await uploadFile(file, metadata);
        if (videoId && onUploadComplete) {
          onUploadComplete(videoId);
        }
      } else {
        // Use the simple file selection
        onFileSelect(file);
      }
    } catch (error) {
      console.error('Upload error:', error);
      onUploadError?.(error instanceof Error ? error.message : 'Upload failed');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };


  // Handle upload completion
  useEffect(() => {
    const currentVideoId = uploadState.currentFile?.processingJobId;
    if (currentVideoId && onUploadComplete) {
      onUploadComplete(currentVideoId);
    }
  }, [uploadState.currentFile?.processingJobId, onUploadComplete]);

  // Handle upload error
  useEffect(() => {
    if (hookError && onUploadError) {
      onUploadError(hookError.message || 'Upload failed');
    }
  }, [hookError, onUploadError]);

  // Reset upload state when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (selectedFile) {
        resetUpload();
      }
    };
  }, [selectedFile, resetUpload]);

  const getStatusIcon = () => {
    const currentStatus = metadata ? uploadState.currentFile?.status : uploadStatus;
    switch (currentStatus) {
      case 'complete':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-8 w-8 text-red-500" />;
      case 'uploading':
        return <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />;
      case 'processing':
        return <FileVideo className="h-8 w-8 text-blue-500 animate-pulse" />;
      default:
        return <Upload className="h-8 w-8 text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    const currentStatus = metadata ? uploadState.currentFile?.status : uploadStatus;
    switch (currentStatus) {
      case 'uploading':
        return isPaused ? 'Upload paused' : 'Uploading...';
      case 'processing':
        return 'Processing video...';
      case 'complete':
        return 'Upload complete!';
      case 'error':
        return 'Upload failed';
      default:
        return 'Drop your video here or click to browse';
    }
  };

  const getSubText = () => {
    const currentStatus = metadata ? uploadState.currentFile?.status : uploadStatus;
    const currentProgress = metadata ? uploadState.currentFile?.progress : uploadProgress;
    const currentError = metadata ? hookError : error;

    if (currentStatus === 'uploading' && currentProgress && currentProgress > 0) {
      return `${Math.round(currentProgress)}% uploaded`;
    }
    if (currentStatus === 'error') {
      return (currentError instanceof Error ? currentError.message : currentError) || 'Please try again';
    }
    if (currentStatus === 'processing') {
      return 'AI is analyzing your video...';
    }
    return `Supports ${allowedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')} (max ${formatFileSize(maxFileSize)})`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="border-2 border-dashed transition-all duration-300 hover:border-primary/50">
        <CardContent className="p-8">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "flex flex-col items-center justify-center space-y-6 p-8 rounded-lg transition-all duration-300 cursor-pointer",
              isDragActive && "bg-primary/5 border-primary/20",
              uploadStatus !== 'idle' && "cursor-default"
            )}
          >
            <input
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="video/*"
              type="file"
            />

            {/* Status Icon */}
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted/50">
              {getStatusIcon()}
            </div>

            {/* Status Text */}
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                {getStatusText()}
              </h3>
              <p className="text-sm text-muted-foreground">
                {getSubText()}
              </p>
            </div>

            {/* Upload Progress */}
            {(uploadStatus === 'uploading' || (metadata && uploadState.currentFile?.status === 'uploading')) && (
              <div className="w-full space-y-2">
                <Progress 
                  value={metadata ? uploadState.currentFile?.progress : uploadProgress} 
                  className="h-2" 
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{Math.round((metadata ? uploadState.currentFile?.progress : uploadProgress) || 0)}% complete</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        isPaused ? onResume?.() : onPause?.();
                      }}
                      className="h-6 px-2"
                    >
                      {isPaused ? (
                        <Play className="h-3 w-3" />
                      ) : (
                        <Pause className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {(uploadStatus === 'idle' && (!metadata || !uploadState.currentFile)) && (
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFileSelect();
                  }}
                  className="flex-1"
                  size="lg"
                  disabled={isHookUploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCameraCapture();
                  }}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                  disabled={isHookUploading}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Record
                </Button>
              </div>
            )}

            {/* Error State Actions */}
            {(uploadStatus === 'error' || (metadata && uploadState.currentFile?.status === 'error')) && (
              <div className="flex gap-3">
                <Button 
                  onClick={() => {
                    if (metadata) {
                      resetUpload();
                    } else {
                      onRetry?.();
                    }
                  }} 
                  size="lg"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (metadata) {
                      resetUpload();
                    }
                    handleFileSelect();
                  }}
                  variant="outline"
                  size="lg"
                >
                  <FileVideo className="h-4 w-4 mr-2" />
                  Choose Different File
                </Button>
              </div>
            )}

            {/* Success State Actions */}
            {(uploadStatus === 'complete' || (metadata && uploadState.currentFile?.status === 'complete')) && (
              <div className="flex gap-3">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (metadata) {
                      resetUpload();
                    }
                    handleFileSelect();
                  }}
                  variant="outline"
                  size="lg"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Another
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Processing Status */}
      {(uploadStatus === 'processing' || (metadata && uploadState.currentFile?.status === 'processing')) && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-medium">Processing your video...</p>
              <p className="text-xs">This may take a few minutes depending on video length</p>
            </div>
          </div>
        </div>
      )}

      {/* File Info */}
      {selectedFile && (
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileVideo className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium truncate">{selectedFile.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {formatFileSize(selectedFile.size)}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedFile(null);
                  resetUpload();
                }}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
