import { verifyCEOSession } from "@/src/lib/ceo-auth";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/src/lib/supabase/admin";
import Link from "next/link";
import { ProjectHeader } from "@/src/components/projects/project-header";
import { ProjectActionsList } from "@/src/components/projects/project-actions-list";
import { ProjectsSidebar } from "@/src/components/projects/projects-sidebar";
import { ProjectsMobileHeader } from "@/src/components/projects/projects-mobile-header";
import { ProjectProperties } from "@/src/components/projects/project-properties";

export const metadata = {
  title: "Project Detail - Naadix HQ",
};

export default async function ProjectDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const hasSession = await verifyCEOSession();

  if (!hasSession) {
    redirect("/projects/ceo-login");
  }

  const { slug } = await props.params;
  const supabase = createAdminClient();

  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !project) {
    redirect("/projects");
  }

  const { data: itemsData } = await supabase
    .from("project_items")
    .select("*")
    .eq("project_id", project.id)
    .order("position", { ascending: true });

  const { data: actionsData } = await supabase
    .from("project_actions")
    .select("*")
    .eq("project_id", project.id)
    .order("position", { ascending: true });

  const items = itemsData ?? [];
  const actions = actionsData ?? [];

  const itemsBySection: Record<string, typeof items> = {};

  items.forEach((item) => {
    if (!itemsBySection[item.section]) {
      itemsBySection[item.section] = [];
    }

    itemsBySection[item.section].push(item);
  });

  const progress = Math.min(
    100,
    Math.max(0, Number(project.progress ?? 0)),
  );

  return (
    <div className="min-h-screen bg-[#0b1214] text-[#e5ded3]">
      <ProjectsSidebar />
      <ProjectsMobileHeader />

      <main className="min-h-screen md:ml-60">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 md:px-10">
          <div className="mb-8 flex items-center justify-between">
            <Link
              href="/projects"
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-[#667b84] transition hover:bg-[#182124] hover:text-[#f2eadf]"
            >
              <span>?</span>
              <span>Projects</span>
            </Link>

            <form action="/api/projects/ceo/logout" method="POST">
              <button
                type="submit"
                className="rounded-md px-2 py-1.5 text-xs text-[#667b84] transition hover:bg-[#182124] hover:text-[#f2eadf]"
              >
                Logout
              </button>
            </form>
          </div>

          <header className="border-b border-[#29383d] pb-10">
            <div className="mb-5 text-4xl">
              ??
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[#f2eadf] sm:text-4xl md:text-5xl lg:text-6xl">
              {project.name}
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-[#788990]">
              {project.short_description}
            </p>

            <div className="mt-6 max-w-2xl">
              <ProjectProperties
                category={project.category}
                status={project.status}
                progress={progress}
                slug={project.slug}
              />
            </div>
          </header>

          <section className="mt-10">
            <ProjectHeader
              name={project.name}
              category={project.category}
              status={project.status}
              progress={project.progress}
              updated_at={project.updated_at}
            />
          </section>

          {Object.entries(itemsBySection).map(
            ([section, sectionItems]) => (
              <section key={section} className="mt-12">
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-xs text-[#53676f]">
                    ?
                  </span>

                  <h2 className="text-sm font-semibold text-[#f2eadf]">
                    {section}
                  </h2>

                  <span className="rounded-md bg-[#202a2d] px-1.5 py-0.5 text-[10px] text-[#667b84]">
                    {sectionItems.length}
                  </span>
                </div>

                <div className="overflow-hidden border-y border-[#29383d]">
                  {sectionItems.map((item) => (
                    <div
                      key={item.id}
                      className="border-b border-[#202a2d] px-2 py-4 last:border-b-0 hover:bg-[#111a1c]"
                    >
                      <div className="text-sm text-[#d8d1c7]">
                        {item.title}
                      </div>

                      {item.description && (
                        <p className="mt-1 max-w-3xl text-xs leading-6 text-[#667b84]">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ),
          )}

          <section className="mt-12">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-xs text-[#53676f]">
                ?
              </span>

              <h2 className="text-sm font-semibold text-[#f2eadf]">
                Actions
              </h2>

              <span className="rounded-md bg-[#202a2d] px-1.5 py-0.5 text-[10px] text-[#667b84]">
                {actions.length}
              </span>
            </div>

            <div className="border-y border-[#29383d] py-2">
              <ProjectActionsList
                projectSlug={project.slug}
                actions={actions}
              />
            </div>
          </section>

          <footer className="mt-12 border-t border-[#29383d] pt-5">
            <Link
              href="/projects"
              className="text-xs text-[#667b84] transition hover:text-[#f2eadf]"
            >
              ? Back to Projects
            </Link>
          </footer>
        </div>
      </main>
    </div>
  );
}
