import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoLoadingOverlayProps {
  className?: string;
}

export function VideoLoadingOverlay({ className }: VideoLoadingOverlayProps) {
  return (
    <div className={cn(
      "absolute inset-0 flex items-center justify-center",
      "bg-black/50 backdrop-blur-sm",
      className
    )}>
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
        <p className="text-white text-sm font-medium">Loading video...</p>
      </div>
    </div>
  );
}