import { useEffect } from "react";
import { CheckCircle } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  title: string;
  message?: string;
  onClose: () => void;
  autoCloseMs?: number;
}

export const SuccessModal = ({
  isOpen,
  title,
  message,
  onClose,
  autoCloseMs = 2000,
}: SuccessModalProps) => {
  useEffect(() => {
    if (isOpen && autoCloseMs > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseMs);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoCloseMs, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-sm animate-in fade-in zoom-in duration-300">
        <div className="rounded-2xl border border-success/30 bg-card shadow-xl p-6 md:p-8 pointer-events-auto">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-success/20 border border-success/40 mb-4 mx-auto">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-xl font-black text-foreground mb-2">
              {title}
            </h3>
            {message && (
              <p className="text-muted-foreground text-sm">
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
