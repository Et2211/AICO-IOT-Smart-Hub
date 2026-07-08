interface ErrorBannerProps {
  message: string;
  onDismiss: () => void;
}

export function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <div className="mb-4 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
      <span>{message}</span>
      <button
        onClick={onDismiss}
        className="ml-4 text-red-500 hover:text-red-700 dark:hover:text-red-300"
        aria-label="Dismiss error"
      >
        &times;
      </button>
    </div>
  );
}
