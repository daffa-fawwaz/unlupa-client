import { ClassroomCard } from "@/features/classroom/components/ClassroomCard";
import { CreateClassButton } from "../components/CreateClassButton";
import { ClassroomSearchInput } from "../components/ClassroomSearchInput";
import { ClassroomHeader } from "../components/ClassroomHeader";
import { TabsNavigation } from "../components/TabsNavigation";
import { EmptyStateWrapper } from "@/components/ui/EmptyStateWrapper";
import { Book, BookAlertIcon } from "lucide-react";
import { QuickAccessCard } from "../components/QuickAccessSection";

const classroomSamples = [
  {
    title: "Tahsin & Hafalan Juz 30",
    description:
      "Kelas intensif untuk menjaga hafalan pendek dengan review harian dan pemantauan guru.",
    teacherName: "Ust. Ahmad Fauzi",
    memberCount: 28,
    bookCount: 3,
    activeReviewCount: 86,
    nextSessionLabel: "Sesi berikutnya: Kamis, 19.30",
    tone: "emerald" as const,
  },
  {
    title: "Kitab Adab Penuntut Ilmu",
    description:
      "Ruang belajar kitab pilihan dengan target pemahaman bertahap dan catatan murajaah.",
    teacherName: "Ustzh. Khadijah Amin",
    memberCount: 16,
    bookCount: 2,
    activeReviewCount: 41,
    nextSessionLabel: "Review bersama: Jumat, 06.00",
    tone: "blue" as const,
  },
  {
    title: "Kelas Percobaan Santri Baru",
    description:
      "Wadah onboarding untuk mengecek ritme belajar, komitmen review, dan kesiapan materi.",
    teacherName: "Admin UNLUPA",
    memberCount: 9,
    bookCount: 1,
    activeReviewCount: 12,
    nextSessionLabel: "Belum ada jadwal tetap",
    status: "draft" as const,
    tone: "amber" as const,
  },
];

export const ClassroomCardSandbox = () => {
  return (
    <main className="min-h-screen bg-[#090A0F] px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute right-[-12%] top-[-18%] h-155 w-155 rounded-full bg-blue-500/6 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-14%] h-130 w-130 rounded-full bg-emerald-500/6 blur-[120px]" />
      </div>

      <section className="relative z-10 mx-auto max-w-6xl">
        <ClassroomHeader
          title="Preview Classroom"
          subtitle="Draft tampilan komponen classroom UNLUPA untuk header, pencarian, CTA, dan kartu kelas."
          totalClasses={3}
          totalStudents={53}
          totalBooks={6}
          activeReviews={139}
        />

        <div className="mt-6">
          <ClassroomSearchInput />
        </div>

        <div className="mt-6 w-full grid grid-cols-2 gap-3">
          <QuickAccessCard
            color="blue"
            description="tes"
            href="#karya"
            icon={BookAlertIcon}
            title="uhuy"
          />
          <QuickAccessCard
            color="blue"
            description="tes"
            href="#karya"
            icon={BookAlertIcon}
            title="uhuy"
          />
        </div>

        <div className="mt-6 ">
          <TabsNavigation
            tabs={[
              { id: "all", label: "All" },
              { id: "active", label: "Active" },
              { id: "draft", label: "Draft" },
            ]}
            activeTab="all"
            onTabChange={(id) => console.log(id)}
          />
        </div>

        <div className="mt-6">
          <CreateClassButton />
        </div>

        <div className="grid grid-cols-1 mt-8 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {classroomSamples.map((classroom) => (
            <ClassroomCard key={classroom.title} {...classroom} />
          ))}
        </div>
      </section>

      <div className="mt-6">
        <EmptyStateWrapper
          icon={Book}
          title="Classroom"
          emptyTitle="Classroom"
          description="Draft tampilan komponen classroom UNLUPA untuk header, pencarian, CTA, dan kartu kelas."
          buttonText="Create Class"
          buttonIcon={CreateClassButton}
          onButtonClick={() => console.log("Create Class")}
        />
      </div>
    </main>
  );
};
