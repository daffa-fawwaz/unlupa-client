import { useAuthStore } from "@/features/auth/stores/auth.store";
import { useDashboardModeStore } from "@/features/dashboard/stores/dashboard-mode.store";
import { useNavigate } from "react-router";
import {
  ChevronDown,
  GraduationCap,
  BookOpen,
  ShieldCheck,
  Check,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { clsx } from "clsx";
import { useApp } from "@/context/AppContext";

interface SidebarRoleSwitcherProps {
  onClose?: () => void;
}

type DashboardRole = "student" | "teacher" | "admin";

export const SidebarRoleSwitcher = ({ onClose }: SidebarRoleSwitcherProps) => {
  const navigate = useNavigate();
  const userRole = useAuthStore((state) => state.user?.role);
  const activeRole = useDashboardModeStore((state) => state.activeRole);
  const setActiveRole = useDashboardModeStore((state) => state.setActiveRole);
  const { language } = useApp();
  const isEnglish = language === "en";

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Configuration for each role
  const roleConfig: Record<DashboardRole, {
    labelEn: string;
    labelId: string;
    helperEn: string;
    helperId: string;
    icon: typeof GraduationCap;
    color: string;
    bg: string;
    activeBg: string;
  }> = {
    student: {
      labelEn: "Student",
      labelId: "Pelajar",
      helperEn: "Learning mode",
      helperId: "Mode belajar",
      icon: GraduationCap,
      color: "text-success",
      bg: "bg-success/10",
      activeBg: "bg-success/10",
    },
    teacher: {
      labelEn: "Teacher",
      labelId: "Guru",
      helperEn: "Teaching mode",
      helperId: "Mode mengajar",
      icon: BookOpen,
      color: "text-warning",
      bg: "bg-warning/10",
      activeBg: "bg-warning/10",
    },
    admin: {
      labelEn: "Admin",
      labelId: "Admin",
      helperEn: "System control",
      helperId: "Kontrol sistem",
      icon: ShieldCheck,
      color: "text-brand-700",
      bg: "bg-brand-50",
      activeBg: "bg-brand-50",
    },
  };

  const currentRole = (activeRole || "student") as DashboardRole;
  const currentConfig = roleConfig[currentRole] || roleConfig.student;
  const RoleIcon = currentConfig.icon;

  const availableRoles: DashboardRole[] = [];
  if (userRole === "student") availableRoles.push("student");
  if (userRole === "teacher") availableRoles.push("student", "teacher");
  if (userRole === "admin") availableRoles.push("student", "teacher", "admin");

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "group flex w-full items-center justify-between rounded-xl border border-secondary bg-primary p-2 text-left shadow-xs transition-all duration-200",
          "hover:border-brand/50 hover:bg-primary_hover hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
          isOpen && "border-brand bg-brand-50/60 ring-1 ring-brand",
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={clsx(
              "flex size-9 items-center justify-center rounded-lg transition-colors",
              currentConfig.bg,
              currentConfig.color,
            )}
          >
            <RoleIcon className="size-4.5" />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-tertiary">
              Mode
            </p>
            <p className="text-sm font-semibold text-primary">
              {isEnglish ? currentConfig.labelEn : currentConfig.labelId}
            </p>
          </div>
        </div>

        <ChevronDown
          className={clsx(
            "size-4 text-fg-quaternary transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl border border-secondary bg-primary p-2 shadow-xl animate-in zoom-in-95 duration-150">
          <div className="space-y-1">
            {availableRoles.map((role) => {
              const config = roleConfig[role];
              const Icon = config.icon;
              const isActive = activeRole === role;

              return (
                <button
                  type="button"
                  key={role}
                  onClick={() => {
                    setActiveRole(role);
                    setIsOpen(false);
                    onClose?.();
                    if (role === "student") {
                      navigate("/dashboard/alquran");
                    } else if (role === "teacher") {
                      navigate("/dashboard/kelas");
                    } else {
                      navigate("/dashboard");
                    }
                  }}
                  className={clsx(
                    "flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-all",
                    isActive
                      ? "bg-brand-50 text-brand-700"
                      : "text-secondary hover:bg-primary_hover hover:text-primary",
                  )}
                >
                  <div className={clsx("flex size-9 items-center justify-center rounded-lg", isActive ? config.activeBg : "bg-secondary")}>
                    <Icon className={clsx("size-4", isActive ? config.color : "text-fg-quaternary")} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{isEnglish ? config.labelEn : config.labelId}</p>
                    <p className={clsx("text-xs", isActive ? "text-brand-700" : "text-tertiary")}>
                      {isEnglish ? config.helperEn : config.helperId}
                    </p>
                  </div>
                  {isActive && (
                    <Check className="size-4 text-brand-700" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
