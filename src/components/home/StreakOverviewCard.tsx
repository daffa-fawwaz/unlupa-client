import { useMemo, useState } from "react";
import { Check, ChevronDown, Flame } from "@/components/foundations/hugeicons";

import { useApp } from "@/context/AppContext";
import { useDashboardStats } from "@/features/dashboard/student/hooks/useDashboardStats";
import { cx } from "@/utils/cx";

const DAY_IN_MS = 86_400_000;

function getLocalDateKey(
  value: string | Date | null | undefined,
): string | null {
  if (!value) return null;
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value))
    return value;

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getLongestStreak(dateKeys: string[]): number {
  let longest = 0;
  let current = 0;
  let previousTime: number | null = null;

  dateKeys.sort().forEach((dateKey) => {
    const currentTime = new Date(`${dateKey}T00:00:00Z`).getTime();
    current =
      previousTime !== null && currentTime - previousTime === DAY_IN_MS
        ? current + 1
        : 1;
    longest = Math.max(longest, current);
    previousTime = currentTime;
  });

  return longest;
}

export function StreakOverviewCard() {
  const {
    quranPages,
    items,
    currentStreak: localCurrentStreak,
    language,
  } = useApp();
  const { data: dashboardStats, isLoading } = useDashboardStats();
  const [showDetails, setShowDetails] = useState(false);

  const streakData = useMemo(() => {
    const activityByDate = new Map<string, number>();
    const addActivity = (
      value: string | Date | null | undefined,
      count = 1,
    ) => {
      const dateKey = getLocalDateKey(value);
      if (!dateKey) return;

      activityByDate.set(
        dateKey,
        Math.max(activityByDate.get(dateKey) ?? 0, count),
      );
    };

    // Preserve all activity sources used by the previous weekly streak widget.
    quranPages.forEach((page) => {
      page.reviewLogs?.forEach((log) => addActivity(log.date));
      addActivity(page.activatedAt);

      // Backend-synced pages may only contain the latest review timestamp.
      addActivity(page.fsrsData.lastReview);
    });

    items.forEach((item) => {
      item.reviewLogs?.forEach((log) => addActivity(log.date));
      addActivity(item.fsrsData.lastReview);
    });

    // The dashboard endpoint is authoritative when local review logs are incomplete.
    dashboardStats?.consistency_heatmap?.forEach((activity) => {
      if (activity.count > 0) addActivity(activity.date, activity.count);
    });

    const today = new Date();
    const dayFromMonday = today.getDay() === 0 ? 6 : today.getDay() - 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayFromMonday);
    monday.setHours(0, 0, 0, 0);

    const dayLabels =
      language === "en"
        ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        : ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

    const weekDays = dayLabels.map((label, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);

      return {
        label,
        date,
        activityCount: activityByDate.get(getLocalDateKey(date) ?? "") ?? 0,
        isActive: (activityByDate.get(getLocalDateKey(date) ?? "") ?? 0) > 0,
        isToday: date.toDateString() === today.toDateString(),
        isFuture: date.getTime() > today.getTime(),
      };
    });

    const dateKeys = Array.from(activityByDate.keys());
    const localLongestStreak = getLongestStreak(dateKeys);
    const totalActivities = Array.from(activityByDate.values()).reduce(
      (total, count) => total + count,
      0,
    );

    return {
      weekDays,
      currentStreak: dashboardStats?.current_streak ?? localCurrentStreak,
      longestStreak: Math.max(
        dashboardStats?.longest_streak ?? 0,
        localLongestStreak,
      ),
      totalActivities,
    };
  }, [dashboardStats, items, language, localCurrentStreak, quranPages]);

  const isEnglish = language === "en";

  return (
    <section
      aria-busy={isLoading}
      className="rounded-3xl border border-secondary bg-secondary p-2 shadow-xs sm:p-4"
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, rgba(152, 162, 179, 0.14) 0, rgba(152, 162, 179, 0.14) 1px, transparent 1px, transparent 8px)",
      }}
    >
      <div className="rounded-2xl border border-secondary bg-primary p-4 shadow-sm sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-200 ring-inset">
                <Flame className="size-5 fill-current" aria-hidden="true" />
              </span>
              <h2 className="text-lg font-semibold text-primary sm:text-xl">
                {isEnglish ? "Streak" : "Istiqomah"}
              </h2>
            </div>

            <p className="mt-3 text-display-sm font-semibold tracking-tight text-brand-700 sm:text-display-md">
              {streakData.currentStreak}
              <span className="ml-1.5 text-lg font-semibold text-secondary sm:text-xl">
                {isEnglish ? "days" : "hari"}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowDetails((isOpen) => !isOpen)}
            className="rounded-lg px-2 py-1 text-sm font-semibold text-secondary outline-focus-ring transition-colors hover:bg-primary_hover hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {showDetails
              ? isEnglish
                ? "Hide details"
                : "Tutup detail"
              : isEnglish
                ? "View details"
                : "Lihat detail"}
          </button>
        </div>

        <div className="mt-5 grid grid-cols-7 gap-1.5 sm:gap-3">
          {streakData.weekDays.map((day) => (
            <div
              key={day.label}
              className="flex min-w-0 flex-col items-center gap-2"
            >
              <div
                title={
                  day.activityCount > 0
                    ? `${day.activityCount} ${isEnglish ? "activities" : "aktivitas"}`
                    : isEnglish
                      ? "No activity"
                      : "Belum ada aktivitas"
                }
                aria-label={`${day.label}: ${day.activityCount} ${isEnglish ? "activities" : "aktivitas"}`}
                className={cx(
                  "flex aspect-square w-full max-w-12 items-center justify-center rounded-full border transition-colors",
                  day.isActive &&
                    "border-brand-600 bg-brand-solid text-white shadow-md shadow-brand-500/25 ring-4 ring-brand-50",
                  !day.isActive &&
                    day.isToday &&
                    "border-brand bg-brand-primary text-brand-secondary",
                  !day.isActive &&
                    !day.isToday &&
                    "border-secondary bg-secondary text-quaternary",
                  day.isFuture && "opacity-55",
                )}
              >
                {day.isActive ? (
                  <Check
                    className="size-4 stroke-[2.5] sm:size-5"
                    aria-hidden="true"
                  />
                ) : (
                  <span className="size-1.5 rounded-full bg-fg-quaternary/50" />
                )}
              </div>
              <span
                className={cx(
                  "truncate text-xs font-medium text-tertiary",
                  day.isActive && "text-brand-700",
                  day.isToday && "font-semibold",
                )}
              >
                {day.label}
              </span>
            </div>
          ))}
        </div>

        <div className="my-5 border-t border-secondary" />

        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-sm text-secondary">
              {isEnglish ? "Longest streak" : "Streak terpanjang"}
            </p>
            <p className="mt-1 text-display-xs font-semibold tracking-tight text-primary">
              {streakData.longestStreak}
              <span className="ml-1 text-lg">
                {isEnglish ? "days" : "hari"}
              </span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-secondary">
              {isEnglish ? "Total" : "Total"}
            </p>
            <p className="mt-1 text-display-xs font-semibold tracking-tight text-primary">
              {streakData.totalActivities}
            </p>
          </div>
        </div>

        <div className="mt-5 border-t border-secondary pt-4">
          <button
            type="button"
            aria-expanded={showDetails}
            onClick={() => setShowDetails((isOpen) => !isOpen)}
            className="flex w-full items-center justify-between gap-4 rounded-xl bg-secondary px-4 py-3 text-left text-sm font-semibold text-primary outline-focus-ring transition-colors hover:bg-secondary_hover focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <span>
              {isEnglish ? "How do streaks work?" : "Bagaimana streak bekerja?"}
            </span>
            <ChevronDown
              className={cx(
                "size-4 text-fg-quaternary transition-transform",
                showDetails && "rotate-180",
              )}
              aria-hidden="true"
            />
          </button>

          {showDetails && (
            <p className="px-4 pt-3 text-sm leading-6 text-secondary">
              {isEnglish
                ? "Complete at least one Quran or book review each day to keep your streak active. Missed days start a new streak."
                : "Selesaikan minimal satu review Al-Qur'an atau buku setiap hari untuk menjaga streak. Hari yang terlewat akan memulai streak baru."}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
