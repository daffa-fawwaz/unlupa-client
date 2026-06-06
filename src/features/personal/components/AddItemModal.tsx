import { useEffect, useState } from "react";
import {
  AlertCircle,
  AlignLeft,
  CheckCircle,
  Clock,
  FileText,
  Hash,
  Image,
  Loader2,
  Lock,
  Plus,
  Upload,
  X,
} from "lucide-react";
import { useAuthStore } from "@/features/auth/stores/auth.store";
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

// Slider config: 1–120 detik, step 5
const SECONDS_MIN = 5;
const SECONDS_MAX = 120;
const SECONDS_STEP = 5;

// Slider config: 1–30 menit, step 1
const MINUTES_MIN = 1;
const MINUTES_MAX = 30;
const MINUTES_STEP = 1;

function formatEstimateLabel(value: number, unit: string): string {
  if (unit === "seconds") {
    return `${value} detik`;
  }
  return `${value} menit`;
}

const INITIAL_FORM = (nextOrder: number) => ({
  content: "",
  answer: "",
  orderStr: String(nextOrder),
  estimateValue: 30,
  estimate_unit: "seconds",
});

export const AddItemModal = ({
  bookId,
  moduleId,
  onClose,
  onCreated,
  nextOrder,
}: AddItemModalProps) => {
  const { createItem, loading: loadingItem } = useCreateItem();
  const { createModuleItem, loading: loadingModule } = useCreateModuleItem();
  const isPremium = useAuthStore((state) => state.user?.is_premium === true);
  const loading = moduleId ? loadingModule : loadingItem;

  const [form, setForm] = useState(INITIAL_FORM(nextOrder));
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [resultState, setResultState] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const sliderMin = form.estimate_unit === "seconds" ? SECONDS_MIN : MINUTES_MIN;
  const sliderMax = form.estimate_unit === "seconds" ? SECONDS_MAX : MINUTES_MAX;
  const sliderStep = form.estimate_unit === "seconds" ? SECONDS_STEP : MINUTES_STEP;
  const sliderPercent = ((form.estimateValue - sliderMin) / (sliderMax - sliderMin)) * 100;

  useEffect(() => {
    if (!imageFile) {
      setImagePreview(null);
      return;
    }

    const previewUrl = URL.createObjectURL(imageFile);
    setImagePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [imageFile]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("File harus berupa gambar.");
      setResultState("error");
      return;
    }

    setImageFile(file);
  };

  const handleUnitChange = (unit: string) => {
    // Reset to sensible default when switching unit
    const defaultValue = unit === "seconds" ? 30 : 5;
    setForm((f) => ({ ...f, estimate_unit: unit, estimateValue: defaultValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.content.trim() || !form.answer.trim()) {
      setErrorMsg("Pertanyaan dan jawaban wajib diisi.");
      setResultState("error");
      return;
    }
    const order = Math.max(1, parseInt(form.orderStr) || 1);
    const estimate_value = form.estimateValue;
    const imagePayload = isPremium && imageFile ? { image: imageFile } : {};

    try {
      let created: CreatedItem | CreatedModuleItem;
      if (moduleId) {
        created = await createModuleItem(moduleId, {
          book_id: bookId,
          title: "",
          content: form.content.trim(),
          answer: form.answer.trim(),
          ...imagePayload,
          order,
          estimate_value,
          estimate_unit: form.estimate_unit,
        });
      } else {
        created = await createItem(bookId, {
          title: "",
          content: form.content.trim(),
          answer: form.answer.trim(),
          ...imagePayload,
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

  const handleCreateAnother = () => {
    setForm(INITIAL_FORM(nextOrder));
    setImageFile(null);
    setResultState("idle");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-md"
        onClick={resultState === "idle" ? onClose : undefined}
      />
      <div className="relative z-10 w-full max-w-lg max-h-[calc(100vh-2rem)] animate-in fade-in zoom-in-95 duration-300">
        <div className="absolute -inset-px rounded-[2.5rem] bg-linear-to-br from-emerald-500/30 via-cyan-500/20 to-transparent blur-sm pointer-events-none" />
        <div className="relative max-h-[calc(100vh-2rem)] rounded-[2.5rem] bg-[#0E1420] border border-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col">

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
              <div className="flex gap-3">
                <button
                  onClick={handleCreateAnother}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm transition-all hover:scale-105 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  Buat Item Lagi
                </button>
                <button
                  onClick={onClose}
                  className="px-8 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                >
                  Lihat Item
                </button>
              </div>
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
              <div className="relative shrink-0 px-8 pt-8 pb-6 border-b border-white/5">
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

              <form onSubmit={handleSubmit} className="overflow-y-auto px-8 py-6 space-y-5">
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

                {isPremium && (
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
                      <Image className="w-3.5 h-3.5" />Gambar
                    </label>
                    {imagePreview ? (
                      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5">
                        <img
                          src={imagePreview}
                          alt="Preview gambar item"
                          className="h-44 w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setImageFile(null)}
                          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition"
                          disabled={loading}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/15 bg-white/5 px-4 py-6 text-center hover:border-emerald-500/40 hover:bg-white/8 transition">
                        <Upload className="h-6 w-6 text-emerald-400" />
                        <span className="text-sm font-semibold text-white">
                          Pilih gambar item
                        </span>
                        <span className="text-xs text-gray-500">
                          JPG, PNG, atau format gambar lain
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          disabled={loading}
                        />
                      </label>
                    )}
                  </div>
                )}

                {/* Estimasi Waktu Review — Slider */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
                      <Clock className="w-3.5 h-3.5" />Estimasi Waktu Review
                    </label>
                    <span className="text-sm font-bold text-white tabular-nums">
                      {formatEstimateLabel(form.estimateValue, form.estimate_unit)}
                    </span>
                  </div>

                  {/* Unit toggle */}
                  <div className="flex gap-2">
                    {["seconds", "minutes"].map((unit) => (
                      <button
                        key={unit}
                        type="button"
                        onClick={() => handleUnitChange(unit)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                          form.estimate_unit === unit
                            ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
                            : "bg-white/5 border border-white/10 text-gray-500 hover:text-gray-300 hover:bg-white/8"
                        }`}
                      >
                        {unit === "seconds" ? "Detik" : "Menit"}
                      </button>
                    ))}
                  </div>

                  {/* Slider */}
                  <div className="relative pt-1">
                    <div className="relative h-2 rounded-full bg-white/10">
                      <div
                        className="absolute left-0 top-0 h-full rounded-full bg-linear-to-r from-emerald-500 to-cyan-500 transition-all"
                        style={{ width: `${sliderPercent}%` }}
                      />
                    </div>
                    <input
                      type="range"
                      min={sliderMin}
                      max={sliderMax}
                      step={sliderStep}
                      value={form.estimateValue}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, estimateValue: Number(e.target.value) }))
                      }
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {/* Thumb visual */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white shadow-lg border-2 border-emerald-400 transition-all pointer-events-none"
                      style={{ left: `calc(${sliderPercent}% - 10px)` }}
                    />
                  </div>

                  {/* Min / Max labels */}
                  <div className="flex justify-between text-[10px] text-gray-600 font-medium">
                    <span>{formatEstimateLabel(sliderMin, form.estimate_unit)}</span>
                    <span>{formatEstimateLabel(sliderMax, form.estimate_unit)}</span>
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

                <div className="sticky bottom-0 -mx-8 -mb-6 flex justify-end gap-3 border-t border-white/5 bg-[#0E1420]/95 px-8 py-4 backdrop-blur">
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
