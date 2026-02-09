import type { SurahInfo, JuzPageRange } from "../types/quran.types";

// Database version
export const DB_VERSION = 18;
export const DB_KEY = "baqen_quran_final_v18";

// Complete Surah mapping for all 30 Juz
export const SURAH_MAP: Record<string, SurahInfo[]> = {
  "1": [
    { n: "Al-Fatihah", a: 7 },
    { n: "Al-Baqarah (1-141)", a: 141 },
  ],
  "2": [{ n: "Al-Baqarah (142-252)", a: 252 }],
  "3": [
    { n: "Al-Baqarah (253-286)", a: 286 },
    { n: "Ali 'Imran (1-92)", a: 92 },
  ],
  "4": [
    { n: "Ali 'Imran (93-200)", a: 200 },
    { n: "An-Nisa' (1-23)", a: 23 },
  ],
  "5": [{ n: "An-Nisa' (24-147)", a: 147 }],
  "6": [
    { n: "An-Nisa' (148-176)", a: 176 },
    { n: "Al-Ma'idah (1-81)", a: 81 },
  ],
  "7": [
    { n: "Al-Ma'idah (82-120)", a: 120 },
    { n: "Al-An'am (1-110)", a: 110 },
  ],
  "8": [
    { n: "Al-An'am (111-165)", a: 165 },
    { n: "Al-A'raf (1-87)", a: 87 },
  ],
  "9": [
    { n: "Al-A'raf (88-206)", a: 206 },
    { n: "Al-Anfal (1-40)", a: 40 },
  ],
  "10": [
    { n: "Al-Anfal (41-75)", a: 75 },
    { n: "At-Taubah (1-92)", a: 92 },
  ],
  "11": [
    { n: "At-Taubah (93-129)", a: 129 },
    { n: "Yunus", a: 109 },
    { n: "Hud (1-5)", a: 5 },
  ],
  "12": [
    { n: "Hud (6-123)", a: 123 },
    { n: "Yusuf (1-52)", a: 52 },
  ],
  "13": [
    { n: "Yusuf (53-111)", a: 111 },
    { n: "Ar-Ra'd", a: 43 },
    { n: "Ibrahim (1-52)", a: 52 },
  ],
  "14": [
    { n: "Al-Hijr", a: 99 },
    { n: "An-Nahl (1-128)", a: 128 },
  ],
  "15": [
    { n: "Al-Isra'", a: 111 },
    { n: "Al-Kahfi (1-74)", a: 74 },
  ],
  "16": [
    { n: "Al-Kahfi (75-110)", a: 110 },
    { n: "Maryam", a: 98 },
    { n: "Taha", a: 135 },
  ],
  "17": [
    { n: "Al-Anbiya'", a: 112 },
    { n: "Al-Hajj", a: 78 },
  ],
  "18": [
    { n: "Al-Mu'minun", a: 118 },
    { n: "An-Nur", a: 64 },
    { n: "Al-Furqan (1-20)", a: 20 },
  ],
  "19": [
    { n: "Al-Furqan (21-77)", a: 77 },
    { n: "Asy-Syu'ara'", a: 227 },
    { n: "An-Naml (1-55)", a: 55 },
  ],
  "20": [
    { n: "An-Naml (56-93)", a: 93 },
    { n: "Al-Qasas", a: 88 },
    { n: "Al-Ankabut (1-45)", a: 45 },
  ],
  "21": [
    { n: "Al-Ankabut (46-69)", a: 69 },
    { n: "Ar-Rum", a: 60 },
    { n: "Luqman", a: 34 },
    { n: "As-Sajdah", a: 30 },
    { n: "Al-Ahzab (1-30)", a: 30 },
  ],
  "22": [
    { n: "Al-Ahzab (31-73)", a: 73 },
    { n: "Saba'", a: 54 },
    { n: "Fatir", a: 45 },
    { n: "Yasin (1-27)", a: 27 },
  ],
  "23": [
    { n: "Yasin (28-83)", a: 83 },
    { n: "As-Saffat", a: 182 },
    { n: "Sad", a: 88 },
    { n: "Az-Zumar (1-31)", a: 31 },
  ],
  "24": [
    { n: "Az-Zumar (32-75)", a: 75 },
    { n: "Ghafir", a: 85 },
    { n: "Fussilat (1-46)", a: 46 },
  ],
  "25": [
    { n: "Fussilat (47-54)", a: 54 },
    { n: "Asy-Syura", a: 53 },
    { n: "Az-Zukhruf", a: 89 },
    { n: "Ad-Dukhan", a: 59 },
    { n: "Al-Jasiyah", a: 37 },
  ],
  "26": [
    { n: "Al-Ahqaf", a: 35 },
    { n: "Muhammad", a: 38 },
    { n: "Al-Fath", a: 29 },
    { n: "Al-Hujurat", a: 18 },
    { n: "Qaf", a: 45 },
    { n: "Az-Zariyat (1-30)", a: 30 },
  ],
  "27": [
    { n: "Az-Zariyat (31-60)", a: 60 },
    { n: "At-Tur", a: 49 },
    { n: "An-Najm", a: 62 },
    { n: "Al-Qamar", a: 55 },
    { n: "Ar-Rahman", a: 78 },
    { n: "Al-Waqi'ah", a: 96 },
    { n: "Al-Hadid", a: 29 },
  ],
  "28": [
    { n: "Al-Mujadilah", a: 22 },
    { n: "Al-Hasyr", a: 24 },
    { n: "Al-Mumtahanah", a: 13 },
    { n: "As-Saff", a: 14 },
    { n: "Al-Jumu'ah", a: 11 },
    { n: "Al-Munafiqun", a: 11 },
    { n: "At-Taghabun", a: 18 },
    { n: "At-Talaq", a: 12 },
    { n: "At-Tahrim", a: 12 },
  ],
  "29": [
    { n: "Al-Mulk", a: 30 },
    { n: "Al-Qalam", a: 52 },
    { n: "Al-Haqqah", a: 52 },
    { n: "Al-Ma'arij", a: 44 },
    { n: "Nuh", a: 28 },
    { n: "Al-Jinn", a: 28 },
    { n: "Al-Muzzammil", a: 20 },
    { n: "Al-Muddassir", a: 56 },
    { n: "Al-Qiyamah", a: 40 },
    { n: "Al-Insan", a: 31 },
    { n: "Al-Mursalat", a: 50 },
  ],
  "30": [
    { n: "An-Naba", a: 40 },
    { n: "An-Nazi'at", a: 46 },
    { n: "Abasa", a: 42 },
    { n: "At-Takwir", a: 29 },
    { n: "Al-Infitar", a: 19 },
    { n: "Al-Mutaffifin", a: 36 },
    { n: "Al-Insyiqaq", a: 25 },
    { n: "Al-Buruj", a: 22 },
    { n: "At-Tariq", a: 17 },
    { n: "Al-A'la", a: 19 },
    { n: "Al-Ghasyiyah", a: 26 },
    { n: "Al-Fajr", a: 30 },
    { n: "Al-Balad", a: 20 },
    { n: "Asy-Syams", a: 15 },
    { n: "Al-Lail", a: 21 },
    { n: "Ad-Duha", a: 11 },
    { n: "Al-Insyirah", a: 8 },
    { n: "At-Tin", a: 8 },
    { n: "Al-'Alaq", a: 19 },
    { n: "Al-Qadr", a: 5 },
    { n: "Al-Bayyinah", a: 8 },
    { n: "Az-Zalzalah", a: 8 },
    { n: "Al-'Adiyat", a: 11 },
    { n: "Al-Qari'ah", a: 11 },
    { n: "At-Takatsur", a: 8 },
    { n: "Al-'Asr", a: 3 },
    { n: "Al-Humazah", a: 9 },
    { n: "Al-Fil", a: 5 },
    { n: "Quraisy", a: 4 },
    { n: "Al-Ma'un", a: 7 },
    { n: "Al-Kautsar", a: 3 },
    { n: "Al-Kafirun", a: 6 },
    { n: "An-Nasr", a: 3 },
    { n: "Al-Lahab", a: 5 },
    { n: "Al-Ikhlas", a: 4 },
    { n: "Al-Falaq", a: 5 },
    { n: "An-Nas", a: 6 },
  ],
};

// Page ranges for each Juz (1-604 pages total)
export const PAGE_DATABASE: Record<string, JuzPageRange> = {
  "1": { min: 1, max: 21 },
  "2": { min: 22, max: 41 },
  "3": { min: 42, max: 61 },
  "4": { min: 62, max: 81 },
  "5": { min: 82, max: 101 },
  "6": { min: 102, max: 121 },
  "7": { min: 122, max: 141 },
  "8": { min: 142, max: 161 },
  "9": { min: 162, max: 181 },
  "10": { min: 182, max: 201 },
  "11": { min: 202, max: 221 },
  "12": { min: 222, max: 241 },
  "13": { min: 242, max: 261 },
  "14": { min: 262, max: 281 },
  "15": { min: 282, max: 301 },
  "16": { min: 302, max: 321 },
  "17": { min: 322, max: 341 },
  "18": { min: 342, max: 361 },
  "19": { min: 362, max: 381 },
  "20": { min: 382, max: 401 },
  "21": { min: 402, max: 421 },
  "22": { min: 422, max: 441 },
  "23": { min: 442, max: 461 },
  "24": { min: 462, max: 481 },
  "25": { min: 482, max: 501 },
  "26": { min: 502, max: 521 },
  "27": { min: 522, max: 541 },
  "28": { min: 542, max: 561 },
  "29": { min: 562, max: 581 },
  "30": { min: 582, max: 604 },
};

// Total pages in Quran
export const TOTAL_QURAN_PAGES = 604;

// Helper function to generate material ID
export function generateMaterialId(juz: string, surahName: string): string {
  const cleanName = surahName.toUpperCase().replace(/[^A-Z0-9]+/g, "_");
  return `QURAN_JUZ_${juz}_SURAH_${cleanName}`;
}

// Helper function to generate system ID
export function generateSystemId(): string {
  return "itm_" + crypto.randomUUID();
}
