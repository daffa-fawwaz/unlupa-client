import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BookCheck,
  BookOpen,
  CalendarPlus,
  CheckCircle2,
  Clock3,
  Eye,
  Hourglass,
  ImageOff,
  Loader2,
  RefreshCw,
  Search,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router";
import { Table, TableCard } from "@/components/application/table/table";
import { Badge, BadgeWithDot } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { Input } from "@/components/base/input/input";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useApproveBook } from "@/features/dashboard/admin/hooks/useApproveBook";
import { usePendingBooks } from "@/features/dashboard/admin/hooks/usePendingBooks";
import { useRejectBook } from "@/features/dashboard/admin/hooks/useRejectBook";
import type { PendingBook } from "@/features/dashboard/admin/types/pendingBook.types";
import { resolveAssetUrl } from "@/lib/assets";

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatRelativeAge = (dateStr: string) => {
  const days = Math.max(
    0,
    Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24)),
  );

  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
};

const StatusBadge = ({ status }: { status: PendingBook["status"] }) => {
  if (status === "approved") {
    return <BadgeWithDot color="success" size="sm">Approved</BadgeWithDot>;
  }

  if (status === "rejected") {
    return <BadgeWithDot color="error" size="sm">Rejected</BadgeWithDot>;
  }

  return <BadgeWithDot color="warning" size="sm">Pending review</BadgeWithDot>;
};

export const PublishedBooksRequestPage = () => {
  const navigate = useNavigate();
  const { data, loading, error, getPendingBooks } = usePendingBooks();
  const { approveBook, loading: approving } = useApproveBook();
  const { rejectBook, loading: rejecting } = useRejectBook();
  const [searchQuery, setSearchQuery] = useState("");
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
  }, [getPendingBooks]);

  const books = useMemo(() => data ?? [], [data]);
  const filteredBooks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return books;

    return books.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.description?.toLowerCase().includes(query),
    );
  }, [books, searchQuery]);

  const stats = useMemo(() => {
    const pendingBooks = books.filter((book) => book.status === "pending");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const submittedToday = books.filter((book) => {
      const createdAt = new Date(book.created_at);
      createdAt.setHours(0, 0, 0, 0);
      return createdAt.getTime() === today.getTime();
    }).length;

    const oldestTimestamp = pendingBooks.reduce<number | null>((oldest, book) => {
      const timestamp = new Date(book.created_at).getTime();
      return oldest === null || timestamp < oldest ? timestamp : oldest;
    }, null);

    return {
      pending: pendingBooks.length,
      submittedToday,
      oldestPendingDays:
        oldestTimestamp === null
          ? 0
          : Math.max(0, Math.floor((Date.now() - oldestTimestamp) / (1000 * 60 * 60 * 24))),
    };
  }, [books]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await getPendingBooks();
    } finally {
      setIsRefreshing(false);
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
    if (approving || rejecting) return;
    setModalState({ isOpen: false, type: null, bookId: null, bookTitle: "" });
  };

  const handleConfirm = async () => {
    if (!modalState.bookId || !modalState.type) return;

    if (modalState.type === "approve") {
      await approveBook(modalState.bookId);
    } else {
      await rejectBook(modalState.bookId);
    }

    await getPendingBooks();
    setModalState({ isOpen: false, type: null, bookId: null, bookTitle: "" });
  };

  const isProcessing = approving || rejecting;
  const statCards = [
    {
      label: "Pending review",
      value: stats.pending,
      suffix: "",
      description: "Awaiting a decision",
      meta: stats.pending === 1 ? "1 request" : `${stats.pending} requests`,
      icon: Clock3,
      cardClass:
        "border-[#f79009]/45 bg-[linear-gradient(145deg,var(--color-bg-primary)_45%,#fffaeb_100%)] dark:bg-[linear-gradient(145deg,var(--color-bg-primary)_45%,#4e1d09_100%)]",
      iconClass: "bg-[#dc6803] text-white shadow-lg shadow-[#dc6803]/25",
      glowClass: "bg-[#fef0c7] dark:bg-[#7a2e0e]",
      cardStyle: { borderColor: "rgba(247, 144, 9, 0.5)" },
    },
    {
      label: "Submitted today",
      value: stats.submittedToday,
      suffix: "",
      description: "New requests today",
      meta: "Daily intake",
      icon: CalendarPlus,
      cardClass:
        "border-brand-200 bg-[linear-gradient(145deg,var(--color-bg-primary)_45%,var(--color-brand-50)_100%)]",
      iconClass: "bg-brand-solid text-white shadow-lg shadow-brand-500/20",
      glowClass: "bg-brand-100",
      cardStyle: undefined,
    },
    {
      label: "Oldest pending",
      value: stats.oldestPendingDays,
      suffix: "d",
      description: "Since the oldest request",
      meta: stats.oldestPendingDays === 0 ? "Up to date" : "Needs attention",
      icon: Hourglass,
      cardClass:
        "border-[#9b8afb]/40 bg-[linear-gradient(145deg,var(--color-bg-primary)_45%,#f4f3ff_100%)] dark:bg-[linear-gradient(145deg,var(--color-bg-primary)_45%,#2d2657_100%)]",
      iconClass: "bg-[#6938ef] text-white shadow-lg shadow-[#6938ef]/20",
      glowClass: "bg-[#e9e5ff] dark:bg-[#3e1c96]",
      cardStyle: { borderColor: "rgba(155, 138, 251, 0.48)" },
    },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 border-b border-secondary pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-200 ring-inset">
            <BookOpen className="size-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
                Book publish requests
              </h1>
              <Badge color="brand" size="sm">{stats.pending} pending</Badge>
            </div>
            <p className="mt-1 max-w-2xl text-sm text-secondary">
              Review books submitted by teachers before they are shared in the global library.
            </p>
          </div>
        </div>

        <ButtonUtility
          icon={RefreshCw}
          tooltip="Refresh book requests"
          size="sm"
          onPress={handleRefresh}
          isDisabled={isRefreshing || loading || isProcessing}
          className={isRefreshing ? "*:data-icon:animate-spin" : undefined}
        />
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        {statCards.map(
          ({ label, value, suffix, description, meta, icon: Icon, cardClass, iconClass, glowClass, cardStyle }) => (
            <article
              key={label}
              style={cardStyle}
              className={`group relative overflow-hidden rounded-3xl border p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${cardClass}`}
            >
              <div className={`pointer-events-none absolute -right-8 -top-10 size-32 rounded-full opacity-70 transition-transform duration-300 group-hover:scale-110 ${glowClass}`} />
              <div className="relative flex items-start justify-between gap-4">
                <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}>
                  <Icon className="size-5" />
                </div>
                <span className="rounded-full border border-white/50 bg-primary/70 px-2.5 py-1 text-[10px] font-semibold text-secondary shadow-xs backdrop-blur-sm">
                  {meta}
                </span>
              </div>
              <div className="relative mt-5">
                <p className="text-3xl font-semibold tracking-tight text-primary">
                  {value}
                  {suffix && <span className="ml-1 text-lg font-medium text-tertiary">{suffix}</span>}
                </p>
                <p className="mt-1 text-sm font-semibold text-primary">{label}</p>
                <p className="mt-0.5 text-xs text-tertiary">{description}</p>
              </div>
            </article>
          ),
        )}
      </section>

      <TableCard.Root size="md" className="rounded-3xl">
        <TableCard.Header
          title="Publication queue"
          badge={<Badge color="gray" size="sm">{filteredBooks.length} shown</Badge>}
          description="Open a book to inspect its content, or make a decision directly from the queue."
          contentTrailing={
            <Input
              aria-label="Search book requests"
              icon={Search}
              size="sm"
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search title or description"
              className="w-full md:w-72"
            />
          }
        />

        {error ? (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-error-primary text-error-primary">
              <AlertCircle className="size-5" />
            </div>
            <p className="mt-3 text-sm font-semibold text-primary">Unable to load book requests</p>
            <p className="mt-1 text-sm text-secondary">{error}</p>
            <Button
              color="secondary"
              size="sm"
              iconLeading={RefreshCw}
              onPress={handleRefresh}
              className="mt-4"
            >
              Try again
            </Button>
          </div>
        ) : loading && books.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-14 text-center">
            <Loader2 className="size-6 animate-spin text-brand-600" />
            <p className="mt-3 text-sm font-semibold text-primary">Loading publication queue</p>
            <p className="mt-1 text-sm text-secondary">Fetching the latest teacher submissions.</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-200 ring-inset">
              {searchQuery ? <Search className="size-5" /> : <BookCheck className="size-5" />}
            </div>
            <p className="mt-3 text-sm font-semibold text-primary">
              {searchQuery ? "No matching requests" : "Publication queue is clear"}
            </p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-secondary">
              {searchQuery
                ? "Try another title or clear the current search."
                : "New books submitted by teachers will appear here for review."}
            </p>
            {searchQuery && (
              <Button color="secondary" size="sm" onPress={() => setSearchQuery("")} className="mt-4">
                Clear search
              </Button>
            )}
          </div>
        ) : (
          <Table aria-label="Book publication requests" className="min-w-[900px]">
            <Table.Header>
              <Table.Head id="book" isRowHeader label="Book" />
              <Table.Head id="description" label="Description" />
              <Table.Head id="submitted" label="Submitted" />
              <Table.Head id="status" label="Status" />
              <Table.Head id="actions" label="Actions" className="w-36" />
            </Table.Header>
            <Table.Body items={filteredBooks}>
              {(book) => (
                <Table.Row id={book.id}>
                  <Table.Cell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-16 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary ring-1 ring-secondary ring-inset">
                        {book.cover_image ? (
                          <img
                            src={resolveAssetUrl(book.cover_image)}
                            alt={`Cover of ${book.title}`}
                            className="size-full object-cover"
                          />
                        ) : (
                          <ImageOff className="size-4 text-fg-quaternary" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="max-w-64 truncate text-sm font-semibold text-primary">{book.title}</p>
                        <p className="mt-1 font-mono text-xs text-tertiary">ID: {book.id.slice(0, 8)}</p>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <p className="max-w-72 truncate text-sm text-secondary" title={book.description}>
                      {book.description || "No description provided"}
                    </p>
                  </Table.Cell>
                  <Table.Cell>
                    <p className="whitespace-nowrap text-sm font-medium text-primary">{formatDate(book.created_at)}</p>
                    <p className="mt-0.5 whitespace-nowrap text-xs text-tertiary">{formatRelativeAge(book.created_at)}</p>
                  </Table.Cell>
                  <Table.Cell><StatusBadge status={book.status} /></Table.Cell>
                  <Table.Cell>
                    <div className="flex justify-end gap-1">
                      <ButtonUtility
                        icon={Eye}
                        color="tertiary"
                        tooltip="Review book details"
                        onPress={() => navigate(`/dashboard/book-requests/${book.id}`)}
                      />
                      {book.status === "pending" && (
                        <>
                          <ButtonUtility
                            icon={CheckCircle2}
                            color="tertiary"
                            tooltip="Approve publication"
                            onPress={() => handleOpenModal("approve", book.id, book.title)}
                            isDisabled={isProcessing}
                            className="text-[#079455] hover:bg-[#ecfdf3] hover:text-[#067647] dark:hover:bg-[#053321]"
                          />
                          <ButtonUtility
                            icon={XCircle}
                            color="tertiary"
                            tooltip="Reject publication"
                            onPress={() => handleOpenModal("reject", book.id, book.title)}
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

      <ConfirmModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
        title={modalState.type === "approve" ? "Setujui Publikasi Buku" : "Tolak Publikasi Buku"}
        message={
          modalState.type === "approve"
            ? `Apakah Anda yakin ingin menyetujui buku "${modalState.bookTitle}" untuk dipublikasikan?`
            : `Apakah Anda yakin ingin menolak permintaan publikasi buku "${modalState.bookTitle}"?`
        }
        confirmText={modalState.type === "approve" ? "Ya, Setujui" : "Ya, Tolak"}
        cancelText="Batal"
        icon={modalState.type === "approve" ? CheckCircle2 : XCircle}
        variant={modalState.type === "approve" ? "success" : "danger"}
      />
    </div>
  );
};
