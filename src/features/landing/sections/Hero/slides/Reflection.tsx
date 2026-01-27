import { SlideContainer } from "@/components/utils/SlideContainer";
import { HelpCircle, Search, Brain, Fingerprint } from "lucide-react";

export const Reflection = ({ index }: { index: number }) => {
  return (
    <SlideContainer>
      {/* Header */}
      <div className="flex justify-between items-start text-xs font-mono tracking-widest border-b border-white/5 pb-6">
        <div className="flex items-center gap-2 text-secondary drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
          <HelpCircle className="w-4 h-4 animate-pulse text-secondary" />
          REFLEKSI
        </div>
        <span className="text-white/30">0{index} / 08</span>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10 mt-2">
        {/* Background Neon Elements - Cyan/Blue Theme */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-100 h-100 bg-secondary/5 rounded-full blur-[100px] animate-pulse pointer-events-none" />

        {/* Floating Question Marks Background */}
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <HelpCircle className="absolute top-10 left-20 w-24 h-24 text-secondary animate-float delay-0" />
          <Search className="absolute bottom-20 right-20 w-32 h-32 text-secondary animate-float delay-1000" />
        </div>

        <div className="relative space-y-8 max-w-5xl mx-auto">
          <div className="relative inline-block">
            <h2 className="font-serif text-3xl md:text-5xl text-white/90 font-light tracking-wide leading-tight">
              HASIL BELAJAR ITU
            </h2>
            <div className="h-px w-1/2 bg-linear-to-r from-transparent via-secondary/50 to-transparent mx-auto mt-4"></div>
          </div>

          <div className="relative group">
            {/* Glowing Text */}
            <h1 className="relative z-10 font-display font-black text-5xl sm:text-6xl md:text-8xl text-transparent bg-clip-text bg-linear-to-b from-cyan-200 via-secondary to-blue-600 drop-shadow-[0_0_35px_rgba(34,211,238,0.4)] tracking-tight leading-tight transition-transform duration-700 group-hover:scale-[1.02]">
              SEBENARNYA KE MANA?
            </h1>

            {/* Ambient Glow behind text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-20 bg-secondary/10 blur-xl rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          </div>
        </div>

        {/* Floating Icons */}
        <div className="absolute left-8 md:left-24 bottom-32 hidden md:block opacity-60 animate-float delay-500">
          <div className="p-4 rounded-full border border-secondary/20 bg-secondary/5 shadow-[0_0_20px_rgba(34,211,238,0.15)]">
            <Brain className="w-8 h-8 text-cyan-300" />
          </div>
        </div>
        <div className="absolute right-8 md:right-24 top-32 hidden md:block opacity-60 animate-float delay-200">
          <div className="p-4 rounded-full border border-secondary/20 bg-secondary/5 shadow-[0_0_20px_rgba(34,211,238,0.15)]">
            <Fingerprint className="w-8 h-8 text-cyan-300" />
          </div>
        </div>

        {/* Bottom Badge */}
        <div className="mt-16 flex items-center gap-3 px-6 py-2 rounded-full border border-secondary/30 bg-secondary/10 shadow-[0_0_20px_rgba(34,211,238,0.1)] backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-secondary animate-ping" />
          <span className="text-cyan-200 text-xs md:text-sm font-mono tracking-widest">
            STATUS: HILANG DARI INGATAN
          </span>
        </div>
      </div>
    </SlideContainer>
  );
};
