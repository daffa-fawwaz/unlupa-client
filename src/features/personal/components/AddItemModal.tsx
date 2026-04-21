import { useState } from "react";
import {
  AlertCircle,
  AlignLeft,
  CheckCircle,
  FileText,
  Hash,
  Loader2,
  Lock,
  Plus,
  X,
} from "lucide-react";
import { useCreateItem } from "@/features/personal/hooks/useCreateItem";
import { useCreateModuleItem } from "@/features/personal/hooks/useCreateModuleItem";
import type {
  CreatedItem,
  CreatedModuleItem,
} from "@/features/personal/types/personal.types";

interface AddItemModalProps {
  bookId: string;
  moduleId?: string;
  onClose: () => void;
  onCreated: (item: CreatedItem | CreatedModuleItem) => void;
  nextOrder: number;
}

export const AddItemModal = ({
  bookId,
  moduleId,
  onClose,
  onCreated,
  nextOrder,
}: AddItemModalProps) => {
  const { createItem, loading: loadingItem } = useCreateItem();
  const { createModuleItem, loading: loadingModule } = useCreateModuleItem();
  const loading = moduleId ? loadingModule : loadingItem;

  const [form, setForm] = useState({
    content: "",
    answer: "",
    orderStr: String(nextOrder),
    estimateStr: "5",
    estimate_unit: "minutes",
  });
  const [resultState, setResultState] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.content.trim() || !form.answer.trim()) {
      setErrorMsg("Pertanyaan dan jawaban wajib diisi.");
      setResultState("error");
      return;
    }
    const order = Math.max(1, parseInt(form.orderStr) || 1);
    const estimate_value = Math.max(1, parseInt(form.estimateStr) || 1);
    try {
      let created: CreatedItem | CreatedModuleItem;
      if (moduleId) {
        created = await createModuleItem(moduleId, {
          book_id: bookId,
          title: "",
          content: form.content.trim(),
          answer: form.answer.trim(),
          order,
          estimate_value,
          estimate_unit: form.estimate_unit,
        });
      } else {
        created = await createItem(bookId, {
          title: "",
          content: form.content.trim(),
          answer: form.answer.trim(),
          order,
          estimate_value,
          estimate_unit: form.estimate_unit,
        });
      }
      onCreated(created);
      setResultState("success");
    } catch (err: unknown) {
      setErrorMsg((err as Error).message ?? "Terjadi kesalahan.");
      setResultState("error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-md"
        onClick={resultState === "idle" ? onClose : undefined}
      />
      <div className="relative z-10 w-full max-w-lg animate-in fade-in zoom-in-95 duration-300">
        <div className="absolute -inset-px rounded-[2.5rem] bg-linear-to-br from-emerald-500/30 via-cyan-500/20 to-transparent blur-sm pointer-events-none" />
        <div className="relative rounded-[2.5rem] bg-[#0E1420] border border-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)] overflow-hidden">

          {/* Success */}
          {resultState === "success" && (
            <div className="p-10 flex flex-col items-center text-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 rounded-[2rem] bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-emerald-400" />
                </div>
                <div className="absolute inset-0 bg-emerald-500/10 rounded-[2rem] blur-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Item Berhasil Dibuat!</h3>
              </div>
              <button
                onClick={onClose}
                className="px-8 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                Lihat Item
              </button>
            </div>
          )}

          {/* Error */}
          {resultState === "error" && (
            <div className="p-10 flex flex-col items-center text-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 rounded-[2rem] bg-rose-500/15 border border-rose-500/30 flex items-center justify-center">
                  <AlertCircle className="w-10 h-10 text-rose-400" />
                </div>
                <div className="absolute inset-0 bg-rose-500/10 rounded-[2rem] blur-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Gagal Membuat Item</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{errorMsg}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setResultState("idle")}
                  className="px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-sm transition"
                >
                  Coba Lagi
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 font-medium text-sm transition"
                >
                  Tutup
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          {resultState === "idle" && (
            <>
              <div className="relative px-8 pt-8 pb-6 border-b border-white/5">
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none" />
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    {moduleId ? "Tambah Item ke Modul" : "Tambah Item Hafalan"}
                  </h2>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {moduleId
                    ? "Tambahkan unit hafalan ke dalam modul ini."
                    : "Tambahkan unit hafalan langsung tanpa modul."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
                    <AlignLeft className="w-3.5 h-3.5" />Pertanyaan / Konten
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Tulis pertanyaan disini"
                    value={form.content}
                    onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-emerald-500/50 focus:outline-none text-white text-sm placeholder-gray-600 transition-colors resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
                    <Lock className="w-3.5 h-3.5" />Jawaban
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Tulis jawaban disini"
                    value={form.answer}
                    onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-emerald-500/50 focus:outline-none text-white text-sm placeholder-gray-600 transition-colors resize-none"
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
                      <Hash className="w-3.5 h-3.5" />Estimasi Waktu Review
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        value={form.estimateStr}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, estimateStr: e.target.value }))
                        }
                        className="w-24 shrink-0 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-emerald-500/50 focus:outline-none text-white text-sm transition-colors"
                      />
                      <select
                        value={form.estimate_unit}
                        onChange={(e) => setForm((f) => ({ ...f, estimate_unit: e.target.value }))}
                        className="flex-1 px-3 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-emerald-500/50 focus:outline-none text-white text-sm transition-colors"
                      >
                        <option value="seconds" className="bg-[#0E1420]">Detik</option>
                        <option value="minutes" className="bg-[#0E1420]">Menit</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
                      <Hash className="w-3.5 h-3.5" />Urutan
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={form.orderStr}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, orderStr: e.target.value }))
                      }
                      className="w-32 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-emerald-500/50 focus:outline-none text-white text-sm transition-colors"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-sm font-medium transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !form.content.trim()}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-linear-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Buat Item
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
