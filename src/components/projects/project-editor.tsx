"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProjectEditorProps {
  project: {
    id: string;
    name: string;
    slug: string;
    category: string;
    status: string | null;
    progress: number | null;
    short_description: string | null;
    overview: string | null;
    current_status: string | null;
    key_learnings: string | null;
    challenges: string | null;
    technical_documentation: string | null;
    skills: string[] | null;
    technologies: string[] | null;
    contributors: string | null;
    notes: string | null;
    github_url: string | null;
  };
}

export function ProjectEditor({ project }: ProjectEditorProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(project);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArrayChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "skills" | "technologies",
  ) => {
    const value = e.target.value.split(",").map((v) => v.trim());
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/projects/${project.slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update project");

      router.push(`/projects/${project.slug}`);
      router.refresh();
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Failed to update project");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {/* Basic Info */}
      <div className="border-t border-[var(--hq-line)] pt-8">
        <h2 className="text-xl font-bold text-[var(--hq-cream)] mb-6">
          Basic Information
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--hq-cream)] mb-2">
              Project Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-[var(--hq-panel)] border border-[var(--hq-line)] rounded text-[var(--hq-cream)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--hq-cream)] mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-[var(--hq-panel)] border border-[var(--hq-line)] rounded text-[var(--hq-cream)] focus:outline-none focus:border-[var(--accent)]"
              >
                <option>Robotics & Embedded Systems</option>
                <option>AI & Automation</option>
                <option>Web & EdTech</option>
                <option>Sustainability / AgriTech</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--hq-cream)] mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-[var(--hq-panel)] border border-[var(--hq-line)] rounded text-[var(--hq-cream)] focus:outline-none focus:border-[var(--accent)]"
              >
                <option>PLANNED</option>
                <option>ACTIVE</option>
                <option>PAUSED</option>
                <option>COMPLETED</option>
                <option>ARCHIVED</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--hq-cream)] mb-2">
                Progress (0-100)
              </label>
              <input
                type="number"
                name="progress"
                min="0"
                max="100"
                value={formData.progress ?? ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-[var(--hq-panel)] border border-[var(--hq-line)] rounded text-[var(--hq-cream)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--hq-cream)] mb-2">
                GitHub URL
              </label>
              <input
                type="text"
                name="github_url"
                value={formData.github_url || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-[var(--hq-panel)] border border-[var(--hq-line)] rounded text-[var(--hq-cream)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--hq-cream)] mb-2">
              Short Description
            </label>
            <textarea
              name="short_description"
              value={formData.short_description || ""}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-4 py-2 bg-[var(--hq-panel)] border border-[var(--hq-line)] rounded text-[var(--hq-cream)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--hq-cream)] mb-2">
              Skills (comma-separated)
            </label>
            <input
              type="text"
              value={formData.skills?.join(", ") || ""}
              onChange={(e) => handleArrayChange(e, "skills")}
              className="w-full px-4 py-2 bg-[var(--hq-panel)] border border-[var(--hq-line)] rounded text-[var(--hq-cream)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--hq-cream)] mb-2">
              Technologies (comma-separated)
            </label>
            <input
              type="text"
              value={formData.technologies?.join(", ") || ""}
              onChange={(e) => handleArrayChange(e, "technologies")}
              className="w-full px-4 py-2 bg-[var(--hq-panel)] border border-[var(--hq-line)] rounded text-[var(--hq-cream)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="border-t border-[var(--hq-line)] pt-8">
        <h2 className="text-xl font-bold text-[var(--hq-cream)] mb-6">
          Content
        </h2>

        <div className="space-y-4">
          {[
            { label: "Overview", name: "overview" },
            { label: "Current Status", name: "current_status" },
            { label: "Key Learnings", name: "key_learnings" },
            { label: "Challenges", name: "challenges" },
            { label: "Technical Documentation", name: "technical_documentation" },
            { label: "Contributors", name: "contributors" },
            { label: "Notes", name: "notes" },
          ].map(({ label, name }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-[var(--hq-cream)] mb-2">
                {label}
              </label>
              <textarea
                name={name}
                value={
                  formData[name as keyof typeof formData] as string | null || ""
                }
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 bg-[var(--hq-panel)] border border-[var(--hq-line)] rounded text-[var(--hq-cream)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-8 border-t border-[var(--hq-line)]">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-[var(--accent)] text-white rounded font-medium hover:opacity-90 disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-[var(--hq-line)] text-[var(--hq-cream)] rounded font-medium hover:bg-[var(--hq-panel)]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
