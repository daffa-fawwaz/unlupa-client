import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useApp } from "@/context/AppContext";
import { HugeiconsIcon } from "@hugeicons/react";
import { Share01Icon } from "@hugeicons/core-free-icons";
import { Share01 } from "@untitledui/icons";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import {
  Home,
  BookOpen,
  Library,
  Users,
  ShieldAlert,
  Sparkles,
  Crown,
  Share2,
  WifiOff,
  LogOut,
  Moon,
  Sun,
  Flame,
} from "lucide-react";
import { PWAInstallButton } from "@/components/common/PWAInstallButton";
import { StudentReportModal } from "@/components/home/StudentReportModal";
import { BillingHistoryModal } from "@/components/profile/BillingHistoryModal";
import { AchievementReportModal } from "@/components/common/AchievementReportModal";
import { Avatar } from "@/components/base/avatar/avatar";

export const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const userRole = user?.role;

  const {
    quranStats,
    personalStats,
    language,
    theme,
    toggleTheme,
    userProfile,
    openUpgradeModal,
    logout,
    quranPages,
    books,
    items,
    chapters,
    myClasses,
    teachingClasses,
    currentStreak,
    totalActiveMaterials,
    totalMasteredMaterials,
  } = useApp();

  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const navItems = [
    {
      path: "/dashboard",
      labelEn: "Home",
      labelId: "Beranda",
      icon: <Home className="w-5 h-5" />,
      badge: 0,
      isActive: location.pathname === "/dashboard",
    },
    {
      path: "/dashboard/alquran",
      labelEn: "Al-Quran",
      labelId: "Al-Qur'an",
      icon: <BookOpen className="w-5 h-5" />,
      badge: quranStats?.dueToday || 0,
      isActive: location.pathname.startsWith("/dashboard/alquran"),
    },
    {
      path: "/dashboard/pribadi",
      labelEn: "Books",
      labelId: "Ruang Buku",
      icon: <Library className="w-5 h-5" />,
      badge: personalStats?.dueToday || 0,
      isActive: location.pathname.startsWith("/dashboard/pribadi"),
    },
    {
      path: "/dashboard/kelas",
      labelEn: "Teaching",
      labelId: "Mengajar",
      icon: <Users className="w-5 h-5" />,
      badge: 0,
      isActive: location.pathname.startsWith("/dashboard/kelas"),
    },
    ...(userRole === "admin"
      ? [
          {
            path: "/dashboard/teacher-requests",
            labelEn: "Admin",
            labelId: "Admin",
            icon: <ShieldAlert className="w-5 h-5" />,
            badge: 0,
            isActive:
              location.pathname.startsWith("/dashboard/teacher-requests") ||
              location.pathname.startsWith("/dashboard/user-list") ||
              location.pathname.startsWith("/dashboard/book-requests"),
          },
        ]
      : []),
  ];

  return (
    <div className="flex min-h-screen flex-col bg-primary font-sans text-primary transition-colors selection:bg-brand-500 selection:text-white">
      {/* Top Application Bar */}
      <header className="sticky top-0 z-40 border-b border-secondary bg-primary/95 backdrop-blur-md transition-colors print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                navigate(
                  userRole === "teacher" ? "/dashboard/kelas" : "/dashboard",
                )
              }
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="relative flex size-8 items-center justify-center overflow-hidden rounded-lg border border-secondary bg-primary-solid shadow-lg shadow-amber-500/10 transition-transform group-hover:scale-105">
                {/* Custom CSS Logo */}
                <div className="w-4 h-5 relative flex flex-col justify-between">
                  <div
                    className="absolute left-0 top-1 bottom-0 w-2 bg-gradient-to-b from-amber-300 via-amber-500 to-amber-600 rounded-sm"
                    style={{
                      clipPath: "polygon(0 15%, 100% 0, 100% 100%, 0 85%)",
                    }}
                  />
                  <div
                    className="absolute right-0 top-0 bottom-1 w-2 bg-gradient-to-b from-amber-300 via-amber-500 to-amber-600 rounded-sm"
                    style={{
                      clipPath: "polygon(0 0, 100% 15%, 100% 85%, 0 100%)",
                    }}
                  />
                  <div
                    className="absolute bottom-0 left-1 right-1 h-2 bg-gradient-to-r from-amber-600 to-amber-500"
                    style={{
                      clipPath: "polygon(0 100%, 100% 0, 100% 100%, 0 100%)",
                    }}
                  />
                  <div
                    className="absolute top-0 left-1 right-1 h-2 bg-gradient-to-r from-amber-400 to-amber-300"
                    style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 0)" }}
                  />
                </div>
              </div>
              <div>
                <span
                  className="text-lg font-bold uppercase tracking-tight text-primary"
                  style={{
                    fontFamily: "system-ui, sans-serif",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Unlupa
                  <span className="text-transparent bg-clip-text bg-gradient-to-br from-amber-400 to-orange-500">
                    .id
                  </span>
                </span>
              </div>
            </button>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <PWAInstallButton />

            {/* Quick Upgrade / Plan Indicator */}
            {userProfile?.plan === "free" ? (
              <button
                type="button"
                onClick={() =>
                  openUpgradeModal(
                    "Top Bar Navigation",
                    "Upgrade ke Unlupa Pro untuk membuka Mushaf 30 Juz, AI Builder, dan kelas tak terbatas.",
                  )
                }
                className="inline-flex items-center gap-1.5 px-3 h-8 rounded-full bg-[#2a1d0f] border border-amber-500/50 hover:border-amber-400 text-amber-300 text-xs font-black tracking-wider shadow-md shadow-amber-500/10 transition-all cursor-pointer active:scale-95"
                title="Upgrade ke Unlupa Pro"
              >
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>PRO</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsBillingModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 h-8 rounded-full bg-[#2a1d0f] border border-amber-500/50 text-amber-300 text-xs font-black tracking-wider transition-all cursor-pointer active:scale-95"
                title="Klik untuk melihat status paket Pro & riwayat invoice"
              >
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>PRO</span>
              </button>
            )}

            {/* Share Report Trigger */}
            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 h-8 rounded-full bg-[#161f30] border border-slate-700/80 hover:border-slate-600 text-xs font-bold text-slate-200 shadow-2xs transition-all cursor-pointer active:scale-95 whitespace-nowrap"
              title={
                language === "en"
                  ? "Share Progress Report"
                  : "Bagikan Rapor Progres"
              }
            >
              {/* <Share2 className="w-3.5 h-3.5 text-blue-400 shrink-0" /> */}
              <HugeiconsIcon icon={Share01Icon} />
              <span>{language === "en" ? "Share Report" : "Bagi Rapor"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Routed Workspace */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-5 pb-28">
        <Outlet />
      </main>

      {/* Floating workspace navigation and profile */}
      <nav
        id="bottom-app-navigation"
        aria-label={language === "en" ? "Main navigation" : "Navigasi utama"}
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] px-2 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] print:hidden select-none sm:px-4"
      >
        <div className="mx-auto flex w-full max-w-md items-end justify-center gap-3">
          <div
            className={`pointer-events-auto grid min-w-0 flex-1 items-center rounded-full border border-secondary bg-primary/90 p-1.5 shadow-[0_12px_35px_rgba(15,23,42,0.18)] backdrop-blur-xl ${
              navItems.length > 4 ? "grid-cols-5" : "grid-cols-4"
            }`}
          >
            {navItems.map((item) => {
              const label = language === "en" ? item.labelEn : item.labelId;

              return (
                <button
                  key={item.path}
                  type="button"
                  aria-label={label}
                  aria-current={item.isActive ? "page" : undefined}
                  title={label}
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate(item.path);
                  }}
                  className={`relative flex h-12 min-w-0 w-full items-center justify-center rounded-3xl transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950 active:scale-95 ${
                    item.isActive
                      ? "bg-primary text-primary shadow-[0_3px_12px_rgba(15,23,42,0.14)] ring-1 ring-secondary"
                      : "text-quaternary hover:bg-primary_hover hover:text-secondary"
                  }`}
                >
                  {item.icon}
                  {item.badge > 0 && (
                    <span className="absolute right-1 top-1 flex min-w-4.5 items-center justify-center rounded-full bg-primary-solid px-1 text-[9px] font-bold leading-4 text-white ring-2 ring-primary">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pointer-events-auto relative shrink-0">
            {showProfileMenu && (
              <div className="absolute bottom-full right-0 mb-3 w-72 origin-bottom-right rounded-3xl border border-secondary bg-primary p-2 text-xs text-secondary shadow-[0_20px_45px_rgba(15,23,42,0.22)] animate-in fade-in zoom-in-95">
                <div className="mb-1 rounded-2xl bg-secondary px-3 py-3">
                  <p className="truncate text-sm font-bold text-primary">
                    {userProfile?.fullName || user?.name || "Tamu / Murid"}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-secondary">
                    {userProfile?.email || user?.email}
                  </p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="rounded-full border border-secondary bg-primary px-2 py-0.5 text-[10px] font-bold text-secondary">
                      {userRole === "admin"
                        ? "Admin"
                        : userRole === "teacher"
                          ? "Guru / Asatidz"
                          : "Santri / Murid"}
                    </span>
                    {currentStreak > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                        <Flame className="size-3 fill-amber-500 text-amber-500" />
                        {currentStreak} Hari
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    toggleTheme();
                    setShowProfileMenu(false);
                  }}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left font-medium transition-colors hover:bg-primary_hover"
                >
                  <span className="flex items-center gap-2">
                    {theme === "dark" ? (
                      <Sun className="size-4 text-amber-500" />
                    ) : (
                      <Moon className="size-4 text-fg-quaternary" />
                    )}
                    {theme === "dark" ? "Mode Terang" : "Mode Gelap"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    setShowProfileMenu(false);
                    await logout();
                    navigate("/login");
                  }}
                  className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left font-medium text-error-primary transition-colors hover:bg-error-primary"
                >
                  <LogOut className="size-4" />
                  <span>Keluar</span>
                </button>
              </div>
            )}

            <button
              type="button"
              aria-label={language === "en" ? "Open profile" : "Buka profil"}
              aria-expanded={showProfileMenu}
              onClick={() => setShowProfileMenu((isOpen) => !isOpen)}
              className="group flex size-15 items-center justify-center rounded-full bg-primary-solid shadow-[0_12px_35px_rgba(15,23,42,0.28)] ring-1 ring-secondary transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring active:scale-95"
            >
              <Avatar
                size="lg"
                src={userProfile?.avatarUrl}
                alt={userProfile?.fullName || user?.name || "User"}
                border
                className="transition-transform group-hover:scale-105"
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Shared Modals */}
      <StudentReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        userProfile={userProfile}
        quranPages={quranPages}
        quranStats={quranStats}
        books={books}
        items={items}
        chapters={chapters}
        myClasses={myClasses}
        teachingClasses={teachingClasses}
        currentStreak={currentStreak}
        totalActiveMaterials={totalActiveMaterials}
        totalMasteredMaterials={totalMasteredMaterials}
        language={language}
      />

      <BillingHistoryModal
        isOpen={isBillingModalOpen}
        onClose={() => setIsBillingModalOpen(false)}
      />

      <AchievementReportModal
        isOpen={isAchievementModalOpen}
        onClose={() => setIsAchievementModalOpen(false)}
      />
    </div>
  );
};
