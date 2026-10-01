import { useCallback, useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { AnimatePresence, motion } from "motion/react";
import {
  Activity,
  BookOpen,
  CheckCircle2,
  Download,
  Flame,
  GraduationCap,
  Library,
  Share2,
  Sparkles,
  Target,
} from "lucide-react";
import { FloatingAlert } from "@/components/base/alert/alert";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import type {
  Book,
  BookItem,
  Chapter,
  ClassGroup,
  Language,
  QuranPageItem,
  QuranStats,
  UserProfile,
} from "../../types";

interface StudentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  quranPages: QuranPageItem[];
  quranStats: QuranStats;
  books: Book[];
  items: BookItem[];
  chapters: Chapter[];
  myClasses: ClassGroup[];
  teachingClasses: ClassGroup[];
  currentStreak: number;
  totalActiveMaterials: number;
  totalMasteredMaterials: number;
  language: Language;
}

type ActionState = "download" | "share" | null;
type ReportAlert = {
  variant: "success" | "error" | "warning" | "info";
  title: string;
  description: string;
} | null;

const getDateKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

const sanitizeUnsupportedColors = (clonedDocument: Document) => {
  const clonedReport = clonedDocument.querySelector<HTMLElement>("[data-report-capture]");
  const clonedWindow = clonedDocument.defaultView;
  if (!clonedReport || !clonedWindow) return;

  const hasUnsupportedColor = (value: string) => /okl(?:ab|ch)\(/i.test(value);
  const elements = [clonedReport, ...clonedReport.querySelectorAll<HTMLElement | SVGElement>("*")];

  elements.forEach((element) => {
    const computedStyle = clonedWindow.getComputedStyle(element);
    const style = element.style;

    if (hasUnsupportedColor(computedStyle.color)) style.color = "#020617";
    if (hasUnsupportedColor(computedStyle.backgroundColor)) style.backgroundColor = "transparent";
    if (hasUnsupportedColor(computedStyle.backgroundImage)) style.backgroundImage = "none";
    if (hasUnsupportedColor(computedStyle.borderTopColor)) style.borderTopColor = "transparent";
    if (hasUnsupportedColor(computedStyle.borderRightColor)) style.borderRightColor = "transparent";
    if (hasUnsupportedColor(computedStyle.borderBottomColor)) style.borderBottomColor = "transparent";
    if (hasUnsupportedColor(computedStyle.borderLeftColor)) style.borderLeftColor = "transparent";
    if (hasUnsupportedColor(computedStyle.textDecorationColor)) style.textDecorationColor = "#020617";
    if (hasUnsupportedColor(computedStyle.boxShadow)) style.boxShadow = "none";
    if (hasUnsupportedColor(computedStyle.textShadow)) style.textShadow = "none";
    if (hasUnsupportedColor(computedStyle.webkitTextStrokeColor)) style.webkitTextStrokeColor = "transparent";
  });
};

export const StudentReportModal = ({
  isOpen,
  onClose,
  userProfile,
  quranPages,
  quranStats,
  books,
  items,
  chapters,
  myClasses,
  teachingClasses,
  currentStreak,
  totalActiveMaterials,
  totalMasteredMaterials,
  language,
}: StudentReportModalProps) => {
  const isDesktop = useBreakpoint("sm");
  const reportRef = useRef<HTMLDivElement>(null);
  const [activeAction, setActiveAction] = useState<ActionState>(null);
  const [reportAlert, setReportAlert] = useState<ReportAlert>(null);
  const [preparedFile, setPreparedFile] = useState<File | null>(null);
  const [isPreparing, setIsPreparing] = useState(false);
  const [reportDate, setReportDate] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      const currentDate = new Date();
      setReportDate((previousDate) =>
        getDateKey(previousDate) === getDateKey(currentDate) ? previousDate : currentDate,
      );
    }, 60_000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!reportAlert) return;
    const timer = window.setTimeout(() => setReportAlert(null), 6_000);
    return () => window.clearTimeout(timer);
  }, [reportAlert]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !activeAction) onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeAction, isOpen, onClose]);

  const masteryRate = totalActiveMaterials > 0
    ? Math.min(100, Math.round((totalMasteredMaterials / totalActiveMaterials) * 100))
    : 0;
  const activeBookItems = items.filter((item) => item.isActive).length;
  const masteredBookItems = items.filter((item) => item.status === "mastered").length;
  const totalReviews = quranPages.reduce((total, page) => total + (page.reviewLogs?.length ?? 0), 0)
    + items.reduce((total, item) => total + (item.reviewLogs?.length ?? 0), 0);
  const classCount = myClasses.length + teachingClasses.length;
  const initials = (userProfile.fullName || "Unlupa User")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
  const formattedDate = reportDate.toLocaleDateString(language === "en" ? "en-US" : "id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const safeName = (userProfile.fullName || "Unlupa-User").trim().replace(/[^a-z0-9]+/gi, "-");
  const fileName = `Unlupa-Progress-${safeName}-${reportDate.getFullYear()}.png`;

  const closeModal = () => {
    if (activeAction) return;
    setReportAlert(null);
    setPreparedFile(null);
    setIsPreparing(false);
    onClose();
  };

  const generateReportFile = useCallback(async () => {
    if (!reportRef.current) throw new Error("Report preview is not available");

    await document.fonts?.ready;
    const canvas = await html2canvas(reportRef.current, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: "#ffffff",
      logging: false,
      onclone: sanitizeUnsupportedColors,
    });

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((result) => {
        if (result) resolve(result);
        else reject(new Error("Unable to encode report image"));
      }, "image/png", 1);
    });

    return new File([blob], fileName, { type: "image/png" });
  }, [fileName]);

  useEffect(() => {
    if (!isOpen || preparedFile) return;

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setIsPreparing(true);
      try {
        const file = await generateReportFile();
        if (!cancelled) setPreparedFile(file);
      } catch (error) {
        console.error("Failed to prepare progress report", error);
        if (!cancelled) {
          setReportAlert({
            variant: "error",
            title: language === "en" ? "Report preview failed" : "Rapor gagal disiapkan",
            description: language === "en" ? "Close this message and try opening the report again." : "Tutup pesan ini lalu coba buka kembali rapornya.",
          });
        }
      } finally {
        if (!cancelled) setIsPreparing(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [generateReportFile, isOpen, language, preparedFile]);

  const downloadFile = (file: File) => {
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
  };

  const handleDownload = async () => {
    setActiveAction("download");
    setReportAlert(null);

    try {
      const file = preparedFile ?? await generateReportFile();
      setPreparedFile(file);
      downloadFile(file);
      setReportAlert({
        variant: "success",
        title: language === "en" ? "Report downloaded" : "Rapor berhasil diunduh",
        description: language === "en" ? "The high-resolution PNG is ready on your device." : "File PNG resolusi tinggi sudah tersimpan di perangkatmu.",
      });
    } catch (error) {
      console.error("Failed to download progress report", error);
      setReportAlert({
        variant: "error",
        title: language === "en" ? "Download failed" : "Rapor gagal diunduh",
        description: language === "en" ? "Please try again in a moment." : "Silakan coba kembali beberapa saat lagi.",
      });
    } finally {
      setActiveAction(null);
    }
  };

  const handleShare = async () => {
    setActiveAction("share");
    setReportAlert(null);

    try {
      if (!preparedFile) throw new Error("Report file is still being prepared");
      const file = preparedFile;
      const title = language === "en" ? "My Unlupa Progress Report" : "Rapor Progres Unlupa Saya";
      const text = language === "en"
        ? `My learning progress: ${masteryRate}% mastery, ${totalMasteredMaterials} mastered materials, and a ${currentStreak}-day streak.`
        : `Progres belajar saya: ${masteryRate}% ketuntasan, ${totalMasteredMaterials} materi mapan, dan istiqomah ${currentStreak} hari.`;

      if (navigator.share) {
        const canShareFile = navigator.canShare?.({ files: [file] }) ?? false;
        await navigator.share(canShareFile ? { title, text, files: [file] } : { title, text });
        setReportAlert({
          variant: "success",
          title: language === "en" ? "Report shared" : "Rapor berhasil dibagikan",
          description: language === "en" ? "Your progress report was sent successfully." : "Rapor progresmu berhasil dikirim.",
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setReportAlert({
          variant: "info",
          title: language === "en" ? "Summary copied" : "Ringkasan berhasil disalin",
          description: language === "en" ? "Web Share is unavailable, so the report summary was copied to your clipboard." : "Fitur berbagi tidak tersedia, jadi ringkasan rapor disalin ke clipboard.",
        });
      } else {
        downloadFile(file);
        setReportAlert({
          variant: "info",
          title: language === "en" ? "Report downloaded instead" : "Rapor diunduh sebagai pengganti",
          description: language === "en" ? "Your browser does not support sharing files." : "Browser ini belum mendukung fitur berbagi file.",
        });
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.error("Failed to share progress report", error);
      setReportAlert({
        variant: "error",
        title: language === "en" ? "Unable to share" : "Rapor gagal dibagikan",
        description: language === "en" ? "Please retry or download the report instead." : "Silakan coba lagi atau unduh rapornya terlebih dahulu.",
      });
    } finally {
      setActiveAction(null);
    }
  };

  const metrics = [
    { label: language === "en" ? "Mastery" : "Ketuntasan", value: `${masteryRate}%`, icon: Target, background: "#fff7ed", color: "#c2410c" },
    { label: language === "en" ? "Mastered" : "Materi Mapan", value: totalMasteredMaterials, icon: CheckCircle2, background: "#ecfdf5", color: "#047857" },
    { label: language === "en" ? "Active" : "Materi Aktif", value: totalActiveMaterials, icon: Activity, background: "#eff6ff", color: "#1d4ed8" },
    { label: language === "en" ? "Reviews" : "Total Review", value: totalReviews, icon: Sparkles, background: "#fffbeb", color: "#b45309" },
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
        <div className="fixed inset-0 z-[250] flex items-end justify-center sm:items-center sm:p-4">
          <motion.button
            type="button"
            aria-label="Close progress report"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="absolute inset-0 bg-overlay/70"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="progress-report-title"
            initial={isDesktop ? { opacity: 0, y: 24, scale: 0.98 } : { y: "100%" }}
            animate={isDesktop ? { opacity: 1, y: 0, scale: 1 } : { y: 0 }}
            exit={isDesktop ? { opacity: 0, y: 24, scale: 0.98 } : { y: "100%" }}
            transition={isDesktop ? { duration: 0.2 } : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex max-h-[96dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl border border-secondary bg-primary shadow-2xl sm:rounded-3xl"
          >
            <header className="flex shrink-0 items-center justify-between gap-4 border-b border-secondary bg-primary px-4 py-3 sm:px-6 sm:py-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
                  {language === "en" ? "Learning portfolio" : "Portofolio belajar"}
                </p>
                <h2 id="progress-report-title" className="truncate text-lg font-semibold tracking-tight text-primary sm:text-xl">
                  {language === "en" ? "Progress Report" : "Rapor Progres"}
                </h2>
              </div>
              <CloseButton slot={null} size="md" onPress={closeModal} isDisabled={Boolean(activeAction)} label="Close progress report" />
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto bg-secondary/40 p-3 sm:p-6">
              <div
                ref={reportRef}
                data-report-capture
                className="mx-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white text-[#020617] shadow-sm"
              >
                <div className="relative overflow-hidden bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_52%,#fffbeb_100%)] px-5 py-6 sm:px-8 sm:py-8">
                  <div className="relative flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 items-center justify-center rounded-xl bg-[#020617] shadow-sm">
                        <img src="/unlupa.logo.png" alt="" className="size-7 object-contain" />
                      </div>
                      <div>
                        <p className="font-semibold tracking-tight text-[#020617]">UNLUPA.ID</p>
                        <p className="text-xs text-[#64748b]">{language === "en" ? "Learning progress report" : "Laporan progres pembelajaran"}</p>
                      </div>
                    </div>
                    <span className="rounded-full border border-[#fed7aa] px-3 py-1 text-xs font-semibold text-[#c2410c]" style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}>
                      {formattedDate}
                    </span>
                  </div>

                  <div className="relative mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative flex size-18 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#ef6905] text-xl font-bold text-white shadow-md">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wider text-[#c2410c]">
                          {language === "en" ? "Student profile" : "Profil pelajar"}
                        </p>
                        <h3 className="mt-1 truncate text-2xl font-semibold tracking-tight text-[#020617] sm:text-3xl">
                          {userProfile.fullName || "Unlupa User"}
                        </h3>
                        <p className="mt-1 truncate text-sm text-[#64748b]">{userProfile.email}</p>
                      </div>
                    </div>

                    <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#fed7aa] px-3 py-2 text-sm font-semibold text-[#1e293b]" style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}>
                      <Flame className="size-4 fill-[#f97316] text-[#f97316]" />
                      {currentStreak} {language === "en" ? "day streak" : "hari istiqomah"}
                    </div>
                  </div>
                </div>

                <div className="space-y-6 p-5 sm:p-8">
                  <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {metrics.map(({ label, value, icon: Icon, background, color }) => (
                      <div key={label} className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
                        <div className="flex size-9 items-center justify-center rounded-lg" style={{ backgroundColor: background, color }}>
                          <Icon className="size-4.5" />
                        </div>
                        <p className="mt-4 text-2xl font-semibold tracking-tight text-[#020617]">{value}</p>
                        <p className="mt-1 text-xs font-medium text-[#64748b]">{label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl border border-[#e2e8f0] p-4 sm:p-5">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-[#020617]">{language === "en" ? "Memory mastery" : "Ketuntasan memori"}</p>
                        <p className="mt-1 text-xs text-[#64748b]">
                          {totalMasteredMaterials} {language === "en" ? "of" : "dari"} {totalActiveMaterials} {language === "en" ? "active materials mastered" : "materi aktif telah mapan"}
                        </p>
                      </div>
                      <p className="text-2xl font-semibold text-[#ea580c]">{masteryRate}%</p>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#f1f5f9]">
                      <div className="h-full rounded-full bg-[#ef6905]" style={{ width: `${masteryRate}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                        {language === "en" ? "Learning breakdown" : "Rincian pembelajaran"}
                      </p>
                      <div className="h-px flex-1 bg-[#e2e8f0]" />
                    </div>

                    <div className="grid gap-3 md:grid-cols-3">
                      <div className="flex items-start gap-3 rounded-xl border border-[#e2e8f0] p-4">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#ecfdf5] text-[#047857]">
                          <BookOpen className="size-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#020617]">Al-Quran</p>
                          <p className="mt-1 text-xs leading-relaxed text-[#64748b]">
                            {quranStats.active} {language === "en" ? "active pages" : "halaman aktif"} · {quranStats.mastered} {language === "en" ? "mastered" : "mapan"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 rounded-xl border border-[#e2e8f0] p-4">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#eff6ff] text-[#1d4ed8]">
                          <Library className="size-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#020617]">{language === "en" ? "Personal books" : "Buku pribadi"}</p>
                          <p className="mt-1 text-xs leading-relaxed text-[#64748b]">
                            {books.length} {language === "en" ? "books" : "buku"} · {activeBookItems} {language === "en" ? "active" : "aktif"} · {masteredBookItems} {language === "en" ? "mastered" : "mapan"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 rounded-xl border border-[#e2e8f0] p-4">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#fffbeb] text-[#b45309]">
                          <GraduationCap className="size-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#020617]">{language === "en" ? "Learning space" : "Ruang belajar"}</p>
                          <p className="mt-1 text-xs leading-relaxed text-[#64748b]">
                            {classCount} {language === "en" ? "classes" : "kelas"} · {chapters.length} {language === "en" ? "chapters" : "bab"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 border-t border-[#e2e8f0] pt-5 text-xs text-[#64748b] sm:flex-row sm:items-center sm:justify-between">
                    <p>{language === "en" ? "Generated from your live Unlupa learning data." : "Dibuat dari data pembelajaran Unlupa milikmu."}</p>
                    <p className="font-medium">{userProfile.quranSpaceCode}</p>
                  </div>
                </div>
              </div>
            </div>

            <footer className="flex shrink-0 flex-col-reverse gap-2 border-t border-secondary bg-primary p-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
              <Button
                color="secondary"
                size="lg"
                iconLeading={Download}
                isLoading={isPreparing || activeAction === "download"}
                isDisabled={isPreparing || !preparedFile || Boolean(activeAction && activeAction !== "download")}
                onPress={handleDownload}
                className="w-full sm:w-auto"
              >
                {language === "en" ? "Download PNG" : "Unduh PNG"}
              </Button>
              <Button
                size="lg"
                iconLeading={Share2}
                isLoading={isPreparing || activeAction === "share"}
                isDisabled={isPreparing || !preparedFile || Boolean(activeAction && activeAction !== "share")}
                onPress={handleShare}
                className="w-full sm:w-auto"
              >
                {language === "en" ? "Share report" : "Bagikan rapor"}
              </Button>
            </footer>
          </motion.div>
        </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && reportAlert && (
          <motion.div key="progress-report-alert" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <FloatingAlert
              variant={reportAlert.variant}
              title={reportAlert.title}
              description={reportAlert.description}
              onDismiss={() => setReportAlert(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
