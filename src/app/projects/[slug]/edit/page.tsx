import { verifyCEOSession } from "@/src/lib/ceo-auth";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/src/lib/supabase/admin";
import Link from "next/link";
import { ProjectEditor } from "@/src/components/projects/project-editor";
import { ProjectItemsManager } from "@/src/components/projects/project-items-manager";
import { ProjectActionsManager } from "@/src/components/projects/project-actions-manager";

export const metadata = {
  title: "Edit Project - Naadix HQ CEO Portal",
};

export default async function ProjectEditPage(props: {
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

  // Fetch project items
  const { data: items = [] } = await supabase
    .from("project_items")
    .select("*")
    .eq("project_id", project.id)
    .order("position", { ascending: true });

  // Fetch project actions
  const { data: actions = [] } = await supabase
    .from("project_actions")
    .select("*")
    .eq("project_id", project.id)
    .order("position", { ascending: true });

  return (
    <div className="min-h-screen bg-[var(--hq)] text-white">
      {/* Header */}
      <header className="border-b border-[var(--hq-line)] bg-[var(--hq-panel)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href={`/projects/${slug}`}
            className="text-[var(--hq-muted)] hover:text-[var(--hq-cream)] transition"
          >
            ← Back to Project
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-[var(--hq-cream)] mb-12">
          Edit Project
        </h1>

        <ProjectEditor project={project} />

        <hr className="my-12 border-[var(--hq-line)]" />

        <ProjectActionsManager
          project={project}
          actions={actions}
        />

        <hr className="my-12 border-[var(--hq-line)]" />

        <ProjectItemsManager
          project={project}
          items={items}
        />
      </main>
    </div>
  );
}
