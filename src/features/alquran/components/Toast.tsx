import type { ToastType } from "../hooks/useToast";

interface ToastProps {
  show: boolean;
  message: string;
  type: ToastType;
}

export const Toast = ({ show, message, type }: ToastProps) => {
  const bgColor = {
    success: "bg-emerald-500",
    error: "bg-rose-500",
    info: "bg-blue-500",
  }[type];

  return (
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 ${bgColor} text-black px-6 py-3 rounded-full font-mono font-bold text-sm shadow-lg transition-all duration-300 z-50 ${
        show
          ? "translate-y-0 opacity-100"
          : "translate-y-24 opacity-0 pointer-events-none"
      }`}
      style={{
        boxShadow: show ? "0 10px 30px rgba(16,185,129,0.3)" : "none",
      }}
    >
      {message}
    </div>
  );
};
