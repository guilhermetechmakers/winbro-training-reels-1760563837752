import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  Camera, 
  FileVideo, 
  Pause, 
  Play,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadWidgetProps {
  onFileSelect: (file: File) => void;
  onCameraCapture: () => void;
  uploadProgress?: number;
  uploadStatus?: 'idle' | 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
  onRetry?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  isPaused?: boolean;
}

export function UploadWidget({
  onFileSelect,
  onCameraCapture,
  uploadProgress = 0,
  uploadStatus = 'idle',
  error,
  onRetry,
  onPause,
  onResume,
  isPaused = false
}: UploadWidgetProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      onFileSelect(file);
    }
  };

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'complete':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-8 w-8 text-red-500" />;
      case 'uploading':
      case 'processing':
        return <FileVideo className="h-8 w-8 text-blue-500 animate-pulse" />;
      default:
        return <Upload className="h-8 w-8 text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    switch (uploadStatus) {
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
    if (uploadStatus === 'uploading' && uploadProgress > 0) {
      return `${Math.round(uploadProgress)}% uploaded`;
    }
    if (uploadStatus === 'error') {
      return error || 'Please try again';
    }
    if (uploadStatus === 'processing') {
      return 'AI is analyzing your video...';
    }
    return 'Supports MP4, MOV, AVI, MKV, WebM (max 500MB)';
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
            {uploadStatus === 'uploading' && (
              <div className="w-full space-y-2">
                <Progress value={uploadProgress} className="h-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{Math.round(uploadProgress)}% complete</span>
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
            {uploadStatus === 'idle' && (
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFileSelect();
                  }}
                  className="flex-1"
                  size="lg"
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
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Record
                </Button>
              </div>
            )}

            {/* Error State Actions */}
            {uploadStatus === 'error' && (
              <div className="flex gap-3">
                <Button onClick={onRetry} size="lg">
                  <Upload className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
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
            {uploadStatus === 'complete' && (
              <div className="flex gap-3">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
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
      {uploadStatus === 'processing' && (
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
    </div>
  );
}
