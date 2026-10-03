import type { ReactNode } from "react";
import { Book } from "@/components/foundations/hugeicons";
import { resolveAssetUrl } from "@/lib/assets";
import { cx } from "@/utils/cx";

interface BookCoverVisualProps {
  src?: string | null;
  title: string;
  author?: string | null;
  className?: string;
  overlay?: ReactNode;
}

export function BookCoverVisual({
  src,
  title,
  author,
  className,
  overlay,
}: BookCoverVisualProps) {
  const coverSrc = resolveAssetUrl(src);

  return (
    <div
      className={cx(
        "relative isolate shrink-0 [perspective:1000px]",
        className,
      )}
    >
      <div className="absolute -bottom-1 left-2 right-0 h-2 rounded-b-md border border-[#d6c9b4] bg-[repeating-linear-gradient(0deg,#fffdf8_0px,#fffdf8_1px,#e8dfd1_1px,#e8dfd1_2px)] shadow-sm dark:border-[#665c4d] dark:bg-[repeating-linear-gradient(0deg,#c8bda9_0px,#c8bda9_1px,#8d806d_1px,#8d806d_2px)]" />
      <div className="absolute -right-1.5 bottom-1 top-1.5 w-3 rounded-r-md border border-l-0 border-[#d6c9b4] bg-[repeating-linear-gradient(90deg,#fffdf8_0px,#fffdf8_1px,#e8dfd1_1px,#e8dfd1_2px)] shadow-md dark:border-[#665c4d] dark:bg-[repeating-linear-gradient(90deg,#c8bda9_0px,#c8bda9_1px,#8d806d_1px,#8d806d_2px)]" />

      <div className="relative size-full origin-left overflow-hidden rounded-l-md rounded-r-xl border border-black/15 bg-[linear-gradient(145deg,#7c2d12_0%,#c2410c_48%,#ef6905_100%)] shadow-[0_14px_24px_-12px_rgba(67,20,7,0.65),inset_0_0_0_1px_rgba(255,255,255,0.16)] transition-transform duration-500 ease-out group-hover:[transform:rotateY(-4deg)_translateY(-3px)]">
        <div className="absolute inset-y-0 left-0 z-20 w-[11%] border-r border-white/20 bg-[linear-gradient(90deg,rgba(0,0,0,0.38),rgba(255,255,255,0.11),rgba(0,0,0,0.12))] shadow-[2px_0_5px_rgba(0,0,0,0.2)]" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-[14%] text-center text-white">
          <div className="flex size-9 items-center justify-center rounded-xl border border-white/25 bg-white/12 shadow-sm backdrop-blur-sm">
            <Book className="size-4.5" />
          </div>
          <p className="mt-3 line-clamp-3 text-xs font-semibold leading-4 drop-shadow-sm">
            {title}
          </p>
          <span className="mt-3 h-px w-8 bg-white/45" />
          <span className="mt-2 text-[7px] font-bold uppercase tracking-[0.24em] text-white/70">
            Unlupa
          </span>
        </div>

        {coverSrc && (
          <img
            src={coverSrc}
            alt={title}
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
            className="absolute inset-0 z-10 size-full object-cover"
          />
        )}

        <div className="pointer-events-none absolute inset-0 z-30 bg-[linear-gradient(100deg,rgba(255,255,255,0.2)_0%,transparent_18%,transparent_78%,rgba(0,0,0,0.15)_100%)]" />
        {author && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-3 pb-2 pt-7 text-center">
            <p className="truncate text-[8px] font-semibold uppercase tracking-[0.12em] text-white/95 drop-shadow-sm sm:text-[9px]">
              {author}
            </p>
          </div>
        )}
        {overlay && <div className="absolute inset-0 z-40">{overlay}</div>}
      </div>
    </div>
  );
}
