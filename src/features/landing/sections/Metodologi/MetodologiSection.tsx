import { BookOpen, BarChart2, RefreshCw, Info } from "lucide-react";

export const MetodologiSection = () => {
  return (
    <section
      id="metode"
      className="relative w-full min-h-screen bg-background flex flex-col items-center justify-center overflow-x-hidden font-primary py-32"
    >
      <div className="relative w-full max-w-7xl px-6 md:px-12 z-10">
        {/* HEADER */}
        <div className="text-center mb-28">
          <div className="inline-flex items-center gap-3 mb-4 opacity-80">
            <span className="h-px w-8 bg-linear-gradient-to-r from-transparent to-primary"></span>
            <span className="font-display text-xs text-primary tracking-[0.3em] uppercase">
              Metodologi
            </span>
            <span className="h-px w-8 bg-linear-gradient-to-l from-transparent to-primary"></span>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-6 tracking-tight">
            Cara Kerja{" "}
            <span className="font-display text-primary">
              UNLUPA
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Belajar bukan tentang seberapa sering materi diulang,{" "}
            <br className="hidden md:block" />
            tetapi tentang{" "}
            <span className="text-foreground border-b border-primary/30 pb-1 italic">
              kapan
            </span>{" "}
            ia dimunculkan kembali.
          </p>
        </div>

        {/* STEPS GRID */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 pt-6">
          <div className="p-8 rounded-2xl relative flex flex-col items-center text-center group bg-card border border-border shadow-sm transition-all duration-500 hover:-translate-y-3 hover:border-info/50">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 border border-info/40 rounded-full flex items-center justify-center font-mono text-lg text-info font-bold z-20 bg-background transition-transform duration-500 group-hover:scale-110">
              01
            </div>

            <div className="mb-6 mt-6 w-16 h-16 rounded-full bg-info/10 border border-info/20 flex items-center justify-center transition-colors duration-500">
              <BookOpen className="w-8 h-8 text-info transition-transform duration-500 group-hover:scale-110" />
            </div>

            <h3 className="font-serif text-xl text-foreground mb-3 leading-snug transition-colors">
              Input Materi
            </h3>
            <p className="text-sm text-muted-foreground font-light leading-relaxed">
              Anda belajar, menghafal, dan memahami materi seperti biasa. <br />
              <span className="text-info/60 font-mono text-[10px] uppercase tracking-widest mt-4 block border-t border-border pt-3">
                Status: Learning
              </span>
            </p>
          </div>

          <div className="p-8 rounded-2xl relative flex flex-col items-center text-center md:-translate-y-8 group mt-8 md:mt-0 bg-card border border-border shadow-sm transition-all duration-500 hover:-translate-y-12 hover:border-warning/50">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 border border-warning/50 rounded-full flex items-center justify-center font-mono text-lg text-warning font-bold z-20 bg-background transition-transform duration-500 group-hover:scale-110">
              02
            </div>

            <div className="mb-6 mt-6 w-16 h-16 rounded-full bg-warning/10 border border-border flex items-center justify-center transition-colors duration-500">
              <BarChart2 className="w-8 h-8 text-warning transition-transform duration-500 group-hover:scale-110" />
            </div>

            <h3 className="font-serif text-xl text-foreground mb-3 leading-snug transition-colors">
              Nilai Ingatan
            </h3>
            <p className="text-sm text-muted-foreground font-light leading-relaxed">
              Beri penilaian jujur tentang seberapa kuat materi itu menempel.{" "}
              <br />
              <span className="text-warning/60 font-mono text-[10px] uppercase tracking-widest mt-4 block border-t border-border pt-3">
                Status: Valuation
              </span>
            </p>
          </div>

          <div className="p-8 rounded-2xl relative flex flex-col items-center text-center group mt-8 md:mt-0 bg-card border border-border shadow-sm transition-all duration-500 hover:-translate-y-3 hover:border-success/50">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 border border-success/40 rounded-full flex items-center justify-center font-mono text-lg text-success font-bold z-20 bg-background transition-transform duration-500 group-hover:scale-110">
              03
            </div>

            <div className="mb-6 mt-6 w-16 h-16 rounded-full bg-success/10 border border-success/20 flex items-center justify-center transition-colors duration-500">
              <RefreshCw className="w-8 h-8 text-success transition-transform duration-500 group-hover:rotate-180" />
            </div>

            <h3 className="font-serif text-xl text-foreground mb-3 leading-snug transition-colors">
              Recall Presisi
            </h3>
            <p className="text-sm text-muted-foreground font-light leading-relaxed">
              Materi akan muncul saat{" "}
              <strong className="text-success font-normal">
                Probability of Recall
              </strong>{" "}
              ada di angka 90-95%. <br />
              <span className="text-success/60 font-mono text-[10px] uppercase tracking-widest mt-4 block border-t border-border pt-3">
                Status: Sweet Spot 95%
              </span>
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-24 text-center">
          <div className="inline-block p-6 rounded-2xl border border-border bg-surface-1 max-w-2xl mx-auto">
            <div className="flex items-start gap-4 text-left">
              <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center shrink-0 border border-warning/20">
                <Info className="w-4 h-4 text-warning" />
              </div>
              <div>
                <h4 className="font-mono text-xs text-warning uppercase tracking-widest mb-2">
                  The Science of Memory
                </h4>
                <p className="text-muted-foreground text-sm font-light leading-relaxed">
                  Hafalan paling efektif dikuatkan saat{" "}
                  <span className="text-foreground">
                    probabilitas mengingatnya 90-95%
                  </span>
                  . Bukan saat ingatan terlalu kuat (terlalu mudah), dan bukan
                  saat sudah dilupakan (harus belajar ulang). UNLUPA menjaga
                  Anda tepat di zona ini.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
