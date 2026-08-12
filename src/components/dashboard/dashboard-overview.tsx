import Link from "next/link";
import { Activity, CalendarDays, ChartNoAxesCombined, Target } from "lucide-react";

const cards = [
  { title: "Today’s goals", text: "No goals recorded yet.", icon: Target },
  { title: "Calendar", text: "No events scheduled.", icon: CalendarDays },
  { title: "Personal metrics", text: "No metrics recorded yet.", icon: ChartNoAxesCombined },
  { title: "Recent activity", text: "Your recent activity will appear here.", icon: Activity },
];

export function DashboardOverview({ name, role }: { name: string; role: string }) {
  return (
    <main className="p-5 sm:p-8">
      <section className="rounded-xl border border-[var(--hq-line)] bg-[linear-gradient(125deg,#1b292d,#172124)] p-6 sm:p-8">
        <p className="text-xs font-semibold tracking-[.18em] text-[#8cbde0]">PERSONAL HQ</p>
        <h2 className="mt-3 max-w-xl text-2xl font-semibold tracking-[-.05em] text-[var(--hq-cream)]">
          A calm home for the things you want to keep moving.
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--hq-muted)]">
          Your first workspace is ready. Calendar, goals, and personal insights will take shape here as you add them.
        </p>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <h2 className="col-span-full text-sm font-semibold tracking-[.14em] text-[#b8c5c7] uppercase">Today</h2>
        {cards.map(({ title, text, icon: Icon }) => (
          <article key={title} className="min-h-40 rounded-xl border border-[var(--hq-line)] bg-[#162023] p-5">
            <Icon className="text-[#8cbde0]" size={19} />
            <h3 className="mt-6 text-sm font-semibold text-[var(--hq-cream)]">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--hq-muted)]">{text}</p>
          </article>
        ))}
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
