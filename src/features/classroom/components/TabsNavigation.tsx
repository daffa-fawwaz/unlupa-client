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
      className={`flex items-center gap-8 border-b border-white/5 px-2 ${className}`}
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
                ? "text-blue-400"
                : "text-gray-500 hover:text-gray-200"
            }`}
          >
            {tab.icon && (
              <span
                className={`transition-colors duration-300 ${
                  isActive
                    ? "text-blue-400"
                    : "text-gray-500 group-hover:text-gray-300"
                }`}
              >
                {tab.icon}
              </span>
            )}
            <span>{tab.label}</span>

            {isActive ? (
              <>
                {/* Active Indicator line */}
                <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] rounded-t-full bg-blue-500" />
                {/* Subtle Glow below active tab */}
                <span className="absolute bottom-0 left-1/2 h-2 w-3/4 -translate-x-1/2 bg-blue-500/40 blur-[6px]" />
              </>
            ) : (
              /* Hover Indicator */
              <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] origin-left scale-x-0 rounded-t-full bg-white/10 transition-transform duration-300 ease-out group-hover:scale-x-100" />
            )}
          </button>
        );
      })}
    </div>
  );
};
