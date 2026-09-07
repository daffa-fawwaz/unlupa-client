import { SlideContainer } from "@/components/utils/SlideContainer";
import { Clock, Hourglass, AlertTriangle, TrendingDown } from "lucide-react";

export const TimeAnalysis = ({ index }: { index: number }) => {
  return (
    <SlideContainer>
      {/* Header */}
      <div className="flex justify-between items-start text-xs font-mono tracking-widest border-b border-border pb-6">
        <div className="flex items-center gap-2 text-primary">
          <Clock className="w-4 h-4 animate-pulse text-primary" />
          ANALISIS WAKTU
        </div>
        <span className="text-foreground/30">0{index} / 08</span>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10 mt-2">
        {/* Background Neon Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-75 h-75 bg-primary/5 rounded-full blur-[80px] animate-pulse pointer-events-none" />

        <div className="relative">
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-foreground leading-tight max-w-4xl mx-auto">
            <span className="inline-block mb-2 md:mb-4 text-foreground/80 text-xl md:text-3xl font-light tracking-wide">
              Menghafal selama
            </span>
            <br />
            <span className="relative inline-block px-4 py-1">
              <span className="absolute inset-0 bg-primary/10 -skew-x-6 rounded-lg border border-primary/20"></span>
              <span className="relative text-primary font-black">
                BERTAHUN TAHUN
              </span>
            </span>
            <br />
            <span className="inline-block mt-2 text-foreground/80 text-xl md:text-3xl font-light">
              hanya untuk menjadi{" "}
              <span className="text-muted-foreground line-through">kenangan</span>
            </span>
          </h2>
        </div>

        {/* Floating Icons with Neon Glow */}
        <div className="absolute left-0 md:left-10 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-8 opacity-60">
          <div className="p-3 rounded-full border border-border bg-surface-1 animate-float delay-0">
            <Hourglass className="w-6 h-6 text-primary" />
          </div>
        </div>
        <div className="absolute right-0 md:right-10 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-8 opacity-60">
          <div className="p-3 rounded-full border border-destructive/20 bg-destructive/5 animate-float delay-1000">
            <TrendingDown className="w-6 h-6 text-destructive" />
          </div>
        </div>

        {/* Warning Badge */}
        <div className="mt-10 md:mt-12 flex items-center gap-3 px-5 py-2 rounded-full border border-destructive/30 bg-destructive/10 backdrop-blur-sm animate-bounce-slow">
          <AlertTriangle className="w-4 h-4 text-destructive" />
          <span className="text-destructive text-xs md:text-sm font-mono tracking-wider">
            Sebuah kerugian yang nyata.
          </span>
        </div>
      </div>
    </SlideContainer>
  );
};
