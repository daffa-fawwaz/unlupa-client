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
      icon: <AlertTriangle className="h-6 w-6 text-rose-400" />,
      bgIcon: "bg-rose-500/20 border-rose-500/30",
      button:
        "bg-linear-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-rose-500/25",
      glow: "bg-rose-500/20",
    },
    warning: {
      icon: <AlertTriangle className="h-6 w-6 text-amber-400" />,
      bgIcon: "bg-amber-500/20 border-amber-500/30",
      button:
        "bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-amber-500/25",
      glow: "bg-amber-500/20",
    },
    info: {
      icon: <Info className="h-6 w-6 text-blue-400" />,
      bgIcon: "bg-blue-500/20 border-blue-500/30",
      button:
        "bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/25",
      glow: "bg-blue-500/20",
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
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-[#121824] shadow-[0_40px_100px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.05)] animate-in fade-in zoom-in-95 duration-300">
        {/* Glow Background */}
        <div
          className={`absolute -right-12 -top-12 h-40 w-40 rounded-full blur-[60px] pointer-events-none ${theme.glow}`}
        />

        <div className="relative p-6 sm:p-8">
          {/* Close button */}
          <button
            onClick={onClose}
            disabled={isLoading}
            className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50"
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
            <h3 className="mb-2 text-xl font-black text-white">{title}</h3>
            <p className="mb-8 text-sm leading-relaxed text-gray-400">
              {description}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`w-full rounded-xl px-4 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 ${theme.button}`}
            >
              {isLoading ? "Memproses..." : confirmText}
            </button>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="w-full rounded-xl border border-white/10 bg-transparent px-4 py-3.5 text-sm font-bold text-gray-300 transition-colors hover:bg-white/5 disabled:opacity-50"
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
