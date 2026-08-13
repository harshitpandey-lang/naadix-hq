import Link from "next/link";
import { CalendarDays, Target } from "lucide-react";
import { getEventsForRange, getScheduledGoalsForRange } from "@/src/lib/calendar";
import { getGoals } from "@/src/lib/goals";

async function getTodaySchedule() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [events, scheduledGoals, allGoals] = await Promise.all([
      getEventsForRange(today.toISOString(), tomorrow.toISOString()),
      getScheduledGoalsForRange(today.toISOString(), tomorrow.toISOString()),
      getGoals(),
    ]);

    const todayGoals = allGoals.filter((g) => g.due_date === today.toISOString().split("T")[0]);

    return {
      events: events.sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime()),
      scheduledGoals: scheduledGoals.sort((a, b) => new Date(a.scheduled_start!).getTime() - new Date(b.scheduled_start!).getTime()),
      todayGoals,
    };
  } catch (error) {
    console.error("Failed to fetch today schedule:", error);
    return { events: [], scheduledGoals: [], todayGoals: [] };
  }
}

export async function DashboardOverview({ name, role }: { name: string; role: string }) {
  const { events, scheduledGoals, todayGoals } = await getTodaySchedule();

  const completedToday = todayGoals.filter((g) => g.completed).length;
  const totalToday = todayGoals.length;
  const progressPercent = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  const allItems = [...events, ...scheduledGoals].sort(
    (a, b) => {
      const aTime = "start_at" in a ? new Date(a.start_at).getTime() : new Date(a.scheduled_start!).getTime();
      const bTime = "start_at" in b ? new Date(b.start_at).getTime() : new Date(b.scheduled_start!).getTime();
      return aTime - bTime;
    }
  );
  return (
    <main className="p-5 sm:p-8">
      <section className="rounded-xl border border-[var(--hq-line)] bg-[linear-gradient(125deg,#1b292d,#172124)] p-6 sm:p-8">
        <p className="text-xs font-semibold tracking-[.18em] text-[#8cbde0]">PERSONAL HQ</p>
        <h2 className="mt-3 max-w-xl text-2xl font-semibold tracking-[-.05em] text-[var(--hq-cream)]">
          A calm home for the things you want to keep moving.
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--hq-muted)]">
          Your workspace for goals, calendar events, and personal progress tracking.
        </p>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="col-span-full">
          <h2 className="text-sm font-semibold tracking-[.14em] text-[#b8c5c7] uppercase">Today</h2>
        </div>

        <article className="rounded-xl border border-[var(--hq-line)] bg-[#162023] p-5">
          <Target className="text-[#8cbde0]" size={19} />
          <h3 className="mt-6 text-sm font-semibold text-[var(--hq-cream)]">Today&apos;s Progress</h3>
          {totalToday > 0 ? (
            <div className="mt-4">
              <div className="text-2xl font-bold text-white">
                {completedToday}/{totalToday}
              </div>
              <div className="mt-2 w-full bg-[#0f1315] rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-[var(--hq-muted)]">{progressPercent}% complete</p>
            </div>
          ) : (
            <p className="mt-2 text-sm leading-6 text-[var(--hq-muted)]">No goals scheduled for today.</p>
          )}
        </article>

        <article className="rounded-xl border border-[var(--hq-line)] bg-[#162023] p-5">
          <CalendarDays className="text-[#8cbde0]" size={19} />
          <h3 className="mt-6 text-sm font-semibold text-[var(--hq-cream)]">Schedule</h3>
          {allItems.length > 0 ? (
            <div className="mt-4 space-y-2">
              {allItems.slice(0, 3).map((item, idx) => {
                const isEvent = "start_at" in item;
                const time = isEvent ? new Date(item.start_at) : new Date(item.scheduled_start!);
                const timeStr = time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
                const title = isEvent ? item.title : `🎯 ${item.title}`;
                return (
                  <div key={idx} className="text-xs text-[var(--hq-muted)]">
                    <span className="font-semibold text-white">{timeStr}</span> {title}
                  </div>
                );
              })}
              {allItems.length > 3 && (
                <div className="text-xs text-[var(--hq-muted)] pt-2">
                  +{allItems.length - 3} more items
                </div>
              )}
            </div>
          ) : (
            <p className="mt-2 text-sm leading-6 text-[var(--hq-muted)]">Nothing scheduled.</p>
          )}
        </article>

        <div className="col-span-full flex gap-4">
          <Link
            href="/dashboard/calendar"
            className="flex-1 rounded-md bg-[#8cbde0] px-4 py-2 text-sm font-medium text-[var(--navy)] transition hover:bg-[#a8cde8] text-center"
          >
            View Calendar →
          </Link>
          {totalToday > 0 && (
            <Link
              href="/dashboard/goals"
              className="flex-1 rounded-md border border-[var(--hq-line)] px-4 py-2 text-sm font-medium transition hover:bg-white/10 text-center"
            >
              View All Goals →
            </Link>
          )}
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-[var(--hq-line)] bg-[#162023] p-5">
        <p className="text-xs font-semibold tracking-[.16em] text-[#8cbde0]">PROFILE</p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-[#d9e4ea] text-sm font-bold text-[var(--navy)]">HP</span>
            <div>
              <h2 className="font-semibold text-[var(--hq-cream)]">{name}</h2>
              <p className="text-sm text-[var(--hq-muted)]">{role}</p>
            </div>
          </div>
          <Link href="/" className="rounded-md border border-[var(--hq-line)] px-3 py-2 text-sm text-[#d4e3e6] transition hover:border-[#8cbde0] hover:text-white">
            View public profile
          </Link>
        </div>
      </section>
    </main>
  );
}
