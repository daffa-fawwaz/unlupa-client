/**
 * Parse content_ref for book items
 * Format: book:{book_id}:item:{item_id}
 */
import type { BookTree, Module } from "@/features/personal/types/personal.types";

export interface ParsedBookContentRef {
  type: "book";
  bookId: string;
  itemId: string;
  title?: string;
  subtitle?: string;
}

export function parseBookContentRef(contentRef: string): ParsedBookContentRef | null {
  if (!contentRef || !contentRef.startsWith("book:")) {
    return null;
  }

  const parts = contentRef.split(":");
  
  // Expected format: book:{book_id}:item:{item_id}
  // parts[0] = "book"
  // parts[1] = book_id
  // parts[2] = "item"
  // parts[3] = item_id
  
  if (parts.length >= 4 && parts[0] === "book" && parts[2] === "item") {
    return {
      type: "book",
      bookId: parts[1],
      itemId: parts[3],
    };
  }

  return null;
}

/**
 * Get today's date key in YYYY-MM-DD format
 */
export const getTodayDateKey = (): string => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

/**
 * Get storage key for reviewed items by date
 */
export const getReviewedStorageKeyByTaskDate = (taskDate: string): string =>
  `books:daily-reviewed:${taskDate}`;

/**
 * Get reviewed item IDs for a specific date from localStorage
 */
export const getReviewedIdsForTaskDate = (taskDate: string): string[] => {
  try {
    const raw = localStorage.getItem(getReviewedStorageKeyByTaskDate(taskDate));
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed)
      ? parsed.filter((v) => typeof v === "string")
      : [];
  } catch {
    return [];
  }
};

/**
 * Origin metadata for a book item in the review card.
 * - bookTitle: nama buku/modul
 * - halaqah: wadah level pertama (module), opsional jika item langsung di bawah buku
 * - subModules: rantai sub-modul (children module) dari halaqah s.d. induk langsung item
 *               — menampung level bertingkat (Sub-Modul, Bab, dst.). Bila item ada
 *               langsung di halaqah, array ini kosong/undefined.
 * - order: urutan item dalam hafalannya
 */
export interface BookItemOrigin {
  bookTitle: string;
  halaqah?: { title?: string; order?: number };
  subModules?: { title: string; order?: number }[];
  order?: number;
}

/**
 * Lacak asal-usul sebuah item hafalan pada BookTree.
 * Struktur: Buku -> Module (halaqah) -> children Module (sub-modul) -> ... -> items
 */
export function findBookItemOrigin(
  tree: BookTree | null | undefined,
  itemId: string,
): BookItemOrigin | null {
  if (!tree) return null;

  if (tree.items?.length) {
    const direct = tree.items.find((i) => i.id === itemId);
    if (direct) {
      return { bookTitle: tree.title, order: direct.order };
    }
  }

  const searchModules = (
    modules: Module[] | null | undefined,
    depth: number,
    currentHalaqah?: { title?: string; order?: number },
    trail: { title: string; order?: number }[] = [],
  ): BookItemOrigin | null => {
    for (const mod of modules ?? []) {
      const found = mod.items?.find((i) => i.id === itemId);
      if (found) {
        if (depth === 0) {
          return {
            bookTitle: tree.title,
            halaqah: { title: mod.title, order: mod.order },
            order: found.order,
          };
        }
        return {
          bookTitle: tree.title,
          halaqah: currentHalaqah,
          subModules: [...trail, { title: mod.title, order: mod.order }],
          order: found.order,
        };
      }
      if (mod.children?.length) {
        const nextHalaqah =
          depth === 0 ? { title: mod.title, order: mod.order } : currentHalaqah;
        const nextTrail =
          depth >= 1
            ? [...trail, { title: mod.title, order: mod.order }]
            : trail;
        const deep = searchModules(
          mod.children,
          depth + 1,
          nextHalaqah,
          nextTrail,
        );
        if (deep) return deep;
      }
    }
    return null;
  };

  return searchModules(tree.modules ?? [], 0);
}
