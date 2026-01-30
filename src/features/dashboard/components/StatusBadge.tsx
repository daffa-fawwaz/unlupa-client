import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const styles: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    approved: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    rejected: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  };

  const defaultStyle = "bg-slate-500/10 text-slate-500 border-slate-500/20";

  return (
    <div
      className={cn(
        "inline-flex px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border",
        styles[status] || defaultStyle,
      )}
    >
      {status}
    </div>
  );
};
