import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  BookOpen, 
  Eye, 
  EyeOff, 
  Trash2, 
  Download, 
  Share2, 
  MoreVertical,
  X,
  CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface BulkActionsProps {
  selectedVideos: string[];
  onClearSelection: () => void;
  onBulkAction: (action: string, videoIds: string[]) => void;
  className?: string;
}

export function BulkActions({
  selectedVideos,
  onClearSelection,
  onBulkAction,
  className,
}: BulkActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (selectedVideos.length === 0) {
    return null;
  }

  const handleBulkAction = async (action: string) => {
    if (action === "delete") {
      setShowDeleteDialog(true);
      return;
    }

    setIsProcessing(true);
    try {
      await onBulkAction(action, selectedVideos);
      toast.success(`${action} completed for ${selectedVideos.length} video${selectedVideos.length !== 1 ? "s" : ""}`);
    } catch (error) {
      toast.error(`Failed to ${action} videos`);
      console.error(`Bulk ${action} error:`, error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsProcessing(true);
    try {
      await onBulkAction("delete", selectedVideos);
      toast.success(`Deleted ${selectedVideos.length} video${selectedVideos.length !== 1 ? "s" : ""}`);
      setShowDeleteDialog(false);
    } catch (error) {
      toast.error("Failed to delete videos");
      console.error("Bulk delete error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const actionItems = [
    {
      id: "assign",
      label: "Assign to Course",
      icon: BookOpen,
      description: "Add selected videos to a course",
    },
    {
      id: "make-public",
      label: "Make Public",
      icon: Eye,
      description: "Change visibility to public",
    },
    {
      id: "make-private",
      label: "Make Private",
      icon: EyeOff,
      description: "Change visibility to private",
    },
    {
      id: "export",
      label: "Export",
      icon: Download,
      description: "Download video metadata",
    },
    {
      id: "share",
      label: "Share",
      icon: Share2,
      description: "Generate shareable links",
    },
  ];

  return (
    <>
      <div className={cn(
        "sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b",
        className
      )}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="font-medium">
                {selectedVideos.length} video{selectedVideos.length !== 1 ? "s" : ""} selected
              </span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {selectedVideos.length} selected
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" disabled={isProcessing}>
                  <MoreVertical className="h-4 w-4 mr-2" />
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {actionItems.map((item) => (
                  <DropdownMenuItem
                    key={item.id}
                    onClick={() => handleBulkAction(item.id)}
                    disabled={isProcessing}
                    className="flex items-center gap-2"
                  >
                    <item.icon className="h-4 w-4" />
                    <div className="flex flex-col">
                      <span>{item.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {item.description}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleBulkAction("delete")}
                  disabled={isProcessing}
                  className="flex items-center gap-2 text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  <div className="flex flex-col">
                    <span>Delete</span>
                    <span className="text-xs text-muted-foreground">
                      Permanently delete videos
                    </span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClearSelection}
              disabled={isProcessing}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Videos</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedVideos.length} video{selectedVideos.length !== 1 ? "s" : ""}? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
