import { LayoutDashboard, FileText, Users, BookOpen } from "lucide-react";
import { NavLink } from "react-router";
import { useAuthStore } from "@/features/auth/stores/auth.store";

export const SidebarNavItems = () => {
  const role = useAuthStore((s) => s.user?.role);

  return (
    <div className="flex flex-col gap-2">
      <nav className="flex flex-col space-y-1">
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group ${
              isActive
                ? "bg-primary/10 text-primary border border-primary/20"
                : "text-muted-foreground hover:text-foreground hover:bg-surface-1 border border-transparent"
            }`
          }
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="text-sm font-medium">Dashboard</span>
        </NavLink>

        {role === "admin" && (
          <>
            <NavLink
              to="/dashboard/teacher-requests"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface-1 border border-transparent"
                }`
              }
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">Teacher Requests</span>
            </NavLink>

            <NavLink
              to="/dashboard/book-requests"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface-1 border border-transparent"
                }`
              }
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-sm font-medium">Book Requests</span>
            </NavLink>

            <NavLink
              to="/dashboard/user-list"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface-1 border border-transparent"
                }`
              }
            >
              <Users className="w-4 h-4 group-hover:text-primary transition-colors" />
              <span className="text-sm font-medium">Users</span>
            </NavLink>
          </>
        )}
      </nav>
    </div>
  );
};
