/// CLASSROOM TYPES

export interface ClassItem {
  id: string;
  guru_id: string;
  name: string;
  description: string;
  cover_image?: string | null;
  class_code: string;
  type: "book" | "quran";
  is_active: boolean;
  owner_name: string;
  student_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateClassPayload {
  name: string;
  description: string;
  type: "book" | "quran";
  cover_image?: File | string;
}

export interface JoinClassPayload {
  code: string
}

export interface UpdateClassPayload {
  name?: string;
  description?: string;
  type: "book" | "quran";
  cover_image?: File | string;
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
  coverImage?: string | null;
  onClick?: () => void;
  onMenuClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export type CreateClassButtonProps = {
  onClick?: () => void;
};
