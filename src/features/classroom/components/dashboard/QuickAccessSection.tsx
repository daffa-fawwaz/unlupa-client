import { type LucideIcon } from "lucide-react";

type QuickAccessCardProps = {
  href: string;
  icon: LucideIcon;
  color: "blue" | "purple" | "green" | "yellow" | "red";
  title: string;
  description: string;
};

const quickAccessStyles: Record<
  string,
  { hoverBg: string; hoverBorder: string; bg: string; text: string; hoverText: string }
> = {
  blue: {
    hoverBg: "hover:bg-info/10",
    hoverBorder: "hover:border-info/30",
    bg: "bg-info/10 border border-info/20",
    text: "text-info",
    hoverText: "group-hover:text-info",
  },
  purple: {
    hoverBg: "hover:bg-primary/10",
    hoverBorder: "hover:border-primary/30",
    bg: "bg-primary/10 border border-primary/20",
    text: "text-primary",
    hoverText: "group-hover:text-primary",
  },
  green: {
    hoverBg: "hover:bg-success/10",
    hoverBorder: "hover:border-success/30",
    bg: "bg-success/10 border border-success/20",
    text: "text-success",
    hoverText: "group-hover:text-success",
  },
  yellow: {
    hoverBg: "hover:bg-warning/10",
    hoverBorder: "hover:border-warning/30",
    bg: "bg-warning/10 border border-warning/20",
    text: "text-warning",
    hoverText: "group-hover:text-warning",
  },
  red: {
    hoverBg: "hover:bg-destructive/10",
    hoverBorder: "hover:border-destructive/30",
    bg: "bg-destructive/10 border border-destructive/20",
    text: "text-destructive",
    hoverText: "group-hover:text-destructive",
  },
};

export const QuickAccessCard = ({
  href,
  icon: Icon,
  title,
  color,
  description,
}: QuickAccessCardProps) => {
  const { hoverBg, hoverBorder, bg, text, hoverText } =
    quickAccessStyles[color];
  return (
    <>
      <div className="mb-8">
        <a
          href={href}
          className={`group flex flex-col md:flex-row items-center gap-3 px-4 py-3.5 rounded-2xl bg-card ${hoverBg} border border-border ${hoverBorder} transition-all duration-300`}
        >
          <div
            className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
          >
            <Icon className={`w-4 h-4 ${text}`} />
          </div>
          <div className="min-w-0">
            <p
              className={`text-foreground text-sm font-bold leading-tight ${hoverText} transition-colors`}
            >
              {title}
            </p>
            <p className="text-muted-foreground text-xs mt-0.5 truncate hidden md:block">
              {description}
            </p>
          </div>
        </a>
      </div>
    </>
  );
};
