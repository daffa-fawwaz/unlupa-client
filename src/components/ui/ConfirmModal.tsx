import { createPortal } from "react-dom";
import type { LucideIcon } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  icon?: LucideIcon;
  variant?: "danger" | "success" | "warning" | "info";
}

const variantStyles = {
  danger: {
    iconColor: "text-destructive",
    buttonBg: "bg-destructive/10 hover:bg-destructive/20",
    buttonText: "text-destructive",
    buttonBorder: "border-destructive/20",
  },
  success: {
    iconColor: "text-success",
    buttonBg: "bg-success/10 hover:bg-success/20",
    buttonText: "text-success",
    buttonBorder: "border-success/20",
  },
  warning: {
    iconColor: "text-warning",
    buttonBg: "bg-warning/10 hover:bg-warning/20",
    buttonText: "text-warning",
    buttonBorder: "border-warning/20",
  },
  info: {
    iconColor: "text-info",
    buttonBg: "bg-info/10 hover:bg-info/20",
    buttonText: "text-info",
    buttonBorder: "border-info/20",
  },
};

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal",
  icon: Icon,
  variant = "info",
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  const styles = variantStyles[variant];

  const handleConfirm = () => {
    onConfirm();
  };

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-sm animate-fadeIn"
      style={{ zIndex: 9999 }}
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-xl p-5 sm:p-6 max-w-sm w-full shadow-xl space-y-4 animate-slideUp mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`flex items-center gap-3 ${styles.iconColor}`}>
          {Icon && <Icon className="w-5 h-5 sm:w-6 sm:h-6" />}
          <h3 className="font-serif font-bold text-base sm:text-lg text-foreground">
            {title}
          </h3>
        </div>

        <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
          {message}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="w-full sm:flex-1 px-4 py-2.5 rounded-lg bg-surface-1 hover:bg-surface-2 text-foreground text-sm font-medium transition cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`w-full sm:flex-1 px-4 py-2.5 rounded-lg ${styles.buttonBg} ${styles.buttonText} text-sm font-medium border ${styles.buttonBorder} transition cursor-pointer`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};
