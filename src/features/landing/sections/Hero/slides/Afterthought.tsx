import { SlideContainer } from "@/components/utils/SlideContainer";
import { HeartCrack, TrendingDown, AlertCircle, XCircle } from "lucide-react";

export const Afterthought = ({ index }: { index: number }) => {
  return (
    <SlideContainer>
      {/* Header */}
      <div className="flex justify-between items-start text-xs font-mono tracking-widest border-b border-white/5 pb-6">
        <div className="flex items-center gap-2 text-destructive drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]">
          <HeartCrack className="w-4 h-4 animate-pulse text-destructive" />
          RENUNGAN
        </div>
        <span className="text-white/30">0{index} / 08</span>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10 mt-2">
        {/* Background Neon Elements - Red/Destructive Theme */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-100 h-100 bg-destructive/5 rounded-full blur-[100px] animate-pulse pointer-events-none" />

        {/* Broken Elements Background */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <XCircle className="absolute top-20 left-10 w-16 h-16 text-destructive animate-float delay-0" />
          <AlertCircle className="absolute bottom-20 right-10 w-24 h-24 text-destructive animate-float delay-1000" />
        </div>

        <div className="relative space-y-8 max-w-5xl mx-auto">
          <p className="text-lg md:text-2xl italic font-display text-white/60 font-light max-w-2xl mx-auto">
            "Jika semua itu berakhir dilupakan,"
          </p>

          <div className="relative group">
            {/* Glitch/Distortion Effect Container */}
            <div className="relative inline-block">
              <h1 className="relative z-10 font-display font-black text-3xl sm:text-4xl md:text-6xl text-transparent bg-clip-text bg-linear-to-b from-white via-gray-300-500 to-slate-400 drop-shadow-[0_0_35px_rgba(248,113,113,0.6)] tracking-tight leading-tight transition-transform duration-500 group-hover:scale-105">
                KE MANA PERGINYA?
              </h1>
              <h1 className="relative z-10 font-display font-black text-3xl sm:text-4xl md:text-6xl text-transparent bg-clip-text bg-linear-to-b from-red-300 via-red-500 to-red-600 drop-shadow-[0_0_35px_rgba(248,113,113,0.6)] tracking-tight leading-tight transition-transform duration-500 group-hover:scale-105">
                USAHA DAN WAKTU?
              </h1>
              {/* Scratch/Line Effect */}
              <div className="absolute top-1/2 left-0 w-full h-1 bg-destructive/50 transform -rotate-2 scale-x-0 group-hover:scale-x-110 transition-transform duration-700 origin-left"></div>
            </div>
          </div>
        </div>

        {/* Floating Icons */}
        <div className="absolute left-8 md:left-24 bottom-32 hidden md:block opacity-60 animate-float delay-500">
          <div className="p-4 rounded-full border border-destructive/20 bg-destructive/5 shadow-[0_0_20px_rgba(248,113,113,0.15)]">
            <TrendingDown className="w-8 h-8 text-red-400" />
          </div>
        </div>

        {/* Bottom Badge */}
        <div className="mt-12 flex items-center gap-3 px-6 py-2 rounded-full border border-destructive/30 bg-destructive/10 shadow-[0_0_20px_rgba(248,113,113,0.1)] backdrop-blur-md animate-pulse">
          <div className="w-2 h-2 rounded-full bg-destructive animate-ping" />
          <span className="text-red-200 text-xs md:text-sm font-mono tracking-widest uppercase">
            Critical Data Loss
          </span>
        </div>
      </div>
    </SlideContainer>
  );
};
