import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Edit3, 
  CheckCircle, 
  Play,
  Pause
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
}

interface TranscriptEditorProps {
  transcript: {
    text: string;
    segments: TranscriptSegment[];
  };
  onTranscriptChange: (transcript: { text: string; segments: TranscriptSegment[] }) => void;
  isProcessing?: boolean;
  processingProgress?: number;
}

export function TranscriptEditor({ 
  transcript, 
  onTranscriptChange, 
  isProcessing = false,
  processingProgress = 0 
}: TranscriptEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(transcript.text);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSave = () => {
    // In a real implementation, you'd need to re-segment the text
    // For now, we'll just update the text
    onTranscriptChange({
      ...transcript,
      text: editedText
    });
    setIsEditing(false);
  };


  const handleSegmentClick = (startTime: number) => {
    setCurrentTime(startTime);
    // In a real implementation, you'd seek the video to this time
  };

  if (isProcessing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            AI Transcription
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Processing transcript...</span>
              <span>{Math.round(processingProgress)}%</span>
            </div>
            <Progress value={processingProgress} className="h-2" />
          </div>
          <p className="text-sm text-muted-foreground">
            Our AI is analyzing your video and generating a transcript with timestamps.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Transcript
          <Badge variant="secondary" className="ml-auto">
            {transcript.segments.length} segments
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Video Controls */}
        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <span className="text-sm font-mono">
            {formatTime(currentTime)} / {formatTime(transcript.segments[transcript.segments.length - 1]?.end || 0)}
          </span>
        </div>

        {/* Transcript Segments */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {transcript.segments.map((segment, index) => (
            <div
              key={index}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50",
                currentTime >= segment.start && currentTime <= segment.end && "bg-primary/10 border-primary/20"
              )}
              onClick={() => handleSegmentClick(segment.start)}
            >
              <div className="flex-shrink-0">
                <Badge variant="outline" className="text-xs">
                  {formatTime(segment.start)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground flex-1">
                {segment.text}
              </p>
            </div>
          ))}
        </div>

        {/* Edit Controls */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              {isEditing ? "Cancel" : "Edit"}
            </Button>
            {isEditing && (
              <Button
                size="sm"
                onClick={handleSave}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Save
              </Button>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            Click segments to jump to that time
          </div>
        </div>

        {/* Edit Mode */}
        {isEditing && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Edit Transcript:</label>
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-full h-32 p-3 border rounded-md text-sm resize-none"
              placeholder="Edit the transcript text..."
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
