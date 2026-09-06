import type { ToastType } from "@/features/alquran/hooks/useToast";

interface ToastProps {
  show: boolean;
  message: string;
  type: ToastType;
}

export const Toast = ({ show, message, type }: ToastProps) => {
  const styles: Record<string, string> = {
    success: "bg-success text-success-foreground",
    error: "bg-destructive text-destructive-foreground",
    info: "bg-info text-info-foreground",
  };

  return (
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 ${styles[type]} px-6 py-3 rounded-full font-mono font-bold text-sm shadow-xl transition-all duration-300 z-50 ${
        show
          ? "translate-y-0 opacity-100"
          : "translate-y-24 opacity-0 pointer-events-none"
      }`}
    >
      {message}
    </div>
  );
};
