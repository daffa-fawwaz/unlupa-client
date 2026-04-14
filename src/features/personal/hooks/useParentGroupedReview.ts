import { useCallback, useState } from "react";
import { personalService } from "@/features/personal/services/personal.services";
import { parseBookContentRef } from "@/features/personal/utils/bookReviewUtils";
import type {
  BookDailyTask,
  BookTree,
  Module,
  ParentGroup,
  ReviewQueueItem,
} from "@/features/personal/types/personal.types";

function findParent(
  tree: BookTree,
  itemId: string,
): { parentId: string; parentTitle: string; parentType: "book" | "module" | "submodule" } | null {
  if (tree.items?.some((i) => i.id === itemId)) {
    return { parentId: tree.book_id, parentTitle: tree.title, parentType: "book" };
  }

  const searchModules = (
    modules: Module[],
    depth: number,
  ): { parentId: string; parentTitle: string; parentType: "book" | "module" | "submodule" } | null => {
    for (const mod of modules) {
      if (mod.items?.some((i) => i.id === itemId)) {
        return {
          parentId: mod.id,
          parentTitle: mod.title,
          parentType: depth === 0 ? "module" : "submodule",
        };
      }
      if (mod.children?.length) {
        const found = searchModules(mod.children, depth + 1);
        if (found) return found;
      }
    }
    return null;
  };

  return searchModules(tree.modules ?? [], 0);
}

export const useParentGroupedReview = () => {
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<ParentGroup[]>([]);
  const [error, setError] = useState<string | null>(null);

  const buildGroups = useCallback(async (tasks: BookDailyTask[]) => {
    if (!tasks.length) {
      setGroups([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Deduplicate by item_id — keep only one task per item
      const seen = new Set<string>();
      const uniqueTasks: BookDailyTask[] = [];
      for (const task of tasks) {
        const parsed = parseBookContentRef(task.content_ref);
        if (!parsed) continue;
        if (seen.has(parsed.itemId)) continue;
        seen.add(parsed.itemId);
        uniqueTasks.push(task);
      }

      // Group by book_id to minimize tree fetches
      const tasksByBook = new Map<string, BookDailyTask[]>();
      for (const task of uniqueTasks) {
        const parsed = parseBookContentRef(task.content_ref);
        if (!parsed) continue;
        const existing = tasksByBook.get(parsed.bookId) ?? [];
        tasksByBook.set(parsed.bookId, [...existing, task]);
      }

      const parentMap = new Map<string, ParentGroup>();

      for (const [bookId, bookTasks] of tasksByBook) {
        let tree: BookTree | null = null;
        let bookTitle = "Buku";

        try {
          const res = await personalService.getBookTree(bookId);
          tree = res.data;
          bookTitle = tree.title;
        } catch {
          // fallback: group all under book
        }

        for (const task of bookTasks) {
          const parsed = parseBookContentRef(task.content_ref);
          if (!parsed) continue;

          let parentId = bookId;
          let parentTitle = bookTitle;
          let parentType: "book" | "module" | "submodule" = "book";

          if (tree) {
            const found = findParent(tree, parsed.itemId);
            if (found) {
              parentId = found.parentId;
              parentTitle = found.parentTitle;
              parentType = found.parentType;
            }
          }

          const queueItem: ReviewQueueItem = { item_id: parsed.itemId, task };

          if (parentMap.has(parentId)) {
            parentMap.get(parentId)!.items.push(queueItem);
          } else {
            parentMap.set(parentId, {
              parent_id: parentId,
              parent_type: parentType,
              parent_title: parentTitle,
              book_id: bookId,
              book_title: bookTitle,
              items: [queueItem],
            });
          }
        }
      }

      setGroups(Array.from(parentMap.values()));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data review");
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, groups, error, buildGroups };
};
