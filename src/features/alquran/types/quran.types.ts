// CREATE JUZ

export interface CreateJuzResponse {
  status: number;
  message: string;
  data: DataJuz;
  timestamp: string;
  path: string;
}

export interface DataJuz {
  ID: string;
  UserID: string;
  Index: number;
  CreatedAt: string;
}

// Enum for item lifecycle status
// Item lifecycle status type
export type ItemStatus =
  | "new"
  | "memorizing"
  | "consolidation"
  | "active"
  | "maintenance"
  | "graduated";

// Surah information
export interface SurahInfo {
  n: string; // Name
  a: number; // Total ayat
}

// Juz page range
export interface JuzPageRange {
  min: number;
  max: number;
}

// Material (Juz/Surah metadata)
export interface Material {
  id: string;
  type: "quran";
  title: string;
  meta: {
    juz: string;
  };
}

// Main Quran item
export interface QuranItem {
  id_system: string;
  id_visual: number;
  material_id: string;
  range: {
    ayat: string; // e.g., "1-7"
    page: string; // e.g., "1-2"
  };
  time: {
    value: number;
    unit: string;
  };
  status: ItemStatus;
  consolidationDays: number;
  activeStage: number;
  stageStreak: number;
  lastReview: number | null;
  nextReview: number | null;
  fingerprint: string;
}

// Database structure
export interface QuranDatabase {
  version: number;
  items: QuranItem[];
  materials: Record<string, Material>;
}

// Draft for creating new item
export interface QuranDraft {
  juz: string;
  surahIdx: string;
  surahName: string;
  ayatStart: number;
  ayatEnd: number;
  pageStart: number;
  pageEnd: number;
  time: number;
}

// Lifecycle statistics
export interface LifecycleStats {
  new: number;
  memorizing: number;
  consolidation: number;
  active: number;
  maintenance: number;
  graduated: number;
}
