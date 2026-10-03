import React, { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { QuranPageItem, PageIssue } from "../../types";
import {
  X,
  MessageSquare,
  Check,
  Plus,
  History,
  Sliders,
  Sparkles,
} from "@/components/foundations/hugeicons";
import { QURAN_PAGES_METADATA } from "../../data/quranPagesMetadata";
import { SURAH_LIST } from "../../data/quranData";
import { AudioRecorderPlayer } from "../shared/AudioRecorderPlayer";
import { AyahSweepSelector } from "./AyahSweepSelector";
import {
  Dialog,
  Modal,
  ModalOverlay,
} from "@/components/application/modals/modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  page: QuranPageItem | null;
}

export interface PageSurahSection {
  surahNumber: number;
  surahNameEn: string;
  surahNameAr: string;
  startAyah: number;
  endAyah: number;
}

// 28 Hijaiyah Letters with Arabic script and transliteration
const HIJAIYAH_LETTERS = [
  { ar: "ا", latin: "Alif" },
  { ar: "ب", latin: "Ba" },
  { ar: "ت", latin: "Ta" },
  { ar: "ث", latin: "Tsa" },
  { ar: "ج", latin: "Jim" },
  { ar: "ح", latin: "Ha" },
  { ar: "خ", latin: "Kha" },
  { ar: "د", latin: "Dal" },
  { ar: "ذ", latin: "Dzal" },
  { ar: "ر", latin: "Ra" },
  { ar: "ز", latin: "Zai" },
  { ar: "س", latin: "Sin" },
  { ar: "ش", latin: "Syin" },
  { ar: "ص", latin: "Shad" },
  { ar: "ض", latin: "Dhad" },
  { ar: "ط", latin: "Tha" },
  { ar: "ظ", latin: "Zha" },
  { ar: "ع", latin: "'Ain" },
  { ar: "غ", latin: "Ghain" },
  { ar: "ف", latin: "Fa" },
  { ar: "ق", latin: "Qaf" },
  { ar: "ك", latin: "Kaf" },
  { ar: "ل", latin: "Lam" },
  { ar: "م", latin: "Mim" },
  { ar: "ن", latin: "Nun" },
  { ar: "و", latin: "Waw" },
  { ar: "هـ", latin: "Ha Besar" },
  { ar: "ي", latin: "Ya" },
];

const MAKHRAJ_MODIFIERS = [
  "Makhraj Kurang Pas",
  "Tertukar Huruf Lain",
  "Kurang Tebal (Isti'la)",
  "Hams / Nafas Kurang",
  "Qalqalah Tertahan",
  "Suara Sengau / Kurang Bersih",
];

const KELANCARAN_PRESETS = [
  {
    label: "Lupa Hafalan (Blank Total)",
    desc: "Terhenti dan butuh bantuan talqin",
  },
  { label: "Tersendat / Terbata-bata", desc: "Ragu-ragu saat membaca" },
  {
    label: "Tertukar Ayat (Mutasyabihat)",
    desc: "Masuk ke ayat atau surat lain",
  },
  {
    label: "Mengulang-ulang (Tardid)",
    desc: "Mengulang kata lebih dari 2 kali",
  },
  { label: "Salah Baris / Lompat Ayat", desc: "Melewati satu baris atau ayat" },
  {
    label: "Ragu-ragu / Kurang Yakin",
    desc: "Sering berhenti mengecek ingatan",
  },
  { label: "Tempo Terburu-buru", desc: "Kecepatan membaca terlalu cepat" },
];

const TAJWID_CATEGORIES = [
  {
    id: "mad",
    title: "Mad (Panjang-Pendek)",
    badge: "Panjang-Pendek",
    options: [
      "Mad Thobi'i Kurang Panjang (2 Harakat)",
      "Mad Thobi'i Terlalu Panjang (>2 Harakat)",
      "Mad Wajib / Jaiz Kurang Panjang (4-5 Harakat)",
      "Mad Lazim Kurang Panjang (6 Harakat)",
      "Mad 'Aridh Lissukun Tidak Konsisten",
      "Mad Shilah / Badal Kurang Tepat",
    ],
  },
  {
    id: "nun_tanwin",
    title: "Nun Mati & Tanwin",
    badge: "Ikhfa/Idgham/Idzhar",
    options: [
      "Ikhfa Haqiqi (Kurang Samar / Kurang Dengung)",
      "Idgham Bighunnah (Kurang Dengung)",
      "Idgham Bilaghunnah (Malah Berdengung)",
      "Iqlab (Kurang Rapat Bibir / Dengung)",
      "Idzhar Halqi (Malah Dengung)",
    ],
  },
  {
    id: "mim_ghunnah",
    title: "Mim Mati & Ghunnah",
    badge: "Dengung & Tasydid",
    options: [
      "Nun/Mim Bertasydid (Ghunnah Kurang 2 Harakat)",
      "Ghunnah Terburu-buru",
      "Ikhfa Syafawi (Mim Mati bertemu Ba)",
      "Idgham Mimi (Mim Mati bertemu Mim)",
      "Idzhar Syafawi (Mim Mati tidak boleh dengung)",
    ],
  },
  {
    id: "qalqalah",
    title: "Qalqalah (Pantulan)",
    badge: "Pantulan Huruf",
    options: [
      "Qalqalah Sughra Kurang Memantul",
      "Qalqalah Kubra Kurang Memantul saat Waqaf",
      "Qalqalah Terlalu Berlebihan / Kasar",
      "Memantulkan Huruf Non-Qalqalah",
    ],
  },
  {
    id: "tafkhim",
    title: "Tebal & Tipis (Tafkhim/Tarqiq)",
    badge: "Isti'la & Istifal",
    options: [
      "Huruf Isti'la Kurang Tebal (Kha, Shad, Dhad, Ghain, Tha, Qaf, Zha)",
      "Huruf Istifal Malah Dibaca Tebal",
      "Ra Tebal Dibaca Tipis",
      "Ra Tipis Dibaca Tebal",
      "Lam Jalalah (Lafazh Allah) Kurang Tebal/Tipis",
    ],
  },
  {
    id: "waqaf_harakat",
    title: "Waqaf, Ibtida & Harakat",
    badge: "Tanda Berhenti & Vokal",
    options: [
      "Waqaf di Tempat Kurang Tepat / Terputus",
      "Salah Memulai Kembali Bacaan (Ibtida)",
      "Nafas Tidak Sampai",
      "Harakat Tertukar (Fathah/Kasrah/Dhommah)",
      "Sukun Tertukar Tasydid",
    ],
  },
];

const QUICK_NOTES = [
  "Perlu dilatih lagi",
  "Ulangi 3x",
  "Hati-hati sambungan ayat",
  "Perhatikan tanda waqaf",
  "Perhatikan dengung & mad",
  "Fokus makhraj huruf",
];

function getPageSurahSections(page: QuranPageItem | null): PageSurahSection[] {
  if (!page) return [];
  const meta = QURAN_PAGES_METADATA[page.pageNumber - 1];
  if (!meta) {
    return [
      {
        surahNumber: page.surahNumber || 1,
        surahNameEn: page.surahNameEn || "Al-Fatihah",
        surahNameAr: page.surahNameAr || "الفاتحة",
        startAyah: 1,
        endAyah: 7,
      },
    ];
  }

  const [startSurahValue, startAyahValue] = meta.startVerseKey.split(":");
  const [endSurahValue, endAyahValue] = meta.endVerseKey.split(":");
  const startSurah = Number(startSurahValue);
  const startAyah = Number(startAyahValue);
  const endSurah = Number(endSurahValue);
  const endAyah = Number(endAyahValue);

  return Array.from({ length: endSurah - startSurah + 1 }, (_, index) => {
    const surahNumber = startSurah + index;
    const surahInfo = SURAH_LIST[surahNumber - 1];
    const sectionStart = surahNumber === startSurah ? startAyah : 1;
    const sectionEnd =
      surahNumber === endSurah ? endAyah : (surahInfo?.ayahsCount ?? 50);
    return {
      surahNumber,
      surahNameEn: surahInfo?.nameEn || `Surah ${surahNumber}`,
      surahNameAr: surahInfo?.nameAr || "",
      startAyah: sectionStart,
      endAyah: Math.max(sectionStart, sectionEnd),
    };
  });
}

export const QuranPageFeedbackModal: React.FC<Props> = ({
  isOpen,
  onClose,
  page,
}) => {
  const { quranPages, addQuranPageIssue, resolveQuranPageIssue, language } =
    useApp();

  // Retrieve reactive, live page from context so newly added or resolved issues reflect immediately without stale state
  const livePage = useMemo(() => {
    if (!page) return null;
    return quranPages.find((p) => p.pageNumber === page.pageNumber) || page;
  }, [quranPages, page]);

  const surahSections = useMemo(
    () => getPageSurahSections(livePage),
    [livePage],
  );
  const issues = livePage?.issues || [];
  const unresolvedIssues = issues.filter((i) => !i.isResolved);
  const resolvedIssues = issues.filter((i) => i.isResolved);
  const initialAyah = surahSections[0]?.startAyah ?? 1;

  const [activeTab, setActiveTab] = useState<"unresolved" | "add" | "history">(
    unresolvedIssues.length > 0 ? "unresolved" : "add",
  );

  // Ayah Sweep State
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(0);
  const [ayahFrom, setAyahFrom] = useState(initialAyah);
  const [ayahTo, setAyahTo] = useState(initialAyah);

  // Issue Type & Details (Zero Typing)
  const [issueType, setIssueType] = useState<PageIssue["type"]>("kelancaran");
  const [selectedDetail, setSelectedDetail] = useState(
    KELANCARAN_PRESETS[0].label,
  );
  const [selectedTajwidCat, setSelectedTajwidCat] = useState("mad");

  // Makhraj Specific
  const [selectedLetter, setSelectedLetter] = useState<{
    ar: string;
    latin: string;
  } | null>(null);
  const [selectedModifier, setSelectedModifier] = useState("");

  // Optional Note State
  const [issueNote, setIssueNote] = useState("");
  const [showCustomNoteInput, setShowCustomNoteInput] = useState(false);

  const currentSection =
    surahSections[selectedSectionIndex] || surahSections[0];

  // Format Ayah Result String
  const resolvedAyahText = useMemo(() => {
    if (!currentSection) return "1";
    const isSingle = ayahFrom === ayahTo;
    const ayahSpan = isSingle ? `${ayahFrom}` : `${ayahFrom} - ${ayahTo}`;
    if (surahSections.length > 1) {
      return `${currentSection.surahNameEn} ${ayahSpan}`;
    }
    return ayahSpan;
  }, [currentSection, ayahFrom, ayahTo, surahSections]);

  // Format Issue Detail
  const resolvedDetailText = useMemo(() => {
    if (issueType === "kelancaran") {
      return selectedDetail || "Lupa Hafalan";
    }
    if (issueType === "tajwid") {
      return selectedDetail || "Kesalahan Tajwid";
    }
    if (issueType === "makharijul") {
      if (!selectedLetter) return "Makharijul Huruf";
      if (selectedModifier) {
        return `Huruf ${selectedLetter.ar} (${selectedLetter.latin}) • ${selectedModifier}`;
      }
      return `Huruf ${selectedLetter.ar} (${selectedLetter.latin})`;
    }
    return selectedDetail;
  }, [issueType, selectedDetail, selectedLetter, selectedModifier]);

  if (!isOpen || !livePage) return null;

  const handleAddIssue = () => {
    if (!resolvedAyahText) {
      alert(
        language === "en"
          ? "Please select an ayah range."
          : "Silakan pilih ayat terlebih dahulu.",
      );
      return;
    }

    addQuranPageIssue(livePage.pageNumber, {
      ayah: resolvedAyahText,
      type: issueType,
      detail: resolvedDetailText || undefined,
      note: issueNote.trim() || undefined,
    });

    setIssueNote("");
    setShowCustomNoteInput(false);

    // Reset & switch to unresolved list immediately
    setActiveTab("unresolved");
  };

  const getIssueLabel = (type: string) => {
    switch (type) {
      case "kelancaran":
        return language === "en" ? "Fluency" : "Kelancaran";
      case "lupa":
        return language === "en" ? "Forgot" : "Lupa Hafalan";
      case "tajwid":
        return "Tajwid";
      case "makharijul":
        return "Makharijul Huruf";
      default:
        return type;
    }
  };

  const getIssueColor = (type: string) => {
    switch (type) {
      case "kelancaran":
        return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:border-amber-800 dark:text-amber-300";
      case "lupa":
        return "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/40 dark:border-rose-800 dark:text-rose-300";
      case "tajwid":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:border-blue-800 dark:text-blue-300";
      case "makharijul":
        return "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/40 dark:border-indigo-800 dark:text-indigo-300";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <ModalOverlay
      isOpen={isOpen}
      isDismissable
      onOpenChange={(open) => !open && onClose()}
      data-no-swipe="true"
    >
      <Modal className="max-w-4xl overflow-hidden rounded-3xl border border-brand-200 bg-primary">
        <Dialog
          aria-label={
            language === "en"
              ? "Page evaluation and issues"
              : "Evaluasi halaman dan masalah"
          }
          className="flex max-h-[92dvh] flex-col overflow-hidden"
        >
          <header className="relative flex shrink-0 items-center justify-between gap-3 overflow-hidden border-b border-brand-200 bg-[linear-gradient(135deg,var(--color-brand-50)_0%,var(--color-bg-primary)_74%)] px-4 py-4 sm:px-6 sm:py-5">
            <div className="pointer-events-none absolute -right-14 -top-20 size-52 rounded-full bg-brand-200/35 blur-3xl" />
            <div className="relative flex min-w-0 items-center gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-[#c2410c] bg-brand-solid text-white shadow-lg shadow-brand-500/20">
                <MessageSquare className="size-5" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-lg font-semibold text-primary sm:text-xl">
                    {language === "en"
                      ? "Page Evaluation & Issues"
                      : "Evaluasi & Masalah Halaman"}
                  </h2>
                  <span className="rounded-full border border-brand-200 bg-primary/85 px-2 py-0.5 text-[10px] font-bold text-brand-700">
                    {language === "en"
                      ? `Page ${livePage.pageNumber}`
                      : `Hal ${livePage.pageNumber}`}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-secondary">
                  {livePage.surahNameEn} · {language === "en" ? "Ayah" : "Ayat"}{" "}
                  {livePage.ayahRange} · Juz {livePage.juzNumber}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label={language === "en" ? "Close" : "Tutup"}
              className="relative flex size-9 shrink-0 items-center justify-center rounded-xl border border-secondary bg-primary text-fg-quaternary shadow-xs outline-none transition hover:border-brand-200 hover:text-brand-700 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#ef6905]"
            >
              <X className="size-4" />
            </button>
          </header>

          <div className="shrink-0 space-y-3 border-b border-secondary bg-primary px-4 py-3 sm:px-6">
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
              <AudioRecorderPlayer
                itemId={livePage.pageNumber}
                itemType="quran"
                itemLabel={`Hal ${livePage.pageNumber}`}
                language={language}
                compact={false}
              />
              <div className="flex items-center gap-2 text-[10px] font-semibold">
                <span className="rounded-lg border border-[#fedf89] bg-[#fffaeb] px-2.5 py-1.5 text-[#b54708] dark:border-[#78350f] dark:bg-[#451a03]/30 dark:text-[#fdb022]">
                  {unresolvedIssues.length}{" "}
                  {language === "en" ? "active" : "aktif"}
                </span>
                <span className="rounded-lg border border-[#a6f4c5] bg-[#ecfdf3] px-2.5 py-1.5 text-[#067647] dark:border-[#085d3a] dark:bg-[#052e22]/35 dark:text-[#47cd89]">
                  {resolvedIssues.length}{" "}
                  {language === "en" ? "resolved" : "selesai"}
                </span>
              </div>
            </div>

            <nav
              className="grid grid-cols-3 gap-1 rounded-2xl border border-secondary bg-secondary/50 p-1"
              aria-label={
                language === "en" ? "Evaluation sections" : "Bagian evaluasi"
              }
            >
              {[
                {
                  id: "unresolved" as const,
                  label: language === "en" ? "Active issues" : "Masalah aktif",
                  icon: MessageSquare,
                  count: unresolvedIssues.length,
                },
                {
                  id: "add" as const,
                  label: language === "en" ? "Add issue" : "Catat masalah",
                  icon: Sliders,
                  count: null,
                },
                {
                  id: "history" as const,
                  label: language === "en" ? "History" : "Riwayat",
                  icon: History,
                  count: resolvedIssues.length,
                },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex min-w-0 items-center justify-center gap-1.5 rounded-xl border px-2 py-2.5 text-xs font-semibold outline-none transition focus-visible:outline-[3px] focus-visible:outline-offset-1 focus-visible:outline-[#ef6905] ${activeTab === tab.id ? "border-brand-200 bg-primary text-brand-700 shadow-xs" : "border-transparent text-secondary hover:bg-primary/70 hover:text-primary"}`}
                  >
                    <Icon className="size-3.5 shrink-0" />
                    <span className="truncate">{tab.label}</span>
                    {tab.count !== null && (
                      <span
                        className={`flex min-w-4.5 items-center justify-center rounded-full px-1 text-[9px] leading-4 ${activeTab === tab.id ? "bg-brand-solid text-white" : "bg-secondary text-tertiary"}`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Modal Body */}
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-secondary/20 p-4 sm:p-6">
            {/* TAB 1: MASALAH AKTIF */}
            {activeTab === "unresolved" && (
              <div className="space-y-3">
                {unresolvedIssues.length === 0 ? (
                  <div className="rounded-3xl border border-[#a6f4c5] bg-[linear-gradient(145deg,#ecfdf3_0%,var(--color-bg-primary)_72%)] px-5 py-10 text-center dark:border-[#085d3a] dark:bg-[linear-gradient(145deg,rgba(5,46,34,0.45)_0%,var(--color-bg-primary)_72%)]">
                    <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl border border-[#75e0a7] bg-[#dcfae6] text-[#067647] shadow-sm dark:border-[#087443] dark:bg-[#052e22] dark:text-[#47cd89]">
                      <Check className="size-6" />
                    </div>
                    <p className="text-sm font-semibold text-primary">
                      {language === "en"
                        ? "No active issues recorded!"
                        : "Alhamdulillah, tidak ada masalah aktif!"}
                    </p>
                    <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-tertiary">
                      {language === "en"
                        ? "Hafalan pada halaman ini terpantau lancar tanpa catatan khusus."
                        : "Hafalan pada halaman ini terpantau lancar dan tertib."}
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab("add")}
                      className="mt-5 inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-[#c2410c] bg-brand-solid px-4 py-2 text-xs font-semibold text-white shadow-md shadow-brand-500/20 outline-none transition hover:bg-brand-solid_hover focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#ef6905]"
                    >
                      <Plus className="size-3.5" />
                      <span>
                        {language === "en"
                          ? "Record an Issue"
                          : "Catat Masalah / Kendala"}
                      </span>
                    </button>
                  </div>
                ) : (
                  unresolvedIssues.map((issue) => (
                    <div
                      key={issue.id}
                      className="rounded-2xl border border-secondary bg-primary p-4 shadow-xs transition hover:border-brand-200 hover:shadow-sm"
                    >
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="flex min-w-0 flex-wrap items-center gap-2">
                          <span
                            className={`rounded-lg border px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${getIssueColor(issue.type)}`}
                          >
                            {getIssueLabel(issue.type)}
                          </span>
                          <span className="text-xs font-semibold text-primary">
                            {language === "en" ? "Ayah" : "Ayat"} {issue.ayah}
                          </span>
                        </div>
                        <span className="shrink-0 text-[10px] text-quaternary">
                          {new Date(issue.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {(issue.detail || issue.note) && (
                        <div className="mb-3 rounded-xl border border-secondary bg-secondary/35 p-3 text-xs text-secondary sm:text-sm">
                          {issue.detail && (
                            <div className="font-semibold text-primary">
                              {issue.detail}
                            </div>
                          )}
                          {issue.note && (
                            <div className="mt-1 text-xs font-normal italic text-tertiary">
                              "{issue.note}"
                            </div>
                          )}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          resolveQuranPageIssue(livePage.pageNumber, issue.id)
                        }
                        className="flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#a6f4c5] bg-[#ecfdf3] px-3 py-2 text-xs font-semibold text-[#067647] outline-none transition hover:border-[#75e0a7] hover:bg-[#dcfae6] active:scale-[0.99] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#ef6905] dark:border-[#085d3a] dark:bg-[#052e22]/60 dark:text-[#47cd89] dark:hover:bg-[#052e22]"
                      >
                        <Check className="size-3.5" />
                        {language === "en"
                          ? "Mark as Resolved (Solved)"
                          : "Tandai Sudah Lancar (Selesai)"}
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 2: TAMBAH MASALAH BARU (ZERO-TYPING & SISTEM SAPU AYAT UX) */}
            {activeTab === "add" && currentSection && (
              <div className="space-y-4">
                {/* 1. SELEKTOR AYAT MENGGUNAKAN SISTEM SAPU (COMPACT, CEPAT & INTUITIF) */}
                <section className="space-y-3 rounded-2xl border border-brand-200 bg-primary p-4 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="flex size-7 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                        <Sparkles className="size-3.5" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">
                        {language === "en"
                          ? "Select Issue Ayah"
                          : "Pilih Ayat Bermasalah"}
                      </span>
                    </div>
                    <span className="rounded-lg border border-brand-200 bg-brand-50 px-2 py-1 text-[10px] font-semibold text-brand-700">
                      {language === "en" ? "Swipe / Tap" : "Sistem Sapu Jari"}
                    </span>
                  </div>

                  {/* Multi-Surah Switcher on this Page (if >1 surah exists) */}
                  {surahSections.length > 1 && (
                    <div className="scrollbar-none flex items-center gap-1.5 overflow-x-auto pb-1">
                      <span className="shrink-0 text-[10px] font-bold text-quaternary">
                        Surat:
                      </span>
                      {surahSections.map((sec, idx) => (
                        <button
                          key={sec.surahNumber}
                          type="button"
                          onClick={() => {
                            setSelectedSectionIndex(idx);
                            setAyahFrom(sec.startAyah);
                            setAyahTo(sec.startAyah);
                          }}
                          className={`min-h-9 whitespace-nowrap rounded-lg border px-2.5 py-1 text-xs font-semibold outline-none transition focus-visible:outline-[3px] focus-visible:outline-offset-1 focus-visible:outline-[#ef6905] ${
                            selectedSectionIndex === idx
                              ? "border-[#c2410c] bg-brand-solid text-white shadow-xs"
                              : "border-secondary bg-primary text-secondary hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                          }`}
                        >
                          {sec.surahNameEn} ({sec.startAyah} - {sec.endAyah})
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Ayah Sweep Selector */}
                  <AyahSweepSelector
                    startAyah={currentSection.startAyah}
                    endAyah={currentSection.endAyah}
                    fromAyah={ayahFrom}
                    toAyah={ayahTo}
                    onChange={(from, to) => {
                      setAyahFrom(from);
                      setAyahTo(to);
                    }}
                    surahName={
                      surahSections.length > 1
                        ? currentSection.surahNameEn
                        : undefined
                    }
                    language={language}
                  />
                </section>

                {/* 2. PILIHAN JENIS MASALAH (3 KATEGORI UTAMA) */}
                <section className="rounded-2xl border border-secondary bg-primary p-4 shadow-xs">
                  <label className="mb-2 block text-xs font-bold text-primary">
                    {language === "en"
                      ? "Issue Category"
                      : "Jenis Masalah (Klik Langsung):"}
                  </label>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIssueType("kelancaran");
                        setSelectedDetail(KELANCARAN_PRESETS[0].label);
                      }}
                      className={`min-h-11 rounded-xl border px-3 py-2 text-center text-xs font-semibold outline-none transition focus-visible:outline-[3px] focus-visible:outline-offset-1 focus-visible:outline-[#ef6905] ${
                        issueType === "kelancaran"
                          ? "border-[#dc6803] bg-[#f79009] text-white shadow-sm"
                          : "border-[#fedf89] bg-[#fffaeb] text-[#b54708] hover:bg-[#fef0c7] dark:border-[#78350f] dark:bg-[#451a03]/30 dark:text-[#fdb022]"
                      }`}
                    >
                      Kelancaran / Lupa
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIssueType("tajwid");
                        setSelectedDetail(TAJWID_CATEGORIES[0].options[0]);
                      }}
                      className={`min-h-11 rounded-xl border px-3 py-2 text-center text-xs font-semibold outline-none transition focus-visible:outline-[3px] focus-visible:outline-offset-1 focus-visible:outline-[#ef6905] ${
                        issueType === "tajwid"
                          ? "border-[#175cd3] bg-[#1570ef] text-white shadow-sm"
                          : "border-[#b2ddff] bg-[#eff8ff] text-[#175cd3] hover:bg-[#d1e9ff] dark:border-[#194185] dark:bg-[#102a56]/35 dark:text-[#53b1fd]"
                      }`}
                    >
                      Hukum Tajwid
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIssueType("makharijul");
                        setSelectedLetter(HIJAIYAH_LETTERS[14]); // Default Dhad
                        setSelectedModifier(MAKHRAJ_MODIFIERS[0]);
                      }}
                      className={`min-h-11 rounded-xl border px-3 py-2 text-center text-xs font-semibold outline-none transition focus-visible:outline-[3px] focus-visible:outline-offset-1 focus-visible:outline-[#ef6905] ${
                        issueType === "makharijul"
                          ? "border-[#6938ef] bg-[#7f56d9] text-white shadow-sm"
                          : "border-[#d9d6fe] bg-[#f4f3ff] text-[#5925dc] hover:bg-[#ebe9fe] dark:border-[#4a1fb8] dark:bg-[#2d1b69]/35 dark:text-[#bdb4fe]"
                      }`}
                    >
                      Makharijul Huruf
                    </button>
                  </div>
                </section>

                {/* 3. DETAIL MASALAH TANPA MENGETIK (ZERO-TYPING UX) */}

                {/* CASE A: KELANCARAN & LUPA HAFALAN */}
                {issueType === "kelancaran" && (
                  <section className="animate-in space-y-2 rounded-2xl border border-[#fedf89] bg-[#fffaeb] p-4 shadow-xs fade-in dark:border-[#78350f] dark:bg-[#451a03]/25">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-[#93370d] dark:text-[#fec84b]">
                      Pilih Gejala Kelancaran:
                    </span>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {KELANCARAN_PRESETS.map((preset) => {
                        const isSelected = selectedDetail === preset.label;
                        return (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => setSelectedDetail(preset.label)}
                            className={`flex min-h-14 flex-col justify-center rounded-xl border p-3 text-left outline-none transition focus-visible:outline-[3px] focus-visible:outline-offset-1 focus-visible:outline-[#ef6905] ${
                              isSelected
                                ? "border-[#dc6803] bg-[#f79009] text-white shadow-sm"
                                : "border-[#fedf89] bg-primary text-primary hover:border-[#fdb022]"
                            }`}
                          >
                            <span className="text-xs font-semibold leading-tight">
                              {preset.label}
                            </span>
                            <span
                              className={`mt-1 text-[10px] leading-tight ${isSelected ? "text-[#fef0c7]" : "text-tertiary"}`}
                            >
                              {preset.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* CASE B: TAJWID (KLIK LANGSUNG KATEGORI DAN MASALAHNYA) */}
                {issueType === "tajwid" && (
                  <section className="animate-in space-y-3 rounded-2xl border border-[#b2ddff] bg-[#eff8ff] p-4 shadow-xs fade-in dark:border-[#194185] dark:bg-[#102a56]/30">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#1849a9] dark:text-[#84caff]">
                        Pilih Bagian Tajwid:
                      </span>
                      <span className="text-[10px] font-semibold text-[#175cd3] dark:text-[#53b1fd]">
                        Klik salah satu di bawah
                      </span>
                    </div>

                    {/* Sub-Category Pills */}
                    <div className="scrollbar-none flex items-center gap-1.5 overflow-x-auto pb-1">
                      {TAJWID_CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setSelectedTajwidCat(cat.id);
                            setSelectedDetail(cat.options[0]);
                          }}
                          className={`min-h-9 whitespace-nowrap rounded-lg border px-2.5 py-1 text-xs font-semibold outline-none transition focus-visible:outline-[3px] focus-visible:outline-offset-1 focus-visible:outline-[#ef6905] ${
                            selectedTajwidCat === cat.id
                              ? "border-[#175cd3] bg-[#1570ef] text-white shadow-xs"
                              : "border-[#b2ddff] bg-primary text-[#175cd3] hover:border-[#84caff]"
                          }`}
                        >
                          {cat.title.split(" ")[0]}
                        </button>
                      ))}
                    </div>

                    {/* Active Tajwid Options Grid */}
                    <div className="space-y-2 pt-1">
                      {TAJWID_CATEGORIES.find(
                        (c) => c.id === selectedTajwidCat,
                      )?.options.map((opt) => {
                        const isSelected = selectedDetail === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setSelectedDetail(opt)}
                            className={`flex min-h-11 w-full items-center justify-between rounded-xl border p-3 text-left text-xs font-semibold outline-none transition focus-visible:outline-[3px] focus-visible:outline-offset-1 focus-visible:outline-[#ef6905] ${
                              isSelected
                                ? "border-[#175cd3] bg-[#1570ef] text-white shadow-xs"
                                : "border-[#b2ddff] bg-primary text-primary hover:border-[#84caff]"
                            }`}
                          >
                            <span>{opt}</span>
                            {isSelected && (
                              <Check className="ml-2 size-3.5 shrink-0 text-white" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* CASE C: MAKHARIJUL HURUF (KLIK HURUF DARI ALIF SAMPAI YA) */}
                {issueType === "makharijul" && (
                  <section className="animate-in space-y-3 rounded-2xl border border-[#d9d6fe] bg-[#f4f3ff] p-4 shadow-xs fade-in dark:border-[#4a1fb8] dark:bg-[#2d1b69]/30">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#4a1fb8] dark:text-[#bdb4fe]">
                        Klik Huruf Hijaiyah:
                      </span>
                      {selectedLetter && (
                        <span className="rounded-lg border border-[#d9d6fe] bg-primary px-2 py-1 text-xs font-bold text-[#5925dc] dark:text-[#bdb4fe]">
                          Terpilih: {selectedLetter.ar} ({selectedLetter.latin})
                        </span>
                      )}
                    </div>

                    {/* 28 Hijaiyah Grid (Touch Friendly) */}
                    <div className="grid grid-cols-7 gap-1.5 rounded-2xl border border-[#d9d6fe] bg-primary p-2">
                      {HIJAIYAH_LETTERS.map((letter) => {
                        const isSelected =
                          selectedLetter?.latin === letter.latin;
                        return (
                          <button
                            key={letter.latin}
                            type="button"
                            onClick={() => setSelectedLetter(letter)}
                            className={`flex min-h-11 flex-col items-center justify-center rounded-xl border p-1 outline-none transition focus-visible:outline-[3px] focus-visible:outline-offset-1 focus-visible:outline-[#ef6905] ${
                              isSelected
                                ? "scale-105 border-[#6938ef] bg-[#7f56d9] text-white shadow-md"
                                : "border-secondary bg-secondary/35 text-primary hover:border-[#bdb4fe] hover:bg-[#f4f3ff]"
                            }`}
                            title={`Huruf ${letter.latin}`}
                          >
                            <span className="mt-0.5 font-serif text-lg font-bold leading-none sm:text-xl">
                              {letter.ar}
                            </span>
                            <span
                              className={`mt-0.5 max-w-10 truncate text-[8px] font-bold sm:text-[9px] ${isSelected ? "text-[#ebe9fe]" : "text-tertiary"}`}
                            >
                              {letter.latin}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Quick Modifier Chips */}
                    <div className="pt-1">
                      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-tight text-[#4a1fb8] dark:text-[#bdb4fe]">
                        Keterangan Masalah Huruf (Klik salah satu):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {MAKHRAJ_MODIFIERS.map((mod) => {
                          const isSelected = selectedModifier === mod;
                          return (
                            <button
                              key={mod}
                              type="button"
                              onClick={() => setSelectedModifier(mod)}
                              className={`min-h-9 rounded-lg border px-2.5 py-1 text-xs font-semibold outline-none transition focus-visible:outline-[3px] focus-visible:outline-offset-1 focus-visible:outline-[#ef6905] ${
                                isSelected
                                  ? "border-[#6938ef] bg-[#7f56d9] text-white shadow-xs"
                                  : "border-[#d9d6fe] bg-primary text-primary hover:border-[#bdb4fe]"
                              }`}
                            >
                              {mod}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </section>
                )}

                {/* 4. CATATAN CEPAT (1-KLIK) & OPSIONAL MANUAL */}
                <section className="space-y-3 rounded-2xl border border-secondary bg-primary p-4 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                      Catatan Tambahan (Klik Cepat):
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setShowCustomNoteInput(!showCustomNoteInput)
                      }
                      className="rounded-lg px-2 py-1 text-[10px] font-semibold text-brand-700 outline-none transition hover:bg-brand-50 focus-visible:outline-[3px] focus-visible:outline-offset-1 focus-visible:outline-[#ef6905]"
                    >
                      {showCustomNoteInput
                        ? "Sembunyikan Ketik Manual"
                        : "+ Tulis Catatan Khusus"}
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_NOTES.map((tag) => {
                      const isSelected = issueNote.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setIssueNote((prev) =>
                                prev
                                  .replace(tag, "")
                                  .replace(/,\s*,/g, ",")
                                  .trim(),
                              );
                            } else {
                              setIssueNote((prev) =>
                                prev ? `${prev}, ${tag}` : tag,
                              );
                            }
                          }}
                          className={`min-h-9 rounded-lg border px-2.5 py-1 text-[11px] font-semibold outline-none transition focus-visible:outline-[3px] focus-visible:outline-offset-1 focus-visible:outline-[#ef6905] ${
                            isSelected
                              ? "border-[#c2410c] bg-brand-solid text-white shadow-xs"
                              : "border-secondary bg-primary text-secondary hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>

                  {showCustomNoteInput && (
                    <textarea
                      value={issueNote}
                      onChange={(e) => setIssueNote(e.target.value)}
                      placeholder="Opsional: catatan tambahan penguji..."
                      className="mt-2 h-20 w-full resize-none rounded-xl border border-secondary bg-primary p-3 text-xs text-primary outline-none transition placeholder:text-placeholder hover:border-brand-200 focus:border-brand-300 focus:outline-[3px] focus:outline-offset-1 focus:outline-[#ef6905]"
                    />
                  )}
                </section>
              </div>
            )}

            {/* TAB 3: RIWAYAT EVALUASI SELESAI */}
            {activeTab === "history" && (
              <div className="space-y-3">
                {resolvedIssues.length === 0 ? (
                  <div className="rounded-3xl border border-secondary bg-primary px-5 py-12 text-center text-quaternary">
                    <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-2xl bg-secondary text-quaternary">
                      <History className="size-5" />
                    </div>
                    <p className="text-xs text-tertiary">
                      {language === "en"
                        ? "No resolved issues recorded yet."
                        : "Belum ada riwayat masalah yang diselesaikan."}
                    </p>
                  </div>
                ) : (
                  resolvedIssues.map((issue) => (
                    <div
                      key={issue.id}
                      className="rounded-2xl border border-secondary bg-primary p-4 shadow-xs"
                    >
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-lg border px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${getIssueColor(issue.type)}`}
                          >
                            {getIssueLabel(issue.type)}
                          </span>
                          <span className="text-xs font-semibold text-primary">
                            {language === "en" ? "Ayah" : "Ayat"} {issue.ayah}
                          </span>
                        </div>
                        <span className="flex items-center gap-1 rounded-lg border border-[#a6f4c5] bg-[#ecfdf3] px-2 py-1 text-[10px] font-semibold text-[#067647] dark:border-[#085d3a] dark:bg-[#052e22]/60 dark:text-[#47cd89]">
                          <Check className="size-3" />
                          {language === "en" ? "Resolved" : "Selesai"}
                        </span>
                      </div>
                      {(issue.detail || issue.note) && (
                        <div className="rounded-xl border border-secondary bg-secondary/35 p-3">
                          {issue.detail && (
                            <div className="text-xs font-semibold text-primary">
                              {issue.detail}
                            </div>
                          )}
                          {issue.note && (
                            <div className="mt-1 text-xs italic text-tertiary">
                              "{issue.note}"
                            </div>
                          )}
                        </div>
                      )}
                      <div className="mt-2 text-[10px] text-quaternary">
                        {language === "en" ? "Resolved:" : "Terselesaikan:"}{" "}
                        {issue.resolvedAt
                          ? new Date(issue.resolvedAt).toLocaleDateString()
                          : language === "en"
                            ? "Recorded"
                            : "Tercatat"}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <footer className="flex shrink-0 items-center justify-between gap-2 border-t border-secondary bg-primary px-4 py-3 sm:px-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-secondary outline-none transition hover:bg-secondary hover:text-primary focus-visible:outline-[3px] focus-visible:outline-[#ef6905]"
            >
              {activeTab === "add"
                ? language === "en"
                  ? "Cancel"
                  : "Batal"
                : language === "en"
                  ? "Close"
                  : "Tutup"}
            </button>

            {activeTab === "add" && (
              <button
                type="button"
                onClick={handleAddIssue}
                className="flex items-center gap-1.5 rounded-xl bg-brand-solid px-5 py-2 text-xs font-semibold text-white shadow-md shadow-brand-500/20 outline-none transition-all hover:bg-brand-solid_hover active:scale-[0.98] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#ef6905] sm:text-sm"
              >
                <Check className="w-4 h-4" />
                <span>
                  {language === "en" ? "Save Issue" : "Simpan Masalah"}
                </span>
              </button>
            )}
          </footer>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
};
