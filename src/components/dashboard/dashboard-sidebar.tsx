import Link from "next/link";
import {
  BarChart3, BookOpenText, CalendarDays, FolderKanban, GalleryVerticalEnd,
  Goal, LayoutDashboard, Map, Settings,
} from "lucide-react";
import { SignOutButton } from "./sign-out-button";

const primary = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Calendar", href: "/dashboard/calendar", icon: CalendarDays },
  { label: "Goals", href: "/dashboard/goals", icon: Goal },
  { label: "Analytics", icon: BarChart3 },
];
const secondary = [
  { label: "Journal", icon: BookOpenText }, { label: "Trips", icon: Map },
  { label: "Gallery", icon: GalleryVerticalEnd }, { label: "Projects", icon: FolderKanban },
];

function NavItems({ items }: { items: (typeof primary | typeof secondary) }) {
  return (
    <div className="grid gap-1">
      {items.map((item) => {
        const Icon = item.icon;
        const href = "href" in item ? item.href : null;
        const isActive = href === "/dashboard" || href === "/dashboard/calendar" || href === "/dashboard/goals";

        if (href) {
          return (
            <Link key={item.label} href={href} className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${isActive ? "bg-white/10 text-white" : "text-[#859598] hover:text-white transition"}`}>
              <Icon size={17} />
              {item.label}
            </Link>
          );
        }

        return (
          <span key={item.label} aria-disabled="true" className="flex cursor-not-allowed items-center gap-3 rounded-md px-3 py-2 text-sm text-[#859598]">
            <Icon size={17} />
            {item.label}
            <small className="ml-auto text-[10px] uppercase tracking-[.12em]">Soon</small>
          </span>
        );
      })}
    </div>
  );
}

export function DashboardSidebar({ name, role }: { name: string; role: string }) {
  return (
    <aside className="hidden min-h-screen w-64 shrink-0 border-r border-[var(--hq-line)] bg-[#111a1d] p-4 lg:flex lg:flex-col">
      <p className="px-3 pt-2 text-sm font-black tracking-[.2em] text-[var(--hq-cream)]">NAADIX HQ</p>
      <nav className="mt-10" aria-label="Dashboard navigation">
        <NavItems items={primary} />
        <div className="my-5 border-t border-[var(--hq-line)]" />
        <NavItems items={secondary} />
        <div className="my-5 border-t border-[var(--hq-line)]" />
        <span aria-disabled="true" className="flex cursor-not-allowed items-center gap-3 rounded-md px-3 py-2 text-sm text-[#859598]">
          <Settings size={17} />Settings<small className="ml-auto text-[10px] uppercase tracking-[.12em]">Soon</small>
        </span>
      </nav>
      <div className="mt-auto border-t border-[var(--hq-line)] pt-4">
        <div className="mb-2 flex items-center gap-3 px-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#d9e4ea] text-xs font-bold text-[var(--navy)]">HP</span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{name}</p>
            <p className="truncate text-xs text-[#859598]">{role}</p>
          </div>
        </div>
        <SignOutButton />
      </div>
    </aside>
  );
}
