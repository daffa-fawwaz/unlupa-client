import { ArrowLeft, Layers } from "lucide-react";
import type {
  ParsedContentRef,
  StatusStyle,
} from "@/features/alquran/components/item-detail/ItemDetailView.config";

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
          className="p-3 rounded-2xl bg-surface-1 border border-border hover:bg-surface-2 hover:border-warning/30 hover:scale-105 transition-all group"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-warning transition-colors" />
        </button>
        <div className="min-w-0 flex items-center gap-2 text-sm text-muted-foreground">
          <span className="shrink-0">Juz {juzIndex}</span>
          <span>/</span>
          <span className="text-muted-foreground truncate">{info.title}</span>
        </div>
      </div>

      <div className="relative p-8 md:p-10 rounded-2xl bg-card border border-warning/20 overflow-hidden shadow-xl mb-8">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="px-3 py-1 rounded-full bg-warning/10 border border-warning/20 text-warning text-xs font-bold uppercase tracking-wider">
              Juz {juzIndex}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${statusStyle.className}`}
            >
              {statusStyle.label}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-2 leading-tight">
            {info.title}
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground text-base md:text-lg">
            <Layers className="w-5 h-5 text-warning/60" />
            <span className="wrap-break-word`">{info.subtitle}</span>
          </div>
        </div>
      </div>
    </>
  );
}
