/**
 * Parse content_ref for book items
 * Format: book:{book_id}:item:{item_id}
 */
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
