import { useState } from "react";
import { PlusCircle, X, CheckCircle, Loader2 } from "lucide-react";
import { useCreateJuz } from "@/features/alquran/hooks/useCreateJuz";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

interface CreateJuzFormProps {
  onClose: () => void;
  onSuccess?: () => void;
  classId?: string;
}


import { useCreateClassJuz } from "@/features/alquran/hooks/useClassJuz";

export const CreateJuzForm = ({ onClose, onSuccess, classId }: CreateJuzFormProps) => {
  const { createJuz, loading: personalLoading, data: personalData, error: personalError } = useCreateJuz();
  const { createClassJuz, loading: classLoading, data: classData, error: classError } = useCreateClassJuz();
  const [selectedJuz, setSelectedJuz] = useState("");

  const loading = classId ? classLoading : personalLoading;
  const data = classId ? classData : personalData;
  const error = classId ? classError : personalError;

  const handleJuzChange = (juz: string) => {
    setSelectedJuz(juz);
  };

  const handleSubmit = async () => {
    if (!selectedJuz) return;
    if (classId) {
      await createClassJuz(Number(selectedJuz), classId);
    } else {
      await createJuz(Number(selectedJuz));
    }
    onSuccess?.();
  };

  const selectedJuzLabel = (() => {
    const juzData = data?.data as
      | { index?: number; Index?: number }
      | undefined;
    return juzData?.index ?? juzData?.Index ?? selectedJuz;
  })();

  // SUCCESS STATE
  if (data) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="w-full max-w-md bg-card border border-success/30 rounded-2xl p-8 shadow-xl text-center relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
              <CheckCircle className="w-10 h-10 text-success" />
            </div>

            <h2 className="text-2xl font-serif text-foreground mb-2">
              Alhamdulillah!
            </h2>
            <p className="text-muted-foreground mb-8">
              Juz{" "}
              <span className="text-success font-bold">
                {selectedJuzLabel}
              </span>{" "}
              berhasil ditambahkan.
              <br />
              Selamat memulai hafalan baru!
            </p>

            <button
              onClick={onClose}
              className="w-full py-3.5 bg-success hover:bg-success/90 text-success-foreground font-bold rounded-xl transition-all shadow-xl cursor-pointer"
            >
              Mulai Menghafal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-[550px] bg-background border border-warning/30 rounded-2xl p-10 shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-border pb-4">
          <h1 className="text-xl font-serif text-foreground">Hafalan Baru</h1>
          <button
            onClick={onClose}
            className="text-muted-foreground cursor-pointer hover:text-foreground transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Juz Selection */}
        <div className="mb-6">
          <label className="block font-mono text-xs text-warning uppercase tracking-widest mb-2">
            1. Pilih Juz
          </label>
          <select
            value={selectedJuz}
            onChange={(e) => handleJuzChange(e.target.value)}
            disabled={loading}
            className="w-full bg-surface-1 border border-border text-foreground px-3.5 py-3.5 rounded-xl font-inter cursor-pointer appearance-none transition-colors hover:bg-surface-2 focus:outline-none focus:border-warning focus:bg-warning/5 disabled:opacity-50"
          >
            <option value="">-- Pilih Juz --</option>
            {Array.from({ length: 30 }, (_, i) => 30 - i).map((juz) => (
              <option key={juz} value={juz.toString()}>
                Juz {juz}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading || !selectedJuz}
          className="w-full py-4 bg-warning disabled:bg-surface-2 disabled:text-muted-foreground text-warning-foreground font-bold uppercase rounded-xl transition-transform hover:-translate-y-0.5 tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <PlusCircle className="w-5 h-5" />
              Tambahkan Juz
            </>
          )}
        </button>
        <ErrorMessage message={error} />
      </div>
    </div>
  );
};
