import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  FileText, 
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Eye,
  Send,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUpload } from "@/hooks/use-upload";
import { UploadWidget } from "@/components/upload/UploadWidget";
import { ProcessingStatus } from "@/components/upload/ProcessingStatus";
import { CaptureGuidelines } from "@/components/upload/CaptureGuidelines";
import { MetadataForm } from "@/components/upload/MetadataForm";
import { TranscriptEditor } from "@/components/upload/TranscriptEditor";
import { ThumbnailSelector } from "@/components/upload/ThumbnailSelector";
import type { VideoMetadata, AIProcessingResult } from "@/types";

type UploadStep = 'upload' | 'metadata' | 'processing' | 'review' | 'complete';

export function UploadPage() {
  const [currentStep, setCurrentStep] = useState<UploadStep>('upload');
  const [isPaused, setIsPaused] = useState(false);
  const [uploadedVideoId, setUploadedVideoId] = useState<string | null>(null);
  const [showProcessingStatus, setShowProcessingStatus] = useState(false);
  
  const {
    uploadState,
    uploadFile,
    completeUpload,
    publishVideo,
    updateMetadata,
    updateAIResults,
    selectThumbnail,
    resetUpload,
    isCompleting,
    isPublishing
  } = useUpload();

  // Mock AI processing simulation
  useEffect(() => {
    if (uploadState.currentFile?.status === 'processing' && !uploadState.aiResults) {
      // Simulate AI processing
      setTimeout(() => {
        const mockAIResults: AIProcessingResult = {
          transcript: {
            text: "This is a sample transcript of the video content. It demonstrates the machining process step by step.",
            segments: [
              { start: 0, end: 5, text: "First, we'll set up the workpiece" },
              { start: 5, end: 10, text: "Next, we'll align the cutting tool" },
              { start: 10, end: 15, text: "Then we'll begin the machining operation" },
              { start: 15, end: 20, text: "Finally, we'll inspect the finished part" }
            ]
          },
          suggestedTags: [
            { tag: "Machining", confidence: 0.95 },
            { tag: "Setup", confidence: 0.87 },
            { tag: "Quality Control", confidence: 0.82 }
          ],
          thumbnails: [
            "https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Thumbnail+1",
            "https://via.placeholder.com/300x200/059669/FFFFFF?text=Thumbnail+2",
            "https://via.placeholder.com/300x200/DC2626/FFFFFF?text=Thumbnail+3",
            "https://via.placeholder.com/300x200/7C3AED/FFFFFF?text=Thumbnail+4"
          ]
        };
        updateAIResults(mockAIResults);
        setCurrentStep('review');
      }, 3000);
    }
  }, [uploadState.currentFile?.status, uploadState.aiResults, updateAIResults]);

  const handleFileSelect = async (file: File) => {
    await uploadFile(file);
    setCurrentStep('metadata');
  };

  const handleUploadComplete = (videoId: string) => {
    setUploadedVideoId(videoId);
    setShowProcessingStatus(true);
    setCurrentStep('processing');
  };

  const handleUploadError = (error: string) => {
    console.error('Upload error:', error);
    // Error handling is already done in the UploadWidget
  };

  const handleProcessingComplete = () => {
    setCurrentStep('review');
  };

  const handleProcessingError = (error: string) => {
    console.error('Processing error:', error);
    // Error handling is already done in the ProcessingStatus component
  };

  const handleCameraCapture = () => {
    // In a real implementation, this would open the camera
    console.log("Camera capture not implemented yet");
  };

  const handleMetadataSubmit = async (metadata: VideoMetadata) => {
    updateMetadata(metadata);
    await completeUpload(metadata);
    setCurrentStep('processing');
  };

  const handlePublish = async (publishNow: boolean) => {
    await publishVideo(publishNow);
    setCurrentStep('complete');
  };

  const handleRetry = () => {
    if (uploadState.currentFile) {
      uploadFile(uploadState.currentFile.file);
    }
  };

  const handlePause = () => {
    setIsPaused(true);
    // In a real implementation, this would pause the upload
  };

  const handleResume = () => {
    setIsPaused(false);
    // In a real implementation, this would resume the upload
  };

  const steps = [
    { id: 'upload', title: 'Upload Video', icon: Upload },
    { id: 'metadata', title: 'Add Metadata', icon: FileText },
    { id: 'processing', title: 'AI Processing', icon: CheckCircle },
    { id: 'review', title: 'Review & Publish', icon: Eye },
    { id: 'complete', title: 'Complete', icon: CheckCircle }
  ];

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === currentStep);
  };

  const canGoBack = () => {
    const currentIndex = getCurrentStepIndex();
    return currentIndex > 0 && currentStep !== 'complete';
  };

  const canGoForward = () => {
    const currentIndex = getCurrentStepIndex();
    return currentIndex < steps.length - 1 && currentStep !== 'complete';
  };

  const handleBack = () => {
    if (canGoBack()) {
      const currentIndex = getCurrentStepIndex();
      setCurrentStep(steps[currentIndex - 1].id as UploadStep);
    }
  };

  const handleNext = () => {
    if (canGoForward()) {
      const currentIndex = getCurrentStepIndex();
      setCurrentStep(steps[currentIndex + 1].id as UploadStep);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'upload':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Upload Your Training Video</h2>
              <p className="text-muted-foreground">
                Share your expertise by uploading a training video
              </p>
            </div>
            
            <UploadWidget
              onFileSelect={handleFileSelect}
              onCameraCapture={handleCameraCapture}
              onUploadComplete={handleUploadComplete}
              onUploadError={handleUploadError}
              uploadProgress={uploadState.currentFile?.progress}
              uploadStatus={uploadState.currentFile?.status}
              error={uploadState.currentFile?.error}
              onRetry={handleRetry}
              onPause={handlePause}
              onResume={handleResume}
              isPaused={isPaused}
              metadata={uploadState.metadata}
            />
          </div>
        );

      case 'metadata':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Add Video Details</h2>
              <p className="text-muted-foreground">
                Help others find your video with descriptive metadata
              </p>
            </div>
            
            <MetadataForm
              onSubmit={handleMetadataSubmit}
              isLoading={isCompleting}
            />
          </div>
        );

      case 'processing':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Video Processing</h2>
              <p className="text-muted-foreground">
                Your video is being processed and optimized for streaming
              </p>
            </div>
            
            {uploadedVideoId && showProcessingStatus ? (
              <ProcessingStatus
                videoId={uploadedVideoId}
                onComplete={handleProcessingComplete}
                onError={handleProcessingError}
                showDetails={true}
              />
            ) : (
              <div className="flex items-center justify-center p-8">
                <div className="text-center space-y-4">
                  <Loader2 className="h-12 w-12 text-muted-foreground animate-spin mx-auto" />
                  <div>
                    <p className="text-lg font-medium">Processing your video...</p>
                    <p className="text-sm text-muted-foreground">
                      This may take a few minutes depending on video length
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Review & Publish</h2>
              <p className="text-muted-foreground">
                Review the AI-generated content and publish your video
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <TranscriptEditor
                  transcript={uploadState.aiResults?.transcript || { text: "", segments: [] }}
                  onTranscriptChange={(transcript) => {
                    if (uploadState.aiResults) {
                      updateAIResults({ ...uploadState.aiResults, transcript });
                    }
                  }}
                />
                
                <ThumbnailSelector
                  thumbnails={uploadState.aiResults?.thumbnails || []}
                  selectedThumbnail={uploadState.selectedThumbnail}
                  onThumbnailSelect={selectThumbnail}
                  onCustomUpload={(file) => {
                    console.log("Custom thumbnail upload:", file);
                  }}
                />
              </div>
              
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Publish Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      onClick={() => handlePublish(true)}
                      className="w-full"
                      size="lg"
                      disabled={isPublishing}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Publish Now
                    </Button>
                    
                    <Button
                      onClick={() => handlePublish(false)}
                      variant="outline"
                      className="w-full"
                      size="lg"
                      disabled={isPublishing}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Submit for Review
                    </Button>
                    
                    <div className="text-xs text-muted-foreground text-center">
                      {uploadState.metadata?.isCustomerSpecific 
                        ? "This video is customer-specific" 
                        : "This video will be available to all users"
                      }
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Video Published Successfully!</h2>
              <p className="text-muted-foreground">
                Your training video has been published and is now available in the library.
              </p>
            </div>
            
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => {
                  resetUpload();
                  setCurrentStep('upload');
                }}
                variant="outline"
              >
                Upload Another Video
              </Button>
              <Button
                onClick={() => window.location.href = '/library'}
              >
                View in Library
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Upload Training Video</h1>
          <p className="text-muted-foreground mt-2">
            Create and share training content with your team
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isActive = step.id === currentStep;
              const isCompleted = getCurrentStepIndex() > index;
              const StepIcon = step.icon;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center space-y-2">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                        isActive && "border-primary bg-primary text-primary-foreground",
                        isCompleted && "border-green-500 bg-green-500 text-white",
                        !isActive && !isCompleted && "border-muted-foreground text-muted-foreground"
                      )}
                    >
                      <StepIcon className="h-5 w-5" />
                    </div>
                    <span className={cn(
                      "text-sm font-medium",
                      isActive && "text-primary",
                      isCompleted && "text-green-600",
                      !isActive && !isCompleted && "text-muted-foreground"
                    )}>
                      {step.title}
                    </span>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className={cn(
                      "w-16 h-0.5 mx-4",
                      isCompleted ? "bg-green-500" : "bg-muted-foreground/30"
                    )} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Guidelines */}
          {currentStep === 'upload' && (
            <div className="lg:col-span-1">
              <CaptureGuidelines />
            </div>
          )}

          {/* Main Content Area */}
          <div className={cn(
            "space-y-6",
            currentStep === 'upload' ? "lg:col-span-3" : "lg:col-span-4"
          )}>
            {renderStepContent()}
          </div>
        </div>

        {/* Navigation */}
        {currentStep !== 'complete' && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={!canGoBack()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                Step {getCurrentStepIndex() + 1} of {steps.length}
              </Badge>
            </div>
            
            <Button
              onClick={handleNext}
              disabled={!canGoForward()}
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
