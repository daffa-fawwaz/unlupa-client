import { ShieldCheck, ArrowDown } from "lucide-react";

export const SolutionSection = () => {
  return (
    <section
      id="solution"
      className="relative w-full min-h-screen bg-deep-universe flex flex-col items-center overflow-hidden font-primary"
    >
      <div className="stars-overlay"></div>

      <div className="relative w-full max-w-4xl px-6 md:px-12 py-24 z-10 flex flex-col items-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-24 w-px bg-linear-to-b from-transparent via-purple-500/50 to-transparent shadow-[0_0_10px_rgba(251,191,36,0.3)]"></div>

        <div className="mb-12 relative animate-in slide-in-from-bottom-8 fade-in duration-1000">
          <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full"></div>
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center relative z-10 rotate-45 border border-amber-500/30 bg-linear-to-b from-slate-900/60 to-slate-900/30 backdrop-blur-[20px] shadow-[0_0_40px_-10px_rgba(88,28,135,0.15)] transition-all duration-500 hover:border-amber-400/30 hover:shadow-[0_0_50px_-10px_rgba(251,191,36,0.1)]">
            <ShieldCheck className="w-10 h-10 text-amber-500 -rotate-45 drop-shadow-[0_0_10px_rgba(245,158,11,0.6)]" />
          </div>
        </div>

        <div className="text-center mb-16">
          <h2 className="font-serif italic text-3xl md:text-5xl text-gray-300 mb-4 leading-relaxed">
            Kerugian Ini Sebenarnya <br />
            <span className="bg-linear-to-br from-amber-200 via-amber-600 to-amber-800 bg-clip-text text-transparent font-bold not-italic text-4xl md:text-6xl tracking-wide drop-shadow-[0_0_15px_rgba(217,119,6,0.4)]">
              BISA DICEGAH
            </span>
          </h2>
          <div className="w-24 h-1 bg-linear-to-r from-transparent via-purple-500/50 to-transparent mx-auto mt-6"></div>
        </div>

        <div className="p-8 md:p-12 rounded-3xl text-center max-w-2xl relative group bg-linear-to-b from-slate-900/60 to-slate-900/30 border border-purple-500/20 border-t-white/10 backdrop-blur-[20px] shadow-[0_0_40px_-10px_rgba(88,28,135,0.15)] hover:border-amber-400/30 hover:shadow-[0_0_50px_-10px_rgba(251,191,36,0.1)] transition-all duration-500">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-500/30 rounded-tl-xl"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-500/30 rounded-br-xl"></div>

          <p className="text-lg md:text-xl text-blue-100/80 font-light leading-relaxed mb-8">
            Lupa bukan sesuatu yang datang tiba-tiba.
          </p>

          <div className="py-6 relative">
            <div className="w-px h-12 bg-linear-to-b from-transparent via-amber-500/50 to-transparent mx-auto mb-6"></div>

            <h3 className="font-serif text-2xl md:text-3xl text-white italic mb-4">
              "Masalahnya bukan pada Anda."
            </h3>

            <p className="text-sm md:text-base text-gray-400 font-mono leading-relaxed">
              Masalahnya adalah cara belajar yang membiarkan ingatan berjalan
              sendiri <br className="hidden md:block" />
              <span className="text-red-400/80 decoration-red-500/30 line-through decoration-1 mx-1">
                tanpa arah
              </span>{" "}
              dan
              <span className="text-red-400/80 decoration-red-500/30 line-through decoration-1 mx-1">
                tanpa penjagaan
              </span>
              .
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-white/5">
            <p className="text-base md:text-lg">
              <strong className="font-display text-amber-500 tracking-widest drop-shadow-[0_0_10px_rgba(245,158,11,0.6)]">
                BAQEN
              </strong>
              <span className="text-gray-300 font-light ml-2">
                hadir untuk mengubah "Lupa" menjadi "Terjaga".
              </span>
            </p>
          </div>
        </div>

        <div className="mt-16 pb-12">
          <button className="flex flex-col items-center gap-3 group cursor-pointer text-gray-500 hover:text-amber-500 transition-colors">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] group-hover:text-amber-400 transition-colors">
              Pelajari Metodenya
            </span>
            <div className="w-10 h-10 rounded-full border border-gray-700 group-hover:border-amber-500/50 flex items-center justify-center transition-all shadow-[0_0_15px_rgba(0,0,0,0)] group-hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              <div>
                <a href="#metode">
                  <ArrowDown className="w-5 h-5 animate-bounce group-hover:text-amber-500" />
                </a>
              </div>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};
