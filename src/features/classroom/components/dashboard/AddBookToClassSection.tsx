import { Button } from "@/components/ui/button";
import { BookOpen, BookOpenCheck, Plus } from "lucide-react";

interface AddBookSectionProps {
  classroomId: string;
}

export const AddBookToClassSection = ({ classroomId }: AddBookSectionProps) => {
  const handleOpenAddBookModalOrPage = () => {
    // Jalankan fungsi Anda di sini (misalnya: setIsModalOpen(true) atau navigate ke page lain)
    console.log(`Membuka menu tambah buku untuk kelas: ${classroomId}`);
    alert(`Aksi: Membuka alur penambahan buku untuk kelas ID: ${classroomId}`);
  };

  return (
    <section className="relative overflow-hidden rounded-2xl border border-dashed border-indigo-500/30 bg-gradient-to-r from-indigo-950/20 via-slate-900/40 to-slate-950/20 p-6 md:p-8 shadow-xl">
      {/* Background Ornamen Halus */}
      <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-indigo-500/10 blur-[40px] pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold uppercase tracking-wider text-indigo-400">
            Panel Administrasi Guru
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-400" /> Tambah Kitab ke
            Kelas Ini
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Butuh materi pelajaran tambahan? Anda dapat memasukkan buku digital
            atau materi modul baru dari pustaka pribadi Anda agar bisa langsung
            diakses oleh semua siswa yang terdaftar.
          </p>
        </div>

        <Button
          onClick={handleOpenAddBookModalOrPage}
          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl h-11 px-5 shadow-lg shadow-indigo-600/20 transition-all shrink-0 gap-2 cursor-pointer group"
        >
          <Plus className="h-4 w-4 stroke-[2.5] group-hover:rotate-90 transition-transform duration-300" />
          Add Book to Class
        </Button>
      </div>
    </section>
  );
};
