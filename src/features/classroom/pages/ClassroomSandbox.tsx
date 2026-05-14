import { ClassroomCard } from "@/features/classroom/components/ClassroomCard";
import { CreateClassButton } from "../components/CreateClassButton";
import { ClassroomSearchInput } from "../components/ClassroomSearchInput";

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
        <div className="absolute right-[-12%] top-[-18%] h-[620px] w-[620px] rounded-full bg-blue-500/6 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-14%] h-[520px] w-[520px] rounded-full bg-emerald-500/6 blur-[120px]" />
      </div>

      <section className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-3 border-b border-white/5 pb-6">
          <span className="w-max rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-300">
            Sandbox
          </span>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">
              Preview
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-400">
              Draft tampilan Komponen Unlupa
            </p>
          </div>
        </div>

        <div className="mt-16">
          <ClassroomSearchInput />
        </div>

        {/* <div className="mt-6">
          <CreateClassButton />
        </div> */}


        <div className="grid grid-cols-1 mt-8 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {classroomSamples.map((classroom) => (
            <ClassroomCard key={classroom.title} {...classroom} />
          ))}
        </div>
      </section>
    </main>
  );
};
