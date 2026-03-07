import { useState } from "react";

// Hooks
import { useQuranData } from "@/features/alquran/hooks/useQuranData";
import { useToast } from "@/features/alquran/hooks/useToast";
import { useRefreshSignal } from "@/features/alquran/hooks/useRefreshSignal";

// Components
import { AlquranDashboard } from "@/features/alquran/components/AlquranDashboard";
import { JuzDetailView } from "@/features/alquran/components/JuzDetailView";
import {
  ItemDetailView,
  type ActionPhase,
} from "@/features/alquran/components/ItemDetailView";
import { CreateJuzForm } from "@/features/alquran/components/CreateJuzForm";
import { Toast } from "@/features/alquran/components/Toast";

// Types
import type { MyItemDetail } from "@/features/alquran/types/quran.types";

// Styles
import "@/features/alquran/styles/alquran.css";

type ViewMode = "dashboard" | "detail" | "item-detail";

export const AlquranPage = () => {
  const [view, setView] = useState<ViewMode>("dashboard");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeJuz, setActiveJuz] = useState<{
    id: string;
    index: number;
  } | null>(null);

  const [activeItem, setActiveItem] = useState<MyItemDetail | null>(null);

  const [itemPhases, setItemPhases] = useState<Record<string, ActionPhase>>({});
  const { signal: juzRefreshSignal, triggerRefresh: triggerJuzRefresh } =
    useRefreshSignal();

  const { getJuzItems, getJuzStats } = useQuranData();
  const { toast } = useToast();

  // ── Handlers Navigasi ──

  // 1. Dashboard → JuzDetail
  const handleJuzClick = (juz: { id: string; index: number }) => {
    setActiveJuz(juz);
    setView("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 2. JuzDetail ← kembali ke Dashboard
  const handleBackToDashboard = () => {
    setActiveJuz(null);
    setView("dashboard");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 3. JuzDetail → ItemDetail
  // Kenapa menyimpan seluruh item object?
  // Karena ItemDetailView butuh semua data item (surah name, status, dll)
  // dan data itu sudah tersedia di JuzDetailView — tidak perlu fetch ulang.
  const handleItemClick = (item: MyItemDetail) => {
    setActiveItem(item);
    setView("item-detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 4. ItemDetail ← kembali ke JuzDetail
  // Kenapa tidak setActiveItem(null)?
  // Karena kalau activeItem di-null, maka initialPhase yang diteruskan
  // ke ItemDetailView akan undefined (karena itemPhases[undefined] = undefined).
  // Biarkan activeItem tetap ada — view state yang menentukan apa yang tampil.
  const handleBackToJuzDetail = () => {
    setView("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 5. Simpan phase dari ItemDetailView supaya persistent
  // Dipanggil setiap kali user transisi ke phase baru di dalam ItemDetailView
  const handlePhaseChange = (
    itemId: string | undefined,
    phase: ActionPhase,
  ) => {
    if (!itemId) return;
    setItemPhases((prev) => ({ ...prev, [itemId]: phase }));
  };

  return (
    <div className="min-h-screen bg-deep-universe text-white font-sans selection:bg-amber-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative bg-deep-universe z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Level 1: Dashboard */}
        {view === "dashboard" && (
          <AlquranDashboard
            juzStats={getJuzStats}
            juzCounts={(juz) => getJuzItems(juz).length}
            onJuzClick={handleJuzClick}
            onAddClick={() => setShowCreateForm(true)}
            refreshSignal={juzRefreshSignal}
          />
        )}

        {/* Level 2: Detail per Juz */}
        {view === "detail" && activeJuz && (
          <JuzDetailView
            juzId={activeJuz.id}
            juzIndex={activeJuz.index}
            backToDashboard={handleBackToDashboard}
            onItemClick={handleItemClick}
          />
        )}

        {/* Level 3: Detail per Item Hafalan */}
        {view === "item-detail" && activeItem && activeJuz && (
          <ItemDetailView
            key={activeItem.item_id}
            item={activeItem}
            juzIndex={activeJuz.index}
            backToJuzDetail={handleBackToJuzDetail}
            currentPhase={itemPhases[activeItem.item_id]}
            onPhaseChange={(phase) =>
              handlePhaseChange(activeItem.item_id, phase)
            }
          />
        )}
      </div>

      {/* Modals & Overlays */}
      {showCreateForm && (
        <CreateJuzForm
          onClose={() => setShowCreateForm(false)}
          onSuccess={triggerJuzRefresh}
        />
      )}

      {/* Toast Notification */}
      <Toast show={toast.show} message={toast.message} type={toast.type} />
    </div>
  );
};
