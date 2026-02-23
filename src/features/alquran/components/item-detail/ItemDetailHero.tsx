import { ArrowLeft, BookOpen, Layers } from "lucide-react";
import type {
  ParsedContentRef,
  StatusStyle,
} from "@/features/alquran/components/item-detail/itemDetailView.config";

interface ItemDetailHeroProps {
  juzIndex: number;
  info: ParsedContentRef;
  statusStyle: StatusStyle;
  onBack: () => void;
}

export function ItemDetailHero({
  juzIndex,
  info,
  statusStyle,
  onBack,
}: ItemDetailHeroProps) {
  return (
    <>
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={onBack}
          className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amber-500/30 hover:scale-105 transition-all group backdrop-blur-sm"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-amber-400 transition-colors" />
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Juz {juzIndex}</span>
          <span>/</span>
          <span className="text-gray-300">{info.title}</span>
        </div>
      </div>

      <div className="relative p-8 md:p-10 rounded-[3rem] bg-linear-to-br from-amber-500/15 via-gray-900/60 to-gray-900/80 border border-amber-500/20 overflow-hidden shadow-2xl shadow-amber-500/5 mb-8">
        <div className="absolute -right-10 -bottom-10 opacity-[0.04] pointer-events-none">
          <BookOpen className="w-64 h-64 text-amber-400" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
              Juz {juzIndex}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${statusStyle.className}`}
            >
              {statusStyle.label}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2 leading-tight">
            {info.title}
          </h1>
          <div className="flex items-center gap-2 text-gray-400 text-lg">
            <Layers className="w-5 h-5 text-amber-500/60" />
            <span>{info.subtitle}</span>
          </div>
        </div>
      </div>
    </>
  );
}
