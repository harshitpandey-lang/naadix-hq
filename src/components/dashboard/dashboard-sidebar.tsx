import Link from "next/link";
import {
  BarChart3, BookOpenText, CalendarDays, FolderKanban, GalleryVerticalEnd,
  Goal, LayoutDashboard, Map, Settings,
} from "lucide-react";
import { SignOutButton } from "./sign-out-button";

const primary = [
  { label: "Overview", icon: LayoutDashboard }, { label: "Calendar", icon: CalendarDays },
  { label: "Goals", icon: Goal }, { label: "Analytics", icon: BarChart3 },
];
const secondary = [
  { label: "Journal", icon: BookOpenText }, { label: "Trips", icon: Map },
  { label: "Gallery", icon: GalleryVerticalEnd }, { label: "Projects", icon: FolderKanban },
];

function NavItems({ items }: { items: typeof primary }) {
  return (
    <div className="grid gap-1">
      {items.map(({ label, icon: Icon }) =>
        label === "Overview" ? (
          <Link key={label} href="/dashboard" className="flex items-center gap-3 rounded-md bg-white/10 px-3 py-2 text-sm font-medium text-white">
            <Icon size={17} />{label}
          </Link>
        ) : (
          <span key={label} aria-disabled="true" className="flex cursor-not-allowed items-center gap-3 rounded-md px-3 py-2 text-sm text-[#859598]">
            <Icon size={17} />{label}<small className="ml-auto text-[10px] uppercase tracking-[.12em]">Soon</small>
          </span>
        ),
      )}
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
