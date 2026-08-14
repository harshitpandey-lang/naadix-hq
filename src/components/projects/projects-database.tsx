"use client";

import Link from "next/link";

interface Project {
  id: string;
  slug: string;
  name: string;
  category: string;
  status: string;
  short_description?: string | null;
  progress?: number | null;
  updated_at?: string | null;
}

interface ProjectsDatabaseProps {
  projects: Project[];
}

function statusLabel(status: string) {
  switch (status) {
    case "ACTIVE":
      return "Active";
    case "COMPLETED":
      return "Completed";
    case "PLANNED":
      return "Planned";
    case "PAUSED":
      return "Paused";
    default:
      return status;
  }
}

function statusClass(status: string) {
  switch (status) {
    case "ACTIVE":
      return "bg-[#263b32] text-[#8fbda1]";
    case "COMPLETED":
      return "bg-[#29352f] text-[#9caf9f]";
    case "PLANNED":
      return "bg-[#302f28] text-[#b9ad83]";
    case "PAUSED":
      return "bg-[#352b2b] text-[#b99797]";
    default:
      return "bg-[#202a2d] text-[#91a6b2]";
  }
}

function formatDate(date?: string | null) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function ProjectsDatabase({
  projects,
}: ProjectsDatabaseProps) {
  return (
    <div className="overflow-x-auto rounded-md border border-[#29383d] bg-[#0f1719]">
      <div className="min-w-[870px]">
        <div className="grid grid-cols-[minmax(280px,1fr)_210px_130px_120px_130px] border-b border-[#29383d] bg-[#131d1f] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[#53676f]">
          <div>Name</div>
          <div>Category</div>
          <div>Status</div>
          <div>Progress</div>
          <div>Updated</div>
        </div>

        {projects.map((project) => {
          const progress = Math.min(
            100,
            Math.max(0, Number(project.progress ?? 0)),
          );

          return (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="grid min-w-[870px] grid-cols-[minmax(280px,1fr)_210px_130px_120px_130px] items-center border-b border-[#202a2d] px-4 py-3.5 text-sm transition hover:bg-[#151f21]"
            >
              <div className="min-w-0 pr-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#202a2d] text-xs">
                    ??
                  </span>

                  <div className="min-w-0">
                    <div className="truncate font-medium text-[#e5ded3]">
                      {project.name}
                    </div>

                    {project.short_description && (
                      <div className="mt-0.5 truncate text-xs text-[#53676f]">
                        {project.short_description}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="truncate pr-4 text-xs text-[#667b84]">
                {project.category}
              </div>

              <div>
                <span
                  className={`inline-flex rounded-md px-2 py-1 text-[10px] font-medium ${statusClass(
                    project.status,
                  )}`}
                >
                  {statusLabel(project.status)}
                </span>
              </div>

              <div className="pr-5">
                <div className="mb-1 text-[10px] text-[#667b84]">
                  {progress}%
                </div>

                <div className="h-1 overflow-hidden rounded-full bg-[#202a2d]">
                  <div
                    className="h-full rounded-full bg-[#6d7f86]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="text-xs text-[#53676f]">
                {formatDate(project.updated_at)}
              </div>
            </Link>
          );
        })}

        <button
          type="button"
          className="flex w-full items-center gap-3 px-4 py-3 text-left text-xs text-[#53676f] transition hover:bg-[#151f21] hover:text-[#91a6b2]"
        >
          <span className="text-sm">+</span>
          <span>New project</span>
        </button>
      </div>
    </div>
  );
}
