import { useState } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { TopNavigationBar } from "../components/navigation/TopNavigationBar";
import HeaderSection from "../components/shared/HeaderSection";
import DynamicBackgroundAtmosphere from "../components/shared/DynamicBackgroundAtmosphere";
import BackgroundAmbience from "../components/shared/BackgroundAmbience";
import MobileSidebarOverlay from "../components/navigation/MobileSidebarOverlay";
import { ClassroomCard } from "../components/dashboard/ClassroomCard";
import { EmptyStateWrapper } from "@/components/ui/EmptyStateWrapper";
import { Plus, School, School2 } from "lucide-react";
import { QuickAccessCard } from "../components/dashboard/QuickAccessSection";
import { DailyReviewSection } from "@/components/ui/DailyReviewSection";

export const StudentDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-deep-universe text-white font-sans selection:bg-blue-500/30">
      {/* Background Ambience */}
      <BackgroundAmbience />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="min-h-screen relative rounded-3xl overflow-hidden selection:bg-blue-500/30">
          {/* --- Dynamic Background Atmosphere --- */}
          <DynamicBackgroundAtmosphere />

          {/* Sidebar */}
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          {/* Overlay for mobile sidebar */}
          <MobileSidebarOverlay
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />

          <div className="p-4 sm:p-6 lg:p-8 animate-fadeIn max-w-400 mx-auto relative z-10">
            <TopNavigationBar setIsSidebarOpen={setIsSidebarOpen} />

            <HeaderSection
              workspace="Dashboard Siswa"
              mainTitle="Ruang"
              secTitle="Kelas"
              subtitle="Akses jadwal belajar, bergabung dengan kelas, dan pantau progres hafalan harian secara real-time."
            />

            <div className="grid mt-6 grid-cols-2 gap-2">
              <QuickAccessCard
                title="Kelas Saya"
                description="Kelas yang sudah Anda ikuti dan aktif saat ini."
                href="#kelas-saya"
                color="blue"
                icon={School}
              />
              <QuickAccessCard
                title="Daftar Kelas"
                description="Temukan dan bergabung dengan kelas baru."
                href="#daftar-kelas"
                color="green"
                icon={School2}
              />
            </div>

            <DailyReviewSection />

            <div id="kelas-saya">
              <EmptyStateWrapper
                // Header
                title="Kelas Saya"
                badge="Kelas"
                subtitle="Berikut adalah daftar kelas yang sudah anda ikuti. "
                // Empty State
                emptyTitle="Anda belum bergabung di kelas manapun"
                description="Yuk, cari dan bergabung dengan kelas yang sesuai minat dan level kemampuan Anda untuk memulai perjalanan belajar bersama!"
                buttonText="Cari Kelas"
                // Icons
                icon={School}
                buttonIcon={Plus}
                // Action
                onButtonClick={() => {
                  // Debug log removed for production
                }}
                // Optional Styling
                mainBgColor="bg-[#020817]"
                wrapperGradient="bg-gradient-to-b from-[#081225] to-[#030712]"
                glowColor="bg-blue-500/10"
                borderColor="border-blue-500/10"
                // Optional Button Styling
                buttonClassName="hover:scale-[1.02]"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <ClassroomCard
                    title="Kelas Arabiyah Baina Yadaik"
                    activeReviewCount={0}
                    memberCount={0}
                    bookCount={0}
                    nextSessionLabel="Sedang Berlangsung"
                    tone="emerald"
                    description="Kitab Bahasa Arab Bagus"
                    teacherName="Ustadz Abdurrahman"
                  />
                  <ClassroomCard
                    title="Kelas Arabiyah Baina Yadaik"
                    activeReviewCount={0}
                    memberCount={0}
                    bookCount={0}
                    nextSessionLabel="Sedang Berlangsung"
                    tone="amber"
                    description="Kitab Bahasa Arab Bagus"
                    teacherName="Ustadz Abdurrahman"
                  />
                  <ClassroomCard
                    title="Kelas Arabiyah Baina Yadaik"
                    activeReviewCount={0}
                    memberCount={0}
                    bookCount={0}
                    nextSessionLabel="Sedang Berlangsung"
                    tone="blue"
                    description="Kitab Bahasa Arab Bagus"
                    teacherName="Ustadz Abdurrahman"
                  />
                </div>
              </EmptyStateWrapper>
            </div>

            <div id="daftar-kelas">
              <EmptyStateWrapper
                // Header
                title="Daftar Kelas"
                badge="Kelas"
                subtitle="Berikut adalah daftar kelas yang tersedia. "
                // Empty State
                emptyTitle="Belum ada kelas yang tersedia"
                description="Ayo, daftarkan kelas Anda sekarang agar dapat mulai digunakan oleh siswa!"
                buttonText="Daftarkan Kelas"
                colorScheme="green"
                // Icons
                icon={School}
                buttonIcon={Plus}
                // Action
                onButtonClick={() => {
                  // Debug log removed for production
                }}
                // Optional Styling
                mainBgColor="bg-[#020817]"
                wrapperGradient="bg-gradient-to-b from-[#081225] to-[#030712]"
                glowColor="bg-blue-500/10"
                borderColor="border-blue-500/10"
                // Optional Button Styling
                buttonClassName="hover:scale-[1.02]"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <ClassroomCard
                    title="Kelas Arabiyah Baina Yadaik"
                    activeReviewCount={0}
                    memberCount={0}
                    bookCount={0}
                    nextSessionLabel="Sedang Berlangsung"
                    tone="emerald"
                    description="Kitab Bahasa Arab Bagus"
                    teacherName="Ustadz Abdurrahman"
                  />
                  <ClassroomCard
                    title="Kelas Arabiyah Baina Yadaik"
                    activeReviewCount={0}
                    memberCount={0}
                    bookCount={0}
                    nextSessionLabel="Sedang Berlangsung"
                    tone="amber"
                    description="Kitab Bahasa Arab Bagus"
                    teacherName="Ustadz Abdurrahman"
                  />
                  <ClassroomCard
                    title="Kelas Arabiyah Baina Yadaik"
                    activeReviewCount={0}
                    memberCount={0}
                    bookCount={0}
                    nextSessionLabel="Sedang Berlangsung"
                    tone="blue"
                    description="Kitab Bahasa Arab Bagus"
                    teacherName="Ustadz Abdurrahman"
                  />
                </div>
              </EmptyStateWrapper>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
