import { useCallback, useState } from "react";
import { personalService } from "@/features/personal/services/personal.services";
import type { BookTree, BookItem } from "@/features/personal/types/personal.types";

// Cache for book trees to avoid refetching
const bookTreeCache = new Map<string, BookTree>();
const itemToBookMap = new Map<string, string>(); // itemId -> bookId

export const useBookTree = () => {
  const [tree, setTree] = useState<BookTree | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookTree = useCallback(async (bookId: string): Promise<BookTree | null> => {
    // Return from cache if available
    if (bookTreeCache.has(bookId)) {
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
    // First, try to find which book this item belongs to
    const bookId = itemToBookMap.get(itemId);
    if (bookId) {
      const bookTree = bookTreeCache.get(bookId);
      if (bookTree) {
        // Search in book items
        const foundItem = bookTree.items.find(item => item.id === itemId);
        if (foundItem) return foundItem;
        
        // Search in modules
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

  return { tree, getBookTree, getItemFromTree, fetchBookTree, clearCache, addItemToTree, removeItemFromTree, loading, error };
};
