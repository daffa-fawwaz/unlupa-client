import { BookOpen, BarChart2, RefreshCw, Info } from "lucide-react";

export const MetodologiSection = () => {
  return (
    <section
      id="metode"
      className="relative w-full min-h-screen bg-deep-universe flex flex-col items-center justify-center overflow-x-hidden font-primary py-32"
    >
      {/* Stars Background */}
      <div className="stars-overlay"></div>

      <div className="relative w-full max-w-7xl px-6 md:px-12 z-10">
        {/* HEADER */}
        <div className="text-center mb-28">
          <div className="inline-flex items-center gap-3 mb-4 opacity-80">
            <span className="h-px w-8 bg-linear-gradient-to-r from-transparent to-amber-500"></span>
            <span className="font-display text-[10px] text-amber-500 tracking-[0.3em] uppercase drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]">
              Metodologi
            </span>
            <span className="h-px w-8 bg-linear-gradient-to-l from-transparent to-amber-500"></span>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl text-white mb-6 tracking-wide">
            Cara Kerja{" "}
            <span className="font-display text-amber-500 drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]">
              UNLUPA
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Belajar bukan tentang seberapa sering materi diulang,{" "}
            <br className="hidden md:block" />
            tetapi tentang{" "}
            <span className="text-white border-b border-amber-500/30 pb-1 italic drop-shadow-sm">
              kapan
            </span>{" "}
            ia dimunculkan kembali.
          </p>
        </div>

        {/* STEPS GRID */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 pt-6">
          {/* Energy Stream (Desktop Only) */}
          <div className="hidden md:block absolute top-1/2 left-[5%] w-[90%] h-px bg-linear-gradient-to-r from-transparent via-amber-500/30 to-transparent -translate-y-1/2 z-0"></div>
          <div className="hidden md:block absolute top-1/2 left-0 w-[60px] h-[2px] bg-linear-to-r from-transparent via-white/80 to-transparent shadow-[0_0_20px_rgba(255,255,255,0.8)] -translate-y-1/2 z-1 animate-[dataFlow_3s_infinite_ease-in-out]"></div>

          <div className="p-8 rounded-2xl relative flex flex-col items-center text-cente  r group bg-[#0a0f1e]/40 border border-white/10 backdrop-blur-[20px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6)] transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_30px_60px_-10px_rgba(59,130,246,0.15)] hover:border-blue-500/50">
            {/* Nebula Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full blur-[60px] bg-blue-500/40 opacity-0 transition-opacity duration-800 -z-10 group-hover:opacity-40"></div>

            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 border border-blue-500/40 rounded-full flex items-center justify-center font-mono text-lg text-blue-400 font-bold shadow-[0_0_20px_rgba(59,130,246,0.3)] z-20 group-hover:scale-110 transition-transform duration-500 bg-[#050505] ring-4 ring-black/50">
              01
            </div>

            <div className="mb-6 mt-6 w-16 h-16 rounded-full bg-blue-900/10 border border-blue-500/20 flex items-center justify-center group-hover:bg-blue-900/30 transition-colors duration-500">
              <BookOpen className="w-8 h-8 text-blue-400 drop-shadow-[0_0_12px_rgba(59,130,246,0.8)] transition-transform duration-500 group-hover:scale-110" />
            </div>

            <h3 className="font-serif text-xl text-white mb-3 group-hover:text-blue-300 transition-colors drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              Input Materi
            </h3>
            <p className="text-sm text-gray-400 font-light leading-relaxed">
              Anda belajar, menghafal, dan memahami materi seperti biasa. <br />
              <span className="text-blue-400/50 font-mono text-[10px] uppercase tracking-widest mt-4 block border-t border-blue-500/10 pt-3">
                Status: Learning
              </span>
            </p>
          </div>

          <div className="p-8 rounded-2xl relative flex flex-col items-center text-center md:-translate-y-8 border-white/10 group mt-8 md:mt-0 bg-[#0a0f1e]/40 border  backdrop-blur-[20px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6)] transition-all duration-500 hover:-translate-y-12 hover:shadow-[0_30px_60px_-10px_rgba(245,158,11,0.15)] hover:border-amber-500/50">
            {/* Nebula Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full blur-[60px] bg-amber-500/40 opacity-0 transition-opacity duration-800 -z-10 group-hover:opacity-15"></div>

            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 border border-amber-500/60 rounded-full flex items-center justify-center font-mono text-lg text-amber-500 font-bold shadow-[0_0_25px_rgba(245,158,11,0.5)] z-20 group-hover:scale-110 transition-transform duration-500 bg-[#050505] ring-4 ring-black/50">
              02
            </div>

            <div className="mb-6 mt-6 w-16 h-16 rounded-full bg-amber-900/10 border border-white/10 flex items-center justify-center group-hover:bg-amber-900/30 transition-colors duration-500 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
              <BarChart2 className="w-8 h-8 text-amber-500 drop-shadow-[0_0_12px_rgba(245,158,11,0.8)] transition-transform duration-500 group-hover:scale-110" />
            </div>

            <h3 className="font-serif text-xl text-white mb-3 group-hover:text-amber-300 transition-colors drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">
              Nilai Ingatan
            </h3>
            <p className="text-sm text-gray-400 font-light leading-relaxed">
              Beri penilaian jujur tentang seberapa kuat materi itu menempel.{" "}
              <br />
              <span className="text-amber-400/50 font-mono text-[10px] uppercase tracking-widest mt-4 block border-t border-amber-500/10 pt-3">
                Status: Valuation
              </span>
            </p>
          </div>

          <div className="p-8 rounded-2xl relative flex flex-col items-center text-center group mt-8 md:mt-0 bg-[#0a0f1e]/40 border border-white/10 backdrop-blur-[20px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6)] transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_30px_60px_-10px_rgba(16,185,129,0.15)] hover:border-emerald-500/50">
            {/* Nebula Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full blur-[60px] bg-emerald-500/40 opacity-0 transition-opacity duration-800 -z-10 group-hover:opacity-40"></div>

            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 border border-emerald-500/40 rounded-full flex items-center justify-center font-mono text-lg text-emerald-400 font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] z-20 group-hover:scale-110 transition-transform duration-500 bg-[#050505] ring-4 ring-black/50">
              03
            </div>

            <div className="mb-6 mt-6 w-16 h-16 rounded-full bg-emerald-900/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-900/30 transition-colors duration-500">
              <RefreshCw className="w-8 h-8 text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.8)] transition-transform duration-500 group-hover:rotate-180" />
            </div>

            <h3 className="font-serif text-xl text-white mb-3 group-hover:text-emerald-300 transition-colors drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
              Recall Presisi
            </h3>
            <p className="text-sm text-gray-400 font-light leading-relaxed">
              Materi akan muncul saat{" "}
              <strong className="text-emerald-300 font-normal">
                Probability of Recall
              </strong>{" "}
              ada di angka 90-95%. <br />
              <span className="text-emerald-400/50 font-mono text-[10px] uppercase tracking-widest mt-4 block border-t border-emerald-500/10 pt-3">
                Status: Sweet Spot 95%
              </span>
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-24 text-center">
          <div className="inline-block p-6 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md max-w-2xl mx-auto">
            <div className="flex items-start gap-4 text-left">
              <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20">
                <Info className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <h4 className="font-mono text-xs text-amber-500 uppercase tracking-widest mb-2">
                  The Science of Memory
                </h4>
                <p className="text-gray-400 text-sm font-light leading-relaxed">
                  Hafalan paling efektif dikuatkan saat{" "}
                  <span className="text-white">
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

      <style>{`
                @keyframes dataFlow {
                    0% { left: 10%; opacity: 0; }
                    20% { opacity: 1; }
                    80% { opacity: 1; }
                    100% { left: 90%; opacity: 0; }
                }
            `}</style>
    </section>
  );
};
