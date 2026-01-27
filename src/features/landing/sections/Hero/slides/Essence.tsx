import { SlideContainer } from "@/components/utils/SlideContainer";
import { Search, Database, FileSearch, ScanSearch } from "lucide-react";

export const Essence = ({ index }: { index: number }) => {
  return (
    <SlideContainer>
      {/* Header */}
      <div className="flex justify-between items-start text-xs font-mono tracking-widest border-b border-white/5 pb-6">
        <div className="flex items-center gap-2 text-primary drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">
          <Search className="w-4 h-4 animate-pulse text-primary" />
          ESENSI
        </div>
        <span className="text-white/30">0{index} / 08</span>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10 mt-2">
        {/* Background Neon Elements - Primary/Purple Theme */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-100 h-100 bg-primary/10 rounded-full blur-[100px] animate-pulse pointer-events-none" />
        <p className="text-lg md:text-2xl italic font-display text-white/60 font-light max-w-2xl mx-auto">
          "Jika akhirnya dilupakan,"
        </p>
        {/* Search Grid Background */}
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(168,85,247,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.2)_1px,transparent_1px)] bg-size-[40px_40px]"></div>

        <div className="relative space-y-8 max-w-5xl mx-auto">
          <div className="relative group perspective-1000">
            {/* 3D Glowing Text */}
            <h1 className="mt-6 relative z-10 font-display font-black text-3xl sm:text-4xl md:text-6xl text-transparent bg-clip-text bg-linear-to-b from-white via-gray-300 to-slate-400 drop-shadow-[0_0_35px_rgba(168,85,247,0.5)] transition-transform duration-700 group-hover:scale-105 group-hover:rotate-x-12">
              APA YANG
            </h1>
            <h1 className="relative z-10 font-display font-black text-3xl sm:text-4xl md:text-6xl text-transparent bg-clip-text bg-linear-to-b from-purple-200 via-primary to-indigo-600 drop-shadow-[0_0_35px_rgba(168,85,247,0.5)] transition-transform duration-700 group-hover:scale-105 group-hover:rotate-x-12">
              SEBENARNYA TERSISA?
            </h1>
          </div>
        </div>

        {/* Floating Icons */}
        <div className="absolute right-8 md:right-24 bottom-32 hidden md:block opacity-60 animate-float delay-200">
          <div className="p-4 rounded-full border border-primary/20 bg-primary/5 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
            <Database className="w-8 h-8 text-purple-300" />
          </div>
        </div>
        <div className="absolute left-8 md:left-24 top-32 hidden md:block opacity-60 animate-float delay-500">
          <div className="p-4 rounded-full border border-primary/20 bg-primary/5 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
            <FileSearch className="w-8 h-8 text-purple-300" />
          </div>
        </div>

        {/* Bottom Badge */}
        <div className="mt-16 flex items-center gap-3 px-6 py-2 rounded-full border border-primary/30 bg-primary/10 shadow-[0_0_20px_rgba(168,85,247,0.1)] backdrop-blur-md">
          <ScanSearch className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-purple-200 text-xs md:text-sm font-mono tracking-widest uppercase">
            Searching Memory Banks...
          </span>
        </div>
      </div>
    </SlideContainer>
  );
};
