/// CLASSROOM CARD

export type ClassroomCardTone = "blue" | "emerald" | "amber" | "violet";

export type ClassroomCardProps = {
  title: string;
  description?: string;
  teacherName: string;
  memberCount: number;
  bookCount: number;
  activeReviewCount: number;
  nextSessionLabel?: string;
  status?: "active" | "draft" | "archived";
  tone?: ClassroomCardTone;
  coverImage?: string;
  onClick?: () => void;
  onMenuClick?: () => void;
};
