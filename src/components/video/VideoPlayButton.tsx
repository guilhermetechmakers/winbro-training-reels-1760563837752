import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VideoPlayButtonProps {
  onClick: () => void;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function VideoPlayButton({ onClick, size = 'medium', className }: VideoPlayButtonProps) {
  const sizeClasses = {
    small: 'h-10 w-10',
    medium: 'h-16 w-16',
    large: 'h-20 w-20',
  };

  const iconSizes = {
    small: 'h-4 w-4',
    medium: 'h-6 w-6',
    large: 'h-8 w-8',
  };

  return (
    <div className={cn(
      "absolute inset-0 flex items-center justify-center",
      "group-hover:scale-105 transition-transform duration-200",
      className
    )}>
      <Button
        onClick={onClick}
        size="lg"
        className={cn(
          "rounded-full bg-white/90 hover:bg-white text-black",
          "shadow-lg hover:shadow-xl transition-all duration-200",
          "hover:scale-110 active:scale-95",
          sizeClasses[size]
        )}
      >
        <Play className={cn("fill-current", iconSizes[size])} />
      </Button>
    </div>
  );
}