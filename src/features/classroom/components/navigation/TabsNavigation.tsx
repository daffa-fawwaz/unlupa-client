import { type ReactNode } from "react";

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
}

export interface TabsNavigationProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  className?: string;
}

export const TabsNavigation = ({
  tabs,
  activeTab,
  onTabChange,
  className = "",
}: TabsNavigationProps) => {
  return (
    <div
      className={`flex items-center gap-8 border-b border-border px-2 ${className}`}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            className={`group relative flex w-full items-center justify-center gap-2 py-4 text-sm font-semibold tracking-wide transition-colors duration-300 ${
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.icon && (
              <span
                className={`transition-colors duration-300 ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground"
                }`}
              >
                {tab.icon}
              </span>
            )}
            <span>{tab.label}</span>

            {isActive ? (
              <>
                {/* Active Indicator line */}
                <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] rounded-t-full bg-primary" />
              </>
            ) : (
              /* Hover Indicator */
              <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] origin-left scale-x-0 rounded-t-full bg-border transition-transform duration-300 ease-out group-hover:scale-x-100" />
            )}
          </button>
        );
      })}
    </div>
  );
};
