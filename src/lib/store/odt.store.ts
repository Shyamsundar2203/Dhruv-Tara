// ============================================================
// OPERATION DHRUV TARA — PERSISTENT STORE (Zustand + Dexie)
// Single source of truth for all Sprint 1 data
// ============================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { format, subDays } from "date-fns";

// ── Types ────────────────────────────────────────────────────
export type TaskStatus   = "backlog" | "todo" | "in_progress" | "review" | "done";
export type TaskPriority = "p0" | "p1" | "p2" | "p3";
export type HabitFreq    = "daily" | "weekdays" | "weekly";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  category?: string;
  tags: string[];
  due_date?: string;
  estimated_min?: number;
  actual_min?: number;
  team_member_id?: string;
  is_mit: boolean;
  created_at: string;
  completed_at?: string;
  order: number;
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency: HabitFreq;
  category: string;
  icon: string;
  color: string;
  is_active: boolean;
  created_at: string;
}

export interface HabitLog {
  habit_id: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  note?: string;
  logged_at: string;
}

export interface DailyEntry {
  date: string; // YYYY-MM-DD
  mood_score?: number;
  energy_score?: number;
  journal_md?: string;
  morning_intention?: string;
  night_reflection?: string;
  ai_summary?: string;
  mit_1?: string;
  mit_2?: string;
  mit_3?: string;
  pomodoro_count: number;
  created_at: string;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  target_date: string;
  completed_at?: string;
  category: string;
  order: number;
}

export interface Mission {
  name: string;
  vision: string;
  purpose: string;
  start_date: string;
  target_date: string;
  tagline: string;
}

// ── Store Interface ──────────────────────────────────────────
interface ODTStore {
  // Mission
  mission: Mission;
  milestones: Milestone[];
  updateMission: (m: Partial<Mission>) => void;
  addMilestone: (m: Omit<Milestone, "id" | "order">) => void;
  updateMilestone: (id: string, updates: Partial<Milestone>) => void;
  deleteMilestone: (id: string) => void;
  completeMilestone: (id: string) => void;

  // Tasks
  tasks: Task[];
  addTask: (t: Omit<Task, "id" | "created_at" | "order">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, status: TaskStatus) => void;
  reorderTasks: (tasks: Task[]) => void;

  // Habits
  habits: Habit[];
  habitLogs: HabitLog[];
  addHabit: (h: Omit<Habit, "id" | "created_at">) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleHabit: (habit_id: string, date: string) => void;
  getHabitLog: (habit_id: string, date: string) => HabitLog | undefined;
  getHabitStreak: (habit_id: string) => number;
  getHabitCompletionRate: (habit_id: string, days: number) => number;
  getHeatmapData: (days?: number) => Array<{ date: string; value: number; level: 0|1|2|3|4 }>;

  // Daily
  dailyEntries: DailyEntry[];
  getTodayEntry: () => DailyEntry;
  updateDailyEntry: (date: string, updates: Partial<DailyEntry>) => void;

  // Settings
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;

  // Life Score (computed)
  getLifeScore: () => { overall: number; habits: number; tasks: number; mission: number };
}

// ── Default Data ─────────────────────────────────────────────
const DEFAULT_MISSION: Mission = {
  name: "Operation Dhruv Tara",
  vision: "Become a world-class AI engineer and entrepreneur by 2030. Build products that impact millions. Live in the top 1% — financially, physically, mentally.",
  purpose: "To prove that a student from India can compete and win on the world stage through relentless learning, discipline, and execution.",
  start_date: "2024-01-01",
  target_date: "2030-01-01",
  tagline: "From student to sovereign by 2030.",
};

const DEFAULT_MILESTONES: Milestone[] = [
  { id: "m1", title: "Master Python + ML Fundamentals", description: "Complete comprehensive ML curriculum", target_date: "2025-06-30", category: "Learning", order: 1 },
  { id: "m2", title: "First AI Project on GitHub", description: "Deploy a real ML project publicly", target_date: "2025-03-31", category: "Projects", order: 2 },
  { id: "m3", title: "Land First AI Internship", description: "Secure a paid AI/ML internship", target_date: "2025-12-31", category: "Career", order: 3 },
  { id: "m4", title: "10K LinkedIn Followers", description: "Build a 10K+ personal brand audience", target_date: "2026-06-30", category: "Brand", order: 4 },
  { id: "m5", title: "Launch First SaaS Product", description: "Ship a product with paying customers", target_date: "2027-01-01", category: "Business", order: 5 },
  { id: "m6", title: "₹1 Lakh Monthly Revenue", description: "Achieve consistent monthly income", target_date: "2027-12-31", category: "Finance", order: 6 },
  { id: "m7", title: "Full-Time AI Role (International)", description: "Land a top-tier AI engineering role", target_date: "2028-06-30", category: "Career", order: 7 },
  { id: "m8", title: "Mission 2030 — Sovereign", description: "Top 1% in all life dimensions", target_date: "2030-01-01", category: "Mission", order: 8 },
];

const DEFAULT_HABITS: Habit[] = [
  { id: "h1", name: "Morning workout", description: "30+ min exercise", frequency: "daily", category: "Fitness", icon: "💪", color: "#00ff88", is_active: true, created_at: new Date().toISOString() },
  { id: "h2", name: "Deep learning session", description: "1+ hour focused study", frequency: "daily", category: "Learning", icon: "🧠", color: "#5b4dff", is_active: true, created_at: new Date().toISOString() },
  { id: "h3", name: "Read 20 pages", description: "Book or research paper", frequency: "daily", category: "Learning", icon: "📚", color: "#00d4ff", is_active: true, created_at: new Date().toISOString() },
  { id: "h4", name: "Journal entry", description: "Write morning intentions", frequency: "daily", category: "Mindset", icon: "📓", color: "#a855f7", is_active: true, created_at: new Date().toISOString() },
  { id: "h5", name: "2L water intake", description: "Stay hydrated all day", frequency: "daily", category: "Health", icon: "💧", color: "#00d4ff", is_active: true, created_at: new Date().toISOString() },
  { id: "h6", name: "Cold shower", description: "Mental toughness", frequency: "daily", category: "Health", icon: "🚿", color: "#00b8e6", is_active: true, created_at: new Date().toISOString() },
  { id: "h7", name: "LinkedIn post / engagement", description: "Build personal brand daily", frequency: "daily", category: "Brand", icon: "📱", color: "#ff6b9d", is_active: true, created_at: new Date().toISOString() },
  { id: "h8", name: "Meditation / breathing", description: "10 min mindfulness", frequency: "daily", category: "Mindset", icon: "🧘", color: "#ffd700", is_active: true, created_at: new Date().toISOString() },
];

const DEFAULT_TASKS: Task[] = [
  { id: "t1", title: "Complete Python fundamentals review", status: "in_progress", priority: "p0", category: "Learning", tags: ["python", "ai"], is_mit: true, created_at: new Date().toISOString(), order: 0 },
  { id: "t2", title: "Build first ML project (MNIST classifier)", status: "todo", priority: "p0", category: "Projects", tags: ["ml", "github"], is_mit: true, created_at: new Date().toISOString(), order: 1 },
  { id: "t3", title: "Update LinkedIn profile with AI focus", status: "todo", priority: "p1", category: "Brand", tags: ["linkedin", "brand"], is_mit: false, created_at: new Date().toISOString(), order: 2 },
  { id: "t4", title: "Research ML internship opportunities", status: "backlog", priority: "p1", category: "Career", tags: ["internship", "career"], is_mit: false, created_at: new Date().toISOString(), order: 3 },
  { id: "t5", title: "Log this week's workouts", status: "todo", priority: "p2", category: "Fitness", tags: ["fitness"], is_mit: false, created_at: new Date().toISOString(), order: 4 },
  { id: "t6", title: "Set up expense tracking", status: "backlog", priority: "p2", category: "Finance", tags: ["finance"], is_mit: false, created_at: new Date().toISOString(), order: 5 },
  { id: "t7", title: "Write weekly reflection post", status: "done", priority: "p2", category: "Brand", tags: ["content"], is_mit: false, created_at: new Date().toISOString(), completed_at: new Date().toISOString(), order: 6 },
];

// ── Helper: generate seed habit logs for the last 60 days ────
function generateSeedLogs(): HabitLog[] {
  const logs: HabitLog[] = [];
  const today = new Date();
  DEFAULT_HABITS.forEach((habit) => {
    for (let d = 60; d >= 0; d--) {
      const date = format(subDays(today, d), "yyyy-MM-dd");
      // Random completion with bias toward recent days being more complete
      const prob = d < 7 ? 0.8 : d < 30 ? 0.65 : 0.5;
      if (Math.random() < prob) {
        logs.push({
          habit_id: habit.id,
          date,
          completed: true,
          logged_at: new Date().toISOString(),
        });
      }
    }
  });
  return logs;
}

// ── Store ─────────────────────────────────────────────────────
export const useODTStore = create<ODTStore>()(
  persist(
    (set, get) => ({
      // ── Mission ──────────────────────────────────────────
      mission: DEFAULT_MISSION,
      milestones: DEFAULT_MILESTONES,

      updateMission: (m) => set((s) => ({ mission: { ...s.mission, ...m } })),

      addMilestone: (m) => {
        const id = `ms_${Date.now()}`;
        const order = get().milestones.length + 1;
        set((s) => ({ milestones: [...s.milestones, { ...m, id, order }] }));
      },

      updateMilestone: (id, updates) =>
        set((s) => ({
          milestones: s.milestones.map((ms) => ms.id === id ? { ...ms, ...updates } : ms),
        })),

      deleteMilestone: (id) =>
        set((s) => ({ milestones: s.milestones.filter((ms) => ms.id !== id) })),

      completeMilestone: (id) =>
        set((s) => ({
          milestones: s.milestones.map((ms) =>
            ms.id === id
              ? { ...ms, completed_at: ms.completed_at ? undefined : new Date().toISOString() }
              : ms
          ),
        })),

      // ── Tasks ─────────────────────────────────────────────
      tasks: DEFAULT_TASKS,

      addTask: (t) => {
        const id = `task_${Date.now()}`;
        set((s) => ({
          tasks: [...s.tasks, { ...t, id, created_at: new Date().toISOString(), order: s.tasks.length }],
        }));
      },

      updateTask: (id, updates) =>
        set((s) => ({
          tasks: s.tasks.map((t) => t.id === id ? { ...t, ...updates } : t),
        })),

      deleteTask: (id) =>
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

      moveTask: (id, status) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id
              ? { ...t, status, completed_at: status === "done" ? new Date().toISOString() : undefined }
              : t
          ),
        })),

      reorderTasks: (tasks) => set({ tasks }),

      // ── Habits ────────────────────────────────────────────
      habits: DEFAULT_HABITS,
      habitLogs: generateSeedLogs(),

      addHabit: (h) => {
        const id = `habit_${Date.now()}`;
        set((s) => ({
          habits: [...s.habits, { ...h, id, created_at: new Date().toISOString() }],
        }));
      },

      updateHabit: (id, updates) =>
        set((s) => ({
          habits: s.habits.map((h) => h.id === id ? { ...h, ...updates } : h),
        })),

      deleteHabit: (id) =>
        set((s) => ({
          habits: s.habits.filter((h) => h.id !== id),
          habitLogs: s.habitLogs.filter((l) => l.habit_id !== id),
        })),

      toggleHabit: (habit_id, date) => {
        const existing = get().habitLogs.find(
          (l) => l.habit_id === habit_id && l.date === date
        );
        if (existing) {
          set((s) => ({
            habitLogs: s.habitLogs.map((l) =>
              l.habit_id === habit_id && l.date === date
                ? { ...l, completed: !l.completed }
                : l
            ),
          }));
        } else {
          set((s) => ({
            habitLogs: [...s.habitLogs, {
              habit_id, date, completed: true,
              logged_at: new Date().toISOString(),
            }],
          }));
        }
      },

      getHabitLog: (habit_id, date) =>
        get().habitLogs.find((l) => l.habit_id === habit_id && l.date === date),

      getHabitStreak: (habit_id) => {
        const logs = get().habitLogs
          .filter((l) => l.habit_id === habit_id && l.completed)
          .map((l) => l.date)
          .sort()
          .reverse();

        let streak = 0;
        const today = format(new Date(), "yyyy-MM-dd");
        let checkDate = today;

        for (let i = 0; i < 365; i++) {
          if (logs.includes(checkDate)) {
            streak++;
            checkDate = format(subDays(new Date(checkDate), 1), "yyyy-MM-dd");
          } else if (checkDate === today) {
            // Allow today to not count yet
            checkDate = format(subDays(new Date(checkDate), 1), "yyyy-MM-dd");
          } else {
            break;
          }
        }
        return streak;
      },

      getHabitCompletionRate: (habit_id, days) => {
        const logs = get().habitLogs.filter((l) => l.habit_id === habit_id && l.completed);
        let count = 0;
        for (let d = 0; d < days; d++) {
          const date = format(subDays(new Date(), d), "yyyy-MM-dd");
          if (logs.find((l) => l.date === date)) count++;
        }
        return Math.round((count / days) * 100);
      },

      getHeatmapData: (days = 365) => {
        const { habits, habitLogs } = get();
        const activeHabits = habits.filter((h) => h.is_active).length;
        const result = [];

        for (let d = days - 1; d >= 0; d--) {
          const date = format(subDays(new Date(), d), "yyyy-MM-dd");
          const completed = habitLogs.filter((l) => l.date === date && l.completed).length;
          const ratio = activeHabits > 0 ? completed / activeHabits : 0;
          const level = ratio === 0 ? 0 : ratio < 0.25 ? 1 : ratio < 0.5 ? 2 : ratio < 0.75 ? 3 : 4;
          result.push({ date, value: completed, level: level as 0|1|2|3|4 });
        }
        return result;
      },

      // ── Daily ─────────────────────────────────────────────
      dailyEntries: [],

      getTodayEntry: () => {
        const today = format(new Date(), "yyyy-MM-dd");
        const existing = get().dailyEntries.find((e) => e.date === today);
        if (existing) return existing;
        const newEntry: DailyEntry = {
          date: today,
          pomodoro_count: 0,
          created_at: new Date().toISOString(),
        };
        set((s) => ({ dailyEntries: [...s.dailyEntries, newEntry] }));
        return newEntry;
      },

      updateDailyEntry: (date, updates) =>
        set((s) => {
          const exists = s.dailyEntries.find((e) => e.date === date);
          if (exists) {
            return { dailyEntries: s.dailyEntries.map((e) => e.date === date ? { ...e, ...updates } : e) };
          }
          return {
            dailyEntries: [...s.dailyEntries, {
              date, pomodoro_count: 0, created_at: new Date().toISOString(), ...updates,
            }],
          };
        }),

      // ── Settings ──────────────────────────────────────────
      geminiApiKey: "",
      setGeminiApiKey: (key) => {
        if (typeof window !== "undefined") localStorage.setItem("gemini_api_key", key);
        set({ geminiApiKey: key });
      },

      // ── Life Score ────────────────────────────────────────
      getLifeScore: () => {
        const { habits, habitLogs, tasks } = get();
        const today = format(new Date(), "yyyy-MM-dd");

        // Habits score
        const activeHabits = habits.filter((h) => h.is_active);
        const todayCompleted = habitLogs.filter((l) => l.date === today && l.completed).length;
        const habitsScore = activeHabits.length > 0
          ? Math.round((todayCompleted / activeHabits.length) * 100)
          : 0;

        // Tasks score (done vs total non-backlog)
        const activeTasks = tasks.filter((t) => t.status !== "backlog");
        const doneTasks = tasks.filter((t) => t.status === "done").length;
        const tasksScore = activeTasks.length > 0
          ? Math.min(100, Math.round((doneTasks / activeTasks.length) * 100))
          : 50;

        // Mission score (milestones completed)
        const { milestones } = get();
        const completed = milestones.filter((m) => m.completed_at).length;
        const missionScore = milestones.length > 0
          ? Math.round((completed / milestones.length) * 100)
          : 10;

        const overall = Math.round((habitsScore * 0.35 + tasksScore * 0.35 + missionScore * 0.3));

        return { overall, habits: habitsScore, tasks: tasksScore, mission: missionScore };
      },
    }),
    {
      name: "odt-store-v1",
      partialize: (state) => ({
        mission: state.mission,
        milestones: state.milestones,
        tasks: state.tasks,
        habits: state.habits,
        habitLogs: state.habitLogs,
        dailyEntries: state.dailyEntries,
        geminiApiKey: state.geminiApiKey,
      }),
    }
  )
);
