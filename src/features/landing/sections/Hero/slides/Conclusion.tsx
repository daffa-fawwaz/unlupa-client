import { SlideContainer } from "@/components/utils/SlideContainer";
import { AlertTriangle, ArrowDown, Siren, ShieldAlert } from "lucide-react";

export const Conclusion = ({ index }: { index: number }) => {
  return (
    <SlideContainer>
      {/* Header */}
      <div className="flex justify-between items-start text-xs font-mono tracking-widest border-b border-border pb-6">
        <div className="flex items-center gap-2 text-warning">
          <AlertTriangle className="w-4 h-4 animate-pulse text-warning" />
          KESIMPULAN
        </div>
        <span className="text-foreground/30">0{index} / 08</span>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10 mt-2">
        {/* Background Neon Elements - Orange/Warning Theme */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-100 h-100 bg-warning/10 rounded-full blur-[100px] animate-pulse pointer-events-none" />

        {/* Hazard Stripes Background */}
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-warning/10"></div>

        <p className="md:text-lg text-foreground/60 font-light max-w-2xl mx-auto mb-4 mt-0 md:mt-4 italic">
          Lupa yang dibiarkan bisa membuat semua pengorbanan suci itu...
        </p>

        <div className="relative max-w-5xl mx-auto">
          <h2 className="font-serif text-xl md:text-3xl text-foreground/90 font-light tracking-wide leading-tight">
            TERASA
          </h2>

          <div className="relative group">
            {/* Main Glowing Text */}
            <h1 className="relative z-10 font-display font-black text-5xl sm:text-6xl md:text-8xl text-destructive tracking-tight leading-tight transition-transform duration-500 group-hover:scale-105">
              SIA-SIA
            </h1>

            {/* Warning Border Effect */}
            <div className="absolute -inset-4 border-2 border-warning/0 group-hover:border-warning/20 rounded-xl transition-all duration-500 scale-95 group-hover:scale-100"></div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-12 md:mt-16">
          <button className="group relative px-10 py-4 rounded-lg bg-primary text-primary-foreground font-bold text-sm tracking-widest uppercase hover:bg-primary/90 transition-all flex items-center gap-3 overflow-hidden">
            <span className="relative z-10">Lihat Solusinya</span>
            <ArrowDown className="w-4 h-4 relative z-10 group-hover:translate-y-1 transition-transform" />
          </button>
        </div>

        {/* Floating Icons */}
        <div className="absolute left-8 md:left-24 bottom-32 hidden md:block opacity-60 animate-float delay-500">
          <div className="p-4 rounded-full border border-warning/20 bg-warning/5">
            <Siren className="w-8 h-8 text-warning" />
          </div>
        </div>
        <div className="absolute right-8 md:right-24 top-32 hidden md:block opacity-60 animate-float delay-200">
          <div className="p-4 rounded-full border border-warning/20 bg-warning/5">
            <ShieldAlert className="w-8 h-8 text-warning" />
          </div>
        </div>
      </div>
    </SlideContainer>
  );
};
