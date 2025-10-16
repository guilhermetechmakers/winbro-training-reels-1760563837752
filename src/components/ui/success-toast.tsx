import { CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SuccessToastProps {
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
  showCloseButton?: boolean;
}

export function SuccessToast({
  title = 'Success',
  message,
  onClose,
  className,
  showCloseButton = true
}: SuccessToastProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg shadow-sm',
        className
      )}
    >
      <div className="flex-shrink-0">
        <CheckCircle className="h-5 w-5 text-green-600" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-green-800">
          {title}
        </h4>
        <p className="mt-1 text-sm text-green-700">
          {message}
        </p>
      </div>
      {showCloseButton && onClose && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="flex-shrink-0 h-6 w-6 p-0 text-green-600 hover:text-green-800 hover:bg-green-100"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}