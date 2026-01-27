import { SlideContainer } from "@/components/utils/SlideContainer";
import { Stars, Sparkles, Gem, Crown } from "lucide-react";

export const Meaning = ({ index }: { index: number }) => {
  return (
    <SlideContainer>
      {/* Header */}
      <div className="flex justify-between items-start text-xs font-mono tracking-widest border-b border-white/5 pb-6">
        <div className="flex items-center gap-2 text-accent drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">
          <Stars className="w-4 h-4 animate-pulse text-accent" />
          MAKNA
        </div>
        <span className="text-white/30">0{index} / 08</span>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10 mt-2">
        {/* Background Neon Elements - Gold/Accent Theme */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-100 h-100 bg-accent/10 rounded-full blur-[100px] animate-pulse pointer-events-none" />

        <div className="relative space-y-8 max-w-5xl mx-auto">
          <h2 className="font-serif text-xl md:text-3xl text-white/90 font-light tracking-wide mt-4">
            APA MAKNA DARI
          </h2>

          <div className="relative group">
            {/* Main Glowing Text */}
            <h1 className="relative z-10 font-display font-black text-3xl sm:text-4xl md:text-6xl text-transparent bg-clip-text bg-linear-to-b from-amber-200 via-accent to-yellow-600 drop-shadow-[0_0_35px_rgba(251,191,36,0.5)] tracking-tight leading-12 transition-all duration-700 group-hover:tracking-normal group-hover:scale-105">
              SEMUA PERJUANGAN ITU?
            </h1>

            {/* Halo Effect */}
            <div className="absolute inset-0 border-2 border-accent/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 scale-125"></div>
          </div>

          <p className="text-lg md:text-2xl text-white/60 font-light max-w-3xl mx-auto">
            Jika pada akhirnya,{" "}
            <span className="text-accent/80 italic">ilmu itu memudar</span>{" "}
            seiring berjalannya waktu.
          </p>
        </div>

        {/* Floating Icons */}
        <div className="absolute left-8 md:left-20 top-20 hidden md:block opacity-60 animate-float delay-300">
          <div className="p-4 rounded-full border border-accent/20 bg-accent/5 shadow-[0_0_20px_rgba(251,191,36,0.15)]">
            <Gem className="w-8 h-8 text-amber-300" />
          </div>
        </div>
        <div className="absolute right-8 md:right-20 bottom-20 hidden md:block opacity-60 animate-float delay-700">
          <div className="p-4 rounded-full border border-accent/20 bg-accent/5 shadow-[0_0_20px_rgba(251,191,36,0.15)]">
            <Sparkles className="w-8 h-8 text-amber-300" />
          </div>
        </div>

        {/* Bottom Badge */}
        <div className="mt-16 flex items-center gap-3 px-6 py-2 rounded-full border border-accent/30 bg-accent/10 shadow-[0_0_20px_rgba(251,191,36,0.1)] backdrop-blur-md">
          <Crown className="w-4 h-4 text-accent animate-bounce-slow" />
          <span className="text-amber-200 text-xs md:text-sm font-mono tracking-widest uppercase">
            Value Assessment: UNKNOWN
          </span>
        </div>
      </div>
    </SlideContainer>
  );
};
