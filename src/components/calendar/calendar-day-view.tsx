"use client";

import { useState } from "react";
import type { CalendarEvent } from "@/src/types/calendar";
import type { Goal } from "@/src/types/goals";
import { EventDetailsDialog } from "./event-details-dialog";
import { GoalDetailsDialog } from "./goal-details-dialog";

interface CalendarDayViewProps {
  date: Date;
  events: CalendarEvent[];
  goals: Goal[];
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export function CalendarDayView({ date, events, goals }: CalendarDayViewProps) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  const dayEvents = events.filter((e) => {
    const eventStart = new Date(e.start_at);
    const eventEnd = new Date(e.end_at);
    return eventStart <= dayEnd && eventEnd >= dayStart;
  });

  const dayGoals = goals.filter((g) => {
    if (!g.scheduled_start || !g.scheduled_end) return false;
    const goalStart = new Date(g.scheduled_start);
    const goalEnd = new Date(g.scheduled_end);
    return goalStart <= dayEnd && goalEnd >= dayStart;
  });

  const getItemsForHour = (hour: number) => {
    const slotStart = new Date(date);
    slotStart.setHours(hour, 0, 0, 0);
    const slotEnd = new Date(date);
    slotEnd.setHours(hour + 1, 0, 0, 0);

    return {
      events: dayEvents.filter((e) => {
        const eventStart = new Date(e.start_at);
        const eventEnd = new Date(e.end_at);
        return eventStart < slotEnd && eventEnd > slotStart;
      }),
      goals: dayGoals.filter((g) => {
        if (!g.scheduled_start || !g.scheduled_end) return false;
        const goalStart = new Date(g.scheduled_start);
        const goalEnd = new Date(g.scheduled_end);
        return goalStart < slotEnd && goalEnd > slotStart;
      }),
    };
  };

  const dateLabel = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const allItems = [...dayEvents, ...dayGoals];
  const hasItems = allItems.length > 0;

  return (
    <div>
      <h2 className="mb-6 text-lg font-semibold text-[var(--hq-cream)]">{dateLabel}</h2>

      {!hasItems && (
        <div className="rounded-lg border border-[var(--hq-line)] bg-[#162023] p-12 text-center">
          <p className="text-sm text-[var(--hq-muted)]">Nothing scheduled for this day.</p>
        </div>
      )}

      {hasItems && (
        <div className="space-y-1 rounded-lg border border-[var(--hq-line)] bg-[#162023]">
          {HOURS.map((hour) => {
            const { events: hourEvents, goals: hourGoals } = getItemsForHour(hour);
            const hasContent = hourEvents.length > 0 || hourGoals.length > 0;

            return (
              <div key={`hour-${hour}`} className="flex border-t border-[var(--hq-line)] first:border-t-0">
                <div className="sticky left-0 w-20 shrink-0 bg-[#0f1315] p-3 text-center text-xs font-semibold text-[var(--hq-muted)]">
                  {hour.toString().padStart(2, "0")}:00
                </div>
                <div className="flex-1 p-3">
                  {!hasContent && <div className="h-12" />}
                  {hourEvents.length > 0 && (
                    <div className="space-y-2">
                      {hourEvents.map((event) => {
                        const startTime = new Date(event.start_at);
                        const endTime = new Date(event.end_at);
                        const timeLabel = `${startTime.getHours().toString().padStart(2, "0")}:${startTime
                          .getMinutes()
                          .toString()
                          .padStart(2, "0")} - ${endTime.getHours().toString().padStart(2, "0")}:${endTime
                          .getMinutes()
                          .toString()
                          .padStart(2, "0")}`;

                        return (
                          <button
                            key={event.id}
                            onClick={() => setSelectedEvent(event)}
                            className="w-full text-left rounded-lg bg-[#8cbde0]/10 border border-[#8cbde0]/30 p-2 transition hover:bg-[#8cbde0]/20 hover:border-[#8cbde0]/50"
                          >
                            <div className="text-sm font-semibold text-[#8cbde0]">{event.title}</div>
                            <div className="mt-1 text-xs text-[var(--hq-muted)]">{timeLabel}</div>
                            {event.location && (
                              <div className="mt-1 text-xs text-[var(--hq-muted)]">📍 {event.location}</div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {hourGoals.length > 0 && (
                    <div className="space-y-2">
                      {hourGoals.map((goal) => {
                        const startTime = new Date(goal.scheduled_start!);
                        const endTime = new Date(goal.scheduled_end!);
                        const duration = Math.round((endTime.getTime() - startTime.getTime()) / (60 * 1000));
                        const hours = Math.floor(duration / 60);
                        const minutes = duration % 60;
                        const durationLabel =
                          hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

                        return (
                          <button
                            key={`goal-${goal.id}`}
                            onClick={() => setSelectedGoal(goal)}
                            className={`w-full text-left rounded-lg p-2 transition ${
                              goal.completed
                                ? "bg-green-900/10 border border-green-900/30 hover:bg-green-900/20 hover:border-green-900/50"
                                : "bg-amber-900/10 border border-amber-900/30 hover:bg-amber-900/20 hover:border-amber-900/50"
                            }`}
                          >
                            <div
                              className={`text-sm font-semibold ${
                                goal.completed ? "text-green-400 line-through" : "text-amber-400"
                              }`}
                            >
                              🎯 {goal.title}
                            </div>
                            <div className={`mt-1 text-xs ${goal.completed ? "text-green-300" : "text-amber-300"}`}>
                              {durationLabel}
                              {goal.goal_type === "duration" && goal.target_value && ` / ${goal.target_value} ${goal.unit}`}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <EventDetailsDialog event={selectedEvent} open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)} />
      <GoalDetailsDialog goal={selectedGoal} open={!!selectedGoal} onOpenChange={(open) => !open && setSelectedGoal(null)} />
    </div>
  );
}
