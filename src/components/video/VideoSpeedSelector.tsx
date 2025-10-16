import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface SpeedOption {
  value: number;
  label: string;
  icon: LucideIcon;
}

interface VideoSpeedSelectorProps {
  currentSpeed: number;
  onSpeedChange: (speed: number) => void;
  onClose: () => void;
  speedOptions: SpeedOption[];
  className?: string;
}

export function VideoSpeedSelector({ 
  currentSpeed, 
  onSpeedChange, 
  onClose, 
  speedOptions,
  className 
}: VideoSpeedSelectorProps) {
  return (
    <div className={cn(
      "absolute bottom-full right-0 mb-2",
      "bg-black/90 backdrop-blur-sm rounded-lg",
      "border border-white/20 shadow-xl",
      "min-w-[120px] py-2",
      className
    )}>
      {speedOptions.map((option) => {
        const Icon = option.icon;
        return (
          <button
            key={option.value}
            onClick={() => {
              onSpeedChange(option.value);
              onClose();
            }}
            className={cn(
              "w-full px-4 py-2 text-left text-white text-sm",
              "hover:bg-white/10 transition-colors duration-150",
              "flex items-center justify-between",
              currentSpeed === option.value && "bg-white/10"
            )}
          >
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              <span>{option.label}</span>
            </div>
            {currentSpeed === option.value && (
              <Check className="h-4 w-4" />
            )}
          </button>
        );
      })}
    </div>
  );
}