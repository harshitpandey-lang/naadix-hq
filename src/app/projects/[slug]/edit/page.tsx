import { verifyCEOSession } from "@/lib/ceo-auth";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ProjectEditor } from "@/components/projects/project-editor";

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
  const supabase = await createClient();

  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !project) {
    redirect("/projects");
  }

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
      </main>
    </div>
  );
}
