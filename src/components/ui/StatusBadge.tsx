import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const styles: Record<string, string> = {
    pending: "bg-warning/10 text-warning border-warning/20",
    approved: "bg-success/10 text-success border-success/20",
    rejected: "bg-destructive/10 text-destructive border-destructive/20",
  };

  const defaultStyle = "bg-muted/10 text-muted-foreground border-muted/20";

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
