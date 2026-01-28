import { create } from "zustand";

export type DashboardRole = "student" | "teacher" | "admin";

interface DashboardModeState {
  activeRole: DashboardRole;
  setActiveRole: (role: DashboardRole) => void;
  reset: () => void;
}

export const useDashboardModeStore = create<DashboardModeState>((set) => ({
  activeRole: "student",
  setActiveRole: (role: DashboardRole) => set({ activeRole: role }),
  reset: () => set({ activeRole: "student" }),
}));