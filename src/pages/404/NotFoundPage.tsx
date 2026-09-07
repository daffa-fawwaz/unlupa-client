import { useAuthStore } from "@/features/auth/stores/auth.store";
import { Link } from "react-router";

export const NotFoundPage = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return (
    <div className="bg-background min-h-screen text-foreground relative flex flex-col items-center justify-center overflow-hidden">
      <div className="relative z-10 text-center px-4">
        {/* Large 404 Text */}
        <h1 className="text-[150px] md:text-[200px] font-display font-bold leading-none text-transparent bg-clip-text bg-linear-to-br from-foreground via-foreground/50 to-transparent opacity-20 select-none">
          404
        </h1>

        <div className="-mt-16 md:-mt-24 space-y-6">
          <h2 className="text-3xl md:text-5xl font-serif text-warning">
            Halaman Tidak Ditemukan
          </h2>

          <p className="text-muted-foreground text-lg md:text-xl max-w-lg mx-auto leading-relaxed">
            Sepertinya Anda telah berkelana terlalu jauh ke ruang angkasa.
            Halaman yang Anda cari tidak ada di galaksi ini.
          </p>

          <div className="pt-8">
            <Link
              to={isAuthenticated ? "/dashboard" : "/"}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground text-sm font-semibold uppercase tracking-wider hover:bg-primary/90 transition group"
            >
              <span>Kembali ke {isAuthenticated ? "Dashboard" : "Home"}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
