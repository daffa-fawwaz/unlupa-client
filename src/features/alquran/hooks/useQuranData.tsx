import { useCallback, useMemo } from "react";
import { useLocalStorage } from "@/features/alquran/hooks/useLocalStorage";
import type {
  QuranDatabase,
  QuranItem,
  ItemStatus,
  LifecycleStats,
} from "../types/quran.types";
import {
  DB_VERSION,
  DB_KEY,
  generateMaterialId,
  generateSystemId,
  TOTAL_QURAN_PAGES,
} from "../constants/quranData";

const initialDatabase: QuranDatabase = {
  version: DB_VERSION,
  items: [],
  materials: {},
};

export function useQuranData() {
  const [db, setDb] = useLocalStorage<QuranDatabase>(DB_KEY, initialDatabase);

  // Add new item
  const addItem = useCallback(
    (
      juz: string,
      surahName: string,
      ayatStart: number,
      ayatEnd: number,
      pageStart: number,
      pageEnd: number,
      time: number,
    ) => {
      const materialId = generateMaterialId(juz, surahName);

      setDb((prevDb) => {
        const newDb = { ...prevDb };

        // Create material if doesn't exist
        if (!newDb.materials[materialId]) {
          newDb.materials[materialId] = {
            id: materialId,
            type: "quran",
            title: surahName,
            meta: { juz },
          };
        }

        // Create new item
        const newItem: QuranItem = {
          id_system: generateSystemId(),
          id_visual: Date.now(),
          material_id: materialId,
          range: {
            ayat: `${ayatStart}-${ayatEnd}`,
            page: `${pageStart}-${pageEnd}`,
          },
          time: {
            value: time,
            unit: "Menit",
          },
          status: "new",
          consolidationDays: 0,
          activeStage: 0,
          stageStreak: 0,
          lastReview: null,
          nextReview: null,
          fingerprint: `A${ayatStart}-${ayatEnd}_P${pageStart}-${pageEnd}`,
        };

        newDb.items.push(newItem);
        return newDb;
      });
    },
    [setDb],
  );

  // Update item status with lifecycle logic
  const updateItemStatus = useCallback(
    (systemId: string, newStatus: ItemStatus) => {
      setDb((prevDb) => {
        const newDb = { ...prevDb };
        const itemIndex = newDb.items.findIndex(
          (item) => item.id_system === systemId,
        );

        if (itemIndex === -1) return prevDb;

        const item = { ...newDb.items[itemIndex] };
        item.status = newStatus;
        item.lastReview = Date.now();

        // Status-specific logic
        if (newStatus === "consolidation") {
          item.consolidationDays = 1;
        } else if (newStatus === "active") {
          item.activeStage = 1;
          item.stageStreak = 0;
          // Next review tomorrow
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          item.nextReview = tomorrow.getTime();
        } else if (newStatus === "maintenance") {
          // Next review in 3 days
          const nextDate = new Date();
          nextDate.setDate(nextDate.getDate() + 3);
          item.nextReview = nextDate.getTime();
        }

        newDb.items[itemIndex] = item;
        return newDb;
      });
    },
    [setDb],
  );

  // Delete item
  const deleteItem = useCallback(
    (systemId: string) => {
      setDb((prevDb) => ({
        ...prevDb,
        items: prevDb.items.filter((item) => item.id_system !== systemId),
      }));
    },
    [setDb],
  );

  // Get items for specific Juz
  const getJuzItems = useCallback(
    (juz: string): QuranItem[] => {
      return db.items.filter((item) => {
        const material = db.materials[item.material_id];
        return material && material.meta.juz === juz;
      });
    },
    [db],
  );

  // Calculate lifecycle stats for a Juz
  const getJuzStats = useCallback(
    (juz: string): LifecycleStats => {
      const items = getJuzItems(juz);
      const stats: LifecycleStats = {
        menghafal: 0,
        murajaah: 0,
        terjaga: 0,
        selesai: 0,
      };

      items.forEach((item) => {
        // Map ItemStatus to LifecycleStats
        if (item.status === "new" || item.status === "memorizing") {
          stats.menghafal++;
        } else if (item.status === "consolidation" || item.status === "active") {
          stats.murajaah++;
        } else if (item.status === "maintenance") {
          stats.terjaga++;
        } else if (item.status === "graduated") {
          stats.selesai++;
        }
      });

      return stats;
    },
    [getJuzItems],
  );

  // Calculate total progress (based on pages in MAINTENANCE or GRADUATED status)
  const calculateProgress = useMemo(() => {
    let totalSafePages = 0;

    db.items.forEach((item) => {
      if (item.status === "maintenance" || item.status === "graduated") {
        try {
          const parts = item.range.page.split("-");
          const start = parseInt(parts[0]);
          const end = parts.length > 1 ? parseInt(parts[1]) : start;
          const pages = end - start + 1;
          totalSafePages += pages;
        } catch (e) {
          console.error("Error calculating pages:", e);
        }
      }
    });

    const juzMastered = (totalSafePages / 20).toFixed(1);
    const percentage = ((totalSafePages / TOTAL_QURAN_PAGES) * 100).toFixed(1);

    return {
      totalPages: totalSafePages,
      juzMastered: parseFloat(juzMastered),
      percentage: parseFloat(percentage),
    };
  }, [db.items]);

  // Get all unique Juz numbers that have items
  const activeJuzList = useMemo(() => {
    const juzSet = new Set<string>();
    db.items.forEach((item) => {
      const material = db.materials[item.material_id];
      if (material) {
        juzSet.add(material.meta.juz);
      }
    });
    return Array.from(juzSet).sort((a, b) => parseInt(a) - parseInt(b));
  }, [db.items, db.materials]);

  return {
    items: db.items,
    materials: db.materials,
    addItem,
    updateItemStatus,
    deleteItem,
    getJuzItems,
    getJuzStats,
    calculateProgress,
    activeJuzList,
  };
}
