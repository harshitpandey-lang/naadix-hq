import { Bell } from "lucide-react";
import { SignOutButton } from "./sign-out-button";

export function DashboardHeader({ name }: { name: string }) {
  const now = new Date();
  const greeting = now.getHours() < 12 ? "morning" : now.getHours() < 18 ? "afternoon" : "evening";
  const date = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(now);

  return (
    <header className="flex items-start justify-between gap-4 border-b border-[var(--hq-line)] px-5 py-5 sm:px-8">
      <div>
        <p className="text-xs font-semibold tracking-[.18em] text-[#8cbde0]">OVERVIEW</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-[-.05em] text-[var(--hq-cream)]">
          Good {greeting}, {name.split(" ")[0]}.
        </h1>
        <p className="mt-1 text-sm text-[var(--hq-muted)]">{date}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="hidden rounded-md p-2 text-[var(--hq-muted)] sm:block" aria-label="Notifications coming soon" title="Notifications coming soon">
          <Bell size={18} />
        </span>
        <div className="hidden sm:block"><SignOutButton /></div>
      </div>
    </header>
  );
}
