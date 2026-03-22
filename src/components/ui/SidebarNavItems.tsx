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
                ? "bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
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
                    ? "bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
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
                    ? "bg-violet-500/10 text-violet-400 border border-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
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
                    ? "bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`
              }
            >
              <Users className="w-4 h-4 group-hover:text-amber-500 transition-colors" />
              <span className="text-sm font-medium">Users</span>
            </NavLink>
          </>
        )}
      </nav>
    </div>
  );
};
