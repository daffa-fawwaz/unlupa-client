import {
  BookHeart,
  GraduationCap,
  Presentation,
  Compass,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export const InklusivitasSection = () => {
  return (
    <section
      id="untuk-siapa"
      className="relative w-full max-w-6xl px-6 md:px-12 py-32 z-10 mx-auto"
    >
      {/* Connector */}
      <div className="pointer-events-none absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-linear-to-b from-transparent via-foreground/10 to-transparent"></div>

      {/* HEADER */}
      <div className="text-center mb-24">
        <p className="font-display text-primary text-xs tracking-[0.3em] uppercase mb-6 flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>{" "}
          Inklusivitas{" "}
          <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
        </p>
        <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-4 leading-tight tracking-tight">
          UNLUPA Dibangun Untuk Mereka <br />
          <span className="text-muted-foreground font-light italic">
            Yang Tidak Ingin Ilmunya Hilang
          </span>
        </h2>
        <div className="w-24 h-px bg-linear-to-r from-transparent via-primary/80 to-transparent mx-auto mt-8 mb-8"></div>
        <p className="text-muted-foreground font-light text-sm tracking-wide">
          Apa pun latar belakang belajarnya
        </p>
      </div>

      {/* GRID SECTORS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* 1. Pembelajar Al-Qur'an (Success) */}
        <div className="bg-card border border-border p-8 rounded-2xl flex items-start gap-6 group cursor-default shadow-sm hover:border-success/40 transition-colors">
          <div className="w-14 h-14 rounded-xl bg-success/10 flex items-center justify-center shrink-0 text-success">
            <BookHeart className="w-7 h-7 transition-all duration-300" />
          </div>
          <div>
            <h3 className="text-xl font-serif text-foreground mb-2 leading-snug">
              Pembelajar Al-Qur’an
            </h3>
            <p className="text-muted-foreground text-sm font-light leading-relaxed">
              Yang ingin menjaga hafalan tanpa tekanan berlebih dan tanpa rasa
              putus asa di tengah jalan.
            </p>
          </div>
        </div>

        {/* 2. Pelajar & Mahasiswa (Info) */}
        <div className="bg-card border border-border p-8 rounded-2xl flex items-start gap-6 group cursor-default shadow-sm hover:border-info/40 transition-colors">
          <div className="w-14 h-14 rounded-xl bg-info/10 flex items-center justify-center shrink-0 text-info">
            <GraduationCap className="w-7 h-7 transition-all duration-300" />
          </div>
          <div>
            <h3 className="text-xl font-serif text-foreground mb-2 leading-snug">
              Pelajar & Mahasiswa
            </h3>
            <p className="text-muted-foreground text-sm font-light leading-relaxed">
              Yang lelah belajar mati-matian hanya untuk ujian, lalu melupakan
              semuanya begitu saja.
            </p>
          </div>
        </div>

        {/* 3. Guru & Pengajar (Warning) */}
        <div className="bg-card border border-border p-8 rounded-2xl flex items-start gap-6 group cursor-default shadow-sm hover:border-warning/40 transition-colors">
          <div className="w-14 h-14 rounded-xl bg-warning/10 flex items-center justify-center shrink-0 text-warning">
            <Presentation className="w-7 h-7 transition-all duration-300" />
          </div>
          <div>
            <h3 className="text-xl font-serif text-foreground mb-2 leading-snug">
              Guru & Pengajar
            </h3>
            <p className="text-muted-foreground text-sm font-light leading-relaxed">
              Yang ingin membimbing murid dengan data yang akurat, bukan sekadar
              dengan emosi atau tebakan.
            </p>
          </div>
        </div>

        {/* 4. Pembelajar Mandiri (Primary) */}
        <div className="bg-card border border-border p-8 rounded-2xl flex items-start gap-6 group cursor-default shadow-sm hover:border-primary/40 transition-colors">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
            <Compass className="w-7 h-7 transition-all duration-300" />
          </div>
          <div>
            <h3 className="text-xl font-serif text-foreground mb-2 leading-snug">
              Pembelajar Mandiri
            </h3>
            <p className="text-muted-foreground text-sm font-light leading-relaxed">
              Yang ingin membangun sistem belajar pribadi jangka panjang tanpa
              tergantung institusi.
            </p>
          </div>
        </div>
      </div>

      {/* UNIVERSAL CONCLUSION */}
      <div className="mt-8">
        <div className="bg-card border border-border p-8 md:p-12 rounded-2xl flex flex-col md:flex-row items-center text-center md:text-left gap-8 md:gap-12 group cursor-default hover:border-warning/40 transition-colors">
          {/* Icon Orb */}
          <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
            <div className="w-full h-full rounded-full border border-warning/40 bg-surface-1 flex items-center justify-center relative z-10 group-hover:border-warning transition-colors">
              <Sparkles className="w-9 h-9 text-warning transition-colors" />
            </div>
          </div>

          <div className="relative z-10 flex-1">
            <h3 className="text-2xl md:text-3xl font-serif text-foreground mb-2 leading-tight">
              Dan Siapa Pun...
            </h3>
            <p className="text-muted-foreground text-base md:text-lg font-light leading-relaxed">
              Yang percaya bahwa ilmu adalah{" "}
              <span className="text-warning font-bold border-b border-warning/30 pb-0.5">
                amanah
              </span>{" "}
              yang harus dijaga, bukan sekadar target yang harus dikejar.
            </p>
          </div>

          <div className="md:ml-auto opacity-70 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500">
            <ArrowRight className="w-8 h-8 text-warning" />
          </div>
        </div>
      </div>
    </section>
  );
};
