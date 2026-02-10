import { useState } from "react";
import { PlusCircle, X } from "lucide-react";
import { useCreateJuz } from "@/features/alquran/hooks/useCreateJuz";

interface CreateJuzFormProps {
  onClose: () => void;
}

export const CreateHafalanForm = ({ onClose }: CreateJuzFormProps) => {
  const { createJuz } = useCreateJuz();
  const [selectedJuz, setSelectedJuz] = useState("");

  const handleJuzChange = (juz: string) => {
    setSelectedJuz(juz);
  };

  const handleSubmit = () => {
    if (!selectedJuz) return;

    createJuz(Number(selectedJuz));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-[550px] bg-[rgba(10,12,15,0.95)] border border-amber-500/30 backdrop-blur-3xl rounded-3xl p-10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)]">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
          <h1 className="text-xl font-serif text-white">Hafalan Baru</h1>
          <button
            onClick={onClose}
            className="text-gray-500 cursor-pointer hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Juz Selection */}
        <div className="mb-6">
          <label className="block font-mono text-xs text-amber-400 uppercase tracking-widest mb-2">
            1. Pilih Juz
          </label>
          <select
            value={selectedJuz}
            onChange={(e) => handleJuzChange(e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-white px-3.5 py-3.5 rounded-xl font-inter cursor-pointer appearance-none transition-colors hover:bg-white/10 focus:outline-none focus:border-amber-400 focus:bg-amber-500/5"
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
          className="w-full py-4 bg-linear-to-r from-amber-400 to-amber-600 text-black font-bold uppercase rounded-xl transition-transform hover:-translate-y-0.5 hover:shadow-[0_5px_20px_rgba(245,158,11,0.2)] tracking-wider flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          Tambahkan Juz
        </button>
      </div>
    </div>
  );
};
