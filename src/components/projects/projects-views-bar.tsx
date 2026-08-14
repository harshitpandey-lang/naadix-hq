"use client";

import Link from "next/link";

interface ProjectsViewsBarProps {
  view?: string;
  search?: string;
  status?: string;
  category?: string;
}

export function ProjectsViewsBar({
  view = "table",
  search,
  status,
  category,
}: ProjectsViewsBarProps) {
  const buildUrl = (nextView: string) => {
    const params = new URLSearchParams();

    if (status) {
      params.set("status", status);
    }

    if (category) {
      params.set("category", category);
    }

    if (search) {
      params.set("search", search);
    }

    if (nextView !== "table") {
      params.set("view", nextView);
    }

    const query = params.toString();

    return query ? `/projects?${query}` : "/projects";
  };

  const views = [
    {
      id: "table",
      label: "Table",
      icon: "?",
    },
    {
      id: "board",
      label: "Board",
      icon: "?",
    },
    {
      id: "timeline",
      label: "Timeline",
      icon: "?",
    },
  ];

  return (
    <div className="mb-4 flex items-center gap-1 border-b border-[#29383d]">
      {views.map((item) => {
        const active = view === item.id;

        return (
          <Link
            key={item.id}
            href={buildUrl(item.id)}
            className={`flex items-center gap-2 border-b-2 px-3 py-2.5 text-xs transition ${
              active
                ? "border-[#91a6b2] text-[#f2eadf]"
                : "border-transparent text-[#53676f] hover:text-[#91a6b2]"
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
