import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-danger-50 dark:bg-danger-500/10">
        <AlertCircle className="h-8 w-8 text-danger-500" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-200">
          Algo deu errado
        </h3>
        <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">{message}</p>
      </div>
      {onRetry && (
        <button
          id="error-retry-button"
          onClick={onRetry}
          className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-600 active:bg-primary-700"
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
}
