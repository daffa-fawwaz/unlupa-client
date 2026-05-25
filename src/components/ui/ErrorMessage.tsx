import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  message?: string | null;
  title?: string;
  className?: string; // Optional custom class
  actionLabel?: string;
  onAction?: () => void;
}

export const ErrorMessage = ({
  message,
  title,
  className = "",
  actionLabel,
  onAction,
}: ErrorMessageProps) => {
  if (!message && !title) return null;

  return (
    <div
      className={`flex flex-col gap-3 p-4 mt-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-100 animate-in fade-in slide-in-from-bottom-2 duration-300 ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />
        <div className="min-w-0">
          {title && (
            <p className="text-sm font-semibold text-red-100">{title}</p>
          )}
          {message && <p className="text-sm text-red-200">{message}</p>}
        </div>
      </div>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="self-start rounded-full bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-100 transition hover:bg-red-500/20"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
