import { ProjectsDatabaseHeader } from "@/src/components/projects/projects-database-header";

interface ProjectsPageHeaderProps {
  projectCount: number;
}

export function ProjectsPageHeader({
  projectCount,
}: ProjectsPageHeaderProps) {
  return (
    <header className="mb-8">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#202a2d] text-2xl">
        ??
      </div>

      <h1 className="text-4xl font-semibold tracking-tight text-[#f2eadf] md:text-5xl">
        Projects Update
      </h1>

      <p className="mt-3 max-w-2xl text-sm leading-6 text-[#667b84]">
        Project updates, technical documentation and current work.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-[#53676f]">
        <span>Naadix HQ</span>

        <span>•</span>

        <span>{projectCount} projects</span>

        <span>•</span>

        <span>Last synced from workspace</span>
      </div>

      <div className="mt-7 h-px bg-[#29383d]" />

      <div className="mt-5">
        <ProjectsDatabaseHeader />
      </div>
    </header>
  );
}
