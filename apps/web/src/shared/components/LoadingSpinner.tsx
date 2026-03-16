import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

const SPINNER_SIZES = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
} as const;

export function LoadingSpinner({ size = 'md', message }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <Loader2 className={`${SPINNER_SIZES[size]} animate-spin text-primary-500`} />
      {message && (
        <p className="text-sm text-surface-500 dark:text-surface-400">{message}</p>
      )}
    </div>
  );
}
