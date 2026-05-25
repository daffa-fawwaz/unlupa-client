import { CheckCircle } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
}

export const SuccessModal = ({ isOpen, title, onClose }: SuccessModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-0 bottom-6 z-50 flex items-center justify-center px-4 pointer-events-none">
      <button
        type="button"
        onClick={onClose}
        className="pointer-events-auto w-full max-w-md rounded-3xl border border-emerald-400/20 bg-emerald-500/95 px-5 py-4 shadow-2xl shadow-emerald-500/30 backdrop-blur-lg text-black transition-all duration-300 text-left"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 text-emerald-950">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-base text-black">{title}</p>
          </div>
        </div>
      </button>
    </div>
  );
};
