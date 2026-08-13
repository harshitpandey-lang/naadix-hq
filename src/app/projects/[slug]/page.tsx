import { verifyCEOSession } from "@/lib/ceo-auth";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ProjectHeader } from "@/components/projects/project-header";
import { ProjectActionsList } from "@/components/projects/project-actions-list";

export const metadata = {
  title: "Project Detail - Naadix HQ CEO Portal",
};

export default async function ProjectDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const hasSession = await verifyCEOSession();

  if (!hasSession) {
    redirect("/projects/ceo-login");
  }

  const { slug } = await props.params;
  const supabase = await createClient();

  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !project) {
    redirect("/projects");
  }

  const { data: items = [] } = await supabase
    .from("project_items")
    .select("*")
    .eq("project_id", project.id)
    .order("position", { ascending: true });

  const { data: actions = [] } = await supabase
    .from("project_actions")
    .select("*")
    .eq("project_id", project.id)
    .order("position", { ascending: true });

  // Group items by section
  const itemsBySection: Record<string, typeof items> = {};
  items.forEach((item) => {
    if (!itemsBySection[item.section]) {
      itemsBySection[item.section] = [];
    }
    itemsBySection[item.section].push(item);
  });

  return (
    <div className="min-h-screen bg-[var(--hq)] text-white">
      {/* Header */}
      <header className="border-b border-[var(--hq-line)] bg-[var(--hq-panel)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/projects"
            className="text-[var(--hq-muted)] hover:text-[var(--hq-cream)] transition"
          >
            ← Back to Projects
          </Link>
          <Link
            href={`/projects/${slug}/edit`}
            className="px-4 py-2 bg-[var(--accent)] text-white rounded font-medium hover:opacity-90"
          >
            Edit Project
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <ProjectHeader
          name={project.name}
          category={project.category}
          status={project.status}
          progress={project.progress}
          updated_at={project.updated_at}
        />

        <div className="space-y-16">
          {/* Executive Summary */}
          {project.overview && (
            <section id="overview" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-[var(--hq-cream)] mb-4">
                EXECUTIVE SUMMARY
              </h2>
              <div className="text-[var(--hq-muted)] leading-relaxed whitespace-pre-wrap">
                {project.overview}
              </div>
            </section>
          )}

          {/* What I Completed */}
          {(itemsBySection.completed_work?.length > 0 ||
            project.overview) && (
            <section id="completed_work" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-[var(--hq-cream)] mb-4">
                WHAT I COMPLETED
              </h2>
              <div className="space-y-4">
                {itemsBySection.completed_work?.map((item) => (
                  <div
                    key={item.id}
                    className="border-l-4 border-[var(--accent)] pl-4 py-2"
                  >
                    <h3 className="font-semibold text-[var(--hq-cream)]">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-sm text-[var(--hq-muted)] mt-1">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Current Status */}
          {project.current_status && (
            <section id="current_status" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-[var(--hq-cream)] mb-4">
                CURRENT STATUS
              </h2>
              <div className="text-[var(--hq-muted)] leading-relaxed whitespace-pre-wrap">
                {project.current_status}
              </div>
            </section>
          )}

          {/* Key Learnings */}
          {(itemsBySection.learnings?.length > 0 ||
            project.key_learnings) && (
            <section id="learnings" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-[var(--hq-cream)] mb-4">
                KEY LEARNINGS / INSIGHTS
              </h2>
              <div className="space-y-4">
                {itemsBySection.learnings?.map((item) => (
                  <div key={item.id} className="bg-[var(--hq-panel)] p-4 rounded">
                    <h3 className="font-semibold text-[var(--hq-cream)]">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-sm text-[var(--hq-muted)] mt-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
                {project.key_learnings && (
                  <div className="text-[var(--hq-muted)] leading-relaxed whitespace-pre-wrap">
                    {project.key_learnings}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Challenges */}
          {(itemsBySection.challenges?.length > 0 ||
            project.challenges) && (
            <section id="challenges" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-[var(--hq-cream)] mb-4">
                CHALLENGES / BLOCKERS
              </h2>
              <div className="space-y-4">
                {itemsBySection.challenges?.map((item) => (
                  <div
                    key={item.id}
                    className="border-l-4 border-red-500 pl-4 py-2"
                  >
                    <h3 className="font-semibold text-[var(--hq-cream)]">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-sm text-[var(--hq-muted)] mt-1">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
                {project.challenges && (
                  <div className="text-[var(--hq-muted)] leading-relaxed whitespace-pre-wrap">
                    {project.challenges}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Next Actions */}
          {actions.length > 0 && (
            <section id="next_actions" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-[var(--hq-cream)] mb-4">
                NEXT ACTIONS
              </h2>
              <ProjectActionsList
                projectSlug={slug}
                actions={actions}
              />
            </section>
          )}

          {/* Technical Documentation */}
          {project.technical_documentation && (
            <section id="technical_documentation" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-[var(--hq-cream)] mb-4">
                TECHNICAL DOCUMENTATION
              </h2>
              <div className="text-[var(--hq-muted)] leading-relaxed whitespace-pre-wrap">
                {project.technical_documentation}
              </div>
            </section>
          )}

          {/* Skills & Technologies */}
          {(project.skills?.length > 0 ||
            project.technologies?.length > 0) && (
            <section id="skills" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-[var(--hq-cream)] mb-4">
                SKILLS & TECHNOLOGIES
              </h2>
              <div className="grid grid-cols-2 gap-8">
                {project.skills?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-[var(--hq-cream)] mb-3">
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-[var(--accent)] text-white rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {project.technologies?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-[var(--hq-cream)] mb-3">
                      Technologies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-[var(--hq-panel)] border border-[var(--hq-line)] text-[var(--hq-cream)] rounded-full text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
