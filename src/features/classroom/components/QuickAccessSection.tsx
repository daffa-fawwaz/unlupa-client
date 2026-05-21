import { type LucideIcon } from "lucide-react";

type QuickAccessCardProps = {
  href: string;
  icon: LucideIcon;
  color: "blue" | "purple" | "green" | "yellow" | "red";
  title: string;
  description: string;
};

export const QuickAccessCard = ({
  href,
  icon: Icon,
  title,
  color,
  description,
}: QuickAccessCardProps) => {
  return (
    <>
      <div className="mb-8">
        <a
          href={href}
          className={`group flex flex-col md:flex-row items-center gap-3 px-4 py-3.5 rounded-2xl bg-white/5 hover:bg-${color}-500/10 border border-white/8 hover:border-${color}-500/30 transition-all duration-300`}
        >
          <div
            className={`w-9 h-9 rounded-xl bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
          >
            <Icon className={`w-4 h-4 text-${color}-400`} />
          </div>
          <div className="min-w-0">
            <p
              className={`text-white text-sm font-bold leading-tight group-hover:text-${color}-300 transition-colors`}
            >
              {title}
            </p>
            <p className="text-gray-500 text-xs mt-0.5 truncate hidden md:block">
              {description}
            </p>
          </div>
        </a>
      </div>
    </>
  );
};
