"use client";

interface Section {
  title: string;
  key: string;
  content?: string | null;
}

interface ProjectDocumentProps {
  sections: Section[];
}

export function ProjectDocument({ sections }: ProjectDocumentProps) {
  return (
    <div className="space-y-12">
      {sections.map((section) => {
        if (!section.content) return null;

        return (
          <div key={section.key} id={section.key} className="scroll-mt-20">
            <h2 className="text-2xl font-bold text-[var(--hq-cream)] mb-4">
              {section.title}
            </h2>
            <div className="prose prose-invert max-w-none">
              <div className="text-[var(--hq-muted)] leading-relaxed whitespace-pre-wrap">
                {section.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
