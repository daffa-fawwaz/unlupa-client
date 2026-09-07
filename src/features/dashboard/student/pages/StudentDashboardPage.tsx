import {
  Menu,
  ShieldCheck,
  Sun,
  Target,
  Trophy,
  UserCheck,
  X,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import type { DashboardContextType } from "@/layouts/DashboardLayout";
import { useGetMyItems } from "@/features/alquran/hooks/useGetMyItems";
import { QuickAccessCards } from "@/components/ui/QuickAccessCards";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useGetDaily } from "@/features/alquran/hooks/useGetDaily";
import { useTeacherRequest } from "../hooks/useTeacherRequest";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const getTodayDateKey = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const getReviewedStorageKeyByTaskDate = (taskDate: string) =>
  `alquran:daily-reviewed:${taskDate}`;

const getReviewedIdsForTaskDate = (taskDate: string): string[] => {
  try {
    const raw = localStorage.getItem(getReviewedStorageKeyByTaskDate(taskDate));
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed)
      ? parsed.filter((v) => typeof v === "string")
      : [];
  } catch {
    return [];
  }
};

export const StudentDashboardPage = () => {
  const { toggleSidebar } = useOutletContext<DashboardContextType>();
  const { name } = useCurrentUser();

  const {
    data: myItems,
    loading: myItemsLoading,
    getMyItems,
  } = useGetMyItems();
  const { data: dailyTasks, loading: dailyLoading } = useGetDaily();

  const { sendTeacherRequest } = useTeacherRequest();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isRequested, setIsRequested] = useState(false);

  useEffect(() => {
    void getMyItems("quran");
  }, []);

  const totalTerjaga =
    myItems?.data.groups.reduce((sum, group) => sum + group.item_count, 0) ?? 0;

  const allItems = myItems?.data.groups.flatMap((group) => group.items) ?? [];
  const totalSelesai = allItems.filter(
    (item) => item.status === "graduated" || item.status === "graduate",
  ).length;

  const reviewHariIni = dailyTasks?.length ?? 0;

  const reviewedToday = getReviewedIdsForTaskDate(getTodayDateKey()).length;
  const estimatedFocusTime = reviewedToday * 4;

  const initialLetter = name.charAt(0).toUpperCase();

  const handleRequestTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Trigger toast loading state biar user tahu sistem sedang bekerja
    const toastId = toast.loading("Sedang mengirim pengajuan Anda...");

    try {
      await sendTeacherRequest.mutateAsync({ message: message });

      setIsRequested(true);
      setIsModalOpen(false);
      setMessage("");

      // Update toast ke sukses dengan style kustom gelap/amber jika diinginkan
      toast.success("Pengajuan berhasil dikirim! Menunggu persetujuan admin.", {
        id: toastId,
        duration: 4000,
      });
    } catch (error: unknown) {
      console.error("Error submitting teacher request:", error);

      if (isAxiosError(error)) {
        console.log("STATUS:", error.response?.status);
        console.log("DATA:", error.response?.data);
      }

      const errorMessage = isAxiosError(error)
        ? error.response?.data?.message ||
          "Gagal mengirim permintaan. Anda mungkin sudah mengajukannya sebelumnya."
        : "Terjadi kesalahan yang tidak diketahui.";

      toast.error(errorMessage, {
        id: toastId,
        duration: 5000,
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 transition-all duration-300 relative">
      {/* HEADER (PROFILE FOCUS) */}
      <nav className="flex justify-between items-center gap-2 sm:gap-4 mb-10">
        {/* Left: Menu Trigger */}
        <button
          onClick={toggleSidebar}
          className="flex items-center gap-3 text-muted-foreground hover:text-primary transition group cursor-pointer shrink-0"
        >
          <div className="p-2 rounded-lg border border-border group-hover:border-primary/50 bg-surface-1">
            <Menu className="w-5 h-5" />
          </div>
          <span className="text-sm font-mono tracking-widest hidden sm:inline">
            MENU
          </span>
        </button>

        {/* Right: User Identity & Request Teacher Action */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <ThemeToggle />
          <div className="text-right flex flex-col items-end min-w-0">
            <p className="text-sm text-foreground font-serif font-medium truncate max-w-[8rem] sm:max-w-[13rem]">
              {name}
            </p>
            <div className="hidden sm:flex items-center gap-2 mt-0.5">
              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                Penjaga Ilmu
              </p>
              <span className="text-muted-foreground text-[10px]">•</span>
              <button
                onClick={() => !isRequested && setIsModalOpen(true)}
                disabled={isRequested}
                className={`text-[10px] font-mono uppercase tracking-widest transition cursor-pointer flex items-center gap-1 ${
                  isRequested
                    ? "text-success cursor-not-allowed"
                    : "text-warning/80 hover:text-warning underline decoration-warning/30 underline-offset-4"
                }`}
              >
                {isRequested ? "Request Pending" : "Jadi Guru?"}
              </button>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-serif font-bold text-primary-foreground shrink-0">
            {initialLetter}
          </div>
        </div>
      </nav>

      {/* 1. QUOTE BANNER */}
      <div className="fade-in-up mb-12 text-center md:text-left border-l-4 border-primary bg-surface-1 p-6 rounded-r-xl">
        <p className="text-xl md:text-2xl font-serif text-foreground italic leading-relaxed">
          "Menjaga hafalan itu lebih ringan <br /> daripada mengulang hafalan
          yang hilang."
        </p>
        <p className="text-xs text-primary mt-3 font-mono uppercase tracking-widest flex items-center gap-2 md:justify-start justify-center">
          <Sun className="w-3 h-3" />
          <span>
            Istiqomah Hari Ini = Kemudahan Esok Hari
          </span>
        </p>
      </div>

      {/* QUICK ACCESS CARDS */}
      <QuickAccessCards role="student" />

      {/* 2. STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {/* Stat 1: Materi Terjaga */}
        <div className="bg-card border border-success/20 rounded-xl p-6 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6">
            <p className="text-[10px] text-success/80 uppercase tracking-widest font-mono">
              Total Terjaga
            </p>
            <ShieldCheck className="w-5 h-5 text-success" />
          </div>
          <h3 className="text-4xl text-foreground font-serif mb-4">
            {myItemsLoading ? "..." : totalTerjaga}{" "}
            <span className="text-sm text-muted-foreground font-sans">Item</span>
          </h3>
          <div className="space-y-2 border-t border-border pt-4">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Al-Qur'an</span>{" "}
              <span className="text-success">
                {myItemsLoading ? "..." : totalTerjaga}
              </span>
            </div>
          </div>
        </div>

        {/* Stat 2: Review Hari Ini */}
        <div className="bg-card border border-primary/20 rounded-xl p-6 relative overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300">
          <div className="flex justify-between items-start mb-6 relative z-10">
            <p className="text-[10px] text-primary/80 uppercase tracking-widest font-mono">
              Review Hari Ini
            </p>
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div className="text-center py-2 relative z-10">
            <h3 className="text-5xl text-foreground font-serif tracking-tight">
              {dailyLoading ? "..." : reviewHariIni}
            </h3>
            <p className="text-sm text-primary mt-1">Tugas Review</p>
          </div>
          <p className="text-[10px] text-center text-muted-foreground mt-6 relative z-10">
            {reviewHariIni > 0
              ? "Ayo selesaikan sekarang!"
              : "Tidak ada tugas hari ini"}
          </p>
        </div>

        {/* Stat 3: Total Selesai */}
        <div className="bg-card border border-warning/20 rounded-xl p-6 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[10px] text-warning/80 uppercase tracking-widest font-mono">
              Total Selesai
            </p>
            <div className="flex items-center gap-1 text-warning">
              <Trophy className="w-5 h-5" />
              <span className="text-sm font-bold">{totalSelesai}</span>
            </div>
          </div>
          <div className="text-center py-2">
            <p className="text-xs text-muted-foreground mb-2">
              Item yang telah dihafal dengan sempurna
            </p>
            <div className="w-full h-2 bg-surface-1 rounded-full overflow-hidden">
              <div
                className="h-full bg-success rounded-full transition-all duration-500"
                style={{
                  width:
                    totalTerjaga > 0
                      ? `${Math.min((totalSelesai / totalTerjaga) * 100, 100)}%`
                      : "0%",
                }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">
              {totalTerjaga > 0
                ? `${Math.round((totalSelesai / totalTerjaga) * 100)}% dari total terjaga`
                : "Mulai menghafal untuk melihat progress"}
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER SUMMARY */}
      <div className="mt-20 border-t border-border pt-8 pb-4">
        <div className="bg-card border border-warning/20 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div>
            <p className="font-serif italic text-foreground text-lg mb-1">
              "Setiap menit adalah investasi abadi."
            </p>
            <p className="text-xs text-muted-foreground">
              Teruslah menjaga, walau sedikit.
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <p className="text-[10px] font-mono text-warning/70 uppercase tracking-widest">
              Total Fokus Hari Ini
            </p>
            <p className="text-3xl font-serif text-warning">
              ± {estimatedFocusTime}{" "}
              <span className="text-sm font-sans text-warning/50">Menit</span>
            </p>
          </div>
        </div>
      </div>

      {/* MODAL DIALOG: REQUEST TEACHER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 transition-opacity duration-300">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 relative shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-xl border border-primary/20 text-primary">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg font-serif text-foreground">
                  Ajukan Sebagai Pengajar
                </h4>
                <p className="text-xs text-muted-foreground font-sans">
                  Bagikan ilmu dan bimbing generasi penghafal.
                </p>
              </div>
            </div>

            <form onSubmit={handleRequestTeacher} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
                  Pesan / Catatan Pengajuan
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Contoh: Saya lulusan pondok pesantren X dan ingin berkontribusi mengajar di UNLUPA..."
                  className="w-full bg-surface-1 border border-border rounded-xl p-3 text-sm text-foreground placeholder-muted-foreground focus:outline-hidden focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground border border-transparent hover:border-border rounded-lg transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={sendTeacherRequest.isPending}
                  className="px-5 py-2 text-xs font-mono uppercase tracking-widest bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg transition shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {sendTeacherRequest.isPending ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    "Kirim Request"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
