"use client";

import { useState } from "react";
import type { CalendarEvent } from "@/src/types/calendar";
import type { Goal } from "@/src/types/goals";
import { EventDetailsDialog } from "./event-details-dialog";
import { GoalDetailsDialog } from "./goal-details-dialog";

interface CalendarMonthViewProps {
  date: Date;
  events: CalendarEvent[];
  goals: Goal[];
}

export function CalendarMonthView({ date, events, goals }: CalendarMonthViewProps) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const getEventsForDay = (day: number | null) => {
    if (!day) return { events: [], goals: [] };
    const dayDate = new Date(date.getFullYear(), date.getMonth(), day);
    const dayStart = new Date(dayDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayDate);
    dayEnd.setHours(23, 59, 59, 999);

    return {
      events: events.filter((e) => {
        const eventStart = new Date(e.start_at);
        const eventEnd = new Date(e.end_at);
        return eventStart <= dayEnd && eventEnd >= dayStart;
      }),
      goals: goals.filter((g) => {
        if (!g.scheduled_start || !g.scheduled_end) return false;
        const goalStart = new Date(g.scheduled_start);
        const goalEnd = new Date(g.scheduled_end);
        return goalStart <= dayEnd && goalEnd >= dayStart;
      }),
    };
  };

  const monthName = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div>
      <h2 className="mb-6 text-lg font-semibold text-[var(--hq-cream)]">{monthName}</h2>

      <div className="grid gap-px overflow-hidden rounded-lg border border-[var(--hq-line)] bg-[var(--hq-line)]">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="bg-[#162023] p-3 text-center text-xs font-semibold text-[#8cbde0]">
            {day}
          </div>
        ))}

        {weeks.map((week, weekIndex) =>
          week.map((day, dayIndex) => {
            const { events: dayEvents, goals: dayGoals } = getEventsForDay(day);
            const isCurrentMonth = day !== null;
            const isToday =
              isCurrentMonth &&
              day === new Date().getDate() &&
              date.getMonth() === new Date().getMonth() &&
              date.getFullYear() === new Date().getFullYear();

            return (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className={`min-h-24 bg-[#162023] p-2 ${
                  isToday ? "border-l-4 border-l-[#8cbde0]" : ""
                } ${!isCurrentMonth ? "bg-[#0f1315]" : ""}`}
              >
                <div className={`mb-1 text-xs font-semibold ${isCurrentMonth ? "text-[var(--hq-cream)]" : "text-[#4a5f66]"}`}>
                  {day}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map((event) => (
                    <button
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className="block w-full truncate rounded bg-[#8cbde0]/20 px-1 py-0.5 text-left text-xs text-[#8cbde0] transition hover:bg-[#8cbde0]/30"
                    >
                      {event.title}
                    </button>
                  ))}
                  {dayGoals.slice(0, 2).map((goal) => (
                    <button
                      key={`goal-${goal.id}`}
                      onClick={() => setSelectedGoal(goal)}
                      className={`block w-full truncate rounded px-1 py-0.5 text-left text-xs transition ${
                        goal.completed
                          ? "bg-green-900/20 text-green-400 line-through"
                          : "bg-amber-900/20 text-amber-400"
                      }`}
                    >
                      🎯 {goal.title}
                    </button>
                  ))}
                  {dayEvents.length + dayGoals.length > 4 && (
                    <div className="text-xs text-[var(--hq-muted)]">
                      +{dayEvents.length + dayGoals.length - 4} more
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <EventDetailsDialog event={selectedEvent} open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)} />
      <GoalDetailsDialog goal={selectedGoal} open={!!selectedGoal} onOpenChange={(open) => !open && setSelectedGoal(null)} />
    </div>
  );
}
