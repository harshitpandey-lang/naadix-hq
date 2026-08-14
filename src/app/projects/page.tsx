import { verifyCEOSession } from "@/src/lib/ceo-auth";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/src/lib/supabase/admin";
import { ProjectList } from "@/src/components/projects/project-list";
import { ProjectStats } from "@/src/components/projects/project-stats";

export const metadata = {
  title: "Project Portfolio - Naadix HQ CEO Portal",
};

interface SearchParams {
  status?: string;
  category?: string;
  search?: string;
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

  // Build query
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

  const categories = [
    "Robotics & Embedded Systems",
    "AI & Automation",
    "Web & EdTech",
    "Sustainability / AgriTech",
  ];

  const recentlyUpdated = projects.slice(0, 3);
  const activeProjects = projects.filter((p) => p.status === "ACTIVE");
  const projectsByCategory = categories.map((cat) => ({
    category: cat,
    projects: projects.filter((p) => p.category === cat),
  }));

  return (
    <div className="min-h-screen bg-[var(--hq)] text-white">
      {/* Header */}
      <header className="border-b border-[var(--hq-line)] bg-[var(--hq-panel)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--hq-cream)]">
              PROJECT PORTFOLIO
            </h1>
            <p className="text-sm text-[var(--hq-muted)]">
              Project updates, technical documentation and current work
            </p>
          </div>
          <form action="/api/projects/ceo/logout" method="POST">
            <button className="px-4 py-2 text-sm font-medium text-[var(--hq-muted)] hover:text-[var(--hq-cream)] transition">
              Logout
            </button>
          </form>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats */}
        <ProjectStats projects={projects} />

        {/* Recently Updated */}
        {recentlyUpdated.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[var(--hq-cream)] mb-6">
              RECENTLY UPDATED
            </h2>
            <ProjectList projects={recentlyUpdated} />
          </section>
        )}

        {/* Active Projects */}
        {activeProjects.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[var(--hq-cream)] mb-6">
              ACTIVE PROJECTS
            </h2>
            <ProjectList projects={activeProjects} />
          </section>
        )}

        {/* Projects by Category */}
        {projectsByCategory.map(
          ({ category, projects: categoryProjects }) =>
            categoryProjects.length > 0 && (
              <section key={category} className="mb-12">
                <h2 className="text-2xl font-bold text-[var(--hq-cream)] mb-6">
                  {category.toUpperCase()}
                </h2>
                <ProjectList projects={categoryProjects} />
              </section>
            ),
        )}

        {projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[var(--hq-muted)] text-lg">
              No projects yet
            </p>
          </div>
        )}
      </main>
    </div>
  );
}