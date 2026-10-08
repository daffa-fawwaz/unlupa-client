import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock5,
  Loader2,
  RefreshCw,
  Search,
  Teacher,
  UserCheck,
  UsersRound,
  UserX,
  XCircle,
} from "@/components/foundations/hugeicons";
import {
  Dialog,
  Modal,
  ModalOverlay,
} from "@/components/application/modals/modal";
import { Table, TableCard } from "@/components/application/table/table";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge, BadgeWithDot } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { CloseButton } from "@/components/base/buttons/close-button";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";
import { useApp } from "@/context/AppContext";
import { useApproveTeacher } from "@/features/dashboard/admin/hooks/useApproveTeacher";
import { useRejectTeacher } from "@/features/dashboard/admin/hooks/useRejectTeacher";
import { useTeacherRequests } from "@/features/dashboard/admin/hooks/useTeacherRequests";
import type { TeacherRequest } from "@/features/dashboard/admin/types/teacherRequest.types";

type StatusFilter = "all" | TeacherRequest["status"];

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

const RequestStatusBadge = ({
  status,
  labels,
}: {
  status: TeacherRequest["status"];
  labels: Record<TeacherRequest["status"], string>;
}) => {
  if (status === "approved") {
    return (
      <BadgeWithDot color="success" size="sm">
        {labels.approved}
      </BadgeWithDot>
    );
  }

  if (status === "rejected") {
    return (
      <BadgeWithDot color="error" size="sm">
        {labels.rejected}
      </BadgeWithDot>
    );
  }

  return (
    <BadgeWithDot color="warning" size="sm">
      {labels.pending}
    </BadgeWithDot>
  );
};

export const TeacherRequestPage = () => {
  const { language } = useApp();
  const isEnglish = language === "en";
  const { data, loading, error, getTeacherRequests } = useTeacherRequests();
  const { approveTeacherRequest, loading: approving } = useApproveTeacher();
  const { rejectTeacherRequest, loading: rejecting } = useRejectTeacher();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
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

  const text = isEnglish
    ? {
        title: "Teacher requests",
        subtitle:
          "Review applications from users who want to teach on the platform.",
        pending: "Pending review",
        approved: "Approved",
        rejected: "Rejected",
        awaitingDecision: "Awaiting a decision",
        teachersJoined: "New teachers approved",
        applicationsDeclined: "Applications declined",
        needsReview: "Needs review",
        completed: "Completed",
        allStatuses: "All statuses",
        noFilter: "No filter",
        searchPlaceholder: "Search name, email, or message",
        tableTitle: "Teacher applications",
        tableDescription:
          "Review applicant details and update each request status.",
        shown: "shown",
        applicant: "Applicant",
        message: "Message",
        submitted: "Submitted",
        status: "Status",
        actions: "Actions",
        applicantLabel: "Teacher applicant",
        noMessage: "No message provided",
        refresh: "Refresh teacher requests",
        approve: "Approve request",
        reject: "Reject request",
        loadError: "Unable to load teacher requests",
        tryAgain: "Try again",
        loadingTitle: "Loading teacher applications",
        loadingDescription: "Fetching the latest requests.",
        emptyTitle: "No teacher applications yet",
        emptyDescription: "New applications will appear here for review.",
        noResultsTitle: "No matching applications",
        noResultsDescription: "Try changing the search or status filter.",
        clearFilters: "Clear filters",
        approveTitle: "Approve teacher request?",
        rejectTitle: "Reject teacher request?",
        approveMessage: (name: string) =>
          `${name} will receive teacher access and can start managing classes.`,
        rejectMessage: (name: string) =>
          `${name}'s teacher application will be declined.`,
        cancel: "Cancel",
        confirmApprove: "Yes, approve",
        confirmReject: "Yes, reject",
        closeConfirmation: "Close confirmation",
      }
    : {
        title: "Permintaan guru",
        subtitle: "Tinjau pengajuan pengguna yang ingin mengajar di platform.",
        pending: "Menunggu tinjauan",
        approved: "Disetujui",
        rejected: "Ditolak",
        awaitingDecision: "Menunggu keputusan",
        teachersJoined: "Guru baru disetujui",
        applicationsDeclined: "Pengajuan yang ditolak",
        needsReview: "Perlu ditinjau",
        completed: "Selesai",
        allStatuses: "Semua status",
        noFilter: "Tanpa filter",
        searchPlaceholder: "Cari nama, email, atau pesan",
        tableTitle: "Pengajuan guru",
        tableDescription:
          "Tinjau data pemohon dan perbarui status setiap pengajuan.",
        shown: "ditampilkan",
        applicant: "Pemohon",
        message: "Pesan",
        submitted: "Diajukan",
        status: "Status",
        actions: "Tindakan",
        applicantLabel: "Pemohon guru",
        noMessage: "Tidak ada pesan",
        refresh: "Muat ulang permintaan guru",
        approve: "Setujui pengajuan",
        reject: "Tolak pengajuan",
        loadError: "Permintaan guru tidak dapat dimuat",
        tryAgain: "Coba lagi",
        loadingTitle: "Memuat pengajuan guru",
        loadingDescription: "Mengambil permintaan terbaru.",
        emptyTitle: "Belum ada pengajuan guru",
        emptyDescription: "Pengajuan baru akan muncul di sini untuk ditinjau.",
        noResultsTitle: "Pengajuan tidak ditemukan",
        noResultsDescription: "Coba ubah pencarian atau filter status.",
        clearFilters: "Hapus filter",
        approveTitle: "Setujui permintaan guru?",
        rejectTitle: "Tolak permintaan guru?",
        approveMessage: (name: string) =>
          `${name} akan mendapatkan akses guru dan dapat mulai mengelola kelas.`,
        rejectMessage: (name: string) =>
          `Pengajuan guru dari ${name} akan ditolak.`,
        cancel: "Batal",
        confirmApprove: "Ya, setujui",
        confirmReject: "Ya, tolak",
        closeConfirmation: "Tutup konfirmasi",
      };

  useEffect(() => {
    getTeacherRequests();
  }, [getTeacherRequests]);

  const requests = useMemo(() => data ?? [], [data]);
  const filteredRequests = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return requests.filter((request) => {
      const matchesStatus =
        statusFilter === "all" || request.status === statusFilter;
      const matchesQuery =
        !query ||
        request.user.full_name.toLowerCase().includes(query) ||
        request.user.email.toLowerCase().includes(query) ||
        request.message?.toLowerCase().includes(query);

      return matchesStatus && matchesQuery;
    });
  }, [requests, searchQuery, statusFilter]);

  const stats = useMemo(
    () => ({
      pending: requests.filter((request) => request.status === "pending")
        .length,
      approved: requests.filter((request) => request.status === "approved")
        .length,
      rejected: requests.filter((request) => request.status === "rejected")
        .length,
    }),
    [requests],
  );

  const statusOptions = [
    { id: "all", label: text.allStatuses, icon: UsersRound },
    { id: "pending", label: text.pending, icon: Clock5 },
    { id: "approved", label: text.approved, icon: CheckCircle2 },
    { id: "rejected", label: text.rejected, icon: XCircle },
  ];
  const statusLabels = {
    pending: text.pending,
    approved: text.approved,
    rejected: text.rejected,
  };
  const isProcessing = approving || rejecting;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await getTeacherRequests();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleOpenModal = (
    type: "approve" | "reject",
    requestId: string,
    requestName: string,
  ) => {
    setModalState({ isOpen: true, type, requestId, requestName });
  };

  const handleCloseModal = () => {
    if (isProcessing) return;
    setModalState({
      isOpen: false,
      type: null,
      requestId: null,
      requestName: "",
    });
  };

  const handleConfirm = async () => {
    if (!modalState.requestId || !modalState.type) return;

    if (modalState.type === "approve") {
      await approveTeacherRequest(modalState.requestId);
    } else {
      await rejectTeacherRequest(modalState.requestId);
    }

    await getTeacherRequests();
    setModalState({
      isOpen: false,
      type: null,
      requestId: null,
      requestName: "",
    });
  };

  const statCards = [
    {
      label: text.pending,
      value: stats.pending,
      description: text.awaitingDecision,
      meta: text.needsReview,
      icon: Clock5,
      cardClass:
        "border-[#f79009]/45 bg-[linear-gradient(145deg,var(--color-bg-primary)_45%,#fffaeb_100%)] dark:bg-[linear-gradient(145deg,var(--color-bg-primary)_45%,#4e1d09_100%)]",
      iconClass: "bg-[#dc6803] text-white shadow-lg shadow-[#dc6803]/25",
      glowClass: "bg-[#fef0c7] dark:bg-[#7a2e0e]",
      cardStyle: { borderColor: "rgba(247, 144, 9, 0.5)" },
    },
    {
      label: text.approved,
      value: stats.approved,
      description: text.teachersJoined,
      meta: text.completed,
      icon: UserCheck,
      cardClass:
        "border-[#12b76a]/45 bg-[linear-gradient(145deg,var(--color-bg-primary)_45%,#ecfdf3_100%)] dark:bg-[linear-gradient(145deg,var(--color-bg-primary)_45%,#053321_100%)]",
      iconClass: "bg-[#079455] text-white shadow-lg shadow-[#079455]/25",
      glowClass: "bg-[#d1fadf] dark:bg-[#054f31]",
      cardStyle: { borderColor: "rgba(18, 183, 106, 0.55)" },
    },
    {
      label: text.rejected,
      value: stats.rejected,
      description: text.applicationsDeclined,
      meta: text.completed,
      icon: UserX,
      cardClass:
        "border-error_subtle bg-[linear-gradient(145deg,var(--color-bg-primary)_45%,rgba(240,68,56,0.08)_100%)]",
      iconClass: "bg-error-solid text-white shadow-lg shadow-error/20",
      glowClass: "bg-error-primary",
      cardStyle: undefined,
    },
  ];

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(isEnglish ? "en-US" : "id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 border-b border-secondary pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-200 ring-inset">
            <Teacher className="size-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
                {text.title}
              </h1>
              <Badge color="warning" size="sm">
                {stats.pending} {text.pending.toLowerCase()}
              </Badge>
            </div>
            <p className="mt-1 max-w-2xl text-sm text-secondary">
              {text.subtitle}
            </p>
          </div>
        </div>

        <ButtonUtility
          icon={RefreshCw}
          tooltip={text.refresh}
          size="sm"
          onPress={handleRefresh}
          isDisabled={isRefreshing || loading || isProcessing}
          className={isRefreshing ? "*:data-icon:animate-spin" : undefined}
        />
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        {statCards.map(
          ({
            label,
            value,
            description,
            meta,
            icon: Icon,
            cardClass,
            iconClass,
            glowClass,
            cardStyle,
          }) => (
            <article
              key={label}
              style={cardStyle}
              className={`group relative overflow-hidden rounded-3xl border p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${cardClass}`}
            >
              <div
                className={`pointer-events-none absolute -right-8 -top-10 size-32 rounded-full opacity-70 transition-transform duration-300 group-hover:scale-110 ${glowClass}`}
              />
              <div className="relative flex items-start justify-between gap-4">
                <div
                  className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
                >
                  <Icon className="size-5" />
                </div>
                <span className="rounded-full border border-white/50 bg-primary/70 px-2.5 py-1 text-[10px] font-semibold text-secondary shadow-xs backdrop-blur-sm">
                  {meta}
                </span>
              </div>
              <div className="relative mt-5">
                <p className="text-3xl font-semibold tracking-tight text-primary">
                  {value}
                </p>
                <p className="mt-1 text-sm font-semibold text-primary">
                  {label}
                </p>
                <p className="mt-0.5 text-xs text-tertiary">{description}</p>
              </div>
            </article>
          ),
        )}
      </section>

      <TableCard.Root size="md" className="rounded-3xl">
        <TableCard.Header
          title={text.tableTitle}
          badge={
            <Badge color="gray" size="sm">
              {filteredRequests.length} {text.shown}
            </Badge>
          }
          description={text.tableDescription}
          contentTrailing={
            <div className="grid w-full gap-2 sm:grid-cols-[minmax(0,1fr)_11rem] md:w-auto">
              <Input
                aria-label={text.searchPlaceholder}
                icon={Search}
                size="sm"
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder={text.searchPlaceholder}
                className="md:w-72"
              />
              <Select
                aria-label={text.allStatuses}
                size="sm"
                value={statusFilter}
                onChange={(value) => setStatusFilter(value as StatusFilter)}
                items={statusOptions}
                popoverClassName="min-w-48"
              >
                {(item) => (
                  <Select.Item
                    id={item.id}
                    icon={item.icon}
                    supportingText={
                      item.id === "all" ? text.noFilter : undefined
                    }
                  >
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
              <AlertCircle className="size-5" />
            </div>
            <p className="mt-3 text-sm font-semibold text-primary">
              {text.loadError}
            </p>
            <p className="mt-1 text-sm text-secondary">{error}</p>
            <Button
              color="secondary"
              size="sm"
              iconLeading={RefreshCw}
              onPress={handleRefresh}
              className="mt-4"
            >
              {text.tryAgain}
            </Button>
          </div>
        ) : loading && requests.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-14 text-center">
            <Loader2 className="size-6 animate-spin text-brand-600" />
            <p className="mt-3 text-sm font-semibold text-primary">
              {text.loadingTitle}
            </p>
            <p className="mt-1 text-sm text-secondary">
              {text.loadingDescription}
            </p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-200 ring-inset">
              {searchQuery || statusFilter !== "all" ? (
                <Search className="size-5" />
              ) : (
                <UsersRound className="size-5" />
              )}
            </div>
            <p className="mt-3 text-sm font-semibold text-primary">
              {searchQuery || statusFilter !== "all"
                ? text.noResultsTitle
                : text.emptyTitle}
            </p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-secondary">
              {searchQuery || statusFilter !== "all"
                ? text.noResultsDescription
                : text.emptyDescription}
            </p>
            {(searchQuery || statusFilter !== "all") && (
              <Button
                color="secondary"
                size="sm"
                onPress={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
                className="mt-4"
              >
                {text.clearFilters}
              </Button>
            )}
          </div>
        ) : (
          <Table aria-label={text.tableTitle} className="min-w-[900px]">
            <Table.Header>
              <Table.Head id="applicant" isRowHeader label={text.applicant} />
              <Table.Head id="message" label={text.message} />
              <Table.Head id="submitted" label={text.submitted} />
              <Table.Head id="status" label={text.status} />
              <Table.Head id="actions" label={text.actions} className="w-24" />
            </Table.Header>
            <Table.Body items={filteredRequests}>
              {(request) => (
                <Table.Row id={request.id}>
                  <Table.Cell>
                    <div className="flex items-center gap-3">
                      <Avatar
                        size="sm"
                        initials={getInitials(request.user.full_name)}
                        alt={request.user.full_name}
                      />
                      <div className="min-w-0">
                        <p className="max-w-56 truncate text-sm font-semibold text-primary">
                          {request.user.full_name}
                        </p>
                        <p className="mt-0.5 max-w-64 truncate text-xs text-tertiary">
                          {request.user.email}
                        </p>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <p
                      className="max-w-72 truncate text-sm text-secondary"
                      title={request.message}
                    >
                      {request.message || text.noMessage}
                    </p>
                  </Table.Cell>
                  <Table.Cell>
                    <p className="whitespace-nowrap text-sm font-medium text-primary">
                      {formatDate(request.created_at)}
                    </p>
                    <p className="mt-0.5 font-mono text-xs text-tertiary">
                      ID: {request.id.slice(0, 8)}
                    </p>
                  </Table.Cell>
                  <Table.Cell>
                    <RequestStatusBadge
                      status={request.status}
                      labels={statusLabels}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex justify-end gap-1">
                      {request.status === "pending" && (
                        <>
                          <ButtonUtility
                            icon={CheckCircle2}
                            color="tertiary"
                            tooltip={text.approve}
                            onPress={() =>
                              handleOpenModal(
                                "approve",
                                request.id,
                                request.user.full_name,
                              )
                            }
                            isDisabled={isProcessing}
                            className="text-[#079455] hover:bg-[#ecfdf3] hover:text-[#067647] dark:hover:bg-[#053321]"
                          />
                          <ButtonUtility
                            icon={XCircle}
                            color="tertiary"
                            tooltip={text.reject}
                            onPress={() =>
                              handleOpenModal(
                                "reject",
                                request.id,
                                request.user.full_name,
                              )
                            }
                            isDisabled={isProcessing}
                            className="text-error-primary hover:bg-error-primary hover:text-error-primary"
                          />
                        </>
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
        isDismissable={!isProcessing}
        onOpenChange={(isOpen) => !isOpen && handleCloseModal()}
      >
        <Modal className="max-w-md overflow-hidden rounded-t-3xl sm:rounded-3xl">
          <Dialog
            aria-label={
              modalState.type === "approve"
                ? text.approveTitle
                : text.rejectTitle
            }
          >
            {({ close }) => {
              const isReject = modalState.type === "reject";
              const Icon = isReject ? XCircle : CheckCircle2;

              return (
                <>
                  <div className="relative px-5 pb-5 pt-6 sm:px-6">
                    <CloseButton
                      label={text.closeConfirmation}
                      onPress={close}
                      isDisabled={isProcessing}
                      className="absolute right-4 top-4"
                    />
                    <div
                      className={`flex size-12 items-center justify-center rounded-xl ring-1 ring-inset ${isReject ? "bg-error-primary text-error-primary ring-error_subtle" : "bg-[#ecfdf3] text-[#079455] ring-[#abefc6] dark:bg-[#053321] dark:text-[#47cd89] dark:ring-[#085d3a]"}`}
                    >
                      <Icon className="size-6" />
                    </div>
                    <h2 className="mt-4 pr-10 text-lg font-semibold text-primary">
                      {isReject ? text.rejectTitle : text.approveTitle}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-secondary">
                      {isReject
                        ? text.rejectMessage(modalState.requestName)
                        : text.approveMessage(modalState.requestName)}
                    </p>
                  </div>
                  <div className="flex flex-col-reverse gap-3 border-t border-secondary bg-secondary px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                    <Button
                      color="secondary"
                      size="md"
                      onPress={close}
                      isDisabled={isProcessing}
                      className="w-full sm:w-auto"
                    >
                      {text.cancel}
                    </Button>
                    <Button
                      color={isReject ? "primary-destructive" : "primary"}
                      size="md"
                      onPress={handleConfirm}
                      isLoading={isProcessing}
                      className="w-full sm:w-auto"
                    >
                      {isReject ? text.confirmReject : text.confirmApprove}
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
