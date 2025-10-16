import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoQualitySelectorProps {
  currentQuality: string;
  onQualityChange: (quality: string) => void;
  onClose: () => void;
  className?: string;
}

const qualityOptions = [
  { value: 'auto', label: 'Auto' },
  { value: '1080p', label: '1080p' },
  { value: '720p', label: '720p' },
  { value: '480p', label: '480p' },
  { value: '360p', label: '360p' },
];

export function VideoQualitySelector({ 
  currentQuality, 
  onQualityChange, 
  onClose, 
  className 
}: VideoQualitySelectorProps) {
  return (
    <div className={cn(
      "absolute bottom-full right-0 mb-2",
      "bg-black/90 backdrop-blur-sm rounded-lg",
      "border border-white/20 shadow-xl",
      "min-w-[120px] py-2",
      className
    )}>
      {qualityOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => {
            onQualityChange(option.value);
            onClose();
          }}
          className={cn(
            "w-full px-4 py-2 text-left text-white text-sm",
            "hover:bg-white/10 transition-colors duration-150",
            "flex items-center justify-between",
            currentQuality === option.value && "bg-white/10"
          )}
        >
          <span>{option.label}</span>
          {currentQuality === option.value && (
            <Check className="h-4 w-4" />
          )}
        </button>
      ))}
    </div>
  );
}