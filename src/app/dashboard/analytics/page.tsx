"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import AppShell from "@/components/layout/AppShell";
import CustomCursor from "@/components/common/CustomCursor";
import HabitHeatmap from "@/components/dashboard/HabitHeatmap";
import { useODTStore } from "@/lib/store/odt.store";

const NeuralBackground = dynamic(() => import("@/components/three/NeuralBackground"), { ssr: false });

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } } };

export default function AnalyticsPage() {
  const { tasks, habits, milestones, transactions } = useODTStore();

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === "done").length;
  const activeHabits = habits.filter((h) => h.is_active).length;
  const totalMilestones = milestones.length;
  const completedMilestones = milestones.filter((m) => m.completed_at).length;

  return (
    <>
      <CustomCursor />
      <NeuralBackground />
      <AppShell>
        <div className="page-container" style={{ position: "relative", zIndex: 1 }}>
          {/* Header */}
          <motion.div variants={container} initial="hidden" animate="show" className="mb-6">
            <motion.div variants={item} className="mb-6">
              <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                Quantitative Life Intelligence
              </p>
              <h1 className="font-display text-3xl font-bold text-gradient-primary">Analytics Engine</h1>
            </motion.div>

            {/* Metrics Overview */}
            <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="glass rounded-2xl p-5">
                <p className="text-xs font-mono text-muted mb-1">Task Velocity</p>
                <p className="font-display text-2xl font-bold" style={{ color: "var(--primary-300)" }}>
                  {totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0}%
                </p>
                <span className="text-xs text-muted font-mono">{doneTasks} of {totalTasks} finished</span>
              </div>

              <div className="glass rounded-2xl p-5">
                <p className="text-xs font-mono text-muted mb-1">Active Habits</p>
                <p className="font-display text-2xl font-bold" style={{ color: "var(--success)" }}>
                  {activeHabits}
                </p>
                <span className="text-xs text-muted font-mono">Daily tracking live</span>
              </div>

              <div className="glass rounded-2xl p-5">
                <p className="text-xs font-mono text-muted mb-1">Milestone Rate</p>
                <p className="font-display text-2xl font-bold" style={{ color: "var(--gold-400)" }}>
                  {totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0}%
                </p>
                <span className="text-xs text-muted font-mono">{completedMilestones} of {totalMilestones} reached</span>
              </div>

              <div className="glass rounded-2xl p-5">
                <p className="text-xs font-mono text-muted mb-1">Ledger Entries</p>
                <p className="font-display text-2xl font-bold" style={{ color: "var(--accent-400)" }}>
                  {transactions.length}
                </p>
                <span className="text-xs text-muted font-mono">Transactions recorded</span>
              </div>
            </motion.div>

            {/* Heatmap & Consistency */}
            <motion.div variants={item} className="glass rounded-2xl p-6">
              <h2 className="font-display text-sm font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                52-WEEK CONSISTENCY MATRIX
              </h2>
              <HabitHeatmap weeks={52} />
            </motion.div>
          </motion.div>
        </div>
      </AppShell>
    </>
  );
}
