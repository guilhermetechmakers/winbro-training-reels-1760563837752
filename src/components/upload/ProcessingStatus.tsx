import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  RotateCcw,
  X,
  Loader2,
  Video,
  Image,
  Zap,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useVideoProcessing } from "@/hooks/use-video-processing";

interface ProcessingStatusProps {
  videoId: string;
  onComplete?: (video: any) => void;
  onError?: (error: string) => void;
  showDetails?: boolean;
  compact?: boolean;
}

export function ProcessingStatus({ 
  videoId, 
  onComplete, 
  onError, 
  showDetails = true,
  compact = false 
}: ProcessingStatusProps) {
  const {
    processingStatus,
    videoDetails,
    isProcessing,
    isCompleted,
    isFailed,
    currentStage,
    overallProgress,
    retry,
    cancel,
    isRetrying,
    isCancelling,
    isLoadingStatus
  } = useVideoProcessing({ videoId });

  const [showRetryDialog, setShowRetryDialog] = useState(false);
  const [retryReason, setRetryReason] = useState("");

  // Handle completion
  useEffect(() => {
    if (isCompleted && videoDetails && onComplete) {
      onComplete(videoDetails);
    }
  }, [isCompleted, videoDetails, onComplete]);

  // Handle error
  useEffect(() => {
    if (isFailed && processingStatus?.error && onError) {
      onError(processingStatus.error);
    }
  }, [isFailed, processingStatus?.error, onError]);

  const getStatusIcon = () => {
    if (isCompleted) return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (isFailed) return <AlertCircle className="h-5 w-5 text-red-500" />;
    if (isProcessing) return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
    return <Clock className="h-5 w-5 text-muted-foreground" />;
  };

  const getStatusText = () => {
    if (isCompleted) return "Processing Complete";
    if (isFailed) return "Processing Failed";
    if (isProcessing) return "Processing Video";
    return "Queued for Processing";
  };

  const getStatusColor = () => {
    if (isCompleted) return "bg-green-500";
    if (isFailed) return "bg-red-500";
    if (isProcessing) return "bg-blue-500";
    return "bg-gray-500";
  };

  const getStageIcon = (stageName: string) => {
    switch (stageName.toLowerCase()) {
      case 'upload validation':
        return <Video className="h-4 w-4" />;
      case 'video analysis':
        return <Zap className="h-4 w-4" />;
      case 'transcoding':
        return <Video className="h-4 w-4" />;
      case 'thumbnail generation':
        return <Image className="h-4 w-4" />;
      case 'quality check':
        return <CheckCircle className="h-4 w-4" />;
      case 'cdn distribution':
        return <Globe className="h-4 w-4" />;
      default:
        return <Loader2 className="h-4 w-4" />;
    }
  };

  const getStageStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'in_progress':
        return 'text-blue-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const handleRetry = () => {
    retry(retryReason || undefined);
    setShowRetryDialog(false);
    setRetryReason("");
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (isLoadingStatus) {
    return (
      <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">Loading processing status...</p>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
        {getStatusIcon()}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{getStatusText()}</p>
          {currentStage && (
            <p className="text-xs text-muted-foreground truncate">
              {currentStage.message || currentStage.name}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Progress value={overallProgress} className="w-16 h-2" />
          <span className="text-xs text-muted-foreground">
            {Math.round(overallProgress)}%
          </span>
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          {getStatusIcon()}
          {getStatusText()}
          <Badge 
            variant="secondary" 
            className={`ml-auto ${getStatusColor()} text-white`}
          >
            {Math.round(overallProgress)}%
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Overall Progress</span>
            <span className="font-medium">{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>

        {/* Current Stage */}
        {currentStage && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-2">
              {getStageIcon(currentStage.name)}
              <div className="flex-1">
                <p className="text-sm font-medium">{currentStage.name}</p>
                <p className="text-xs text-muted-foreground">
                  {currentStage.message || 'Processing...'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{currentStage.progress}%</p>
                <Progress value={currentStage.progress} className="w-16 h-1 mt-1" />
              </div>
            </div>
          </div>
        )}

        {/* Processing Stages */}
        {showDetails && processingStatus?.processingStages && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Processing Stages</h4>
            <div className="space-y-1">
              {processingStatus.processingStages.map((stage, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center space-x-3 p-2 rounded-lg transition-colors",
                    stage.status === 'in_progress' && "bg-blue-50 dark:bg-blue-950/20",
                    stage.status === 'completed' && "bg-green-50 dark:bg-green-950/20",
                    stage.status === 'failed' && "bg-red-50 dark:bg-red-950/20"
                  )}
                >
                  <div className="flex-shrink-0">
                    {stage.status === 'completed' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : stage.status === 'in_progress' ? (
                      <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                    ) : stage.status === 'failed' ? (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm font-medium",
                      getStageStatusColor(stage.status)
                    )}>
                      {stage.name}
                    </p>
                    {stage.message && (
                      <p className="text-xs text-muted-foreground truncate">
                        {stage.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {stage.status === 'in_progress' && (
                      <Progress value={stage.progress} className="w-12 h-1" />
                    )}
                    <span className="text-xs text-muted-foreground">
                      {stage.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Estimated Time */}
        {processingStatus?.estimatedTimeRemaining && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              Estimated time remaining: {formatTime(processingStatus.estimatedTimeRemaining)}
            </span>
          </div>
        )}

        {/* Error Message */}
        {isFailed && processingStatus?.error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {processingStatus.error}
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            {isFailed && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRetryDialog(true)}
                disabled={isRetrying}
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                {isRetrying ? 'Retrying...' : 'Retry'}
              </Button>
            )}
            
            {isProcessing && (
              <Button
                variant="outline"
                size="sm"
                onClick={cancel}
                disabled={isCancelling}
              >
                <X className="h-4 w-4 mr-1" />
                {isCancelling ? 'Cancelling...' : 'Cancel'}
              </Button>
            )}
          </div>
          
          {isCompleted && (
            <div className="text-sm text-green-600 dark:text-green-400">
              Ready for viewing
            </div>
          )}
        </div>
      </CardContent>

      {/* Retry Dialog */}
      {showRetryDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Retry Processing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Reason for retry (optional)</label>
                <textarea
                  value={retryReason}
                  onChange={(e) => setRetryReason(e.target.value)}
                  placeholder="Describe why you're retrying the processing..."
                  className="w-full mt-1 p-2 border rounded-md resize-none"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowRetryDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleRetry}
                  disabled={isRetrying}
                >
                  {isRetrying ? 'Retrying...' : 'Retry Processing'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Card>
  );
}