"use client";

import { useState } from "react";
import type { CalendarEvent } from "@/src/types/calendar";
import type { Goal } from "@/src/types/goals";
import { EventDetailsDialog } from "./event-details-dialog";
import { GoalDetailsDialog } from "./goal-details-dialog";

interface CalendarWeekViewProps {
  date: Date;
  events: CalendarEvent[];
  goals: Goal[];
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function CalendarWeekView({ date, events, goals }: CalendarWeekViewProps) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const dayOfWeek = date.getDay();
  const diff = date.getDate() - dayOfWeek;
  const weekStart = new Date(date);
  weekStart.setDate(diff);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const getItemsForSlot = (dayDate: Date, hour: number) => {
    const slotStart = new Date(dayDate);
    slotStart.setHours(hour, 0, 0, 0);
    const slotEnd = new Date(dayDate);
    slotEnd.setHours(hour + 1, 0, 0, 0);

    const slotEvents = events.filter((e) => {
      const eventStart = new Date(e.start_at);
      const eventEnd = new Date(e.end_at);
      return eventStart < slotEnd && eventEnd > slotStart;
    });

    const slotGoals = goals.filter((g) => {
      if (!g.scheduled_start || !g.scheduled_end) return false;
      const goalStart = new Date(g.scheduled_start);
      const goalEnd = new Date(g.scheduled_end);
      return goalStart < slotEnd && goalEnd > slotStart;
    });

    return { slotEvents, slotGoals };
  };

  const weekLabel = `${weekStart.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })} - ${new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric" }
  )}`;

  return (
    <div>
      <h2 className="mb-6 text-lg font-semibold text-[var(--hq-cream)]">Week of {weekLabel}</h2>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="grid gap-px" style={{ gridTemplateColumns: "80px " + Array(7).fill("1fr").join(" ") }}>
            {/* Time header */}
            <div className="bg-[#162023] p-2" />
            {weekDays.map((d) => (
              <div key={d.toDateString()} className="bg-[#162023] p-3 text-center">
                <div className="text-xs font-semibold text-[#8cbde0]">{DAYS[d.getDay()]}</div>
                <div className="mt-1 text-sm font-semibold text-[var(--hq-cream)]">{d.getDate()}</div>
              </div>
            ))}

            {/* Time slots */}
            {HOURS.map((hour) => (
              <div key={`hour-${hour}`}>
                <div className="sticky left-0 bg-[#162023] p-2 text-center text-xs text-[var(--hq-muted)]">
                  {hour.toString().padStart(2, "0")}:00
                </div>

                {weekDays.map((dayDate) => {
                  const { slotEvents, slotGoals } = getItemsForSlot(dayDate, hour);

                  return (
                    <div
                      key={`${dayDate.toDateString()}-${hour}`}
                      className="min-h-16 border-t border-[var(--hq-line)] bg-[#162023] p-1"
                    >
                      {slotEvents.map((event) => (
                        <button
                          key={event.id}
                          onClick={() => setSelectedEvent(event)}
                          className="mb-1 block w-full truncate rounded bg-[#8cbde0]/20 px-1 py-0.5 text-left text-xs text-[#8cbde0] transition hover:bg-[#8cbde0]/30"
                        >
                          {event.title}
                        </button>
                      ))}
                      {slotGoals.map((goal) => (
                        <button
                          key={`goal-${goal.id}`}
                          onClick={() => setSelectedGoal(goal)}
                          className={`mb-1 block w-full truncate rounded px-1 py-0.5 text-left text-xs transition ${
                            goal.completed
                              ? "bg-green-900/20 text-green-400 line-through"
                              : "bg-amber-900/20 text-amber-400"
                          }`}
                        >
                          🎯 {goal.title}
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <EventDetailsDialog event={selectedEvent} open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)} />
      <GoalDetailsDialog goal={selectedGoal} open={!!selectedGoal} onOpenChange={(open) => !open && setSelectedGoal(null)} />
    </div>
  );
}
