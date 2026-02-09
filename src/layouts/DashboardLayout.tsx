import { DashboardSidebar } from "@/components/ui/Sidebar";
import { useState } from "react";
import { Outlet } from "react-router";

export interface DashboardContextType {
  toggleSidebar: () => void;
}

export const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <>
      <div
        className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`}
        onClick={closeSidebar}
      ></div>
      <DashboardSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <main className="flex-1 w-full min-h-screen bg-deep-universe">
        <Outlet context={{ toggleSidebar }} />
      </main>
    </>
  );
};
