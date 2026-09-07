import type { LucideIcon } from "lucide-react";
import React from "react";

interface ShardCardProps {
  color: "green" | "blue" | "purple";
  icon: LucideIcon;
  label: string;
  title: string;
  description: string;
  placeholder: string;
  onClick: () => void;
}

export const ShardCard: React.FC<ShardCardProps> = ({
  color,
  icon: Icon,
  label,
  title,
  description,
  placeholder,
  onClick,
}) => {
  // Determine color classes based on the prop
  let variantClass = "border-success/25 hover:border-success/60";
  let iconClass = "text-success bg-success/10 border-success/30";
  let textClass = "group-hover:text-success";
  let labelClass = "text-success/70";
  let inputStyle = { "--text-color": "var(--success)" } as React.CSSProperties;

  if (color === "blue") {
    variantClass = "border-info/25 hover:border-info/60";
    iconClass = "text-info bg-info/10 border-info/30";
    textClass = "group-hover:text-info";
    labelClass = "text-info/70";
    inputStyle = { "--text-color": "var(--info)" } as React.CSSProperties;
  } else if (color === "purple") {
    variantClass = "border-primary/25 hover:border-primary/60";
    iconClass = "text-primary bg-primary/10 border-primary/30";
    textClass = "group-hover:text-primary";
    labelClass = "text-primary/70";
    inputStyle = { "--text-color": "var(--primary)" } as React.CSSProperties;
  }

  return (
    <div
      className={`group relative cursor-pointer overflow-hidden rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 ${variantClass}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center border ${iconClass}`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <span
          className={`font-mono text-[10px] uppercase tracking-widest ${labelClass}`}
        >
          {label}
        </span>
      </div>
      <h4
        className={`font-serif text-xl text-foreground mb-2 transition-colors ${textClass}`}
      >
        {title}
      </h4>
      <p className="text-xs text-muted-foreground font-light leading-relaxed mb-4">
        {description}
      </p>
      <div className="relative">
        <input
          type="number"
          className="w-full border-b border-border bg-transparent py-2 font-mono text-sm text-foreground outline-none transition-colors focus:border-[color:var(--text-color)]"
          placeholder={placeholder}
          style={inputStyle}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};
