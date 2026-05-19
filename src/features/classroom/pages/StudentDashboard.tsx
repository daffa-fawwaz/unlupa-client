import { useState } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { ClassroomHeader } from "../components/ClassroomHeader";
import { TopNavigationBar } from "../components/TopNavigationBar";
import HeaderSection from "../components/HeaderSection";
import DynamicBackgroundAtmosphere from "../components/DynamicBackgroundAtmosphere";
import BackgroundAmbience from "../components/BackgroundAmbience";
import MobileSidebarOverlay from "../components/MobileSidebarOverlay";
import { ClassroomCard } from "../components/ClassroomCard";
import { EmptyStateWrapper } from "@/components/ui/EmptyStateWrapper";
import { Book, BookOpen, BookOpenIcon, Plus, School } from "lucide-react";

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

          <div className="p-4 sm:p-6 lg:p-8 animate-fadeIn max-w-[1600px] mx-auto relative z-10">
            <TopNavigationBar setIsSidebarOpen={setIsSidebarOpen} />

            <HeaderSection
              workspace="Dashboard Siswa"
              mainTitle="Ruang"
              secTitle="Kelas"
              subtitle="Akses jadwal belajar, bergabung dengan kelas, dan pantau progres hafalan harian secara real-time."
            />

            <ClassroomHeader
              title="Statistik Kelas"
              subtitle="Ringkasan aktivitas dan performa belajar Anda."
              totalClasses={10}
              totalStudents={150}
              totalBooks={20}
              activeReviews={50}
            />

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
                console.log("Cari Kelas");
              }}
              // Optional Styling
              mainBgColor="bg-[#020817]"
              wrapperGradient="bg-gradient-to-b from-[#081225] to-[#030712]"
              glowColor="bg-blue-500/10"
              borderColor="border-blue-500/10"
              // Optional Button Styling
              buttonClassName="hover:scale-[1.02]"
            >
              {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
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
                  tone="emerald"
                  description="Kitab Bahasa Arab Bagus"
                  teacherName="Ustadz Abdurrahman"
                />
              </div> */}
            </EmptyStateWrapper>
            
            <EmptyStateWrapper
              // Header
              title="Daftar Kelas"
              badge="Kelas"
              subtitle="Berikut adalah daftar kelas yang tersedia. "
              // Empty State
              emptyTitle="Belum ada kelas yang tersedia"
              description="Ayo, daftarkan kelas Anda sekarang agar dapat mulai digunakan oleh siswa!"
              buttonText="Daftarkan Kelas"
              // Icons
              icon={School}
              buttonIcon={Plus}
              // Action
              onButtonClick={() => {
                console.log("Cari Kelas");
              }}
              // Optional Styling
              mainBgColor="bg-[#020817]"
              wrapperGradient="bg-gradient-to-b from-[#081225] to-[#030712]"
              glowColor="bg-blue-500/10"
              borderColor="border-blue-500/10"
              // Optional Button Styling
              buttonClassName="hover:scale-[1.02]"
            >
              {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
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
                  tone="emerald"
                  description="Kitab Bahasa Arab Bagus"
                  teacherName="Ustadz Abdurrahman"
                />
              </div> */}
            </EmptyStateWrapper>
          </div>
        </div>
      </div>
    </div>
  );
};
