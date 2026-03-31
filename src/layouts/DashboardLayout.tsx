import { Sidebar } from "@/components/ui/Sidebar";
import { useState, useEffect } from "react";
import { Outlet } from "react-router";

export interface DashboardContextType {
  toggleSidebar: () => void;
}

export const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  useEffect(() => {
    console.log('[DashboardLayout] MOUNTED');
    return () => {
      console.log('[DashboardLayout] UNMOUNTED');
    };
  }, []);

  useEffect(() => {
    console.log('[DashboardLayout] isSidebarOpen changed:', isSidebarOpen);
  }, [isSidebarOpen]);

  return (
    <>
      <div
        className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`}
        onClick={closeSidebar}
      ></div>
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <main className="flex-1 w-full min-h-screen bg-deep-universe">
        <Outlet context={{ toggleSidebar }} />
      </main>
    </>
  );
};
