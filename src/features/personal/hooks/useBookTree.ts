import { useCallback, useState } from "react";
import { personalService } from "@/features/personal/services/personal.services";
import type { BookTree, BookItem, Module } from "@/features/personal/types/personal.types";

// Cache for book trees to avoid refetching
const bookTreeCache = new Map<string, BookTree>();
const itemToBookMap = new Map<string, string>(); // itemId -> bookId

// Expose cache invalidation globally so review flow can clear stale data
export const invalidateBookTreeCache = (bookId?: string) => {
  if (bookId) {
    bookTreeCache.delete(bookId);
  } else {
    bookTreeCache.clear();
  }
};

// Update review_count for a specific item in the cache
export const updateItemReviewCountInCache = (bookId: string, itemId: string, reviewCount: number) => {
  const cached = bookTreeCache.get(bookId);
  if (!cached) return;

  const updateItems = (items: BookItem[]) =>
    items.map((i) => i.id === itemId ? { ...i, review_count: reviewCount } : i);

  const updateModules = (modules: Module[]): Module[] =>
    modules.map((m) => ({
      ...m,
      items: m.items ? updateItems(m.items) : m.items,
      children: m.children?.length ? updateModules(m.children) : m.children,
    }));

  const updated: BookTree = {
    ...cached,
    items: updateItems(cached.items),
    modules: updateModules(cached.modules),
  };
  bookTreeCache.set(bookId, updated);
};

// Update status for a specific item in the cache (optimistic update)
export const updateItemStatusInCache = (bookId: string, itemId: string, status: BookItem["status"]) => {
  const cached = bookTreeCache.get(bookId);
  if (!cached) return;

  const updateItems = (items: BookItem[]) =>
    items.map((i) => i.id === itemId ? { ...i, status } : i);

  const updateModules = (modules: Module[]): Module[] =>
    modules.map((m) => ({
      ...m,
      items: m.items ? updateItems(m.items) : m.items,
      children: m.children?.length ? updateModules(m.children) : m.children,
    }));

  bookTreeCache.set(bookId, {
    ...cached,
    items: updateItems(cached.items),
    modules: updateModules(cached.modules),
  });
};

export const useBookTree = () => {
  const [tree, setTree] = useState<BookTree | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookTree = useCallback(async (bookId: string, forceRefresh = false): Promise<BookTree | null> => {
    // Return from cache if available and not forcing refresh
    if (!forceRefresh && bookTreeCache.has(bookId)) {
      const cached = bookTreeCache.get(bookId) || null;
      setTree(cached);
      return cached;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await personalService.getBookTree(bookId);
      const bookTree = response.data;
      
      // Cache the book tree
      bookTreeCache.set(bookId, bookTree);
      setTree(bookTree);
      
      // Map all items in this book to the bookId
      bookTree.items.forEach(item => {
        itemToBookMap.set(item.id, bookId);
      });
      
      // Also map items in modules
      const mapModuleItems = (modules: BookTree['modules']) => {
        modules.forEach(module => {
          if (module.items) {
            module.items.forEach(item => {
              itemToBookMap.set(item.id, bookId);
            });
          }
          if (module.children && module.children.length > 0) {
            mapModuleItems(module.children);
          }
        });
      };
      mapModuleItems(bookTree.modules);
      
      return bookTree;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch book tree";
      setError(errorMessage);
      console.error("Failed to fetch book tree:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getBookTree = useCallback(async (bookId: string): Promise<BookTree | null> => {
    return fetchBookTree(bookId);
  }, [fetchBookTree]);

  const getItemFromTree = useCallback((itemId: string): BookItem | null => {
    const bookId = itemToBookMap.get(itemId);
    if (bookId) {
      const bookTree = bookTreeCache.get(bookId);
      if (bookTree) {
        const foundItem = bookTree.items.find(item => item.id === itemId);
        if (foundItem) return foundItem;
        
        const searchInModules = (modules: BookTree['modules']): BookItem | null => {
          for (const module of modules) {
            if (module.items) {
              const found = module.items.find(item => item.id === itemId);
              if (found) return found;
            }
            if (module.children && module.children.length > 0) {
              const found = searchInModules(module.children);
              if (found) return found;
            }
          }
          return null;
        };
        
        return searchInModules(bookTree.modules);
      }
    }
    
    return null;
  }, []);

  const clearCache = useCallback(() => {
    bookTreeCache.clear();
    itemToBookMap.clear();
    setTree(null);
  }, []);

  const addItemToTree = useCallback((bookId: string, newItem: BookTree['items'][0]) => {
    const cached = bookTreeCache.get(bookId);
    if (cached) {
      const updatedTree: BookTree = {
        ...cached,
        items: [...cached.items, newItem],
      };
      bookTreeCache.set(bookId, updatedTree);
      setTree(updatedTree);
      itemToBookMap.set(newItem.id, bookId);
    }
  }, []);

  // Add a new module to the tree state immediately (optimistic update)
  const addModuleToTree = useCallback((bookId: string, newModule: Module) => {
    const cached = bookTreeCache.get(bookId);
    if (cached) {
      const updatedTree: BookTree = {
        ...cached,
        modules: [...cached.modules, newModule],
      };
      bookTreeCache.set(bookId, updatedTree);
      setTree(updatedTree);
    }
  }, []);

  // Add an item to a specific module in the tree (optimistic update)
  const addItemToModule = useCallback((bookId: string, moduleId: string, newItem: BookItem) => {
    const cached = bookTreeCache.get(bookId);
    if (cached) {
      const updateModules = (modules: Module[]): Module[] =>
        modules.map((m) => {
          if (m.id === moduleId) {
            return { ...m, items: [...(m.items ?? []), newItem] };
          }
          if (m.children?.length) {
            return { ...m, children: updateModules(m.children) };
          }
          return m;
        });

      const updatedTree: BookTree = {
        ...cached,
        modules: updateModules(cached.modules),
      };
      bookTreeCache.set(bookId, updatedTree);
      setTree(updatedTree);
      itemToBookMap.set(newItem.id, bookId);
    }
  }, []);

  // Add a child module to a parent module in the tree (optimistic update)
  const addChildModuleToTree = useCallback((bookId: string, parentId: string, newModule: Module) => {
    const cached = bookTreeCache.get(bookId);
    if (cached) {
      const updateModules = (modules: Module[]): Module[] =>
        modules.map((m) => {
          if (m.id === parentId) {
            return { ...m, children: [...(m.children ?? []), newModule] };
          }
          if (m.children?.length) {
            return { ...m, children: updateModules(m.children) };
          }
          return m;
        });

      const updatedTree: BookTree = {
        ...cached,
        modules: updateModules(cached.modules),
      };
      bookTreeCache.set(bookId, updatedTree);
      setTree(updatedTree);
    }
  }, []);

  const removeItemFromTree = useCallback((bookId: string, itemId: string) => {
    const cached = bookTreeCache.get(bookId);
    if (cached) {
      const updatedTree: BookTree = {
        ...cached,
        items: cached.items.filter(item => item.id !== itemId),
      };
      bookTreeCache.set(bookId, updatedTree);
      setTree(updatedTree);
      itemToBookMap.delete(itemId);
    }
  }, []);

  return { tree, getBookTree, getItemFromTree, fetchBookTree, clearCache, addItemToTree, addModuleToTree, addItemToModule, addChildModuleToTree, removeItemFromTree, loading, error };
};
