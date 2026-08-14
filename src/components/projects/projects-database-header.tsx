"use client";

interface ProjectsDatabaseHeaderProps {
  search?: string;
}

export function ProjectsDatabaseHeader({
  search,
}: ProjectsDatabaseHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-[#29383d] pb-3">
      <div className="flex items-center gap-2">
        <span className="text-sm">??</span>

        <span className="text-sm font-medium text-[#f2eadf]">
          Projects
        </span>

        <span className="rounded-md bg-[#20292c] px-1.5 py-0.5 text-[10px] text-[#667b84]">
          Database
        </span>

        {search && (
          <span className="text-xs text-[#53676f]">
            · filtered by &quot;{search}&quot;
          </span>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          className="flex h-7 items-center gap-1.5 rounded-md px-2 text-xs text-[#667b84] transition hover:bg-[#182124] hover:text-[#91a6b2]"
        >
          <span>?</span>
          <span className="hidden sm:inline">Open</span>
        </button>

        <button
          type="button"
          className="flex h-7 items-center gap-1.5 rounded-md px-2 text-xs text-[#667b84] transition hover:bg-[#182124] hover:text-[#91a6b2]"
        >
          <span>•••</span>
        </button>
      </div>
    </div>
  );
}
