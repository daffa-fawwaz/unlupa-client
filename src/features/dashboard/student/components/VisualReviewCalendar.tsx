import { useMemo, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Plus, Search } from "@/components/foundations/hugeicons";
import type { UpcomingReviewForecast } from "../types";

interface VisualReviewCalendarProps {
  forecast: UpcomingReviewForecast[];
}

type CalendarEvent = {
  label: string;
  meta: string;
  color: "blue" | "pink" | "green" | "orange" | "purple";
};

type CalendarDay = {
  date: Date;
  key: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
};

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const eventStyles: Record<CalendarEvent["color"], string> = {
  blue: "border-blue-200 bg-blue-50 text-blue-700",
  pink: "border-pink-200 bg-pink-50 text-pink-700",
  green: "border-emerald-200 bg-emerald-50 text-emerald-700",
  orange: "border-orange-200 bg-orange-50 text-orange-700",
  purple: "border-purple-200 bg-purple-50 text-purple-700",
};

const dotStyles: Record<CalendarEvent["color"], string> = {
  blue: "bg-blue-500",
  pink: "bg-pink-500",
  green: "bg-emerald-500",
  orange: "bg-orange-500",
  purple: "bg-purple-500",
};

const parseDateKey = (date: string) => new Date(`${date}T00:00:00`);

const toDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getMonthRangeLabel = (monthDate: Date) => {
  const start = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const end = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
  const month = monthNames[monthDate.getMonth()].slice(0, 3);

  return `${month} ${start.getDate()}, ${monthDate.getFullYear()} - ${month} ${end.getDate()}, ${monthDate.getFullYear()}`;
};

const getWeekOfMonth = (date: Date) => Math.ceil((date.getDate() + new Date(date.getFullYear(), date.getMonth(), 1).getDay()) / 7);

const buildCalendarDays = (
  monthDate: Date,
  eventsByDate: Map<string, CalendarEvent[]>,
  todayKey: string,
): CalendarDay[] => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const start = new Date(year, month, 1 - firstDay.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const key = toDateKey(date);

    return {
      date,
      key,
      dayNumber: date.getDate(),
      isCurrentMonth: date.getMonth() === month,
      isToday: key === todayKey,
      events: eventsByDate.get(key) ?? [],
    };
  });
};

export const VisualReviewCalendar = ({
  forecast = [],
}: VisualReviewCalendarProps) => {
  const [today] = useState(() => new Date());
  const todayKey = toDateKey(today);
  const firstForecastDate = forecast[0]?.date ? parseDateKey(forecast[0].date) : today;
  const [monthDate, setMonthDate] = useState(() => new Date(firstForecastDate.getFullYear(), firstForecastDate.getMonth(), 1));
  const [selectedDateKey, setSelectedDateKey] = useState(() => forecast[0]?.date ?? todayKey);

  const eventsByDate = useMemo(() => {
    const colors: CalendarEvent["color"][] = ["blue", "pink", "green", "orange", "purple"];
    const grouped = new Map<string, CalendarEvent[]>();

    forecast.forEach((item, index) => {
      if (item.count <= 0) return;

      grouped.set(item.date, [
        {
          label: `${item.count} review due`,
          meta: item.count === 1 ? "1 materi" : `${item.count} materi`,
          color: colors[index % colors.length],
        },
      ]);
    });

    return grouped;
  }, [forecast]);

  const calendarDays = useMemo(
    () => buildCalendarDays(monthDate, eventsByDate, todayKey),
    [eventsByDate, monthDate, todayKey],
  );

  const selectedDay = calendarDays.find((day) => day.key === selectedDateKey);
  const monthTitle = `${monthNames[monthDate.getMonth()]} ${monthDate.getFullYear()}`;

  const goToPreviousMonth = () => {
    setMonthDate((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setMonthDate((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setMonthDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDateKey(todayKey);
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-secondary bg-primary shadow-xs">
      <div className="flex flex-col gap-4 border-b border-secondary p-4 md:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-xl border border-secondary bg-primary text-center shadow-xs">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-tertiary">{monthNames[monthDate.getMonth()].slice(0, 3)}</span>
            <span className="text-lg font-bold text-brand-700">{today.getDate()}</span>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold tracking-tight text-primary md:text-xl">{monthTitle}</h3>
              <span className="rounded-full border border-secondary bg-secondary px-2 py-0.5 text-xs font-medium text-secondary">
                Week {getWeekOfMonth(today)}
              </span>
            </div>
            <p className="mt-1 text-xs text-secondary md:text-sm">{getMonthRangeLabel(monthDate)}</p>
          </div>
        </div>

        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 sm:flex sm:flex-wrap sm:justify-end">
          <button className="rounded-xl border border-secondary bg-primary p-2 text-fg-quaternary transition hover:bg-primary_hover" aria-label="Search review forecast">
            <Search className="size-4" />
          </button>
          <div className="col-span-3 grid grid-cols-[2.5rem_1fr_2.5rem] overflow-hidden rounded-xl border border-secondary sm:col-span-1 sm:w-44">
            <button type="button" onClick={goToPreviousMonth} className="flex h-10 items-center justify-center border-r border-secondary text-fg-quaternary transition hover:bg-primary_hover" aria-label="Previous month">
              <ChevronLeft className="size-4" />
            </button>
            <button type="button" onClick={goToToday} className="h-10 text-sm font-semibold text-primary transition hover:bg-primary_hover">
              Today
            </button>
            <button type="button" onClick={goToNextMonth} className="flex h-10 items-center justify-center border-l border-secondary text-fg-quaternary transition hover:bg-primary_hover" aria-label="Next month">
              <ChevronRight className="size-4" />
            </button>
          </div>
          <button className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-secondary bg-primary px-3 text-sm font-semibold text-primary shadow-xs transition hover:bg-primary_hover">
            Month view
            <ChevronDown className="size-4 text-fg-quaternary" />
          </button>
          <button className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-brand-solid px-3 text-sm font-semibold text-white shadow-xs transition hover:bg-brand-solid_hover">
            <Plus className="size-4" />
            Add event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-secondary bg-secondary/40">
        {dayNames.map((day) => (
          <div key={day} className="border-r border-secondary px-2 py-2 text-center text-[11px] font-medium text-secondary last:border-r-0">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {calendarDays.map((day) => {
          const isSelected = selectedDateKey === day.key;

          return (
            <button
              key={day.key}
              type="button"
              onClick={() => setSelectedDateKey(day.key)}
              className={`group relative min-h-18 border-r border-b border-secondary p-2 text-left transition last:border-r-0 sm:min-h-24 md:min-h-30 lg:min-h-36 ${
                day.isCurrentMonth ? "bg-primary hover:bg-primary_hover" : "bg-secondary/40 text-tertiary"
              } ${isSelected ? "ring-2 ring-inset ring-brand" : ""}`}
            >
              <span
                className={`inline-flex size-6 items-center justify-center rounded-full text-xs font-semibold ${
                  day.isToday ? "bg-brand-solid text-white" : day.isCurrentMonth ? "text-primary" : "text-tertiary"
                }`}
              >
                {day.dayNumber}
              </span>

              <div className="mt-3 hidden space-y-1.5 sm:block">
                {day.events.slice(0, 3).map((event) => (
                  <div key={`${day.key}-${event.label}`} className={`truncate rounded-md border px-2 py-1 text-xs font-medium ${eventStyles[event.color]}`}>
                    <span className="truncate">{event.label}</span>
                    <span className="ml-2 text-[11px] opacity-75">{event.meta}</span>
                  </div>
                ))}
                {day.events.length > 3 && <p className="text-xs font-medium text-secondary">{day.events.length - 3} more...</p>}
              </div>

              {day.events.length > 0 && (
                <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1 sm:hidden">
                  {day.events.slice(0, 4).map((event) => (
                    <span key={`${day.key}-${event.color}`} className={`size-1.5 rounded-full ${dotStyles[event.color]}`} />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="border-t border-secondary p-4 sm:hidden">
        <h4 className="text-sm font-semibold text-primary">
          {selectedDay?.date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </h4>
        <div className="mt-3 space-y-2">
          {selectedDay && selectedDay.events.length > 0 ? (
            selectedDay.events.map((event) => (
              <div key={`${selectedDay.key}-${event.label}`} className={`flex items-center justify-between rounded-lg border px-3 py-2 text-xs font-medium ${eventStyles[event.color]}`}>
                <span>{event.label}</span>
                <span>{event.meta}</span>
              </div>
            ))
          ) : (
            <p className="rounded-lg border border-dashed border-secondary bg-secondary/40 px-3 py-3 text-xs text-secondary">Tidak ada review pada tanggal ini.</p>
          )}
        </div>
      </div>
    </section>
  );
};
