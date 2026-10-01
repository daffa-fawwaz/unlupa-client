import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Crown,
  RefreshCw,
  Search,
  Shield,
  UserCheck,
  UserCircle,
  Users,
  UserX,
  XCircle,
} from "lucide-react";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { Table, TableCard } from "@/components/application/table/table";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge, BadgeWithDot } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { CloseButton } from "@/components/base/buttons/close-button";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";
import { useActivateUser } from "@/features/dashboard/admin/hooks/useActivateUser";
import { useDeactivateUser } from "@/features/dashboard/admin/hooks/useDeactivateUser";
import { useUsers } from "@/features/dashboard/admin/hooks/useUsers";
import type { User } from "@/features/dashboard/admin/types/user.types";

type RoleFilter = "all" | "admin" | "teacher" | "student";
type StatusFilter = "all" | "active" | "inactive";

const roleOptions = [
  { id: "all", label: "All roles", icon: Users },
  { id: "admin", label: "Admin", icon: Shield },
  { id: "teacher", label: "Teacher", icon: Crown },
  { id: "student", label: "Student", icon: UserCircle },
];

const statusOptions = [
  { id: "all", label: "All statuses", icon: Users },
  { id: "active", label: "Active", icon: CheckCircle2 },
  { id: "inactive", label: "Inactive", icon: XCircle },
];

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

const RoleBadge = ({ role }: { role: string }) => {
  if (role === "admin") {
    return (
      <Badge color="purple" size="sm" className="gap-1.5 capitalize">
        <Shield className="size-3.5" />
        Admin
      </Badge>
    );
  }

  if (role === "teacher") {
    return (
      <Badge color="warning" size="sm" className="gap-1.5 capitalize">
        <Crown className="size-3.5" />
        Teacher
      </Badge>
    );
  }

  return (
    <Badge color="blue" size="sm" className="gap-1.5 capitalize">
      <UserCircle className="size-3.5" />
      Student
    </Badge>
  );
};

const PlanBadge = ({ plan }: { plan?: string }) => {
  const normalizedPlan = plan?.toLowerCase() || "free";

  if (normalizedPlan === "premium" || normalizedPlan === "pro") {
    return (
      <Badge color="orange" size="sm" className="gap-1.5 uppercase">
        <Crown className="size-3.5" />
        Pro
      </Badge>
    );
  }

  if (normalizedPlan === "institutional") {
    return <Badge color="purple" size="sm">Institutional</Badge>;
  }

  return <Badge color="gray" size="sm">Free</Badge>;
};

export const UserListPage = () => {
  const { data, loading, error, getUsers } = useUsers();
  const { activateUser, loading: activating } = useActivateUser();
  const { deactivateUser, loading: deactivating } = useDeactivateUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
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
  const isUpdating = activating || deactivating;

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const users = useMemo(() => data ?? [], [data]);
  const filteredData = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return users.filter((user) => {
      const matchesQuery = !query || user.full_name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query);
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? user.is_active : !user.is_active);

      return matchesQuery && matchesRole && matchesStatus;
    });
  }, [roleFilter, searchQuery, statusFilter, users]);

  const stats = useMemo(
    () => ({
      total: users.length,
      active: users.filter((user) => user.is_active).length,
      inactive: users.filter((user) => !user.is_active).length,
    }),
    [users],
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await getUsers();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleOpenModal = (type: "activate" | "deactivate", user: User) => {
    setModalState({
      isOpen: true,
      type,
      userId: user.id,
      userName: user.full_name,
    });
  };

  const handleCloseModal = () => {
    if (isUpdating) return;
    setModalState({
      isOpen: false,
      type: null,
      userId: null,
      userName: "",
    });
  };

  const handleConfirm = async () => {
    if (!modalState.userId || !modalState.type) return;

    if (modalState.type === "activate") {
      await activateUser(modalState.userId);
    } else {
      await deactivateUser(modalState.userId);
    }

    await getUsers();
    handleCloseModal();
  };

  const statCards = [
    {
      label: "Total users",
      value: stats.total,
      description: "Registered accounts",
      meta: "All platform users",
      icon: Users,
      cardClass: "border-brand-200 bg-[linear-gradient(145deg,var(--color-bg-primary)_45%,var(--color-brand-50)_100%)]",
      iconClass: "bg-brand-solid text-white shadow-lg shadow-brand-500/20",
      glowClass: "bg-brand-100",
      cardStyle: undefined,
      iconStyle: undefined,
    },
    {
      label: "Active users",
      value: stats.active,
      description: "Currently active",
      meta: stats.total > 0 ? `${Math.round((stats.active / stats.total) * 100)}% of total` : "No users yet",
      icon: UserCheck,
      cardClass: "border-[#12b76a]/45 bg-[linear-gradient(145deg,var(--color-bg-primary)_45%,#ecfdf3_100%)] dark:bg-[linear-gradient(145deg,var(--color-bg-primary)_45%,#053321_100%)]",
      iconClass: "bg-[#079455] text-white shadow-lg shadow-[#079455]/25",
      glowClass: "bg-[#d1fadf] dark:bg-[#054f31]",
      cardStyle: { borderColor: "rgba(18, 183, 106, 0.55)" },
      iconStyle: { backgroundColor: "#079455", color: "#ffffff" },
    },
    {
      label: "Inactive users",
      value: stats.inactive,
      description: "Deactivated accounts",
      meta: stats.total > 0 ? `${Math.round((stats.inactive / stats.total) * 100)}% of total` : "No users yet",
      icon: UserX,
      cardClass: "border-error_subtle bg-[linear-gradient(145deg,var(--color-bg-primary)_45%,rgba(240,68,56,0.08)_100%)]",
      iconClass: "bg-error-solid text-white shadow-lg shadow-error/20",
      glowClass: "bg-error-primary",
      cardStyle: undefined,
      iconStyle: undefined,
    },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 border-b border-secondary pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-200 ring-inset">
            <Users className="size-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-primary sm:text-3xl">User management</h1>
              <Badge color="brand" size="sm">{stats.total} users</Badge>
            </div>
            <p className="mt-1 max-w-2xl text-sm text-secondary">
              Manage account access, roles, plans, and activation status across the platform.
            </p>
          </div>
        </div>

        <ButtonUtility
          icon={RefreshCw}
          tooltip="Refresh users"
          size="sm"
          onPress={handleRefresh}
          isDisabled={isRefreshing || loading}
          className={isRefreshing ? "*:data-icon:animate-spin" : undefined}
        />
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        {statCards.map(({ label, value, description, meta, icon: Icon, cardClass, iconClass, glowClass, cardStyle, iconStyle }) => (
          <article key={label} style={cardStyle} className={`group relative overflow-hidden rounded-3xl border p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${cardClass}`}>
            <div className={`pointer-events-none absolute -right-8 -top-10 size-32 rounded-full opacity-70 transition-transform duration-300 group-hover:scale-110 ${glowClass}`} />
            <div className="relative flex items-start justify-between gap-4">
              <div style={iconStyle} className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}>
                <Icon className="size-5" />
              </div>
              <span className="rounded-full border border-white/50 bg-primary/70 px-2.5 py-1 text-[10px] font-semibold text-secondary shadow-xs backdrop-blur-sm">
                {meta}
              </span>
            </div>
            <div className="relative mt-5">
              <p className="text-3xl font-semibold tracking-tight text-primary">{value}</p>
              <p className="mt-1 text-sm font-semibold text-primary">{label}</p>
              <p className="mt-0.5 text-xs text-tertiary">{description}</p>
            </div>
          </article>
        ))}
      </section>

      <TableCard.Root size="md" className="rounded-3xl">
        <TableCard.Header
          title="All users"
          badge={<Badge color="gray" size="sm">{filteredData.length} shown</Badge>}
          description="Search, filter, and manage registered accounts."
          contentTrailing={
            <div className="grid w-full gap-2 sm:grid-cols-3 md:w-auto">
              <Input
                aria-label="Search users"
                icon={Search}
                size="sm"
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search name or email"
                className="sm:col-span-3 md:col-span-1 md:w-60"
              />
              <Select
                aria-label="Filter by role"
                size="sm"
                value={roleFilter}
                onChange={(value) => setRoleFilter(value as RoleFilter)}
                items={roleOptions}
                className="min-w-40"
                popoverClassName="min-w-44"
              >
                {(item) => (
                  <Select.Item id={item.id} icon={item.icon} supportingText={item.id === "all" ? "No filter" : undefined}>
                    {item.label}
                  </Select.Item>
                )}
              </Select>
              <Select
                aria-label="Filter by status"
                size="sm"
                value={statusFilter}
                onChange={(value) => setStatusFilter(value as StatusFilter)}
                items={statusOptions}
                className="min-w-40"
                popoverClassName="min-w-44"
              >
                {(item) => (
                  <Select.Item id={item.id} icon={item.icon} supportingText={item.id === "all" ? "No filter" : undefined}>
                    {item.label}
                  </Select.Item>
                )}
              </Select>
            </div>
          }
        />

        {error ? (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-error-primary text-error-primary">
              <XCircle className="size-5" />
            </div>
            <p className="mt-3 text-sm font-semibold text-primary">Unable to load users</p>
            <p className="mt-1 text-sm text-secondary">{error}</p>
          </div>
        ) : loading && users.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-secondary">Loading users...</div>
        ) : filteredData.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-secondary text-fg-quaternary">
              <Search className="size-5" />
            </div>
            <p className="mt-3 text-sm font-semibold text-primary">No users found</p>
            <p className="mt-1 text-sm text-secondary">Try changing the search or filters.</p>
          </div>
        ) : (
          <Table aria-label="User management table" className="min-w-[880px]">
            <Table.Header>
              <Table.Head id="user" isRowHeader label="User" />
              <Table.Head id="email" label="Email" />
              <Table.Head id="role" label="Role" />
              <Table.Head id="plan" label="Plan" />
              <Table.Head id="status" label="Status" />
              <Table.Head id="actions" label="Actions" className="w-24" />
            </Table.Header>
            <Table.Body items={filteredData}>
              {(user) => (
                <Table.Row id={user.id}>
                  <Table.Cell>
                    <div className="flex items-center gap-3">
                      <Avatar size="sm" initials={getInitials(user.full_name)} alt={user.full_name} />
                      <div className="min-w-0">
                        <p className="max-w-52 truncate text-sm font-semibold text-primary">{user.full_name}</p>
                        <p className="mt-0.5 text-xs capitalize text-tertiary">ID: {user.id.slice(0, 8)}</p>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="block max-w-64 truncate text-sm text-secondary">{user.email}</span>
                  </Table.Cell>
                  <Table.Cell><RoleBadge role={user.role} /></Table.Cell>
                  <Table.Cell><PlanBadge plan={user.plan} /></Table.Cell>
                  <Table.Cell>
                    <BadgeWithDot color={user.is_active ? "success" : "gray"} size="sm">
                      {user.is_active ? "Active" : "Inactive"}
                    </BadgeWithDot>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex justify-end">
                      {user.is_active ? (
                        <ButtonUtility
                          icon={XCircle}
                          color="tertiary"
                          tooltip="Deactivate user"
                          onPress={() => handleOpenModal("deactivate", user)}
                          className="text-error-primary hover:bg-error-primary hover:text-error-primary"
                        />
                      ) : (
                        <ButtonUtility
                          icon={CheckCircle2}
                          color="tertiary"
                          tooltip="Activate user"
                          onPress={() => handleOpenModal("activate", user)}
                          className="text-success hover:bg-success/10 hover:text-success"
                        />
                      )}
                    </div>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        )}
      </TableCard.Root>

      <ModalOverlay
        isOpen={modalState.isOpen}
        isDismissable={!isUpdating}
        onOpenChange={(isOpen) => !isOpen && handleCloseModal()}
      >
        <Modal className="max-w-md overflow-hidden rounded-t-3xl sm:rounded-3xl">
          <Dialog aria-label={modalState.type === "activate" ? "Activate user account" : "Deactivate user account"}>
            {({ close }) => {
              const isDeactivate = modalState.type === "deactivate";
              const Icon = isDeactivate ? XCircle : CheckCircle2;

              return (
                <>
                  <div className="relative px-5 pb-5 pt-6 sm:px-6 sm:pt-6">
                    <CloseButton
                      label="Close confirmation"
                      onPress={close}
                      isDisabled={isUpdating}
                      className="absolute right-4 top-4"
                    />
                    <div
                      className={`flex size-12 items-center justify-center rounded-xl ring-1 ring-inset ${
                        isDeactivate
                          ? "bg-error-primary text-error-primary ring-error_subtle"
                          : "bg-[#ecfdf3] text-[#079455] ring-[#abefc6] dark:bg-[#053321] dark:text-[#47cd89] dark:ring-[#085d3a]"
                      }`}
                    >
                      <Icon className="size-6" />
                    </div>
                    <h2 className="mt-4 pr-10 text-lg font-semibold text-primary">
                      {isDeactivate ? "Deactivate user account?" : "Activate user account?"}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-secondary">
                      {isDeactivate
                        ? `${modalState.userName} will lose access to the platform until their account is activated again.`
                        : `${modalState.userName} will regain access to the platform and can sign in again.`}
                    </p>
                  </div>

                  <div className="flex flex-col-reverse gap-3 border-t border-secondary bg-secondary px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                    <Button color="secondary" size="md" onPress={close} isDisabled={isUpdating} className="w-full sm:w-auto">
                      Cancel
                    </Button>
                    <Button
                      color={isDeactivate ? "primary-destructive" : "primary"}
                      size="md"
                      onPress={handleConfirm}
                      isLoading={isUpdating}
                      className="w-full sm:w-auto"
                    >
                      {isDeactivate ? "Yes, deactivate" : "Yes, activate"}
                    </Button>
                  </div>
                </>
              );
            }}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </div>
  );
};
