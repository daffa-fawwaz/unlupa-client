import { Sun, Moon } from "@/components/foundations/hugeicons";
import { useApp } from "@/context/AppContext";
import { cx } from "@/utils/cx";

const themes = [
  { value: "light" as const, icon: Sun, label: "Light" },
  { value: "dark" as const, icon: Moon, label: "Dark" },
];

export function ThemeToggle() {
  const { theme, setTheme } = useApp();

  return (
    <div className="flex items-center gap-1 rounded-lg border border-secondary bg-secondary p-1">
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          title={label}
          className={cx(
            "flex size-8 cursor-pointer items-center justify-center rounded-md outline-focus-ring transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2",
            theme === value
              ? "border border-secondary bg-primary text-primary shadow-xs"
              : "text-quaternary hover:bg-primary_hover hover:text-secondary"
          )}
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
}
