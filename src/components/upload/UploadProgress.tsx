import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  CheckCircle, 
  AlertCircle,
  Pause,
  Play,
  X
} from "lucide-react";

interface UploadProgressProps {
  fileName: string;
  fileSize: number;
  progress: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
  onPause?: () => void;
  onResume?: () => void;
  onCancel?: () => void;
  onRetry?: () => void;
  isPaused?: boolean;
  uploadSpeed?: number; // bytes per second
  estimatedTime?: number; // seconds remaining
}

export function UploadProgress({
  fileName,
  fileSize,
  progress,
  status,
  error,
  onPause,
  onResume,
  onCancel,
  onRetry,
  isPaused = false,
  uploadSpeed,
  estimatedTime
}: UploadProgressProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatSpeed = (bytesPerSecond: number) => {
    return formatFileSize(bytesPerSecond) + '/s';
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'uploading':
      case 'processing':
        return <Upload className="h-5 w-5 text-blue-500" />;
      default:
        return <Upload className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'uploading':
        return isPaused ? 'Upload paused' : 'Uploading...';
      case 'processing':
        return 'Processing video...';
      case 'complete':
        return 'Upload complete!';
      case 'error':
        return 'Upload failed';
      default:
        return 'Preparing upload...';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'complete':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'uploading':
      case 'processing':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          {getStatusIcon()}
          {getStatusText()}
          <Badge 
            variant="secondary" 
            className={`ml-auto ${getStatusColor()} text-white`}
          >
            {Math.round(progress)}%
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Info */}
        <div className="space-y-1">
          <p className="text-sm font-medium truncate">{fileName}</p>
          <p className="text-xs text-muted-foreground">
            {formatFileSize(fileSize)}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{Math.round(progress)}% complete</span>
            {uploadSpeed && (
              <span>{formatSpeed(uploadSpeed)}</span>
            )}
          </div>
        </div>

        {/* Upload Stats */}
        {(status === 'uploading' || status === 'processing') && (
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-muted-foreground">Uploaded</p>
              <p className="font-medium">{formatFileSize((fileSize * progress) / 100)}</p>
            </div>
            {estimatedTime && (
              <div>
                <p className="text-muted-foreground">Time remaining</p>
                <p className="font-medium">{formatTime(estimatedTime)}</p>
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {status === 'error' && error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            {status === 'uploading' && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={isPaused ? onResume : onPause}
                >
                  {isPaused ? (
                    <Play className="h-4 w-4 mr-1" />
                  ) : (
                    <Pause className="h-4 w-4 mr-1" />
                  )}
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onCancel}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </>
            )}
            {status === 'error' && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
              >
                <Upload className="h-4 w-4 mr-1" />
                Retry
              </Button>
            )}
          </div>
          
          {status === 'complete' && (
            <div className="text-sm text-green-600 dark:text-green-400">
              Ready for processing
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
