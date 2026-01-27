import { SlideContainer } from "@/components/utils/SlideContainer";
import { Target, Zap, Award, Crosshair } from "lucide-react";

export const TimePurpose = ({ index }: { index: number }) => {
  return (
    <SlideContainer>
      {/* Header */}
      <div className="flex justify-between items-start text-xs font-mono tracking-widest border-b border-white/5 pb-6">
        <div className="flex items-center gap-2 text-accent drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">
          <Target className="w-4 h-4 animate-spin-slow text-accent" />
          TIME PURPOSE
        </div>
        <span className="text-white/30">0{index} / 08</span>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10 mt-2">
        {/* Background Neon Elements - Gold/Amber Theme */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-100 h-100 bg-accent/5 rounded-full blur-[100px] animate-pulse pointer-events-none" />

        {/* Dynamic Crosshairs Background */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border-l-2 border-t-2 border-accent"></div>
          <div className="absolute bottom-10 right-10 w-20 h-20 border-r-2 border-b-2 border-accent"></div>
        </div>

        <div className="relative space-y-6 md:space-y-8 max-w-5xl mx-auto">
          <h3 className="font-serif text-2xl md:text-4xl text-white/90 font-light tracking-wide">
            Belajar seharusnya untuk
          </h3>

          <div className="relative inline-block group">
            {/* Glitch Effect Layers */}
            <h1 className="relative z-10 font-display font-black text-6xl sm:text-7xl md:text-9xl text-transparent bg-clip-text bg-linear-to-b from-white via-white to-white/50 drop-shadow-[0_0_35px_rgba(251,191,36,0.6)] tracking-tighter transition-transform duration-500 group-hover:scale-105">
              DIINGAT
            </h1>
            <div className="absolute inset-0 z-0 bg-accent/20 blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500 rounded-full scale-110"></div>
          </div>

          <div className="flex items-center justify-center gap-4 text-xl md:text-3xl font-light text-white/80">
            <span>Bukan untuk</span>
            <span className="relative px-3 py-1">
              <span className="absolute inset-0 bg-red-500/10 skew-x-12 border border-red-500/20"></span>
              <span className="relative text-red-400 font-serif italic decoration-red-500/50 decoration-2 underline-offset-4 line-through">
                dilupakan
              </span>
            </span>
          </div>
        </div>

        {/* Floating Icons */}
        <div className="absolute left-4 md:left-16 bottom-20 hidden md:block opacity-40 animate-float delay-700">
          <Zap className="w-8 h-8 text-yellow-200 drop-shadow-[0_0_10px_rgba(253,224,71,0.5)]" />
        </div>
        <div className="absolute right-4 md:right-16 top-20 hidden md:block opacity-40 animate-float delay-300">
          <Award className="w-8 h-8 text-yellow-200 drop-shadow-[0_0_10px_rgba(253,224,71,0.5)]" />
        </div>

        {/* Bottom Badge */}
        <div className="mt-12 md:mt-16 flex items-center gap-2 text-accent/60 text-xs md:text-sm font-mono tracking-[0.2em] border border-accent/20 px-4 py-1.5 rounded-full bg-accent/5 backdrop-blur-md">
          <Crosshair className="w-3 h-3" />
          TARGET: LONG-TERM RETENTION
        </div>
      </div>
    </SlideContainer>
  );
};
