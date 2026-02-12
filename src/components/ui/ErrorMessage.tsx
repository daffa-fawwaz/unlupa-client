import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  message?: string | null;
  className?: string; // Optional custom class
}

export const ErrorMessage = ({
  message,
  className = "",
}: ErrorMessageProps) => {
  if (!message) return null;

  return (
    <div
      className={`flex items-center gap-3 p-4 mt-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 animate-in fade-in slide-in-from-bottom-2 duration-300 ${className}`}
      role="alert"
    >
      <AlertCircle className="w-5 h-5 shrink-0" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};
