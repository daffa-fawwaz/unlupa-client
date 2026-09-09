import { useEffect, useState } from "react";
import { personalService } from "@/features/personal/services/personal.services";
import {
  findBookItemOrigin,
  parseBookContentRef,
  type BookItemOrigin,
} from "@/features/personal/utils/bookReviewUtils";
import type { BookTree } from "@/features/personal/types/personal.types";

const originTreeCache = new Map<string, BookTree>();

export const useBookItemOrigin = (contentRef?: string | null) => {
  const [origin, setOrigin] = useState<BookItemOrigin | null>(null);

  useEffect(() => {
    let active = true;

    const parsed = parseBookContentRef(contentRef ?? "");
    if (!parsed) return () => {
      active = false;
    };

    const { bookId, itemId } = parsed;

    const load = async () => {
      let tree: BookTree | undefined = originTreeCache.get(bookId);
      if (!tree) {
        try {
          const res = await personalService.getBookTree(bookId);
          tree = res.data;
          originTreeCache.set(bookId, tree);
        } catch {
          tree = undefined;
        }
      }
      if (!active) return;
      setOrigin(tree ? findBookItemOrigin(tree, itemId) : null);
    };

    void load();

    return () => {
      active = false;
    };
  }, [contentRef]);

  return origin;
};