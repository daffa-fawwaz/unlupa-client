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
      className={`flex flex-col gap-3 p-4 mt-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive-foreground animate-in fade-in slide-in-from-bottom-2 duration-300 ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-destructive" />
        <div className="min-w-0">
          {title && (
            <p className="text-sm font-semibold text-destructive-foreground">{title}</p>
          )}
          {message && <p className="text-sm text-destructive-foreground/80">{message}</p>}
        </div>
      </div>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="self-start rounded-full bg-destructive/10 px-4 py-2 text-sm font-semibold text-destructive-foreground transition hover:bg-destructive/20"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
