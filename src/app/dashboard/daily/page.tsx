"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import dynamic from "next/dynamic";
import AppShell from "@/components/layout/AppShell";
import CustomCursor from "@/components/common/CustomCursor";
import { useODTStore } from "@/lib/store/odt.store";

const NeuralBackground = dynamic(() => import("@/components/three/NeuralBackground"), { ssr: false });

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } } };

const REFLECTION_PROMPTS = [
  "What was your biggest win today?",
  "What held you back from being your best today?",
  "What will you do differently tomorrow?",
  "Did you move closer to your 2030 mission today?",
  "What are you grateful for today?",
];

const MORNING_PROMPTS = [
  "My #1 priority today is...",
  "The person I'm becoming today is...",
  "One thing I'll do to move my mission forward today is...",
];

type DailyTab = "morning" | "focus" | "evening";

export default function DailyPage() {
  const today = format(new Date(), "yyyy-MM-dd");
  const { getTodayEntry, updateDailyEntry, habits, habitLogs, toggleHabit } = useODTStore();
  const entry = getTodayEntry();
  const [tab, setTab] = useState<DailyTab>("morning");
  const [journal, setJournal]             = useState(entry.journal_md ?? "");
  const [intention, setIntention]         = useState(entry.morning_intention ?? "");
  const [reflection, setReflection]       = useState(entry.night_reflection ?? "");
  const [mit1, setMit1]                   = useState(entry.mit_1 ?? "");
  const [mit2, setMit2]                   = useState(entry.mit_2 ?? "");
  const [mit3, setMit3]                   = useState(entry.mit_3 ?? "");
  const [mood, setMood]                   = useState(entry.mood_score ?? 7);
  const [energy, setEnergy]               = useState(entry.energy_score ?? 7);
  const [saved, setSaved]                 = useState(false);

  const activeHabits = habits.filter((h) => h.is_active);

  const getLog = (habitId: string) =>
    habitLogs.find((l) => l.habit_id === habitId && l.date === today);

  const completedHabits = activeHabits.filter((h) => getLog(h.id)?.completed).length;

  const save = () => {
    updateDailyEntry(today, {
      journal_md: journal,
      morning_intention: intention,
      night_reflection: reflection,
      mit_1: mit1,
      mit_2: mit2,
      mit_3: mit3,
      mood_score: mood,
      energy_score: energy,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const TABS: { id: DailyTab; label: string; icon: string }[] = [
    { id: "morning", label: "Morning",  icon: "🌅" },
    { id: "focus",   label: "Focus",    icon: "⚡" },
    { id: "evening", label: "Evening",  icon: "🌙" },
  ];

  return (
    <>
      <CustomCursor />
      <NeuralBackground />
      <AppShell>
        <div className="page-container" style={{ position: "relative", zIndex: 1 }}>
          {/* Header */}
          <motion.div variants={container} initial="hidden" animate="show" className="mb-6">
            <motion.div variants={item} className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                  {format(new Date(), "EEEE, MMMM d")}
                </p>
                <h1 className="font-display text-3xl font-bold text-gradient-primary">Daily Control</h1>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-normal)" }}>
                  <span>💪</span>
                  <span className="text-sm font-mono" style={{ color: completedHabits === activeHabits.length ? "var(--success)" : "var(--text-secondary)" }}>
                    {completedHabits}/{activeHabits.length} habits
                  </span>
                </div>
                <motion.button
                  onClick={save}
                  className="btn btn-primary btn-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  style={{ minWidth: "80px" }}
                >
                  {saved ? "✓ Saved!" : "💾 Save"}
                </motion.button>
              </div>
            </motion.div>

            {/* Tabs */}
            <motion.div variants={item} className="flex gap-2 p-1 rounded-xl" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-normal)", width: "fit-content" }}>
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: tab === t.id ? "rgba(91,77,255,0.2)" : "transparent",
                    color: tab === t.id ? "var(--primary-300)" : "var(--text-muted)",
                    border: tab === t.id ? "1px solid rgba(91,77,255,0.3)" : "1px solid transparent",
                    cursor: "pointer",
                  }}
                >
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </motion.div>
          </motion.div>

          <AnimatePresence mode="wait">
            {/* ── MORNING TAB ──────────────────────────────────── */}
            {tab === "morning" && (
              <motion.div
                key="morning"
                variants={container}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0 }}
                className="grid gap-5"
                style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}
              >
                {/* Mood & Energy */}
                <motion.div variants={item} className="glass rounded-2xl p-6">
                  <h2 className="font-display text-sm font-bold mb-4" style={{ color: "var(--text-secondary)", letterSpacing: "0.08em" }}>
                    DAILY STATE
                  </h2>
                  <div className="flex flex-col gap-5">
                    {[
                      { label: "Mood",   value: mood,   onChange: setMood,   color: "var(--primary-500)", emojis: ["😔","😐","😊","😄","🤩"] },
                      { label: "Energy", value: energy, onChange: setEnergy, color: "var(--accent-400)",  emojis: ["😴","🔋","⚡","🚀","💥"] },
                    ].map(({ label, value, onChange, color, emojis }) => (
                      <div key={label}>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{label}</span>
                          <div className="flex items-center gap-2">
                            <span style={{ fontSize: "1.1rem" }}>{emojis[Math.min(4, Math.floor((value / 10) * emojis.length))]}</span>
                            <span className="font-mono text-sm font-bold" style={{ color, fontFamily: "var(--font-mono)", minWidth: "28px" }}>
                              {value}/10
                            </span>
                          </div>
                        </div>
                        <div style={{ position: "relative" }}>
                          <input
                            type="range" min={1} max={10} value={value}
                            onChange={(e) => onChange(Number(e.target.value))}
                            className="w-full"
                            style={{ accentColor: color, cursor: "pointer" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* MITs */}
                <motion.div variants={item} className="glass-primary rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span>⭐</span>
                    <h2 className="font-display text-sm font-bold" style={{ color: "var(--primary-300)", letterSpacing: "0.08em" }}>
                      MOST IMPORTANT TASKS
                    </h2>
                  </div>
                  <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
                    Max 3. These are non-negotiable for today.
                  </p>
                  <div className="flex flex-col gap-3">
                    {[
                      { num: 1, val: mit1, set: setMit1, placeholder: "MIT #1 — The most critical thing today..." },
                      { num: 2, val: mit2, set: setMit2, placeholder: "MIT #2 — Second priority..." },
                      { num: 3, val: mit3, set: setMit3, placeholder: "MIT #3 — Third priority..." },
                    ].map(({ num, val, set, placeholder }) => (
                      <div key={num} className="flex gap-3 items-start">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-2"
                          style={{ background: "rgba(91,77,255,0.3)", color: "var(--primary-200)" }}
                        >
                          {num}
                        </div>
                        <input
                          value={val}
                          onChange={(e) => set(e.target.value)}
                          placeholder={placeholder}
                          className="input flex-1"
                          style={{ background: "rgba(91,77,255,0.05)" }}
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Morning Intention */}
                <motion.div variants={item} className="glass rounded-2xl p-6">
                  <h2 className="font-display text-sm font-bold mb-1" style={{ color: "var(--text-secondary)", letterSpacing: "0.08em" }}>
                    MORNING INTENTION
                  </h2>
                  <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
                    {MORNING_PROMPTS[new Date().getDay() % MORNING_PROMPTS.length]}
                  </p>
                  <textarea
                    value={intention}
                    onChange={(e) => setIntention(e.target.value)}
                    placeholder="Set your intention for today..."
                    className="input w-full"
                    rows={5}
                    style={{ resize: "vertical", background: "var(--bg-overlay)", lineHeight: 1.7 }}
                  />
                </motion.div>

                {/* Habits */}
                <motion.div variants={item} className="glass rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display text-sm font-bold" style={{ color: "var(--text-secondary)", letterSpacing: "0.08em" }}>
                      TODAY&apos;S HABITS
                    </h2>
                    <span className="font-mono text-sm" style={{ color: completedHabits === activeHabits.length ? "var(--success)" : "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                      {completedHabits}/{activeHabits.length}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="progress-track mb-4">
                    <motion.div
                      className="progress-fill"
                      animate={{ width: `${activeHabits.length > 0 ? (completedHabits / activeHabits.length) * 100 : 0}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      style={{ background: "linear-gradient(90deg, var(--primary-600), var(--success))" }}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    {activeHabits.map((habit) => {
                      const log = getLog(habit.id);
                      const done = log?.completed ?? false;
                      return (
                        <motion.button
                          key={habit.id}
                          onClick={() => toggleHabit(habit.id, today)}
                          className="flex items-center gap-3 rounded-xl p-3 text-left w-full"
                          style={{
                            background: done ? `${habit.color}08` : "var(--bg-elevated)",
                            border: done ? `1px solid ${habit.color}25` : "1px solid var(--border-normal)",
                            cursor: "pointer",
                          }}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {/* Checkbox */}
                          <motion.div
                            className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                            animate={{
                              background: done ? habit.color : "var(--bg-overlay)",
                              boxShadow: done ? `0 0 12px ${habit.color}60` : "none",
                            }}
                            style={{ border: done ? "none" : `2px solid ${habit.color}40` }}
                          >
                            <AnimatePresence>
                              {done && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                  style={{ fontSize: "0.7rem", color: done && habit.color === "#ffd700" ? "black" : "black" }}
                                >
                                  ✓
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </motion.div>
                          <span style={{ fontSize: "1.1rem" }}>{habit.icon}</span>
                          <div className="flex-1">
                            <p className="text-sm font-medium" style={{ color: done ? "var(--text-muted)" : "var(--text-primary)", textDecoration: done ? "line-through" : "none" }}>
                              {habit.name}
                            </p>
                            {habit.description && (
                              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{habit.description}</p>
                            )}
                          </div>
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${habit.color}15`, color: habit.color }}>
                            {habit.category}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* ── FOCUS TAB ────────────────────────────────────── */}
            {tab === "focus" && (
              <motion.div key="focus" variants={container} initial="hidden" animate="show" exit={{ opacity: 0 }} className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
                <motion.div variants={item} className="glass rounded-2xl p-6 col-span-full">
                  <h2 className="font-display text-sm font-bold mb-4" style={{ color: "var(--text-secondary)", letterSpacing: "0.08em" }}>DAILY JOURNAL</h2>
                  <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
                    Your private space. Write anything — thoughts, wins, blockers, insights.
                  </p>
                  <textarea
                    value={journal}
                    onChange={(e) => setJournal(e.target.value)}
                    placeholder="Start writing... What's on your mind today?"
                    className="input w-full"
                    rows={16}
                    style={{
                      resize: "vertical",
                      background: "var(--bg-overlay)",
                      fontFamily: "var(--font-ui)",
                      lineHeight: 1.8,
                      fontSize: "0.9375rem",
                    }}
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                      {journal.split(/\s+/).filter(Boolean).length} words
                    </span>
                    <span className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                      {format(new Date(), "HH:mm")} IST
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* ── EVENING TAB ──────────────────────────────────── */}
            {tab === "evening" && (
              <motion.div key="evening" variants={container} initial="hidden" animate="show" exit={{ opacity: 0 }} className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
                {/* Day Summary */}
                <motion.div variants={item} className="glass rounded-2xl p-6">
                  <h2 className="font-display text-sm font-bold mb-4" style={{ color: "var(--text-secondary)", letterSpacing: "0.08em" }}>DAY SUMMARY</h2>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { label: "Habits", value: `${completedHabits}/${activeHabits.length}`, color: "var(--success)", icon: "✅" },
                      { label: "Mood",   value: `${mood}/10`,   color: "var(--primary-400)", icon: "😊" },
                      { label: "Energy", value: `${energy}/10`, color: "var(--accent-400)",  icon: "⚡" },
                    ].map((stat) => (
                      <div key={stat.label} className="rounded-xl p-3 text-center" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-normal)" }}>
                        <div style={{ fontSize: "1.2rem" }}>{stat.icon}</div>
                        <div className="font-mono font-bold text-base" style={{ color: stat.color, fontFamily: "var(--font-mono)" }}>{stat.value}</div>
                        <div className="text-xs" style={{ color: "var(--text-muted)" }}>{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Night Reflection */}
                <motion.div variants={item} className="glass rounded-2xl p-6">
                  <h2 className="font-display text-sm font-bold mb-2" style={{ color: "var(--text-secondary)", letterSpacing: "0.08em" }}>NIGHT REFLECTION</h2>
                  <p className="text-xs mb-3 italic" style={{ color: "var(--text-muted)" }}>
                    🌙 &ldquo;{REFLECTION_PROMPTS[new Date().getDay() % REFLECTION_PROMPTS.length]}&rdquo;
                  </p>
                  <textarea
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    placeholder="Reflect on today. What did you learn? What will you improve tomorrow?"
                    className="input w-full"
                    rows={10}
                    style={{ resize: "vertical", background: "var(--bg-overlay)", lineHeight: 1.7 }}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </AppShell>
    </>
  );
}
