"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { differenceInDays, format } from "date-fns";
import dynamic from "next/dynamic";
import AppShell from "@/components/layout/AppShell";
import CustomCursor from "@/components/common/CustomCursor";
import HabitHeatmap from "@/components/dashboard/HabitHeatmap";
import { useODTStore, Milestone } from "@/lib/store/odt.store";

const NeuralBackground = dynamic(() => import("@/components/three/NeuralBackground"), { ssr: false });

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } } };

const MISSION_2030 = new Date("2030-01-01");

export default function MissionPage() {
  const { mission, milestones, updateMission, completeMilestone, addMilestone, deleteMilestone } = useODTStore();
  const [editingVision, setEditingVision] = useState(false);
  const [visionText, setVisionText] = useState(mission.vision);
  const [showAddMsModal, setShowAddMsModal] = useState(false);

  // New milestone form
  const [msTitle, setMsTitle] = useState("");
  const [msDesc, setMsDesc] = useState("");
  const [msDate, setMsDate] = useState("2026-12-31");
  const [msCategory, setMsCategory] = useState("Learning");

  const daysRemaining = differenceInDays(MISSION_2030, new Date());
  const completedMs = milestones.filter((m) => m.completed_at).length;
  const progressPct = milestones.length > 0 ? Math.round((completedMs / milestones.length) * 100) : 0;

  const handleSaveVision = () => {
    updateMission({ vision: visionText });
    setEditingVision(false);
  };

  const handleAddMilestone = () => {
    if (!msTitle.trim()) return;
    addMilestone({
      title: msTitle.trim(),
      description: msDesc.trim(),
      target_date: msDate,
      category: msCategory,
    });
    setMsTitle("");
    setMsDesc("");
    setShowAddMsModal(false);
  };

  return (
    <>
      <CustomCursor />
      <NeuralBackground />
      <AppShell>
        <div className="page-container" style={{ position: "relative", zIndex: 1 }}>
          {/* Header */}
          <motion.div variants={container} initial="hidden" animate="show" className="mb-6">
            <motion.div variants={item} className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                  Sovereign Life Strategy
                </p>
                <h1 className="font-display text-4xl font-black text-gradient-primary">{mission.name}</h1>
                <p className="text-sm mt-1" style={{ color: "var(--gold-300)", fontFamily: "var(--font-accent)" }}>
                  &ldquo;{mission.tagline}&rdquo;
                </p>
              </div>

              {/* 2030 Countdown Widget */}
              <motion.div className="glass-gold rounded-2xl px-6 py-4 text-right" whileHover={{ scale: 1.02 }}>
                <p className="text-xs font-semibold tracking-wider uppercase mb-1" style={{ color: "var(--gold-300)", fontFamily: "var(--font-mono)" }}>
                  ⏳ 2030 Sovereign Target
                </p>
                <p className="font-display text-3xl font-black" style={{ color: "var(--gold-400)", textShadow: "0 0 20px rgba(255,215,0,0.5)" }}>
                  {daysRemaining.toLocaleString()}
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>days until singularity</p>
              </motion.div>
            </motion.div>

            {/* Overall Progress Meter */}
            <motion.div variants={item} className="glass rounded-2xl p-6 mb-6">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: "1.2rem" }}>🎯</span>
                  <span className="font-display text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                    MISSION PROGRESS
                  </span>
                </div>
                <span className="font-mono font-bold text-lg" style={{ color: "var(--primary-300)", fontFamily: "var(--font-mono)" }}>
                  {progressPct}% ({completedMs}/{milestones.length} Milestones)
                </span>
              </div>

              <div className="progress-track mb-3" style={{ height: "10px" }}>
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  style={{ background: "linear-gradient(90deg, var(--primary-600), var(--accent-400), var(--gold-400))" }}
                />
              </div>

              <div className="flex justify-between text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                <span>Start: {mission.start_date}</span>
                <span>Target: {mission.target_date}</span>
              </div>
            </motion.div>

            {/* Grid Layout: Vision Canvas & Milestones */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 mb-6">
              {/* Left Column: Vision & Purpose */}
              <motion.div variants={item} className="glass rounded-2xl p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-sm font-bold" style={{ color: "var(--primary-300)", letterSpacing: "0.08em" }}>
                    VISION CANVAS
                  </h2>
                  <button
                    onClick={() => setEditingVision(!editingVision)}
                    className="text-xs btn btn-ghost btn-sm"
                  >
                    {editingVision ? "Cancel" : "✏️ Edit Vision"}
                  </button>
                </div>

                {editingVision ? (
                  <div className="flex flex-col gap-3">
                    <textarea
                      value={visionText}
                      onChange={(e) => setVisionText(e.target.value)}
                      rows={6}
                      className="input text-sm"
                      style={{ lineHeight: 1.6 }}
                    />
                    <button onClick={handleSaveVision} className="btn btn-primary btn-sm">Save Vision</button>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {mission.vision}
                  </p>
                )}

                <div className="border-t pt-4" style={{ borderColor: "var(--border-normal)" }}>
                  <h3 className="font-display text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--accent-400)" }}>
                    Core Purpose
                  </h3>
                  <p className="text-xs leading-relaxed italic" style={{ color: "var(--text-muted)" }}>
                    &ldquo;{mission.purpose}&rdquo;
                  </p>
                </div>
              </motion.div>

              {/* Right 2 Columns: Milestone Achievement Tree */}
              <motion.div variants={item} className="glass rounded-2xl p-6 lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-display text-sm font-bold" style={{ color: "var(--text-primary)", letterSpacing: "0.08em" }}>
                      ACHIEVEMENT MILESTONES
                    </h2>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>Key checkpoints on the road to 2030</p>
                  </div>
                  <button onClick={() => setShowAddMsModal(true)} className="btn btn-primary btn-sm">
                    + Add Milestone
                  </button>
                </div>

                {/* Milestone List */}
                <div className="flex flex-col gap-3">
                  {milestones.map((ms, idx) => {
                    const isDone = !!ms.completed_at;
                    return (
                      <motion.div
                        key={ms.id}
                        className="flex items-center justify-between p-4 rounded-xl gap-4"
                        style={{
                          background: isDone ? "rgba(0,255,136,0.04)" : "var(--bg-elevated)",
                          border: `1px solid ${isDone ? "rgba(0,255,136,0.2)" : "var(--border-normal)"}`,
                        }}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <button
                            onClick={() => completeMilestone(ms.id)}
                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                            style={{
                              background: isDone ? "var(--success)" : "var(--bg-overlay)",
                              border: `2px solid ${isDone ? "var(--success)" : "var(--border-strong)"}`,
                              color: isDone ? "black" : "var(--text-muted)",
                              cursor: "pointer",
                            }}
                          >
                            {isDone ? "✓" : idx + 1}
                          </button>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h4
                                className="text-sm font-semibold"
                                style={{
                                  color: isDone ? "var(--text-muted)" : "var(--text-primary)",
                                  textDecoration: isDone ? "line-through" : "none",
                                }}
                              >
                                {ms.title}
                              </h4>
                              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(91,77,255,0.15)", color: "var(--primary-300)" }}>
                                {ms.category}
                              </span>
                            </div>
                            {ms.description && (
                              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{ms.description}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                            Target: {ms.target_date}
                          </span>
                          <button onClick={() => deleteMilestone(ms.id)} className="text-xs text-danger hover:opacity-80">
                            ✕
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Mission Activity Heatmap */}
            <motion.div variants={item} className="glass rounded-2xl p-6">
              <h2 className="font-display text-sm font-bold mb-4" style={{ color: "var(--text-primary)", letterSpacing: "0.08em" }}>
                MISSION ACTIVITY HEATMAP
              </h2>
              <HabitHeatmap weeks={40} />
            </motion.div>
          </motion.div>

          {/* Add Milestone Modal */}
          <AnimatePresence>
            {showAddMsModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="cmd-backdrop flex items-center justify-center"
                onClick={() => setShowAddMsModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.95, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 10 }}
                  className="glass rounded-2xl p-6 w-full max-w-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="font-display text-lg font-bold text-gradient-primary mb-4">Add Milestone Target</h3>

                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="text-xs font-mono text-muted mb-1 block">Title</label>
                      <input
                        autoFocus
                        value={msTitle}
                        onChange={(e) => setMsTitle(e.target.value)}
                        placeholder="Milestone title..."
                        className="input text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono text-muted mb-1 block">Description</label>
                      <textarea
                        value={msDesc}
                        onChange={(e) => setMsDesc(e.target.value)}
                        placeholder="Details or exit criteria..."
                        className="input text-sm"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-mono text-muted mb-1 block">Category</label>
                        <select
                          value={msCategory}
                          onChange={(e) => setMsCategory(e.target.value)}
                          className="input text-sm"
                        >
                          <option value="Learning">Learning</option>
                          <option value="Projects">Projects</option>
                          <option value="Career">Career</option>
                          <option value="Brand">Brand</option>
                          <option value="Business">Business</option>
                          <option value="Finance">Finance</option>
                          <option value="Mission">Mission</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-mono text-muted mb-1 block">Target Date</label>
                        <input
                          type="date"
                          value={msDate}
                          onChange={(e) => setMsDate(e.target.value)}
                          className="input text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                      <button onClick={handleAddMilestone} className="btn btn-primary btn-md flex-1">
                        Add Milestone
                      </button>
                      <button onClick={() => setShowAddMsModal(false)} className="btn btn-ghost btn-md">
                        Cancel
                      </button>
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
