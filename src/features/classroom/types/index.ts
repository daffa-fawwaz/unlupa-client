/// CLASSROOM TYPES

export interface ClassItem {
  id: string;
  guru_id: string;
  name: string;
  description: string;
  class_code: string;
  type: "book" | "quran";
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateClassPayload {
  name: string;
  description: string;
  type: "book" | "quran";
}

/// CLASSROOM CARD

export type ClassroomCardTone =
  | "blue"
  | "emerald"
  | "amber"
  | "violet"
  | "rose"
  | "indigo"
  | "teal"
  | "cyan"
  | "fuchsia"
  | "pink"
  | "yellow"
  | "lime"
  | "gray";

export type ClassroomCardProps = {
  title: string;
  description?: string;
  teacherName: string;
  memberCount: number;
  bookCount: number;
  nextSessionLabel?: string;
  status?: "active" | "draft" | "archived";
  tone?: ClassroomCardTone;
  coverImage?: string;
  onClick?: () => void;
  onMenuClick?: () => void;
};
