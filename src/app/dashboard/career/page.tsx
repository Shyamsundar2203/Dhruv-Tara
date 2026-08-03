"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import AppShell from "@/components/layout/AppShell";
import CustomCursor from "@/components/common/CustomCursor";
import { useODTStore, JobApp } from "@/lib/store/odt.store";

const NeuralBackground = dynamic(() => import("@/components/three/NeuralBackground"), { ssr: false });

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } } };

const STATUSES: { id: JobApp["status"]; label: string; color: string }[] = [
  { id: "wishlist",     label: "Wishlist",     color: "var(--text-muted)" },
  { id: "applied",      label: "Applied",      color: "var(--accent-400)" },
  { id: "interviewing", label: "Interviewing", color: "var(--warning)" },
  { id: "offer",        label: "Offer Received", color: "var(--success)" },
  { id: "rejected",     label: "Rejected",     color: "var(--danger)" },
];

export default function CareerPage() {
  const { jobApps, addJobApp, updateJobAppStatus, deleteJobApp } = useODTStore();
  const [showAddModal, setShowAddModal] = useState(false);

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [salary, setSalary] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<JobApp["status"]>("applied");

  const handleCreateJob = () => {
    if (!company.trim() || !role.trim()) return;
    addJobApp({
      company: company.trim(),
      role: role.trim(),
      salary_range: salary.trim() || undefined,
      notes: notes.trim() || undefined,
      status,
      applied_date: new Date().toISOString().slice(0, 10),
    });
    setCompany("");
    setRole("");
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
                  Career & Opportunity Pipeline
                </p>
                <h1 className="font-display text-3xl font-bold text-gradient-primary">Career Hub</h1>
              </div>
              <button onClick={() => setShowAddModal(true)} className="btn btn-primary btn-sm">
                + Add Application
              </button>
            </motion.div>

            {/* Application Pipeline Grid */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-5">
              {STATUSES.map((col) => {
                const apps = jobApps.filter((j) => j.status === col.id);
                return (
                  <div key={col.id} className="flex flex-col gap-3">
                    <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-normal)" }}>
                      <span className="text-xs font-mono font-bold uppercase" style={{ color: col.color }}>{col.label}</span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{ background: `${col.color}20`, color: col.color }}>{apps.length}</span>
                    </div>

                    <div className="flex flex-col gap-3 min-h-[150px]">
                      {apps.map((app) => (
                        <div key={app.id} className="glass rounded-xl p-4 flex flex-col justify-between">
                          <div>
                            <h3 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{app.role}</h3>
                            <p className="text-xs font-mono" style={{ color: "var(--primary-300)" }}>{app.company}</p>
                            {app.salary_range && (
                              <p className="text-xs mt-2 font-mono" style={{ color: "var(--success)" }}>💰 {app.salary_range}</p>
                            )}
                            {app.notes && (
                              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{app.notes}</p>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-3 border-t pt-2" style={{ borderColor: "var(--border-subtle)" }}>
                            <select
                              value={app.status}
                              onChange={(e) => updateJobAppStatus(app.id, e.target.value as any)}
                              className="text-xs input"
                              style={{ padding: "2px 4px", width: "auto" }}
                            >
                              {STATUSES.map((s) => (
                                <option key={s.id} value={s.id}>{s.label}</option>
                              ))}
                            </select>
                            <button onClick={() => deleteJobApp(app.id)} className="text-xs text-danger">✕</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Add Job Modal */}
          <AnimatePresence>
            {showAddModal && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="cmd-backdrop flex items-center justify-center" onClick={() => setShowAddModal(false)}>
                <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="glass rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                  <h3 className="font-display text-lg font-bold text-gradient-primary mb-4">Track Job Application</h3>
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="text-xs font-mono text-muted mb-1 block">Company Name</label>
                      <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. OpenAI / Google / Startup" className="input text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-mono text-muted mb-1 block">Role Title</label>
                      <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. AI Research Intern" className="input text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-mono text-muted mb-1 block">Salary / Stipend</label>
                      <input value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="e.g. ₹50,000/mo" className="input text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-mono text-muted mb-1 block">Status</label>
                      <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="input text-sm">
                        {STATUSES.map((s) => (
                          <option key={s.id} value={s.id}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button onClick={handleCreateJob} className="btn btn-primary btn-md flex-1">Save Application</button>
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
