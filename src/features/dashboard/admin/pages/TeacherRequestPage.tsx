import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  Filter,
  RefreshCw,
  Menu,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useTeacherRequests } from "@/features/dashboard/admin/hooks/useTeacherRequests";
import { DashboardTable } from "@/features/dashboard/components/DashboardTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { TeacherRequest } from "@/features/dashboard/admin/types/teacherRequest.types";
import type { TableColumn } from "@/features/dashboard/types/table.types";
import { useApproveTeacher } from "@/features/dashboard/admin/hooks/useApproveTeacher";
import { useRejectTeacher } from "@/features/dashboard/admin/hooks/useRejectTeacher";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Sidebar } from "@/components/ui/Sidebar";

const teacherRequestColumns: TableColumn[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "message", label: "Message" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions", align: "right" },
];

export const TeacherRequestPage = () => {
  const { data, getTeacherRequests } = useTeacherRequests();
  const { approveTeacherRequest } = useApproveTeacher();
  const { rejectTeacherRequest } = useRejectTeacher();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Filter state - untuk menyimpan pilihan filter user
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");

  // Loading state untuk refresh button
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal state
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: "approve" | "reject" | null;
    requestId: string | null;
    requestName: string;
  }>({
    isOpen: false,
    type: null,
    requestId: null,
    requestName: "",
  });

  useEffect(() => {
    getTeacherRequests();
  }, []);

  // STEP 1: Filter data berdasarkan status yang dipilih
  // Menggunakan useMemo agar hanya recalculate ketika data atau filter berubah
  const filteredData = useMemo(() => {
    if (!data) return null;

    // Jika filter "all", return semua data
    if (statusFilter === "all") {
      return data;
    }

    // Jika ada filter spesifik, filter data berdasarkan status
    return data.filter((request) => request.status === statusFilter);
  }, [data, statusFilter]);

  // STEP 2: Hitung statistik dari DATA ASLI (bukan filtered data)
  // Stats harus selalu menunjukkan total keseluruhan, bukan yang difilter
  const stats = useMemo(() => {
    if (!data || data.length === 0) {
      return { pending: 0, approved: 0, rejected: 0 };
    }

    return {
      pending: data.filter((req) => req.status === "pending").length,
      approved: data.filter((req) => req.status === "approved").length,
      rejected: data.filter((req) => req.status === "rejected").length,
    };
  }, [data]);

  // STEP 3: Handler untuk refresh data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await getTeacherRequests();
    } catch (error) {
      console.error("Terjadi kesalahan saat menyegarkan data");
    } finally {
      // Set timeout agar animasi terlihat (minimal 500ms)
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    }
  };

  // STEP 4: Handler untuk filter change
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(
      e.target.value as "all" | "pending" | "approved" | "rejected",
    );
  };

  const handleOpenModal = (
    type: "approve" | "reject",
    requestId: string,
    requestName: string,
  ) => {
    setModalState({
      isOpen: true,
      type,
      requestId,
      requestName,
    });
  };

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      type: null,
      requestId: null,
      requestName: "",
    });
  };

  const handleConfirm = async () => {
    if (modalState.requestId && modalState.type) {
      try {
        // Step 1: Eksekusi approve/reject request
        if (modalState.type === "approve") {
          await approveTeacherRequest(modalState.requestId);
        } else {
          await rejectTeacherRequest(modalState.requestId);
        }

        // Step 2: Setelah berhasil, refresh data untuk mendapatkan data terbaru
        await getTeacherRequests();

        // Step 3: Close modal setelah semua selesai
        handleCloseModal();
      } catch (error) {
        // Jika ada error, modal tetap terbuka dan user bisa coba lagi
        console.error("Terjadi kesalahan saat memproses permintaan guru");
      }
    }
  };

  const renderTeacherRequestCell = (
    column: TableColumn,
    item: TeacherRequest,
    index: number,
  ) => {
    switch (column.key) {
      case "id":
        return (
          <div className="text-muted-foreground font-mono text-xs">#{index + 1}</div>
        );

      case "name":
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 hidden md:flex rounded-xl bg-primary items-center justify-center text-primary-foreground font-bold text-sm">
              {item.user.full_name.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-foreground">{item.user.full_name}</p>
              <p className="text-xs text-muted-foreground">Teacher Applicant</p>
            </div>
          </div>
        );

      case "email":
        return (
          <div className="text-muted-foreground font-mono text-xs">
            {item.user.email}
          </div>
        );

      case "message":
        return (
          <div
            className="max-w-[200px] truncate text-muted-foreground italic text-sm"
            title={item.message}
          >
            "{item.message}"
          </div>
        );

      case "status":
        return <StatusBadge status={item.status} />;

      case "actions":
        // Conditional rendering based on status
        if (item.status === "pending") {
          // Show Approve & Reject buttons for pending requests
          return (
            <div className="flex justify-end gap-2">
              <button
                onClick={() =>
                  handleOpenModal("approve", item.id, item.user.full_name)
                }
                className="p-2 rounded-lg bg-success/10 text-success hover:bg-success hover:text-success-foreground transition"
                title="Approve Request"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  handleOpenModal("reject", item.id, item.user.full_name)
                }
                className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition"
                title="Reject Request"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          );
        } else if (item.status === "approved") {
          // Show green badge for approved requests
          return (
            <div className="flex justify-end">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-success/10 text-success text-xs font-medium border border-success/20">
                <CheckCircle className="w-3.5 h-3.5" />
                Approved
              </span>
            </div>
          );
        } else if (item.status === "rejected") {
          // Show red badge for rejected requests
          return (
            <div className="flex justify-end">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs font-medium border border-destructive/20">
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
    <div className="relative min-h-screen bg-background text-foreground font-primary max-w-7xl mx-auto p-6 md:p-10">
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
            className="p-2 rounded-lg bg-surface-1 hover:bg-surface-2 border border-border transition text-foreground"
          >
            <Menu className="w-6 h-6" />
          </button>
          <p className="text-sm font-mono tracking-widest md:inline">MENU</p>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-warning/10 border border-warning/20">
                <User className="w-5 h-5 text-warning" />
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground tracking-wide">
                TEACHER <span className="text-warning">REQUESTS</span>
              </h1>
            </div>
            <p className="text-muted-foreground text-sm max-w-lg">
              Manage incoming applications from users who want to become
              teachers on the platform. Review their details and approve or
              reject them.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-center">
            {/* STEP 5: Bind onClick handler ke refresh button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2.5 rounded-xl bg-surface-1 hover:bg-surface-2 border border-border transition text-muted-foreground hover:text-foreground group disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh Data"
            >
              <RefreshCw
                className={`w-5 h-5 group-hover:text-warning transition-transform ${isRefreshing ? "animate-spin" : ""}`}
              />
            </button>

            {/* STEP 6: Bind value dan onChange ke select element */}
            <div className="relative group">
              <Filter className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 group-hover:text-warning transition" />
              <select
                value={statusFilter}
                onChange={handleFilterChange}
                className="pl-10 pr-5 py-2.5 bg-surface-1 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-warning/50 appearance-none cursor-pointer hover:bg-surface-2 transition min-w-[160px] font-medium"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-2xl border border-border relative overflow-hidden group hover:border-warning/30 transition-all duration-300">
            <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition transform group-hover:scale-110 duration-500">
              <Clock className="w-32 h-32 text-warning" />
            </div>
            <div className="relative z-10">
              <p className="text-sm font-medium text-warning/80 mb-2 uppercase tracking-wider">
                Pending Review
              </p>
              <h3 className="text-4xl font-display font-bold text-foreground">
                {stats.pending}
              </h3>
              <p className="text-xs text-muted-foreground mt-2">Awaiting decision</p>
            </div>
          </div>

          <div className="bg-card p-6 rounded-2xl border border-border relative overflow-hidden group hover:border-success/30 transition-all duration-300">
            <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition transform group-hover:scale-110 duration-500">
              <CheckCircle className="w-32 h-32 text-success" />
            </div>
            <div className="relative z-10">
              <p className="text-sm font-medium text-success/80 mb-2 uppercase tracking-wider">
                Approved
              </p>
              <h3 className="text-4xl font-display font-bold text-foreground">
                {stats.approved}
              </h3>
              <p className="text-xs text-muted-foreground mt-2">New teachers joined</p>
            </div>
          </div>

          <div className="bg-card p-6 rounded-2xl border border-border relative overflow-hidden group hover:border-destructive/30 transition-all duration-300">
            <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition transform group-hover:scale-110 duration-500">
              <XCircle className="w-32 h-32 text-destructive" />
            </div>
            <div className="relative z-10">
              <p className="text-sm font-medium text-destructive/80 mb-2 uppercase tracking-wider">
                Rejected
              </p>
              <h3 className="text-4xl font-display font-bold text-foreground">
                {stats.rejected}
              </h3>
              <p className="text-xs text-muted-foreground mt-2">
                Applications declined
              </p>
            </div>
          </div>
        </div>

        {/* Requests Table (Desktop) */}
        {/* STEP 7: Pass filteredData instead of raw data */}
        <DashboardTable
          title="Recent Applications"
          columns={teacherRequestColumns}
          data={filteredData}
          getRowKey={(item) => item.id}
          renderCell={(column, item, index) =>
            renderTeacherRequestCell(column, item, index)
          }
        />

        {/* Requests List (Mobile) - Empty State Only for now per static code */}
        <div className="md:hidden bg-card rounded-2xl border border-border p-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-surface-1 border border-border">
              <User className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-display font-semibold text-foreground">
              No Applications Yet
            </h3>
            <p className="text-muted-foreground text-sm max-w-md">
              Once users apply to become teachers, their requests will appear
              here for review.
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
            ? "Setujui Permintaan Guru"
            : "Tolak Permintaan Guru"
        }
        message={
          modalState.type === "approve"
            ? `Apakah Anda yakin ingin menyetujui ${modalState.requestName} sebagai guru?`
            : `Apakah Anda yakin ingin menolak permintaan dari ${modalState.requestName}?`
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
