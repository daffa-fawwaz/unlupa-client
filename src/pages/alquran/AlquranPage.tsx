import { useState } from "react";
import { Moon } from "lucide-react";

// Hooks
import { useQuranData } from "@/features/alquran/hooks/useQuranData";
import { useToast } from "@/features/alquran/hooks/useToast";

// Components
import { AlquranDashboard } from "@/features/alquran/components/AlquranDashboard";
import { JuzDetailView } from "@/features/alquran/components/JuzDetailView";
import { CreateHafalanForm } from "@/features/alquran/components/CreateHafalanForm";
import { Toast } from "@/features/alquran/components/Toast";

// Styles
import "@/features/alquran/styles/alquran.css";

type ViewMode = "dashboard" | "detail" | "create";

export const AlquranPage = () => {
  const [view, setView] = useState<ViewMode>("dashboard");
  const [activeJuz, setActiveJuz] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const {
    materials,
    addItem,
    updateItemStatus,
    deleteItem,
    getJuzItems,
    getJuzStats,
    calculateProgress,
  } = useQuranData();

  const { toast, showToast } = useToast();

  // Navigation Handlers
  const handleJuzClick = (juz: string) => {
    setActiveJuz(juz);
    setView("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToDashboard = () => {
    setActiveJuz(null);
    setView("dashboard");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCreateSubmit = (
    juz: string,
    surahName: string,
    ayatStart: number,
    ayatEnd: number,
    pageStart: number,
    pageEnd: number,
    time: number,
  ) => {
    addItem(juz, surahName, ayatStart, ayatEnd, pageStart, pageEnd, time);
    setShowCreateForm(false);
    showToast("Hafalan berhasil ditambahkan!", "success");

    // Optional: auto-navigate to the juz of the new item
    // setActiveJuz(juz);
    // setView("detail");
  };

  return (
    <div className="min-h-screen bg-[#0A0C0F] text-white font-sans selection:bg-amber-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title (Only on Dashboard) */}
        {view === "dashboard" && (
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif text-white mb-2 flex items-center gap-3">
                <Moon className="w-8 h-8 text-amber-400" />
                Al-Qur'an Tracker
              </h1>
              <p className="text-gray-400">
                Pantau progres hafalan dan muraja'ahmu setiap hari.
              </p>
            </div>
          </div>
        )}

        {/* Content Area */}
        {view === "dashboard" && (
          <AlquranDashboard
            progress={calculateProgress}
            juzStats={getJuzStats}
            juzCounts={(juz) => getJuzItems(juz).length}
            onJuzClick={handleJuzClick}
            onAddClick={() => setShowCreateForm(true)}
          />
        )}

        {view === "detail" && activeJuz && (
          <JuzDetailView
            juz={activeJuz}
            items={getJuzItems(activeJuz)}
            materials={materials}
            onBack={handleBackToDashboard}
            onStatusChange={(id, status) => {
              updateItemStatus(id, status);
              showToast("Status berhasil diperbarui!", "success");
            }}
            onDelete={(id) => {
              deleteItem(id);
              showToast("Item berhasil dihapus.", "info");
            }}
            onAddItem={() => setShowCreateForm(true)}
          />
        )}
      </div>

      {/* Modals & Overlays */}
      {showCreateForm && (
        <CreateHafalanForm
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreateSubmit}
        />
      )}

      {/* Toast Notification */}
      <Toast show={toast.show} message={toast.message} type={toast.type} />
    </div>
  );
};
