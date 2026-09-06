import {
  Users,
  Filter,
  RefreshCw,
  Menu,
  CheckCircle,
  XCircle,
  Shield,
  Crown,
  UserCircle,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useUsers } from "@/features/dashboard/admin/hooks/useUsers";
import { useActivateUser } from "@/features/dashboard/admin/hooks/useActivateUser";
import { useDeactivateUser } from "@/features/dashboard/admin/hooks/useDeactivateUser";
import { DashboardTable } from "@/features/dashboard/components/DashboardTable";
import type { User } from "@/features/dashboard/admin/types/user.types";
import type { TableColumn } from "@/features/dashboard/types/table.types";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Sidebar } from "@/components/ui/Sidebar";

const userColumns: TableColumn[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  { key: "plan", label: "Plan" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions", align: "right" },
];

export const UserListPage = () => {
  const { data, getUsers } = useUsers();
  const { activateUser } = useActivateUser();
  const { deactivateUser } = useDeactivateUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Filter state
  const [roleFilter, setRoleFilter] = useState<
    "all" | "admin" | "teacher" | "student"
  >("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  // Loading state untuk refresh button
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal state
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: "activate" | "deactivate" | null;
    userId: string | null;
    userName: string;
  }>({
    isOpen: false,
    type: null,
    userId: null,
    userName: "",
  });

  useEffect(() => {
    getUsers();
  }, []);

  // Filter data berdasarkan role dan status
  const filteredData = useMemo(() => {
    if (!data) return null;

    let filtered = data;

    // Filter by role
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    // Filter by status
    if (statusFilter === "active") {
      filtered = filtered.filter((user) => user.is_active === true);
    } else if (statusFilter === "inactive") {
      filtered = filtered.filter((user) => user.is_active === false);
    }

    return filtered;
  }, [data, roleFilter, statusFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        total: 0,
        active: 0,
        inactive: 0,
        admins: 0,
        teachers: 0,
        students: 0,
      };
    }

    return {
      total: data.length,
      active: data.filter((user) => user.is_active).length,
      inactive: data.filter((user) => !user.is_active).length,
      admins: data.filter((user) => user.role === "admin").length,
      teachers: data.filter((user) => user.role === "teacher").length,
      students: data.filter((user) => user.role === "student").length,
    };
  }, [data]);

  // Handler untuk refresh data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await getUsers();
    } catch (error) {
      console.error("Terjadi kesalahan saat menyegarkan data");
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    }
  };

  const handleOpenModal = (
    type: "activate" | "deactivate",
    userId: string,
    userName: string,
  ) => {
    setModalState({
      isOpen: true,
      type,
      userId,
      userName,
    });
  };

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      type: null,
      userId: null,
      userName: "",
    });
  };

  const handleConfirm = async () => {
    if (modalState.userId && modalState.type) {
      try {
        if (modalState.type === "activate") {
          await activateUser(modalState.userId);
        } else {
          await deactivateUser(modalState.userId);
        }

        await getUsers();
        handleCloseModal();
      } catch (error) {
        console.error("Terjadi kesalahan saat memproses permintaan pengguna");
      }
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="w-4 h-4" />;
      case "teacher":
        return <Crown className="w-4 h-4" />;
      default:
        return <UserCircle className="w-4 h-4" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-primary/10 text-primary border-primary/20";
      case "teacher":
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-info/10 text-info border-info/20";
    }
  };

  const renderUserCell = (column: TableColumn, item: User, index: number) => {
    switch (column.key) {
      case "id":
        return (
          <div className="text-muted-foreground font-mono text-xs">#{index + 1}</div>
        );

      case "name":
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 hidden md:flex rounded-xl bg-primary items-center justify-center text-primary-foreground font-bold text-sm">
              {item.full_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-foreground">{item.full_name}</p>
              <p className="text-xs text-muted-foreground capitalize">{item.role}</p>
            </div>
          </div>
        );

      case "email":
        return (
          <div className="text-muted-foreground font-mono text-xs">{item.email}</div>
        );

      case "role":
        return (
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${getRoleBadgeColor(item.role)}`}
            >
              {getRoleIcon(item.role)}
              <span className="capitalize">{item.role}</span>
            </span>
          </div>
        );

      case "plan":
        return (
          <div className="text-muted-foreground text-sm capitalize">
            {item.plan || "Free"}
          </div>
        );

      case "status":
        return (
          <div className="flex items-center gap-2">
            {item.is_active ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-success/10 text-success text-xs font-medium border border-success/20">
                <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/10 text-muted-foreground text-xs font-medium border border-muted/20">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                Inactive
              </span>
            )}
          </div>
        );

      case "actions":
        return (
          <div className="flex justify-end gap-2">
            {item.is_active ? (
              <button
                onClick={() =>
                  handleOpenModal("deactivate", item.id, item.full_name)
                }
                className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition"
                title="Deactivate User"
              >
                <XCircle className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() =>
                  handleOpenModal("activate", item.id, item.full_name)
                }
                className="p-2 rounded-lg bg-success/10 text-success hover:bg-success hover:text-success-foreground transition"
                title="Activate User"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        );

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
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground tracking-wide">
                USER <span className="text-primary">MANAGEMENT</span>
              </h1>
            </div>
            <p className="text-muted-foreground text-sm max-w-lg">
              Manage all users in the platform. Activate or deactivate user
              accounts as needed.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-center flex-wrap">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2.5 rounded-xl bg-surface-1 hover:bg-surface-2 border border-border transition text-muted-foreground hover:text-foreground group disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh Data"
            >
              <RefreshCw
                className={`w-5 h-5 group-hover:text-primary transition-transform ${isRefreshing ? "animate-spin" : ""}`}
              />
            </button>

            <div className="relative group">
              <Filter className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 group-hover:text-primary transition" />
              <select
                value={roleFilter}
                onChange={(e) =>
                  setRoleFilter(
                    e.target.value as "all" | "admin" | "teacher" | "student",
                  )
                }
                className="pl-10 pr-5 py-2.5 bg-surface-1 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary/50 appearance-none cursor-pointer hover:bg-surface-2 transition min-w-[140px] font-medium"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </select>
            </div>

            <div className="relative group">
              <Filter className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 group-hover:text-primary transition" />
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as "all" | "active" | "inactive",
                  )
                }
                className="pl-10 pr-5 py-2.5 bg-surface-1 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary/50 appearance-none cursor-pointer hover:bg-surface-2 transition min-w-[140px] font-medium"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-2xl border border-border relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
            <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition transform group-hover:scale-110 duration-500">
              <Users className="w-32 h-32 text-primary" />
            </div>
            <div className="relative z-10">
              <p className="text-sm font-medium text-primary/80 mb-2 uppercase tracking-wider">
                Total Users
              </p>
              <h3 className="text-4xl font-display font-bold text-foreground">
                {stats.total}
              </h3>
              <p className="text-xs text-muted-foreground mt-2">Registered accounts</p>
            </div>
          </div>

          <div className="bg-card p-6 rounded-2xl border border-border relative overflow-hidden group hover:border-success/30 transition-all duration-300">
            <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition transform group-hover:scale-110 duration-500">
              <CheckCircle className="w-32 h-32 text-success" />
            </div>
            <div className="relative z-10">
              <p className="text-sm font-medium text-success/80 mb-2 uppercase tracking-wider">
                Active Users
              </p>
              <h3 className="text-4xl font-display font-bold text-foreground">
                {stats.active}
              </h3>
              <p className="text-xs text-muted-foreground mt-2">Currently active</p>
            </div>
          </div>

          <div className="bg-card p-6 rounded-2xl border border-border relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition transform group-hover:scale-110 duration-500">
              <XCircle className="w-32 h-32 text-muted-foreground" />
            </div>
            <div className="relative z-10">
              <p className="text-sm font-medium text-muted-foreground/80 mb-2 uppercase tracking-wider">
                Inactive Users
              </p>
              <h3 className="text-4xl font-display font-bold text-foreground">
                {stats.inactive}
              </h3>
              <p className="text-xs text-muted-foreground mt-2">Deactivated accounts</p>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <DashboardTable
          title="All Users"
          columns={userColumns}
          data={filteredData}
          getRowKey={(item) => item.id}
          renderCell={(column, item, index) =>
            renderUserCell(column, item, index)
          }
        />
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
        title={
          modalState.type === "activate"
            ? "Activate User Account"
            : "Deactivate User Account"
        }
        message={
          modalState.type === "activate"
            ? `Are you sure you want to activate ${modalState.userName}'s account?`
            : `Are you sure you want to deactivate ${modalState.userName}'s account? They will not be able to access the platform.`
        }
        confirmText={
          modalState.type === "activate" ? "Yes, Activate" : "Yes, Deactivate"
        }
        cancelText="Cancel"
        icon={modalState.type === "activate" ? CheckCircle : XCircle}
        variant={modalState.type === "activate" ? "success" : "danger"}
      />
    </div>
  );
};
