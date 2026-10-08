import { BookMarked, FileText, LayoutDashboard, Users } from "@/components/foundations/hugeicons";
import { NavLink, Outlet } from "react-router";
import { SidebarRoleSwitcher } from "@/components/ui/SidebarRoleSwitcher";
import { useApp } from "@/context/AppContext";

const adminNavItems = [
  { to: "/dashboard", labelEn: "Dashboard", labelId: "Dasbor", descriptionEn: "System overview", descriptionId: "Ringkasan sistem", icon: LayoutDashboard, end: true },
  { to: "/dashboard/teacher-requests", labelEn: "Teacher requests", labelId: "Permintaan guru", descriptionEn: "Review applications", descriptionId: "Tinjau pengajuan", icon: FileText },
  { to: "/dashboard/book-requests", labelEn: "Book requests", labelId: "Permintaan buku", descriptionEn: "Review publications", descriptionId: "Tinjau publikasi", icon: BookMarked },
  { to: "/dashboard/user-list", labelEn: "Users", labelId: "Pengguna", descriptionEn: "Manage access", descriptionId: "Kelola akses", icon: Users },
];

function AdminNavCards() {
  const { language } = useApp();
  const isEnglish = language === "en";

  return (
    <nav aria-label={isEnglish ? "Admin navigation" : "Navigasi admin"} className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {adminNavItems.map(({ to, labelEn, labelId, descriptionEn, descriptionId, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `group flex min-w-0 items-center gap-2.5 rounded-2xl border px-3 py-2.5 shadow-xs transition-all duration-150 ${
              isActive
                ? "border-brand-300 bg-brand-50 text-brand-700 ring-1 ring-brand-200"
                : "border-secondary bg-primary text-primary hover:border-brand-200 hover:bg-primary_hover"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div
                className={`flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                  isActive ? "bg-brand-solid text-white" : "bg-secondary text-fg-quaternary group-hover:bg-brand-50 group-hover:text-brand-700"
                }`}
              >
                <Icon className="size-4.5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold tracking-tight">{isEnglish ? labelEn : labelId}</p>
                <p className={`mt-0.5 truncate text-[11px] ${isActive ? "text-brand-700" : "text-tertiary"}`}>
                  {isEnglish ? descriptionEn : descriptionId}
                </p>
              </div>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

export function AdminSectionLayout({ children }: { children?: React.ReactNode }) {
  const { language } = useApp();
  const isEnglish = language === "en";

  return (
    <div className="mx-auto min-h-screen max-w-7xl bg-primary px-3 py-5 text-primary transition-colors sm:px-6 md:px-10 md:py-8">
      <header className="mb-7 space-y-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-primary md:text-3xl">
            {isEnglish ? "Admin control center" : "Pusat kontrol admin"}
          </h1>
          <p className="mt-1 text-sm text-secondary">
            {isEnglish ? "Manage platform operations and review incoming requests." : "Kelola operasional platform dan tinjau permintaan yang masuk."}
          </p>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1fr_15rem] lg:items-start">
          <AdminNavCards />
          <aside className="rounded-2xl border border-secondary bg-primary p-2.5 shadow-xs">
            <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-wider text-tertiary">
              {isEnglish ? "Account mode" : "Mode akun"}
            </p>
            <SidebarRoleSwitcher />
          </aside>
        </div>
      </header>

      {children ?? <Outlet />}
    </div>
  );
}
