import { LogOut, Settings } from "lucide-react";

export const DashboardSidebarFooter = ({
  setShowLogoutConfirm,
}: {
  setShowLogoutConfirm: (value: boolean) => void;
}) => {
  return (
    <div className="mt-4 pt-6 border-t border-white/10 space-y-2">
      <button className="flex items-center gap-3 px-2 py-2 w-full rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition cursor-pointer">
        <Settings className="w-4 h-4" />
        <span className="text-sm">Pengaturan</span>
      </button>
      <button
        onClick={() => setShowLogoutConfirm(true)}
        className="flex items-center gap-3 px-2 py-2 w-full rounded-lg text-red-400 hover:bg-red-900/20 transition cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        <span className="text-sm">Keluar</span>
      </button>
    </div>
  );
};
