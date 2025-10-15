import React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Image, 
  Upload, 
  CheckCircle,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ThumbnailSelectorProps {
  thumbnails: string[];
  selectedThumbnail?: string;
  onThumbnailSelect: (thumbnailUrl: string) => void;
  onCustomUpload: (file: File) => void;
  isProcessing?: boolean;
}

export function ThumbnailSelector({ 
  thumbnails, 
  selectedThumbnail, 
  onThumbnailSelect,
  onCustomUpload,
  isProcessing = false 
}: ThumbnailSelectorProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      onCustomUpload(file);
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setTimeout(() => setIsUploading(false), 1000);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  if (isProcessing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Thumbnail Selection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center py-8">
            <div className="text-center space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto"></div>
              <p className="text-sm text-muted-foreground">
                Generating thumbnails...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          Select Thumbnail
          <Badge variant="secondary" className="ml-auto">
            {thumbnails.length} options
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Thumbnail Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {thumbnails.map((thumbnail, index) => (
            <div
              key={index}
              className={cn(
                "relative aspect-video rounded-lg border-2 cursor-pointer transition-all hover:scale-105",
                selectedThumbnail === thumbnail 
                  ? "border-primary ring-2 ring-primary/20" 
                  : "border-border hover:border-primary/50"
              )}
              onClick={() => onThumbnailSelect(thumbnail)}
            >
              <img
                src={thumbnail}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              {selectedThumbnail === thumbnail && (
                <div className="absolute inset-0 flex items-center justify-center bg-primary/20 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
              )}
              <div className="absolute bottom-1 right-1">
                <Badge variant="secondary" className="text-xs">
                  {Math.floor(index * 2.5)}s
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Upload */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">Custom Thumbnail</h4>
              <p className="text-xs text-muted-foreground">
                Upload your own thumbnail image
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleUploadClick}
              disabled={isUploading}
            >
              {isUploading ? (
                <Clock className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* Selected Thumbnail Preview */}
        {selectedThumbnail && (
          <div className="pt-4 border-t">
            <div className="flex items-center gap-3">
              <div className="w-16 h-12 rounded border overflow-hidden">
                <img
                  src={selectedThumbnail}
                  alt="Selected thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-medium">Selected Thumbnail</p>
                <p className="text-xs text-muted-foreground">
                  This will be shown in the video library
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
