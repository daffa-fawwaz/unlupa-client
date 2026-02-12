import { useState } from "react";

// Hooks
import { useQuranData } from "@/features/alquran/hooks/useQuranData";
import { useToast } from "@/features/alquran/hooks/useToast";

// Components
import { AlquranDashboard } from "@/features/alquran/components/AlquranDashboard";
import { JuzDetailView } from "@/features/alquran/components/JuzDetailView";
import { CreateJuzForm } from "@/features/alquran/components/CreateJuzForm";
import { Toast } from "@/features/alquran/components/Toast";

// Styles
import "@/features/alquran/styles/alquran.css";

type ViewMode = "dashboard" | "detail" | "create";

export const AlquranPage = () => {
  const [view, setView] = useState<ViewMode>("dashboard");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeJuz, setActiveJuz] = useState<string | null>(null);
  const { getJuzItems, getJuzStats, calculateProgress } = useQuranData();

  const { toast } = useToast();

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

  return (
    <div className="min-h-screen bg-deep-universe text-white font-sans selection:bg-amber-500/30 ">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative bg-deep-universe z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {view === "detail" && activeJuz && <JuzDetailView backToDashboard={handleBackToDashboard} />}
      </div>

      {/* Modals & Overlays */}
      {showCreateForm && (
        <CreateJuzForm onClose={() => setShowCreateForm(false)} />
      )}

      {/* Toast Notification */}
      <Toast show={toast.show} message={toast.message} type={toast.type} />
    </div>
  );
};
