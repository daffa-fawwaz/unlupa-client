import { Sidebar } from "@/components/ui/Sidebar";
import { useState, useEffect } from "react";
import { Menu, Library, Loader2, Globe, Search, ArrowLeft } from "lucide-react";
import { usePublishedBooks } from "../hooks/usePublishedBooks";
import { PublicBookCard } from "./PublicBookCard";
import { NavLink, useNavigate } from "react-router";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { personalService } from "../services/personal.services";
import type { Book } from "../types/personal.types";

export const GlobalLibraryDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { books, loading, fetchBooks } = usePublishedBooks();
  const navigate = useNavigate();

  useEffect(() => {
    void fetchBooks();
  }, [fetchBooks]);

  const handleImport = async (book: Book) => {
    const toastId = toast.loading("Menambahkan ke koleksi...");
    try {
      await personalService.addPublishedBookToMyBooks(book.id);
      toast.success("Kitab berhasil ditambahkan ke koleksi Anda!", {
        id: toastId,
        duration: 4000,
      });
      navigate("/dashboard/pribadi");
    } catch (error: unknown) {
      const errorMessage = isAxiosError(error)
        ? error.response?.data?.message || "Gagal menambahkan kitab."
        : "Terjadi kesalahan yang tidak diketahui.";

      toast.error(errorMessage, {
        id: toastId,
        duration: 5000,
      });
    }
  };

  const totalPublished = books.length;

  return (
    <div className="min-h-screen w-full bg-background selection:bg-primary/30">
      {/* --- Dynamic Background Atmosphere --- */}

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Overlay for mobile sidebar */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <div className="p-4 sm:p-6 lg:p-8 animate-fadeIn max-w-[1600px] mx-auto relative z-10">
        {/* === TOP NAVIGATION BAR === */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-all group cursor-pointer lg:mr-4"
            >
              <div className="p-2.5 rounded-xl border border-border group-hover:border-border bg-surface-1 group-hover:bg-surface-2 transition-colors">
                <Menu className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
            </button>
            <NavLink
              to="/dashboard/pribadi"
              className="px-5 py-2.5 rounded-full bg-surface-1 border border-border text-xs text-muted-foreground font-bold hover:bg-surface-2 transition-colors flex items-center gap-2 decoration-transparent cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Kembali ke Workspace</span>
            </NavLink>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-1 border border-primary/20 text-xs text-primary font-bold select-none hover:bg-surface-2 transition-colors">
              <Library className="w-4 h-4" />
              <span>{totalPublished} Karya Global</span>
            </div>
          </div>
        </div>

        {/* === HERO / HEADER SECTION === */}
        <div className="mb-14 relative flex flex-col md:flex-row gap-8 justify-between items-start md:items-end">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6 text-xs font-medium text-primary">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Live Library Repository
            </div>

            <h1 className="text-4xl md:text-6xl font-serif font-black text-foreground mb-5 tracking-tight leading-tight">
              Perpustakaan <br className="hidden md:block" />
              <span className="text-primary">
                Umat Global.
              </span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed font-light">
              Pelajari & unduh literatur, rangkuman, dan materi hafalan
              berkualitas tinggi dari kontributor di seluruh dunia untuk
              menunjang studi Anda.
            </p>
          </div>

          <div className="relative w-full md:max-w-xs shrink-0">
            <div className="absolute top-1/2 -translate-y-1/2 left-5 text-muted-foreground pointer-events-none">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Cari perihal atau kitab..."
              className="w-full bg-background/60 border border-primary/20 text-foreground pl-14 pr-5 py-4 rounded-lg font-inter focus:outline-none focus:border-primary focus:bg-background transition-colors box-border placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* === SECTION 1: LIBRARY GRID === */}
        <div className="mb-20 z-10 relative">
          {loading && books.length === 0 ? (
            <div className="flex flex-col justify-center items-center py-32 bg-card rounded-2xl border border-border">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-6" />
              <p className="text-muted-foreground text-lg animate-pulse font-light tracking-wide">
                Menghubungkan ke Repositori Global...
              </p>
            </div>
          ) : books.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book) => (
                <PublicBookCard key={book.id} book={book} onImport={handleImport} />
              ))}
            </div>
          ) : (
            <div className="relative group">
              <div className="relative flex flex-col items-center justify-center py-32 px-4 rounded-2xl border border-primary/20 bg-card text-center overflow-hidden">

                <div className="relative">
                  <div className="w-28 h-28 rounded-xl bg-surface-1 flex items-center justify-center mb-8 border border-border mx-auto relative z-10 group-hover:scale-105 transition-transform duration-300">
                    <Globe className="w-12 h-12 text-primary/80" />
                  </div>
                </div>

                <h3 className="text-3xl font-bold text-foreground mb-4 tracking-tight">
                  Katalog Masih Kosong
                </h3>
                <p className="text-muted-foreground max-w-md mb-10 text-lg font-light leading-relaxed">
                  Saat ini belum ada satupun kontributor yang mempublikasikan
                  karya mereka secara global kawan...
                </p>

                <NavLink
                  to="/dashboard/pribadi"
                  className="px-8 py-4 rounded-lg cursor-pointer bg-primary text-primary-foreground font-bold hover:bg-primary/90 flex items-center gap-3 transition-colors decoration-transparent"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="tracking-wide">
                    Kembali ke Workspace Pribadi
                  </span>
                </NavLink>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
