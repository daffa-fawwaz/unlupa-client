import { CheckCircle } from "lucide-react";

export interface SuccessModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  onClose: () => void;
}

export const SuccessModal = ({
  isOpen,
  title,
  description,
  onClose,
}: SuccessModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-0 bottom-6 z-50 flex items-center justify-center px-4 pointer-events-none">
      <button
        type="button"
        onClick={onClose}
        className="pointer-events-auto w-full max-w-md rounded-3xl border border-success/20 bg-success px-5 py-4 shadow-sm text-success-foreground transition-all duration-300 text-left"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-success-foreground/15 text-success-foreground">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-base text-success-foreground">{title}</p>
            {description && (
              <p className="text-sm text-success-foreground/80 mt-1">{description}</p>
            )}
          </div>
        </div>
      </button>
    </div>
  );
};
