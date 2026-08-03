"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { format, differenceInDays } from "date-fns";
import AppShell from "@/components/layout/AppShell";
import LifeScoreGauge from "@/components/dashboard/LifeScoreGauge";
import PomodoroTimer from "@/components/dashboard/PomodoroTimer";
import CustomCursor from "@/components/common/CustomCursor";

// Lazy load Three.js (avoid SSR issues)
const NeuralBackground = dynamic(
  () => import("@/components/three/NeuralBackground"),
  { ssr: false }
);

// ── Sample Data (will be replaced with Supabase) ─────────────
const MISSION_2030 = new Date("2030-01-01");

const LIFE_MODULES = [
  { id: "mission",  label: "Mission",   score: 72, icon: "🎯", color: "var(--primary-500)" },
  { id: "learning", label: "Learning",  score: 65, icon: "📚", color: "var(--accent-400)" },
  { id: "fitness",  label: "Fitness",   score: 58, icon: "💪", color: "var(--success)" },
  { id: "finance",  label: "Finance",   score: 45, icon: "💰", color: "var(--warning)" },
  { id: "career",   label: "Career",    score: 70, icon: "💼", color: "var(--primary-400)" },
  { id: "habits",   label: "Habits",    score: 80, icon: "🔱", color: "#a855f7" },
];

const TODAY_TASKS = [
  { id: "1", title: "Complete ML model training pipeline",  priority: "p0", done: false },
  { id: "2", title: "LinkedIn post: AI learning update",    priority: "p1", done: false },
  { id: "3", title: "Review DSA problems (10 questions)",   priority: "p1", done: true  },
  { id: "4", title: "Log workout and update body metrics",  priority: "p2", done: false },
  { id: "5", title: "Read 20 pages of Deep Work",          priority: "p2", done: false },
];

const HABITS = [
  { id: "h1", name: "Morning workout",  icon: "💪", done: true  },
  { id: "h2", name: "Cold shower",      icon: "🚿", done: true  },
  { id: "h3", name: "1h deep learning", icon: "🧠", done: false },
  { id: "h4", name: "Journal entry",    icon: "📓", done: false },
  { id: "h5", name: "Read 20 pages",    icon: "📚", done: false },
  { id: "h6", name: "2L water",         icon: "💧", done: true  },
];

const QUOTES = [
  "The people who are crazy enough to think they can change the world are the ones who do.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "An investment in knowledge pays the best interest.",
  "The future belongs to those who prepare for it today.",
  "Your only limit is your mind.",
];

const PRIORITY_COLORS: Record<string, string> = {
  p0: "var(--danger)",
  p1: "var(--warning)",
  p2: "var(--accent-400)",
  p3: "var(--text-muted)",
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function DashboardHome() {
  const [habits, setHabits] = useState(HABITS);
  const [tasks, setTasks]   = useState(TODAY_TASKS);
  const [mood, setMood]     = useState(7);
  const [energy, setEnergy] = useState(8);
  const today = new Date();
  const daysTo2030 = differenceInDays(MISSION_2030, today);
  const lifeScore = Math.round(LIFE_MODULES.reduce((a, m) => a + m.score, 0) / LIFE_MODULES.length);
  const todayQuote = QUOTES[today.getDate() % QUOTES.length];
  const completedHabits = habits.filter((h) => h.done).length;
  const completedTasks  = tasks.filter((t) => t.done).length;

  const toggleHabit = (id: string) =>
    setHabits((h) => h.map((x) => x.id === id ? { ...x, done: !x.done } : x));

  const toggleTask = (id: string) =>
    setTasks((t) => t.map((x) => x.id === id ? { ...x, done: !x.done } : x));

  return (
    <>
      <CustomCursor />
      <NeuralBackground />

      <AppShell>
        <div className="page-container" style={{ position: "relative", zIndex: 1 }}>
          {/* ── Header: Date + Mission ──────────────────────────── */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="mb-8"
          >
            <motion.div variants={item} className="flex flex-wrap items-start justify-between gap-4 mb-2">
              <div>
                <p
                  className="text-xs font-semibold tracking-widest uppercase mb-1"
                  style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
                >
                  {format(today, "EEEE, MMMM d, yyyy")}
                </p>
                <h1
                  className="font-display text-3xl font-bold text-gradient-primary"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  Mission Control
                </h1>
                <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                  Operation Dhruv Tara • Active
                </p>
              </div>

              {/* 2030 Countdown */}
              <motion.div
                className="glass-gold rounded-xl px-5 py-3 text-right"
                variants={item}
                whileHover={{ scale: 1.02 }}
              >
                <p className="text-xs" style={{ color: "var(--gold-300)", fontFamily: "var(--font-mono)" }}>
                  ⏳ Mission 2030
                </p>
                <p
                  className="font-display text-2xl font-bold"
                  style={{ color: "var(--gold-400)", textShadow: "0 0 20px rgba(255,215,0,0.5)" }}
                >
                  {daysTo2030.toLocaleString()}
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>days remaining</p>
              </motion.div>
            </motion.div>

            {/* Today's Quote */}
            <motion.div
              variants={item}
              className="glass rounded-xl px-5 py-4 mb-6 border-l-2"
              style={{ borderLeftColor: "var(--primary-500)" }}
            >
              <p className="text-sm italic" style={{ color: "var(--text-secondary)" }}>
                &ldquo;{todayQuote}&rdquo;
              </p>
            </motion.div>
          </motion.div>

          {/* ── Main Grid ──────────────────────────────────────── */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-5"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gridAutoRows: "auto",
            }}
          >
            {/* ── Life Score Card ─────────────────────────────── */}
            <motion.div
              variants={item}
              className="glass-primary rounded-2xl p-6 flex flex-col items-center gap-4"
            >
              <div className="w-full flex items-center justify-between mb-2">
                <h2
                  className="font-display text-sm font-bold"
                  style={{ color: "var(--primary-300)", letterSpacing: "0.08em" }}
                >
                  LIFE SCORE
                </h2>
                <span className="badge badge-primary text-xs">Today</span>
              </div>

              <LifeScoreGauge score={lifeScore} />

              {/* Module sub-scores */}
              <div className="w-full grid grid-cols-2 gap-2 mt-2">
                {LIFE_MODULES.map((mod) => (
                  <div key={mod.id} className="flex items-center gap-2">
                    <span style={{ fontSize: "0.85rem" }}>{mod.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between mb-0.5">
                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>{mod.label}</span>
                        <span className="text-xs font-mono" style={{ color: mod.color }}>{mod.score}</span>
                      </div>
                      <div className="progress-track" style={{ height: "3px" }}>
                        <div
                          className="progress-fill"
                          style={{
                            width: `${mod.score}%`,
                            background: `linear-gradient(90deg, ${mod.color}88, ${mod.color})`,
                            boxShadow: `0 0 6px ${mod.color}60`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ── Pomodoro Card ────────────────────────────────── */}
            <motion.div variants={item} className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="font-display text-sm font-bold"
                  style={{ color: "var(--text-secondary)", letterSpacing: "0.08em" }}
                >
                  FOCUS TIMER
                </h2>
                <span className="badge badge-accent">Pomodoro</span>
              </div>
              <PomodoroTimer />
            </motion.div>

            {/* ── Today's Habits ───────────────────────────────── */}
            <motion.div variants={item} className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="font-display text-sm font-bold"
                  style={{ color: "var(--text-secondary)", letterSpacing: "0.08em" }}
                >
                  HABITS
                </h2>
                <span
                  className="text-xs font-mono"
                  style={{ color: completedHabits === habits.length ? "var(--success)" : "var(--text-muted)" }}
                >
                  {completedHabits}/{habits.length}
                </span>
              </div>

              {/* Habit progress */}
              <div className="progress-track mb-4" style={{ height: "4px" }}>
                <div
                  className="progress-fill"
                  style={{ width: `${(completedHabits / habits.length) * 100}%` }}
                />
              </div>

              <div className="flex flex-col gap-2">
                {habits.map((h) => (
                  <motion.button
                    key={h.id}
                    onClick={() => toggleHabit(h.id)}
                    className="flex items-center gap-3 rounded-lg p-3 text-left w-full"
                    style={{
                      background: h.done ? "rgba(0,255,136,0.06)" : "var(--bg-elevated)",
                      border: h.done ? "1px solid rgba(0,255,136,0.2)" : "1px solid var(--border-normal)",
                      cursor: "pointer",
                    }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: h.done ? "var(--success)" : "var(--bg-overlay)",
                        border: h.done ? "none" : "2px solid var(--border-strong)",
                        boxShadow: h.done ? "0 0 8px rgba(0,255,136,0.4)" : "none",
                      }}
                    >
                      {h.done && <span style={{ fontSize: "0.65rem", color: "black" }}>✓</span>}
                    </div>
                    <span style={{ fontSize: "1rem" }}>{h.icon}</span>
                    <span
                      className="text-sm"
                      style={{
                        color: h.done ? "var(--text-muted)" : "var(--text-secondary)",
                        textDecoration: h.done ? "line-through" : "none",
                      }}
                    >
                      {h.name}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* ── Priority Tasks / MITs ────────────────────────── */}
            <motion.div variants={item} className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="font-display text-sm font-bold"
                  style={{ color: "var(--text-secondary)", letterSpacing: "0.08em" }}
                >
                  TODAY&apos;S TASKS
                </h2>
                <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                  {completedTasks}/{tasks.length} done
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {tasks.map((task) => (
                  <motion.button
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className="flex items-start gap-3 rounded-lg p-3 text-left w-full"
                    style={{
                      background: task.done ? "rgba(255,255,255,0.02)" : "var(--bg-elevated)",
                      border: task.done ? "1px solid var(--border-subtle)" : "1px solid var(--border-normal)",
                      cursor: "pointer",
                    }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Priority dot */}
                    <div
                      className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                      style={{
                        background: PRIORITY_COLORS[task.priority],
                        boxShadow: `0 0 6px ${PRIORITY_COLORS[task.priority]}80`,
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm"
                        style={{
                          color: task.done ? "var(--text-muted)" : "var(--text-secondary)",
                          textDecoration: task.done ? "line-through" : "none",
                        }}
                      >
                        {task.title}
                      </p>
                    </div>
                    <span
                      className="text-xs font-mono flex-shrink-0"
                      style={{
                        color: PRIORITY_COLORS[task.priority],
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {task.priority.toUpperCase()}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* ── Mood & Energy ────────────────────────────────── */}
            <motion.div variants={item} className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="font-display text-sm font-bold"
                  style={{ color: "var(--text-secondary)", letterSpacing: "0.08em" }}
                >
                  DAILY STATE
                </h2>
                <span className="text-lg">
                  {energy >= 8 ? "⚡" : energy >= 6 ? "😊" : energy >= 4 ? "😐" : "😴"}
                </span>
              </div>

              {/* Mood */}
              <div className="mb-5">
                <div className="flex justify-between mb-2">
                  <span className="text-sm" style={{ color: "var(--text-muted)" }}>Mood</span>
                  <span className="text-sm font-mono" style={{ color: "var(--primary-400)", fontFamily: "var(--font-mono)" }}>
                    {mood}/10
                  </span>
                </div>
                <input
                  type="range" min={1} max={10} value={mood}
                  onChange={(e) => setMood(Number(e.target.value))}
                  className="w-full"
                  style={{ accentColor: "var(--primary-500)" }}
                />
                <div className="flex justify-between mt-1">
                  <span style={{ fontSize: "1rem" }}>😔</span>
                  <span style={{ fontSize: "1rem" }}>😊</span>
                </div>
              </div>

              {/* Energy */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm" style={{ color: "var(--text-muted)" }}>Energy</span>
                  <span className="text-sm font-mono" style={{ color: "var(--accent-400)", fontFamily: "var(--font-mono)" }}>
                    {energy}/10
                  </span>
                </div>
                <input
                  type="range" min={1} max={10} value={energy}
                  onChange={(e) => setEnergy(Number(e.target.value))}
                  className="w-full"
                  style={{ accentColor: "var(--accent-400)" }}
                />
                <div className="flex justify-between mt-1">
                  <span style={{ fontSize: "1rem" }}>🔋</span>
                  <span style={{ fontSize: "1rem" }}>⚡</span>
                </div>
              </div>
            </motion.div>

            {/* ── AI Team Quick Access ──────────────────────────── */}
            <motion.div variants={item} className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="font-display text-sm font-bold"
                  style={{ color: "var(--text-secondary)", letterSpacing: "0.08em" }}
                >
                  TEAM ONLINE
                </h2>
                <span className="badge badge-success">9 Active</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { name: "Harvey",   icon: "⚔️", color: "#5b4dff", href: "/team/harvey-specter/chat" },
                  { name: "Drishti",  icon: "👁️", color: "#ff6b9d", href: "/team/drishti/chat" },
                  { name: "Agni",     icon: "🔥", color: "#ff6b2b", href: "/team/agni/chat" },
                  { name: "Arth",     icon: "💰", color: "#00d4ff", href: "/team/arth/chat" },
                  { name: "Kawach",   icon: "🛡️", color: "#00ff88", href: "/team/kawach/chat" },
                  { name: "Niti",     icon: "⏰", color: "#a855f7", href: "/team/niti/chat" },
                  { name: "Yugnayak", icon: "🌟", color: "#ffd700", href: "/team/yugnayak/chat" },
                  { name: "Sasta",    icon: "🎙️", color: "#f97316", href: "/team/sasta/chat" },
                  { name: "Abhishek", icon: "🚀", color: "#ec4899", href: "/team/abhishek/chat" },
                ].map((member) => (
                  <motion.a
                    key={member.name}
                    href={member.href}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl cursor-pointer text-center"
                    style={{
                      background: `${member.color}10`,
                      border: `1px solid ${member.color}25`,
                      textDecoration: "none",
                    }}
                    whileHover={{
                      scale: 1.05,
                      background: `${member.color}18`,
                      boxShadow: `0 4px 20px ${member.color}30`,
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span style={{ fontSize: "1.3rem" }}>{member.icon}</span>
                    <span
                      className="text-xs font-medium"
                      style={{ color: member.color, fontFamily: "var(--font-ui)" }}
                    >
                      {member.name}
                    </span>
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        background: "var(--success)",
                        boxShadow: "0 0 4px var(--success)",
                      }}
                    />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </AppShell>
    </>
  );
}
