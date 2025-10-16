import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VideoErrorOverlayProps {
  error: string;
  onRetry: () => void;
  className?: string;
}

export function VideoErrorOverlay({ error, onRetry, className }: VideoErrorOverlayProps) {
  return (
    <div className={cn(
      "absolute inset-0 flex items-center justify-center",
      "bg-black/80 backdrop-blur-sm",
      className
    )}>
      <div className="flex flex-col items-center gap-4 p-6 text-center">
        <AlertTriangle className="h-12 w-12 text-red-400" />
        <div className="space-y-2">
          <h3 className="text-white text-lg font-semibold">Video Error</h3>
          <p className="text-white/80 text-sm max-w-md">{error}</p>
        </div>
        <Button
          onClick={onRetry}
          variant="outline"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    </div>
  );
}