import {
  CheckCircle,
  XCircle,
  Clock,
  BookOpen,
  RefreshCw,
  Menu,
  BookMarked,
  ImageOff,
  CalendarPlus,
  Hourglass,
  Eye,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { usePendingBooks } from "@/features/dashboard/admin/hooks/usePendingBooks";
import { useApproveBook } from "@/features/dashboard/admin/hooks/useApproveBook";
import { useRejectBook } from "@/features/dashboard/admin/hooks/useRejectBook";
import { DashboardTable } from "@/features/dashboard/components/DashboardTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { PendingBook } from "@/features/dashboard/admin/types/pendingBook.types";
import type { TableColumn } from "@/features/dashboard/types/table.types";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Sidebar } from "@/components/ui/Sidebar";

const pendingBookColumns: TableColumn[] = [
  { key: "id", label: "No." },
  { key: "cover", label: "Cover" },
  { key: "title", label: "Book Info" },
  { key: "description", label: "Description" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions", align: "right" },
];

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const PublishedBooksRequestPage = () => {
  const navigate = useNavigate();
  const { data, getPendingBooks } = usePendingBooks();
  const { approveBook } = useApproveBook();
  const { rejectBook } = useRejectBook();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: "approve" | "reject" | null;
    bookId: string | null;
    bookTitle: string;
  }>({
    isOpen: false,
    type: null,
    bookId: null,
    bookTitle: "",
  });

  useEffect(() => {
    getPendingBooks();
  }, []);

  // Stats hitung dari data asli
  const stats = useMemo(() => {
    if (!data || data.length === 0) {
      return { pending: 0, submittedToday: 0, oldestPendingDays: 0 };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const submittedToday = data.filter((b) => {
      const created = new Date(b.created_at);
      created.setHours(0, 0, 0, 0);
      return created.getTime() === today.getTime();
    }).length;

    const oldest = data.reduce<Date | null>((acc, b) => {
      const created = new Date(b.created_at);
      return acc === null || created < acc ? created : acc;
    }, null);

    const oldestPendingDays = oldest
      ? Math.floor(
          (new Date().getTime() - oldest.getTime()) / (1000 * 60 * 60 * 24),
        )
      : 0;

    return {
      pending: data.filter((b) => b.status === "pending").length,
      submittedToday,
      oldestPendingDays,
    };
  }, [data]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await getPendingBooks();
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    }
  };

  const handleOpenModal = (
    type: "approve" | "reject",
    bookId: string,
    bookTitle: string,
  ) => {
    setModalState({ isOpen: true, type, bookId, bookTitle });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, type: null, bookId: null, bookTitle: "" });
  };

  const handleConfirm = async () => {
    if (modalState.bookId && modalState.type) {
      try {
        if (modalState.type === "approve") {
          await approveBook(modalState.bookId);
        } else {
          await rejectBook(modalState.bookId);
        }
        await getPendingBooks();
        handleCloseModal();
      } catch (error) {
        console.error("Error processing book request:", error);
      }
    }
  };

  const renderBookCell = (
    column: TableColumn,
    item: PendingBook,
    index: number,
  ) => {
    switch (column.key) {
      case "id":
        return (
          <div className="text-gray-500 font-mono text-xs">#{index + 1}</div>
        );

      case "cover":
        return (
          <div className="w-10 h-14 rounded-lg overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
            {item.cover_image ? (
              <img
                src={item.cover_image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageOff className="w-5 h-5 text-gray-600" />
            )}
          </div>
        );

      case "title":
        return (
          <div className="flex items-center gap-3">
            <div className="hidden md:flex w-8 h-8 rounded-lg bg-linear-to-br from-violet-500 to-indigo-600 items-center justify-center text-white shrink-0">
              <BookMarked className="w-4 h-4" />
            </div>
            <div>
              <p className="font-medium text-white line-clamp-1">{item.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {formatDate(item.created_at)}
              </p>
            </div>
          </div>
        );

      case "description":
        return (
          <div
            className="max-w-[200px] truncate text-gray-400 italic text-sm"
            title={item.description}
          >
            {item.description || (
              <span className="text-gray-600 not-italic">No description</span>
            )}
          </div>
        );

      case "status":
        return <StatusBadge status={item.status} />;

      case "actions":
        if (item.status === "pending") {
          return (
            <div className="flex justify-end gap-2">
              <button
                onClick={() => navigate(`/dashboard/book-requests/${item.id}`)}
                className="p-2 rounded-lg bg-violet-500/10 text-violet-400 hover:bg-violet-500 hover:text-white transition"
                title="Lihat Detail Buku"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  handleOpenModal("approve", item.id, item.title)
                }
                className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition"
                title="Approve Book"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleOpenModal("reject", item.id, item.title)}
                className="p-2 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition"
                title="Reject Book"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          );
        } else if (item.status === "approved") {
          return (
            <div className="flex justify-end">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 text-xs font-medium border border-emerald-500/20">
                <CheckCircle className="w-3.5 h-3.5" />
                Approved
              </span>
            </div>
          );
        } else if (item.status === "rejected") {
          return (
            <div className="flex justify-end">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-500 text-xs font-medium border border-rose-500/20">
                <XCircle className="w-3.5 h-3.5" />
                Rejected
              </span>
            </div>
          );
        }
        return null;

      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen bg-deep-universe text-white font-primary max-w-7xl mx-auto p-6 md:p-10">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      {/* Sidebar Integration */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Overlay for mobile sidebar */}
      <div
        className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <div className="relative z-10 space-y-8">
        {/* Header Section */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-500/50 transition text-violet-400"
          >
            <Menu className="w-6 h-6" />
          </button>
          <p className="text-sm font-mono tracking-widest md:inline">MENU</p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
                <BookOpen className="w-5 h-5 text-violet-400" />
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-wide">
                PUBLISHED BOOKS{" "}
                <span className="text-violet-400">REQUESTS</span>
              </h1>
            </div>
            <p className="text-gray-400 text-sm max-w-lg">
              Review book publish requests submitted by teachers. Approve or
              reject books to control what gets shared in the global library.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-center">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition text-gray-400 hover:text-white group disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh Data"
            >
              <RefreshCw
                className={`w-5 h-5 group-hover:text-violet-400 transition-transform ${isRefreshing ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-amber-500/30 transition-all duration-300">
            <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition transform group-hover:scale-110 duration-500">
              <Clock className="w-32 h-32 text-amber-500" />
            </div>
            <div className="relative z-10">
              <p className="text-sm font-medium text-amber-500/80 mb-2 uppercase tracking-wider">
                Pending Review
              </p>
              <h3 className="text-4xl font-display font-bold text-white">
                {stats.pending}
              </h3>
              <p className="text-xs text-gray-500 mt-2">Awaiting decision</p>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300">
            <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition transform group-hover:scale-110 duration-500">
              <CalendarPlus className="w-32 h-32 text-blue-400" />
            </div>
            <div className="relative z-10">
              <p className="text-sm font-medium text-blue-400/80 mb-2 uppercase tracking-wider">
                Submitted Today
              </p>
              <h3 className="text-4xl font-display font-bold text-white">
                {stats.submittedToday}
              </h3>
              <p className="text-xs text-gray-500 mt-2">Buku masuk hari ini</p>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-orange-500/30 transition-all duration-300">
            <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition transform group-hover:scale-110 duration-500">
              <Hourglass className="w-32 h-32 text-orange-400" />
            </div>
            <div className="relative z-10">
              <p className="text-sm font-medium text-orange-400/80 mb-2 uppercase tracking-wider">
                Oldest Pending
              </p>
              <h3 className="text-4xl font-display font-bold text-white">
                {stats.oldestPendingDays}
                <span className="text-lg font-normal text-gray-400 ml-1">d</span>
              </h3>
              <p className="text-xs text-gray-500 mt-2">Hari sejak request terlama</p>
            </div>
          </div>
        </div>

        {/* Books Table */}
        <DashboardTable
          title="Book Publish Requests"
          columns={pendingBookColumns}
          data={data}
          renderCell={(column, item, index) =>
            renderBookCell(column, item, index)
          }
        />

        {/* Mobile empty state placeholder */}
        <div className="md:hidden glass-panel rounded-2xl border border-white/5 p-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-white/5 border border-white/10">
              <BookOpen className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-lg font-display font-semibold text-white">
              No Book Requests Yet
            </h3>
            <p className="text-gray-500 text-sm max-w-md">
              Once teachers submit books for publication, they will appear here
              for your review.
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
        title={
          modalState.type === "approve"
            ? "Setujui Publikasi Buku"
            : "Tolak Publikasi Buku"
        }
        message={
          modalState.type === "approve"
            ? `Apakah Anda yakin ingin menyetujui buku "${modalState.bookTitle}" untuk dipublikasikan?`
            : `Apakah Anda yakin ingin menolak permintaan publikasi buku "${modalState.bookTitle}"?`
        }
        confirmText={
          modalState.type === "approve" ? "Ya, Setujui" : "Ya, Tolak"
        }
        cancelText="Batal"
        icon={modalState.type === "approve" ? CheckCircle : XCircle}
        variant={modalState.type === "approve" ? "success" : "danger"}
      />
    </div>
  );
};
