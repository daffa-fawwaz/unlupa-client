import { useAuthStore } from "@/features/auth/stores/auth.store";
import { LogOut } from "lucide-react";

export const LogoutConfirmModal = ({
  setShowLogoutConfirm,
}: {
  setShowLogoutConfirm: (value: boolean) => void;
}) => {
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="fixed inset-0 z-99 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl p-6 max-w-sm w-full shadow-2xl space-y-4">
        <div className="flex items-center gap-3 text-destructive">
          <LogOut className="w-6 h-6" />
          <h3 className="font-serif font-bold text-lg">Konfirmasi Keluar</h3>
        </div>

        <p className="text-muted-foreground text-sm">
          Apakah Anda yakin ingin keluar dari aplikasi?
        </p>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => setShowLogoutConfirm(false)}
            className="flex-1 px-4 py-2 rounded-lg bg-surface-1 hover:bg-surface-2 text-foreground text-sm font-medium transition cursor-pointer"
          >
            Tidak
          </button>
          <button
            onClick={() => logout()}
            className="flex-1 px-4 py-2 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive text-sm font-medium border border-destructive/20 transition cursor-pointer"
          >
            Ya, Keluar
          </button>
        </div>
      </div>
    </div>
  );
};
