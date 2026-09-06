import { createPortal } from "react-dom";
import { AlertTriangle, Info, X } from "lucide-react";

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Yakin",
  cancelText = "Batal",
  variant = "warning",
  isLoading = false,
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  const styles = {
    danger: {
      icon: <AlertTriangle className="h-6 w-6 text-destructive" />,
      bgIcon: "bg-destructive/20 border-destructive/30",
      button: "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
      glow: "bg-destructive/20",
    },
    warning: {
      icon: <AlertTriangle className="h-6 w-6 text-warning" />,
      bgIcon: "bg-warning/20 border-warning/30",
      button: "bg-warning hover:bg-warning/90 text-warning-foreground",
      glow: "bg-warning/20",
    },
    info: {
      icon: <Info className="h-6 w-6 text-info" />,
      bgIcon: "bg-info/20 border-info/30",
      button: "bg-info hover:bg-info/90 text-info-foreground",
      glow: "bg-info/20",
    },
  };

  const theme = styles[variant];

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-card animate-in fade-in zoom-in-95 duration-300">
        <div className="relative p-6 sm:p-8">
          {/* Close button */}
          <button
            onClick={onClose}
            disabled={isLoading}
            className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="mb-5 flex justify-center">
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${theme.bgIcon}`}
            >
              {theme.icon}
            </div>
          </div>

          <div className="text-center">
            <h3 className="mb-2 text-xl font-black text-foreground">{title}</h3>
            <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`w-full rounded-xl px-4 py-3.5 text-sm font-bold transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 ${theme.button}`}
            >
              {isLoading ? "Memproses..." : confirmText}
            </button>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="w-full rounded-xl border border-border bg-transparent px-4 py-3.5 text-sm font-bold text-muted-foreground transition-colors hover:bg-surface-2 disabled:opacity-50"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};
