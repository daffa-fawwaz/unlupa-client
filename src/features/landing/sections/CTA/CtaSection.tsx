import { Link } from "react-router";

export const CtaSection = () => {
  return (
    <section id="cta" className="py-24 md:py-32 bg-primary/5 border-y border-primary/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-widest text-primary">Siap Memulai?</span>
        </div>

        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.05] tracking-tight mb-6">
          Ilmu Anda Berhak<br />Terjaga.
        </h2>

        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12">
          Bergabunglah dengan ribuan pelajar yang telah memilih UNLUPA untuk menjaga ilmu mereka.
          Mulai dari nol biaya bulan pertama, kontribusi bebas sesuai kemampuan.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-4 text-lg font-bold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors w-full sm:w-auto"
          >
            Mulai Menjaga Ilmu
            <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            to="#metode"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#metode")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-8 py-4 text-lg font-medium text-foreground hover:text-primary border border-border rounded-lg transition-colors w-full sm:w-auto"
          >
            Pelajari Metodenya Dulu
          </Link>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Bulan pertama bebas kontribusi. Batalkan kapan saja.
        </p>
      </div>
    </section>
  );
};
