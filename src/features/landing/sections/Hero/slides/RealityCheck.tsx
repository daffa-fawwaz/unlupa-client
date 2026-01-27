import { SlideContainer } from "@/components/utils/SlideContainer";

export const RealityCheckSlide = ({ index }: { index: number }) => (
  <SlideContainer>
    {/* Header */}
    <div className="flex justify-between items-start text-xs font-mono tracking-widest border-b border-white/5 pb-6">
      <div className="flex items-center gap-2 text-gold-premium drop-shadow-[0_0_8px_rgba(217,119,6,0.5)]">
        <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_5px_#FBBF24]" />
        REALITY CHECK
      </div>
      <span className="text-white/30">0{index} / 08</span>
    </div>

    {/* Content - Split Grid */}
    <div className="flex-1 grid md:grid-cols-2 relative mt-8 items-center">
      {/* Divider Line */}
      <div className="absolute left-1/2 top-4 bottom-4 w-px bg-linear-to-b from-transparent via-white/10 to-transparent hidden md:block" />

      {/* Left Section - FASE AWAL */}
      <div className="flex flex-col justify-center items-center md:items-end text-center md:text-right pr-0 md:pr-12">
        <span className="font-mono text-[10px] md:text-[12px] w-full text-white/40 tracking-[0.2em] mb-2 md:mb-4 uppercase">
          Fase Awal
        </span>
        <h3 className="font-serif italic tracking-tight w-full font-black text-gold-premium text-3xl leading-tight md:text-6xl md:leading-14 mb-2 drop-shadow-md">
          DULU <br /> TIDAK TAHU
        </h3>
        <p className="font-serif w-full italic text-white/40 text-sm tracking-wide">
          (Belum memiliki ilmunya)
        </p>
      </div>

      {/* Right Section - FASE SAAT INI */}
      <div className="flex flex-col justify-center items-center md:items-start text-center md:text-right pl-0 md:pl-12 mt-12 md:mt-0">
        <span className="font-mono text-[10px] md:text-[12px] text-white/40 tracking-[0.2em] mb-2 md:mb-4 uppercase">
          Fase Saat Ini
        </span>
        <h3 className="font-serif italic font-black text-center` md:text-left text-red-fading leading-tight md:leading-14 text-3xl md:text-6xl mb-2 drop-shadow-md">
          SEKARANG <br /> LUPA
        </h3>
        <p className="font-serif italic text-white/40 text-sm tracking-wide">
          (Setelah lelah menghafal)
        </p>
      </div>
    </div>

    {/* Footer Quote */}
    <div className="mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center gap-3 text-sm justify-center md:justify-start">
      <span className="font-serif italic text-base md:text-lg text-white/60">
        "Terasa familiar, bukan?"
      </span>
      <span className="hidden md:inline text-white/20">—</span>
      <span className="text-base md:text-lg text-red-fading font-medium tracking-wide drop-shadow-[0_0_10px_rgba(248,113,113,0.2)]">
        Sungguh alur yang menyakitkan.
      </span>
    </div>
  </SlideContainer>
);
