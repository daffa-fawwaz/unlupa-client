import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  ShieldCheck,
  Trophy,
  Activity,
} from "lucide-react";
import { alquranService } from "@/features/alquran/services/alquran.services";
import { useItemsByStatus } from "@/features/alquran/hooks/useItemsByStatus";
import { useGetJuz } from "@/features/alquran/hooks/useGetJuz";
import { HafalanCard } from "@/components/ui/HafalanCard";
import { HafalanKosong } from "@/components/ui/HafalanKosong";
import {
  ItemDetailView,
  type ActionPhase,
} from "@/features/alquran/components/ItemDetailView";
import type {
  MyItemsQuranResponse,
  QuranGroup,
  MyItemDetail,
} from "@/features/alquran/types/quran.types";

type ItemStatus = "menghafal" | "interval" | "fsrs_active" | "graduate";

type ViewMode = "list" | "item-detail";

const STATUS_CONFIG: Record<
  ItemStatus,
  {
    label: string;
    description: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
    gradientFrom: string;
    gradientTo: string;
  }
> = {
  menghafal: {
    label: "Menghafal",
    description: "Item yang masih dalam tahap hafalan awal",
    icon: BookOpen,
    color: "from-warning to-warning/60",
    bgColor: "bg-warning/10",
    borderColor: "border-warning/20",
    textColor: "text-warning",
    gradientFrom: "from-warning/20",
    gradientTo: "to-warning/15",
  },
  interval: {
    label: "Latihan Interval",
    description: "Item dalam masa latihan pengulangan berkala",
    icon: Clock,
    color: "from-info to-info/60",
    bgColor: "bg-info/10",
    borderColor: "border-info/20",
    textColor: "text-info",
    gradientFrom: "from-info/20",
    gradientTo: "to-info/15",
  },
  fsrs_active: {
    label: "Ujian Interval",
    description: "Item dalam jadwal ujian interval berkala",
    icon: ShieldCheck,
    color: "from-success to-success/60",
    bgColor: "bg-success/10",
    borderColor: "border-success/20",
    textColor: "text-success",
    gradientFrom: "from-success/20",
    gradientTo: "to-success/15",
  },
  graduate: {
    label: "Selesai",
    description: "Item yang telah diselesaikan dengan sukses",
    icon: Trophy,
    color: "from-primary to-primary/60",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20",
    textColor: "text-primary",
    gradientFrom: "from-primary/20",
    gradientTo: "to-primary/15",
  },
};

export const StatusItemsView = () => {
  const navigate = useNavigate();
  const { status, juzId } = useParams<{ status: ItemStatus; juzId: string }>();
  const [searchParams] = useSearchParams();
  const juzIndex = searchParams.get("juzIndex");
  const [view, setView] = useState<ViewMode>("list");
  const [activeItem, setActiveItem] = useState<MyItemDetail | null>(null);
  const [itemPhases, setItemPhases] = useState<Record<string, ActionPhase>>({});
  const [loading, setLoading] = useState(true);
  const [juzData, setJuzData] = useState<QuranGroup | null>(null);

  const { data: juzList } = useGetJuz();
  const isClassJuz = juzList?.data?.some((j) => j.juz_id === juzId && j.class_id) || false;

  const { data: fsrsData } = useItemsByStatus({ status: "fsrs_active" });
  const { data: intervalData } = useItemsByStatus({ status: "interval" });

  useEffect(() => {
    if (!status || !juzId || isClassJuz) return;

    const fetchJuzItems = async () => {
      setLoading(true);
      try {
        const response: MyItemsQuranResponse =
          await alquranService.getMyItems("quran");

        // Find the specific Juz
        const group = response.data.groups.find((g) => g.juz_id === juzId);

        if (group) {
          // Filter items by status
          const filteredItems = group.items.filter(
            (item) => item.status === status,
          );
          setJuzData({
            ...group,
            items: filteredItems,
            item_count: filteredItems.length,
          });
        } else {
          setJuzData(null);
        }
      } catch (error) {
        console.error("Gagal mengambil items Juz");
        setJuzData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchJuzItems();
  }, [status, juzId]);

  // Build next_review_map
  const nextReviewMap = useMemo(() => {
    const map: Record<string, string | undefined> = {};
    for (const d of [fsrsData, intervalData]) {
      if (!d?.data) continue;
      for (const item of d.data) {
        map[item.item_id] = item.interval_next_review_at ?? item.next_review_at;
      }
    }
    return map;
  }, [fsrsData, intervalData]);

  // Merge next_review_at into items
  const itemsWithReview = useMemo(() => {
    if (!juzData) return [];
    return juzData.items.map((item) => ({
      ...item,
      next_review_at: nextReviewMap[item.item_id] ?? item.next_review_at,
    })) as MyItemDetail[];
  }, [juzData, nextReviewMap]);

  const config = status ? STATUS_CONFIG[status] : null;

  const handleItemClick = (item: MyItemDetail) => {
    setActiveItem(item);
    setView("item-detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToList = () => {
    setView("list");
    setActiveItem(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToStatusList = () => {
    navigate(`/dashboard/alquran/status/${status}`);
  };

  const handlePhaseChange = (phase: ActionPhase) => {
    if (!activeItem?.item_id) return;
    setItemPhases((prev) => ({ ...prev, [activeItem.item_id]: phase }));
  };

  if (!config) {
    return (
      <div className="min-h-screen p-6 bg-background rounded-3xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-surface-1 flex items-center justify-center">
            <Clock className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">Status tidak ditemukan</p>
        </div>
      </div>
    );
  }

  const Icon = config.icon;

  // Render Item Detail View
  if (view === "item-detail" && activeItem) {
    return (
      <ItemDetailView
        key={activeItem.item_id}
        item={activeItem}
        juzIndex={juzIndex ? parseInt(juzIndex) : 1}
        backToJuzDetail={handleBackToList}
        currentPhase={itemPhases[activeItem.item_id]}
        onPhaseChange={handlePhaseChange}
      />
    );
  }

  // Render List View
  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-background rounded-3xl relative overflow-hidden">

      <div className="relative z-10 animate-fadeIn max-w-7xl mx-auto">
        {/* Header */}
        <div className="relative mb-10 md:mb-12">
          <button
            onClick={handleBackToStatusList}
            className="inline-flex items-center gap-2 mb-8 text-muted-foreground hover:text-foreground transition-all group"
          >
            <div className="p-2 rounded-xl bg-surface-1 border border-border group-hover:bg-surface-2 group-hover:border-border transition-all">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">
              Kembali ke Daftar Status
            </span>
          </button>

          {/* Hero Card */}
          <div className="relative rounded-2xl p-8 md:p-10 bg-card border border-border overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 flex-1">
                <div
                  className={`w-20 h-20 md:w-24 md:h-24 rounded-3xl ${config.bgColor} ${config.textColor} flex items-center justify-center shadow-xl ${config.borderColor} border`}
                >
                  <Icon className="w-10 h-10 md:w-12 md:h-12" />
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="px-4 py-1.5 rounded-full bg-surface-1 border border-border text-muted-foreground text-xs font-black uppercase tracking-wider">
                      Juz {juzIndex}
                    </span>
                    <span
                      className={`px-4 py-1.5 rounded-full ${config.bgColor} ${config.borderColor} ${config.textColor} text-xs font-black uppercase tracking-wider border`}
                    >
                      {config.label}
                    </span>
                  </div>

                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-3">
                    Hafalan Juz {juzIndex}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Activity className="w-4 h-4 text-success" />
                      <span>
                        <strong className="text-foreground font-bold">
                          {juzData?.item_count || 0}
                        </strong>{" "}
                        Item
                      </span>
                    </div>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">
                      Status:{" "}
                      <strong className={`${config.textColor}`}>
                        {config.label.toLowerCase()}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center gap-4 md:gap-6 pt-6 md:pt-0 md:pl-6 md:border-l md:border-border">
                <div className="text-center">
                  <p
                    className={`text-3xl md:text-4xl font-black ${config.textColor}`}
                  >
                    {juzData?.item_count || 0}
                  </p>
                  <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider font-bold mt-1">
                    Total Item
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-64 rounded-3xl bg-surface-1 animate-pulse"
              />
            ))}
          </div>
        ) : !juzData || itemsWithReview.length === 0 ? (
          <HafalanKosong
            hafalan="Juz"
            title="Tidak ada item"
            description={`Tidak ada item dengan status ${config.label.toLowerCase()} di Juz ${juzIndex}`}
          />
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Daftar Hafalan</h2>
              <span className="text-sm text-muted-foreground">
                {itemsWithReview.length} item ditemukan
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {itemsWithReview.map((item, index) => (
                <div
                  key={item.item_id}
                  className="animate-fadeIn"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <HafalanCard
                    item={item}
                    onClick={() => handleItemClick(item)}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
