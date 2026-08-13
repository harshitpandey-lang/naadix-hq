"use client";

import { useState, useTransition } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { CalendarMonthView } from "./calendar-month-view";
import { CalendarWeekView } from "./calendar-week-view";
import { CalendarDayView } from "./calendar-day-view";
import { EventFormDialog } from "./event-form-dialog";
import { useCalendarData } from "./use-calendar-data";
import type { CalendarView } from "@/src/types/calendar";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CalendarContainer({ timezone }: { timezone: string }) {
  const [view, setView] = useState<CalendarView>("month");
  const [date, setDate] = useState(() => new Date());
  const [showNewEventDialog, setShowNewEventDialog] = useState(false);
  const [isLoading, startTransition] = useTransition();

  const { events, goals, error } = useCalendarData(date, view);

  const navigatePrevious = () => {
    startTransition(() => {
      const newDate = new Date(date);
      if (view === "month") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else if (view === "week") {
        newDate.setDate(newDate.getDate() - 7);
      } else {
        newDate.setDate(newDate.getDate() - 1);
      }
      setDate(newDate);
    });
  };

  const navigateNext = () => {
    startTransition(() => {
      const newDate = new Date(date);
      if (view === "month") {
        newDate.setMonth(newDate.getMonth() + 1);
      } else if (view === "week") {
        newDate.setDate(newDate.getDate() + 7);
      } else {
        newDate.setDate(newDate.getDate() + 1);
      }
      setDate(newDate);
    });
  };

  const navigateToday = () => {
    startTransition(() => {
      setDate(new Date());
    });
  };

  return (
    <main className="min-h-screen bg-[var(--hq)] text-white">
      <div className="border-b border-[var(--hq-line)] p-5 sm:p-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-[var(--hq-cream)]">Calendar</h1>
              <p className="mt-1 text-sm text-[var(--hq-muted)]">Manage your schedule and view your goals</p>
            </div>
            <button
              onClick={() => setShowNewEventDialog(true)}
              className="flex items-center gap-2 rounded-md bg-[#d9e4ea] px-4 py-2 text-sm font-medium text-[var(--navy)] transition hover:bg-[#e8f1f6]"
            >
              <Plus size={16} />
              New Event
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={navigatePrevious}
                disabled={isLoading}
                className="rounded-md border border-[var(--hq-line)] p-2 transition hover:bg-white/10 disabled:opacity-50"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={navigateToday}
                disabled={isLoading}
                className="rounded-md border border-[var(--hq-line)] px-3 py-2 text-sm font-medium transition hover:bg-white/10 disabled:opacity-50"
              >
                Today
              </button>
              <button
                onClick={navigateNext}
                disabled={isLoading}
                className="rounded-md border border-[var(--hq-line)] p-2 transition hover:bg-white/10 disabled:opacity-50"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="flex gap-2">
              {(["month", "week", "day"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                    view === v
                      ? "bg-[#8cbde0] text-[var(--navy)]"
                      : "border border-[var(--hq-line)] text-[var(--hq-muted)] hover:text-white"
                  }`}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="border-b border-red-900 bg-red-900/20 p-4 text-red-300">
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="p-5 sm:p-8">
        {isLoading && (
          <div className="flex h-96 items-center justify-center">
            <div className="text-center">
              <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-[var(--hq-line)] border-t-[#8cbde0]" />
              <p className="text-sm text-[var(--hq-muted)]">Loading calendar...</p>
            </div>
          </div>
        )}

        {!isLoading && view === "month" && <CalendarMonthView date={date} events={events} goals={goals} />}
        {!isLoading && view === "week" && <CalendarWeekView date={date} events={events} goals={goals} />}
        {!isLoading && view === "day" && <CalendarDayView date={date} events={events} goals={goals} />}
      </div>

      <EventFormDialog
        open={showNewEventDialog}
        onOpenChange={setShowNewEventDialog}
        onSuccess={() => {
          setShowNewEventDialog(false);
          // Trigger refetch
          startTransition(() => {
            setDate(new Date(date));
          });
        }}
      />
    </main>
  );
}
