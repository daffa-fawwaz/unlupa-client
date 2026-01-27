import { SlideContainer } from "@/components/utils/SlideContainer";
import { Clock, Hourglass, AlertTriangle, TrendingDown } from "lucide-react";

export const TimeAnalysis = ({ index }: { index: number }) => {
  return (
    <SlideContainer>
      {/* Header */}
      <div className="flex justify-between items-start text-xs font-mono tracking-widest border-b border-white/5 pb-6">
        <div className="flex items-center gap-2 text-primary drop-shadow-[0_0_8px_rgba(124,58,237,0.5)]">
          <Clock className="w-4 h-4 animate-pulse text-primary" />
          ANALISIS WAKTU
        </div>
        <span className="text-white/30">0{index} / 08</span>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10 mt-2">
        {/* Background Neon Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-75 h-75 bg-primary/5 rounded-full blur-[80px] animate-pulse pointer-events-none" />

        <div className="relative">
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-white leading-tight max-w-4xl mx-auto drop-shadow-2xl">
            <span className="inline-block mb-2 md:mb-4 text-white/80 text-xl md:text-3xl font-light tracking-wide">
              Menghafal selama
            </span>
            <br />
            <span className="relative inline-block px-4 py-1">
              <span className="absolute inset-0 bg-primary/10 -skew-x-6 rounded-lg border border-primary/20 shadow-[0_0_30px_rgba(124,58,237,0.3)]"></span>
              <span className="relative text-transparent bg-clip-text bg-linear-to-r from-primary via-purple-300 to-primary font-black drop-shadow-[0_0_15px_rgba(124,58,237,0.8)] animate-text-shimmer bg-size-[200%_auto]">
                BERTAHUN TAHUN
              </span>
            </span>
            <br />
            <span className="inline-block mt-2 text-white/80 text-xl md:text-3xl font-light">
              hanya untuk menjadi{" "}
              <span className="text-gray-500 line-through">kenangan</span>
            </span>
          </h2>
        </div>

        {/* Floating Icons with Neon Glow */}
        <div className="absolute left-0 md:left-10 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-8 opacity-60">
          <div className="p-3 rounded-full border border-white/10 bg-white/5 shadow-[0_0_15px_rgba(255,255,255,0.1)] animate-float delay-0">
            <Hourglass className="w-6 h-6 text-primary" />
          </div>
        </div>
        <div className="absolute right-0 md:right-10 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-8 opacity-60">
          <div className="p-3 rounded-full border border-red-500/20 bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-float delay-1000">
            <TrendingDown className="w-6 h-6 text-red-400" />
          </div>
        </div>

        {/* Warning Badge */}
        <div className="mt-10 md:mt-12 flex items-center gap-3 px-5 py-2 rounded-full border border-red-500/30 bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.2)] backdrop-blur-sm animate-bounce-slow">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <span className="text-red-200 text-xs md:text-sm font-mono tracking-wider">
            Sebuah kerugian yang nyata.
          </span>
        </div>
      </div>
    </SlideContainer>
  );
};
