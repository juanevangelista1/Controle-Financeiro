import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  message: string;
  description?: string;
}

export function EmptyState({ message, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-100 dark:bg-surface-800">
        <Inbox className="h-8 w-8 text-surface-400" />
      </div>
      <h3 className="text-lg font-semibold text-surface-700 dark:text-surface-300">{message}</h3>
      {description && (
        <p className="text-sm text-surface-500 dark:text-surface-400">{description}</p>
      )}
    </div>
  );
}
