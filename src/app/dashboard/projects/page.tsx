"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import AppShell from "@/components/layout/AppShell";
import CustomCursor from "@/components/common/CustomCursor";
import { useODTStore } from "@/lib/store/odt.store";

const NeuralBackground = dynamic(() => import("@/components/three/NeuralBackground"), { ssr: false });

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } } };

export default function ProjectsPage() {
  const { projects, addProject, deleteProject } = useODTStore();
  const [showAddModal, setShowAddModal] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [status, setStatus] = useState<"planning" | "in_development" | "deployed" | "archived">("in_development");

  const handleCreateProject = () => {
    if (!name.trim()) return;
    addProject({
      name: name.trim(),
      description: description.trim(),
      tech_stack: techStack.split(",").map((s) => s.trim()).filter(Boolean),
      github_url: githubUrl.trim() || undefined,
      status,
      progress: status === "deployed" ? 100 : status === "in_development" ? 60 : 15,
    });
    setName("");
    setDescription("");
    setShowAddModal(false);
  };

  return (
    <>
      <CustomCursor />
      <NeuralBackground />
      <AppShell>
        <div className="page-container" style={{ position: "relative", zIndex: 1 }}>
          {/* Header */}
          <motion.div variants={container} initial="hidden" animate="show" className="mb-6">
            <motion.div variants={item} className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                  Sovereign Software Infrastructure
                </p>
                <h1 className="font-display text-3xl font-bold text-gradient-primary">Projects & Repos</h1>
              </div>
              <button onClick={() => setShowAddModal(true)} className="btn btn-primary btn-sm">
                + New Project
              </button>
            </motion.div>

            {/* Project List */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
              {projects.map((proj) => (
                <motion.div key={proj.id} variants={item} className="glass rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="font-display text-base font-bold" style={{ color: "var(--primary-300)" }}>{proj.name}</h2>
                      <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full" style={{ background: "rgba(91,77,255,0.15)", color: "var(--accent-400)" }}>
                        {proj.status.replace("_", " ")}
                      </span>
                    </div>

                    <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>{proj.description}</p>

                    {/* Tech Stack Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {proj.tech_stack.map((tech) => (
                        <span key={tech} className="text-xs px-2 py-0.5 rounded" style={{ background: "var(--bg-elevated)", color: "var(--text-muted)", border: "1px solid var(--border-normal)" }}>
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span style={{ color: "var(--text-muted)" }}>Completion</span>
                        <span style={{ color: "var(--success)", fontFamily: "var(--font-mono)" }}>{proj.progress}%</span>
                      </div>
                      <div className="progress-track" style={{ height: "6px" }}>
                        <div className="progress-fill" style={{ width: `${proj.progress}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t pt-3" style={{ borderColor: "var(--border-normal)" }}>
                    {proj.github_url ? (
                      <a href={proj.github_url} target="_blank" rel="noreferrer" className="text-xs text-accent hover:underline flex items-center gap-1 font-mono">
                        🐙 View GitHub Repo →
                      </a>
                    ) : (
                      <span className="text-xs text-muted font-mono">Local Project</span>
                    )}

                    <button onClick={() => deleteProject(proj.id)} className="text-xs text-danger hover:opacity-80">
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Create Modal */}
          <AnimatePresence>
            {showAddModal && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="cmd-backdrop flex items-center justify-center" onClick={() => setShowAddModal(false)}>
                <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="glass rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                  <h3 className="font-display text-lg font-bold text-gradient-primary mb-4">Add New Project</h3>
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="text-xs font-mono text-muted mb-1 block">Project Name</label>
                      <input value={name} onChange={(e) => setName(e.target.value)} className="input text-sm" placeholder="e.g. AI Speech Agent" />
                    </div>
                    <div>
                      <label className="text-xs font-mono text-muted mb-1 block">Description</label>
                      <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="input text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-mono text-muted mb-1 block">Tech Stack (comma-separated)</label>
                      <input value={techStack} onChange={(e) => setTechStack(e.target.value)} placeholder="Next.js, PyTorch, FastAPI" className="input text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-mono text-muted mb-1 block">GitHub Repository URL (Optional)</label>
                      <input value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/..." className="input text-sm" />
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button onClick={handleCreateProject} className="btn btn-primary btn-md flex-1">Create Project</button>
                      <button onClick={() => setShowAddModal(false)} className="btn btn-ghost btn-md">Cancel</button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </AppShell>
    </>
  );
}
