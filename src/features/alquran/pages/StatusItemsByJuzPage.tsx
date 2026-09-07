import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  ShieldCheck,
  Trophy,
  ChevronRight,
} from "lucide-react";
import { alquranService } from "@/features/alquran/services/alquran.services";
import type {
  MyItemsQuranResponse,
  QuranGroup,
} from "@/features/alquran/types/quran.types";

type ItemStatus = "menghafal" | "interval" | "fsrs_active" | "graduate";

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
    color: "bg-warning",
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
    color: "bg-info",
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
    color: "bg-success",
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
    color: "bg-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20",
    textColor: "text-primary",
    gradientFrom: "from-primary/20",
    gradientTo: "to-primary/15",
  },
};

export const StatusItemsByJuzPage = () => {
  const navigate = useNavigate();
  const { status } = useParams<{ status: ItemStatus }>();
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<QuranGroup[]>([]);
  const [personalJuzIds, setPersonalJuzIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!status) return;

    const fetchItems = async () => {
      setLoading(true);
      try {
        const juzResponse = await alquranService.getJuz();
        const personalIds = new Set(
          juzResponse.data.filter((j) => !j.class_id).map((j) => j.juz_id),
        );
        setPersonalJuzIds(personalIds);

        const response: MyItemsQuranResponse =
          await alquranService.getMyItems("quran");

        // Filter groups that have items with the selected status
        const filteredGroups = response.data.groups
          .filter((group) => personalIds.has(group.juz_id))
          .map((group) => ({
            ...group,
            items: group.items.filter((item) => item.status === status),
            item_count: group.items.filter((item) => item.status === status)
              .length,
          }))
          .filter((group) => group.items.length > 0);

        setGroups(filteredGroups);
      } catch (error) {
        console.error("Gagal mengambil items Juz");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [status]);

  const config = status ? STATUS_CONFIG[status] : null;

  const handleJuzClick = (juzIndex: number, juzId: string) => {
    navigate(
      `/dashboard/alquran/status/${status}/${juzId}?juzIndex=${juzIndex}`,
    );
  };

  if (!config) {
    return (
      <div className="min-h-screen p-6 bg-background flex items-center justify-center">
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
  const totalItems = groups.reduce((sum, g) => sum + g.item_count, 0);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-background relative">

      <div className="relative z-10 animate-fadeIn max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <button
            onClick={() => navigate("/dashboard/alquran")}
            className="inline-flex items-center gap-2 mb-8 text-muted-foreground hover:text-foreground transition-all group"
          >
            <div className="p-2 rounded-xl bg-surface-1 border border-border group-hover:bg-surface-2 group-hover:border-border transition-all">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">Kembali ke Dashboard</span>
          </button>

          {/* Hero Section */}
          <div className="relative rounded-2xl p-8 md:p-10 bg-card border border-border overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
              <div
                className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl ${config.bgColor} ${config.textColor} flex items-center justify-center ${config.borderColor} border`}
              >
                <Icon className="w-10 h-10 md:w-12 md:h-12" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`px-4 py-1.5 rounded-full ${config.bgColor} ${config.borderColor} ${config.textColor} text-xs font-black uppercase tracking-wider border`}
                  >
                    {config.label}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-3">
                  {config.label}
                </h1>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-2xl">
                  {config.description}
                </p>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-border">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl ${config.bgColor} ${config.textColor} flex items-center justify-center`}
                    >
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-foreground">
                        {groups.length}
                      </p>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">
                        Juz Aktif
                      </p>
                    </div>
                  </div>
                  <div className="w-px h-10 bg-border" />
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl ${config.bgColor} ${config.textColor} flex items-center justify-center`}
                    >
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-foreground">
                        {totalItems}
                      </p>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">
                        Total Item
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-40 rounded-2xl bg-surface-1 animate-pulse"
              />
            ))}
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center py-24 px-6 rounded-2xl bg-card border border-border">
            <div
              className={`w-24 h-24 mx-auto mb-8 rounded-3xl ${config.bgColor} ${config.textColor} flex items-center justify-center`}
            >
              <Icon className="w-12 h-12" />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-3">
              Belum ada item
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto mb-8 leading-relaxed">
              Tidak ada item dengan status{" "}
              <span className={`${config.textColor} font-bold`}>
                {config.label.toLowerCase()}
              </span>{" "}
              di Juz manapun.
            </p>
            <button
              onClick={() => navigate("/dashboard/alquran")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-1 border border-border text-foreground font-bold hover:bg-surface-2 transition-all"
            >
              <ArrowLeft className="w-4 h-4 rotate-180" />
              Kembali ke Dashboard
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Daftar Juz</h2>
              <span className="text-sm text-muted-foreground">
                {groups.length} Juz ditemukan
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups.map((group, index) => (
                <button
                  key={group.juz_id}
                  onClick={() => handleJuzClick(group.juz_index, group.juz_id)}
                  className="group relative overflow-hidden rounded-xl p-6 bg-card border border-border hover:border-primary/40 transition-colors duration-300 text-left hover:-translate-y-1"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-black text-foreground">
                          {group.juz_index}
                        </span>
                        <div
                          className={`w-12 h-12 rounded-xl ${config.bgColor} ${config.textColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                        >
                          <BookOpen className="w-6 h-6" />
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all duration-300 ${config.textColor}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${config.textColor.replace("text-", "bg-")}`}
                        />
                        <p className={`${config.textColor} font-bold text-sm`}>
                          {group.item_count}{" "}
                          {group.item_count === 1 ? "item" : "items"}
                        </p>
                      </div>
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        Klik untuk melihat detail item
                      </p>
                    </div>

                    {/* Progress bar decoration */}
                    <div className={`mt-4 h-1 rounded-full bg-surface-1 overflow-hidden`}>
                      <div
                        className={`h-full w-0 group-hover:w-full ${config.color} transition-all duration-700`}
                      />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
