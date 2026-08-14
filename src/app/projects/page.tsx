import { verifyCEOSession } from "@/src/lib/ceo-auth";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/src/lib/supabase/admin";
import { ProjectsDatabase } from "@/src/components/projects/projects-database";
import { ProjectsBoard } from "@/src/components/projects/projects-board";
import { ProjectsTimeline } from "@/src/components/projects/projects-timeline";
import { ProjectsDatabaseHeader } from "@/src/components/projects/projects-database-header";
import { ProjectsViewsBar } from "@/src/components/projects/projects-views-bar";
import { ProjectsPageHeader } from "@/src/components/projects/projects-page-header";

export const metadata = {
  title: "Projects Update - Naadix HQ",
};

interface SearchParams {
  status?: string;
  category?: string;
  search?: string;
  view?: string;
}

export default async function ProjectsDashboardPage(props: {
  searchParams?: Promise<SearchParams>;
}) {
  const hasSession = await verifyCEOSession();

  if (!hasSession) {
    redirect("/projects/ceo-login");
  }

  const searchParams = await props.searchParams;
  const supabase = createAdminClient();

  let query = supabase
    .from("projects")
    .select("*")
    .neq("status", "ARCHIVED")
    .order("updated_at", { ascending: false });

  if (searchParams?.status && searchParams.status !== "all") {
    query = query.eq("status", searchParams.status);
  }

  if (searchParams?.category) {
    query = query.eq("category", searchParams.category);
  }

  if (searchParams?.search) {
    query = query.or(
      `name.ilike.%${searchParams.search}%,short_description.ilike.%${searchParams.search}%`,
    );
  }

  const { data: projectsData } = await query;
  const projects = projectsData ?? [];

  return (
    <div className="min-h-screen bg-[#0b1214] text-[#e5ded3]">
      <main className="min-h-screen">
        <div className="mx-auto max-w-6xl px-6 py-8 md:px-10">
          <div className="mb-6 flex items-center justify-between">
            <div className="text-xs text-[#53676f]">
              Naadix HQ / Projects
            </div>

            <form action="/api/projects/ceo/logout" method="POST">
              <button
                type="submit"
                className="rounded-md px-2 py-1.5 text-xs text-[#667b84] transition hover:bg-[#182124] hover:text-[#f2eadf]"
              >
                Logout
              </button>
            </form>
          </div>

          <ProjectsPageHeader projectCount={projects.length} />

          <ProjectsViewsBar
            view={searchParams?.view ?? "table"}
            search={searchParams?.search}
            status={searchParams?.status}
            category={searchParams?.category}
          />

          <div className="mt-4">
            {searchParams?.view === "board" ? (
              <ProjectsBoard projects={projects} />
            ) : searchParams?.view === "timeline" ? (
              <ProjectsTimeline projects={projects} />
            ) : (
              <ProjectsDatabase projects={projects} />
            )}
          </div>

          <div className="mt-4">
            <ProjectsDatabaseHeader
              search={searchParams?.search}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
