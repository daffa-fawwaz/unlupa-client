import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  Filter,
  RefreshCw,
  Menu,
} from "lucide-react";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { useEffect, useState } from "react";
import { useTeacherRequests } from "@/features/dashboard/admin/hooks/useTeacherRequests";
import { DashboardTable } from "@/features/dashboard/components/DashboardTable";
import { StatusBadge } from "@/features/dashboard/components/StatusBadge";
import type { TeacherRequest } from "../types/teacherRequest.types";
import type { TableColumn } from "@/features/dashboard/types/table.types";
import { useApproveTeacher } from "../hooks/useApproveTeacher";
import { useRejectTeacher } from "../hooks/useRejectTeacher";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

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
        console.error("Error processing request:", error);
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
          <div className="text-gray-500 font-mono text-xs">#{index + 1}</div>
        );

      case "name":
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 hidden md:flex rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 items-center justify-center text-white font-bold text-sm">
              {item.user.full_name.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-white">{item.user.full_name}</p>
              <p className="text-xs text-gray-400">Teacher Applicant</p>
            </div>
          </div>
        );

      case "email":
        return (
          <div className="text-gray-300 font-mono text-xs">
            {item.user.email}
          </div>
        );

      case "message":
        return (
          <div
            className="max-w-[200px] truncate text-gray-400 italic text-sm"
            title={item.message}
          >
            "{item.message}"
          </div>
        );

      case "status":
        return <StatusBadge status={item.status} />;

      case "actions":
        return (
          <div className="flex justify-end gap-2">
            <button
              onClick={() =>
                handleOpenModal("approve", item.id, item.user.full_name)
              }
              className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
            <button
              onClick={() =>
                handleOpenModal("reject", item.id, item.user.full_name)
              }
              className="p-2 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen bg-deep-universe text-white font-primary max-w-7xl mx-auto p-6 md:p-10">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      {/* Sidebar Integration */}
      <DashboardSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

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
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/50 transition text-amber-500"
          >
            <Menu className="w-6 h-6" />
          </button>
          <p className="text-sm font-mono tracking-widest md:inline">MENU</p>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <User className="w-5 h-5 text-amber-500" />
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-wide">
                TEACHER <span className="text-amber-400">REQUESTS</span>
              </h1>
            </div>
            <p className="text-gray-400 text-sm max-w-lg">
              Manage incoming applications from users who want to become
              teachers on the platform. Review their details and approve or
              reject them.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-center">
            <button
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition text-gray-400 hover:text-white group"
              title="Refresh Data"
            >
              <RefreshCw className="w-5 h-5 group-hover:text-amber-500" />
            </button>

            <div className="relative group">
              <Filter className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-hover:text-amber-500 transition" />
              <select className="pl-10 pr-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500/50 appearance-none cursor-pointer hover:bg-white/10 transition min-w-[160px] font-medium">
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
          <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-amber-500/30 transition-all duration-300">
            <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition transform group-hover:scale-110 duration-500">
              <Clock className="w-32 h-32 text-amber-500" />
            </div>
            <div className="relative z-10">
              <p className="text-sm font-medium text-amber-500/80 mb-2 uppercase tracking-wider">
                Pending Review
              </p>
              <h3 className="text-4xl font-display font-bold text-white">
                {0}
              </h3>
              <p className="text-xs text-gray-500 mt-2">Awaiting decision</p>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
            <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition transform group-hover:scale-110 duration-500">
              <CheckCircle className="w-32 h-32 text-emerald-500" />
            </div>
            <div className="relative z-10">
              <p className="text-sm font-medium text-emerald-500/80 mb-2 uppercase tracking-wider">
                Approved
              </p>
              <h3 className="text-4xl font-display font-bold text-white">
                {0}
              </h3>
              <p className="text-xs text-gray-500 mt-2">New teachers joined</p>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-rose-500/30 transition-all duration-300">
            <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition transform group-hover:scale-110 duration-500">
              <XCircle className="w-32 h-32 text-rose-500" />
            </div>
            <div className="relative z-10">
              <p className="text-sm font-medium text-rose-500/80 mb-2 uppercase tracking-wider">
                Rejected
              </p>
              <h3 className="text-4xl font-display font-bold text-white">
                {0}
              </h3>
              <p className="text-xs text-gray-500 mt-2">
                Applications declined
              </p>
            </div>
          </div>
        </div>

        {/* Requests Table (Desktop) */}
        <DashboardTable
          title="Recent Applications"
          columns={teacherRequestColumns}
          data={data}
          renderCell={(column, item, index) =>
            renderTeacherRequestCell(column, item, index)
          }
        />

        {/* Requests List (Mobile) - Empty State Only for now per static code */}
        <div className="md:hidden glass-panel rounded-2xl border border-white/5 p-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-white/5 border border-white/10">
              <User className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-lg font-display font-semibold text-white">
              No Applications Yet
            </h3>
            <p className="text-gray-500 text-sm max-w-md">
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
