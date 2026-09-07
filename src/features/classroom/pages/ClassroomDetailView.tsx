import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { tones } from "../constants";
import {
  Users,
  BookOpen,
  Plus,
  Search,
  UserPlus,
  Sparkles,
  SlidersHorizontal,
  ArrowUpRight,
  Mail,
  ImageIcon,
  MoreVertical,
} from "lucide-react";
import { Sidebar } from "@/components/ui/Sidebar";
import { TopNavigationBar } from "@/features/classroom/components/navigation/TopNavigationBar";
import {
  useGetClassBook,
  useGetClassMember,
  useMyClassesTeacher,
  useMyJoinedClass,
} from "../hooks/useClassroom";
import { toneStyles, statusLabel } from "../constants";
import { Button } from "@/components/ui/button";
import BackgroundAmbience from "../components/shared/BackgroundAmbience";
import MobileSidebarOverlay from "../components/navigation/MobileSidebarOverlay";
import { QuranClassroomDetailView } from "./QuranClassroomDetailView";
import { StudentQuranClassroomDetailView } from "./StudentQuranClassroomDetailView";
import {
  BookCard,
  type BookCardProps,
} from "@/features/personal/components/BookCard";
import { AddBookToClassSection } from "../components/dashboard/AddBookToClassSection";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { resolveAssetUrl } from "@/lib/assets";

export const ClassroomDetailView = () => {
  const navigate = useNavigate();
  const { classroomId } = useParams<{ classroomId: string }>();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"books" | "members">("books");
  const [memberSearch, setMemberSearch] = useState("");
  const [bookSearch, setBookSearch] = useState("");
  const { data: memberData, isLoading: isLoadingMember } = useGetClassMember(
    classroomId!,
  );
  const {
    data: bookData,
    isLoading: isLoadingBook,
    error: bookError,
  } = useGetClassBook(classroomId!);

  const { data: teacherClasses } = useMyClassesTeacher();
  const { data: studentClasses } = useMyJoinedClass();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleClickOutside = () => {
    setIsDropdownOpen(false);
  };

  const allClasses = [...(teacherClasses || []), ...(studentClasses || [])];
  const classroom = allClasses.find((c) => c.id === classroomId);
  const userRole = useAuthStore((state) => state.user?.role);
  const isTeacher = userRole === "teacher";
  console.log("isTeacher:", isTeacher);
  // UX Guard: Memastikan jika user adalah student, tab otomatis terkunci di 'books'
  useEffect(() => {
    if (!isTeacher) {
      setActiveTab("books");
    }
  }, [isTeacher]);

  if (!classroom) {
    return (
      <div className="min-h-screen bg-background text-muted-foreground flex flex-col items-center justify-center relative">
        <BackgroundAmbience />
        <div className="p-6 text-center space-y-4 z-10">
          <div className="h-12 w-12 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center mx-auto text-destructive">
            <SlidersHorizontal className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium tracking-wide">
            Akses Ditolak atau Kelas Tidak Tersedia
          </p>
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            size="sm"
            className="border-border text-foreground"
          >
            Kembali ke Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (classroom.type === "quran") {
    if (isTeacher) {
      return (
        <QuranClassroomDetailView
          classroom={classroom}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      );
    } else {
      return (
        <StudentQuranClassroomDetailView
          classroom={classroom}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      );
    }
  }

  const toneIndex = classroom.id.charCodeAt(0) % tones.length;
  const theme = toneStyles[tones[toneIndex]];

  const filteredBooks = (bookData ?? []).filter((b) =>
    b.book.title.toLowerCase().includes(bookSearch.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-primary/30 pb-12">
      <BackgroundAmbience />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <MobileSidebarOverlay
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Top Nav Bar */}
      <div className="sticky z-40 bg-background/90 backdrop-blur-md border-b border-border px-4 sm:px-6 lg:px-10 py-4">
        <div className="max-w-7xl mx-auto gap-4 mb-4 mt-4 px-6">
          <TopNavigationBar
            info={classroom.name}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        </div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* HERO BANNER */}
        <div className="relative rounded-2xl overflow-hidden border border-border bg-card min-h-[180px] md:min-h-[220px] flex items-center">
          {classroom.cover_image ? (
            <>
              <img
                src={resolveAssetUrl(classroom.cover_image)}
                alt={classroom.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-r from-background via-background/70 to-transparent z-10" />
              <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent z-10" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
              <div className="absolute right-8 md:right-16 bottom-0 top-0 my-auto h-24 w-24 md:h-32 md:w-32 flex items-center justify-center text-foreground/5 pointer-events-none">
                <ImageIcon className="w-full h-full stroke-[1]" />
              </div>
              <div className="absolute inset-0 bg-linear-to-r from-background via-background/40 to-transparent z-10" />
            </>
          )}

          <div className="relative z-20 w-full p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-2.5">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${theme.border} ${theme.softBg} ${theme.text}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                  {classroom.is_active ? statusLabel.active : statusLabel.draft}
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  Materi Orisinal
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight leading-tight">
                {classroom.name}
              </h2>
              <p className="text-sm text-foreground/80 leading-relaxed max-w-2xl">
                {classroom.description ||
                  "Belum ada deskripsi detail yang disematkan untuk kelas ini."}
              </p>
            </div>
          </div>
        </div>

        {/* LAYOUT GRID UTAMA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* PANEL KIRI: Metadata */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 rounded-xl border border-border bg-surface-1 space-y-4">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                Penulis & Pengajar
              </p>
              <div className="flex items-center gap-3">
                <div
                  className={`h-11 w-11 flex items-center justify-center rounded-xl border ${theme.border} ${theme.iconBg} text-foreground`}
                >
                  <Sparkles className={`h-5 w-5 ${theme.text}`} />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-foreground truncate">
                    {classroom.owner_name}
                  </p>
                  <p className="text-xs text-primary/80 font-medium mt-0.5">
                    Pemilik Hak Cipta Materi
                  </p>
                </div>
              </div>
            </div>

            {isTeacher ? (
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setActiveTab("books")}
                  className={`p-5 rounded-xl border text-left transition-all group ${activeTab === "books" ? "bg-success/10 border-success/40 ring-1 ring-success/20" : "border-border bg-surface-1 hover:bg-surface-2"}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`h-8 w-8 rounded-lg flex items-center justify-center ${activeTab === "books" ? "bg-success/20 text-success" : "bg-surface-1 text-muted-foreground"}`}
                    >
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <p className="text-2xl font-black text-foreground tracking-tight">
                    {bookData?.length}
                  </p>
                  <p className="text-[11px] font-semibold text-muted-foreground mt-1 uppercase tracking-wide">
                    Koleksi Kitab
                  </p>
                </button>

                <button
                  onClick={() => setActiveTab("members")}
                  className={`p-5 rounded-xl border text-left transition-all group ${activeTab === "members" ? "bg-primary/10 border-primary/40 ring-1 ring-primary/20" : "border-border bg-surface-1 hover:bg-surface-2"}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`h-8 w-8 rounded-lg flex items-center justify-center ${activeTab === "members" ? "bg-primary/20 text-primary" : "bg-surface-1 text-muted-foreground"}`}
                    >
                      <Users className="h-4 w-4" />
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <p className="text-2xl font-black text-foreground tracking-tight">
                    {classroom.student_count}
                  </p>
                  <p className="text-[11px] font-semibold text-muted-foreground mt-1 uppercase tracking-wide">
                    Siswa Terdaftar
                  </p>
                </button>
              </div>
            ) : (
              <div className="p-5 rounded-xl border border-border bg-surface-1 text-center space-y-1">
                <p className="text-2xl font-bold text-foreground tracking-tight">
                  {filteredBooks?.length}
                </p>
                <p className="text-xs text-muted-foreground">
                  Materi Kitab Siap Dipelajari 
                </p>
              </div>
            )}
          </div>

          {/* PANEL KANAN: Ruang Kerja Tab */}
          <div className="lg:col-span-8 p-6 rounded-xl border border-border bg-card space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center border-b border-border pb-4">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  {activeTab === "books"
                    ? "Daftar Karya Kitab Pengajar"
                    : "Daftar Siswa Kelas"}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {activeTab === "books"
                    ? "Materi eksklusif yang disusun langsung oleh pengajar utama kelas ini."
                    : "Kelola hak akses siswa ke materi belajar."}
                </p>
              </div>

              {isTeacher && activeTab === "members" && (
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs rounded-lg h-8 px-3 self-end sm:self-center"
                >
                  <UserPlus className="h-3.5 w-3.5 mr-1.5" /> Undang Siswa
                </Button>
              )}
            </div>

            {/* TAB CONTENT: BOOKS WORKSPACE */}
            {activeTab === "books" && (
              <div className="space-y-6">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Cari judul materi kitab..."
                    value={bookSearch}
                    onChange={(e) => setBookSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-border bg-surface-1 text-sm text-foreground placeholder:text-muted-foreground outline-none ring-1 ring-border focus:ring-success/50 transition-all"
                  />
                </div>

                {filteredBooks.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {filteredBooks.map((book, idx) => (
                      <BookCard
                        classroomId={classroomId}
                        key={idx}
                        book={book.book}
                        showMenu={isTeacher}
                        onClick={() =>
                          navigate(
                            `/dashboard/kelas/${classroomId}/book/${book.book.id}`,
                          )
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border border-dashed border-border rounded-xl bg-surface-1">
                    <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">
                      Tidak ada materi kitab yang cocok.
                    </p>
                  </div>
                )}

                {/* ─── ADD BOOK TO CLASS SECTION (HANYA UNTUK GURU) ─── */}
                {isTeacher && (
                  <div className="pt-4 border-t border-border">
                    <AddBookToClassSection classroomId={classroomId || ""} />
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: MEMBERS WORKSPACE */}
            {isTeacher && activeTab === "members" && (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Cari nama siswa..."
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-border bg-surface-1 text-sm text-foreground placeholder:text-muted-foreground outline-none ring-1 ring-border focus:ring-primary/50 transition-all"
                  />
                </div>

                {memberData && memberData?.length > 0 ? (
                  <div className="border border-border bg-surface-1 rounded-xl overflow-hidden divide-y divide-border">
                    {memberData?.map((member) => (
                      <div
                        key={member.user_id}
                        className="flex items-center justify-between p-4 hover:bg-surface-2 transition-all gap-4"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border bg-surface-1 border-border text-foreground">
                            {member.full_name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-sm text-foreground truncate">
                                {member.full_name}
                              </p>
                            </div>
                            <p className="text-xs text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                              <Mail className="h-3 w-3" /> {member.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                          <div className="text-right hidden sm:block">
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              Gabung{" "}
                              {new Date(member.joined_at).toLocaleDateString(
                                "id-ID",
                                { month: "short", year: "numeric" },
                              )}
                            </p>
                          </div>
                          <button className="p-1 text-muted-foreground hover:text-foreground rounded hover:bg-surface-2 transition-colors">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border border-dashed border-border rounded-xl bg-surface-1">
                    <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">
                      Siswa tidak ditemukan.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
