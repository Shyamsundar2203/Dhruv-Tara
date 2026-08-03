// ============================================================
// OPERATION DHRUV TARA — FULL SOVEREIGN DATA STORE
// Covers all 15 modules with persistent LocalStorage state
// ============================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { format, subDays } from "date-fns";

// ── Types ────────────────────────────────────────────────────
export type TaskStatus   = "backlog" | "todo" | "in_progress" | "review" | "done";
export type TaskPriority = "p0" | "p1" | "p2" | "p3";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  category?: string;
  tags: string[];
  due_date?: string;
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
  frequency: string;
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
  logged_at: string;
}

export interface DailyEntry {
  date: string; // YYYY-MM-DD
  mood_score?: number;
  energy_score?: number;
  journal_md?: string;
  morning_intention?: string;
  night_reflection?: string;
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

// Flashcards & Learning
export interface Flashcard {
  id: string;
  deck: string;
  front: string;
  back: string;
  difficulty: "easy" | "medium" | "hard";
  reviewed_at?: string;
}

// Projects
export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  tech_stack: string[];
  github_url?: string;
  status: "planning" | "in_development" | "deployed" | "archived";
  progress: number;
  created_at: string;
}

// Finance
export interface TransactionItem {
  id: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
}

// Fitness
export interface WorkoutItem {
  id: string;
  exercise: string;
  sets: number;
  reps: number;
  weight_kg: number;
  date: string;
}

// Knowledge Note
export interface NoteItem {
  id: string;
  title: string;
  content_md: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

// Job Application
export interface JobApp {
  id: string;
  company: string;
  role: string;
  status: "wishlist" | "applied" | "interviewing" | "offer" | "rejected";
  applied_date: string;
  salary_range?: string;
  notes?: string;
}

// Store Interface
interface ODTStore {
  // Mission
  mission: Mission;
  milestones: Milestone[];
  updateMission: (m: Partial<Mission>) => void;
  addMilestone: (m: Omit<Milestone, "id" | "order">) => void;
  completeMilestone: (id: string) => void;
  deleteMilestone: (id: string) => void;

  // Tasks
  tasks: Task[];
  addTask: (t: Omit<Task, "id" | "created_at" | "order">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, status: TaskStatus) => void;

  // Habits
  habits: Habit[];
  habitLogs: HabitLog[];
  addHabit: (h: Omit<Habit, "id" | "created_at">) => void;
  toggleHabit: (habit_id: string, date: string) => void;
  getHeatmapData: (days?: number) => Array<{ date: string; value: number; level: 0|1|2|3|4 }>;

  // Daily
  dailyEntries: DailyEntry[];
  getTodayEntry: () => DailyEntry;
  updateDailyEntry: (date: string, updates: Partial<DailyEntry>) => void;

  // Learning
  flashcards: Flashcard[];
  addFlashcard: (f: Omit<Flashcard, "id">) => void;
  deleteFlashcard: (id: string) => void;

  // Projects
  projects: ProjectItem[];
  addProject: (p: Omit<ProjectItem, "id" | "created_at">) => void;
  deleteProject: (id: string) => void;

  // Finance
  transactions: TransactionItem[];
  addTransaction: (t: Omit<TransactionItem, "id">) => void;
  deleteTransaction: (id: string) => void;

  // Fitness
  workouts: WorkoutItem[];
  addWorkout: (w: Omit<WorkoutItem, "id">) => void;
  deleteWorkout: (id: string) => void;

  // Knowledge
  notes: NoteItem[];
  addNote: (n: Omit<NoteItem, "id" | "created_at" | "updated_at">) => void;
  updateNote: (id: string, updates: Partial<NoteItem>) => void;
  deleteNote: (id: string) => void;

  // Career / Job Apps
  jobApps: JobApp[];
  addJobApp: (j: Omit<JobApp, "id">) => void;
  updateJobAppStatus: (id: string, status: JobApp["status"]) => void;
  deleteJobApp: (id: string) => void;

  // Settings
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
}

const DEFAULT_MISSION: Mission = {
  name: "Operation Dhruv Tara",
  vision: "Become a top 0.1% AI Engineer & Sovereign Builder by 2030. Build high-impact AI systems, dominate career milestones, achieve total financial freedom, and optimize health and mindset.",
  purpose: "To prove that relentless focus, elite discipline, and continuous execution can transform ambition into global excellence.",
  start_date: "2024-01-01",
  target_date: "2030-01-01",
  tagline: "From student to sovereign by 2030.",
};

const DEFAULT_MILESTONES: Milestone[] = [
  { id: "m1", title: "Master Python & Core ML Mathematics", description: "NumPy, Pandas, PyTorch, Linear Algebra & Calculus", target_date: "2025-06-30", category: "AI Engineering", order: 1 },
  { id: "m2", title: "Deploy First Full-Stack LLM Application", description: "RAG pipeline + Next.js + Vector Database", target_date: "2025-09-30", category: "Projects", order: 2 },
  { id: "m3", title: "Land AI/ML Engineering Internship", description: "Paid role at a high-growth tech startup", target_date: "2025-12-31", category: "Career", order: 3 },
  { id: "m4", title: "Build 10K Personal Brand Audience", description: "LinkedIn & X tech insights & project builds", target_date: "2026-06-30", category: "Brand", order: 4 },
  { id: "m5", title: "Launch SaaS Product (₹1L+ MRR)", description: "Monetized AI tool with active subscribers", target_date: "2027-06-30", category: "Business", order: 5 },
  { id: "m6", title: "Mission 2030 Singularity", description: "Top 0.1% global AI builder & total independence", target_date: "2030-01-01", category: "Mission", order: 6 },
];

const DEFAULT_HABITS: Habit[] = [
  { id: "h1", name: "Morning Workout / Exercise", description: "30+ min physical training", frequency: "daily", category: "Fitness", icon: "💪", color: "#00ff88", is_active: true, created_at: new Date().toISOString() },
  { id: "h2", name: "1 Hour Deep AI Learning", description: "ML, PyTorch, LLMs, or Papers", frequency: "daily", category: "Learning", icon: "🧠", color: "#5b4dff", is_active: true, created_at: new Date().toISOString() },
  { id: "h3", name: "Read 20 Pages", description: "Technical book or research paper", frequency: "daily", category: "Learning", icon: "📚", color: "#00d4ff", is_active: true, created_at: new Date().toISOString() },
  { id: "h4", name: "Daily Reflection & Journal", description: "Morning intention & night review", frequency: "daily", category: "Mindset", icon: "📓", color: "#a855f7", is_active: true, created_at: new Date().toISOString() },
  { id: "h5", name: "2.5L Water Hydration", description: "Optimal body performance", frequency: "daily", category: "Health", icon: "💧", color: "#00d4ff", is_active: true, created_at: new Date().toISOString() },
  { id: "h6", name: "LinkedIn / Brand Post", description: "Share daily tech build or insight", frequency: "daily", category: "Brand", icon: "📱", color: "#ff6b9d", is_active: true, created_at: new Date().toISOString() },
];

const DEFAULT_TASKS: Task[] = [
  { id: "t1", title: "Complete Transformer Architecture Notes", status: "in_progress", priority: "p0", category: "AI Engineering", tags: ["llm", "pytorch"], is_mit: true, created_at: new Date().toISOString(), order: 0 },
  { id: "t2", title: "Build Vector Search RAG Demo", status: "todo", priority: "p0", category: "Projects", tags: ["rag", "langchain"], is_mit: true, created_at: new Date().toISOString(), order: 1 },
  { id: "t3", title: "Update Resume with Operation Dhruv Tara", status: "todo", priority: "p1", category: "Career", tags: ["resume"], is_mit: false, created_at: new Date().toISOString(), order: 2 },
  { id: "t4", title: "Log Financial Expenses & Budget", status: "done", priority: "p2", category: "Finance", tags: ["finance"], is_mit: false, created_at: new Date().toISOString(), completed_at: new Date().toISOString(), order: 3 },
];

const DEFAULT_FLASHCARDS: Flashcard[] = [
  { id: "fc1", deck: "Machine Learning", front: "What is the key difference between L1 and L2 Regularization?", back: "L1 (Lasso) adds absolute values and leads to sparse weights (feature selection). L2 (Ridge) adds squared values and shrinks weights continuously.", difficulty: "medium" },
  { id: "fc2", deck: "Deep Learning", front: "Why is Self-Attention in Transformers O(N^2)?", back: "Because every token computes a dot-product attention score with every other token in the sequence of length N.", difficulty: "hard" },
  { id: "fc3", deck: "Python AI", front: "What does `torch.no_grad()` do?", back: "Disables gradient calculation during evaluation, saving memory and speeding up inference computation.", difficulty: "easy" },
];

const DEFAULT_PROJECTS: ProjectItem[] = [
  { id: "p1", name: "Operation Dhruv Tara OS", description: "AI-powered Life Operating System with Next.js 16, Three.js, and Gemini API", tech_stack: ["Next.js", "TypeScript", "Three.js", "Zustand", "TailwindCSS"], github_url: "https://github.com/Shyamsundar2203/Dhruv-Tara", status: "in_development", progress: 85, created_at: new Date().toISOString() },
  { id: "p2", name: "Neural Vector RAG Engine", description: "Autonomous document Q&A system using embeddings and local LLM reranking", tech_stack: ["Python", "PyTorch", "FastAPI", "Qdrant"], status: "planning", progress: 25, created_at: new Date().toISOString() },
];

const DEFAULT_TRANSACTIONS: TransactionItem[] = [
  { id: "tr1", description: "AI Research Book Purchase", amount: 1200, type: "expense", category: "Learning", date: format(new Date(), "yyyy-MM-dd") },
  { id: "tr2", description: "Freelance Project Milestone", amount: 15000, type: "income", category: "Income", date: format(new Date(), "yyyy-MM-dd") },
  { id: "tr3", description: "Gym Membership Monthly", amount: 1500, type: "expense", category: "Fitness", date: format(new Date(), "yyyy-MM-dd") },
];

const DEFAULT_WORKOUTS: WorkoutItem[] = [
  { id: "w1", exercise: "Barbell Bench Press", sets: 4, reps: 10, weight_kg: 70, date: format(new Date(), "yyyy-MM-dd") },
  { id: "w2", exercise: "Incline DB Press", sets: 3, reps: 12, weight_kg: 24, date: format(new Date(), "yyyy-MM-dd") },
  { id: "w3", exercise: "Triceps Pushdowns", sets: 4, reps: 15, weight_kg: 30, date: format(new Date(), "yyyy-MM-dd") },
];

const DEFAULT_NOTES: NoteItem[] = [
  { id: "n1", title: "Transformer Architecture Deep Dive", content_md: "# Transformer Architecture\n\n- **Encoder**: Multi-Head Attention + FeedForward\n- **Decoder**: Masked Multi-Head Attention\n- **Positional Encoding**: Sine & Cosine functions for sequence order", tags: ["ai", "architecture"], created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "n2", title: "2030 Sovereign Playbook", content_md: "# Mission 2030 Principles\n\n1. Relentless Skill Building\n2. Output-Driven Execution\n3. Zero Excuses, 100% Accountability", tags: ["mindset", "mission"], created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

const DEFAULT_JOB_APPS: JobApp[] = [
  { id: "j1", company: "OpenAI / Anthropic Partner Lab", role: "AI Engineering Intern", status: "interviewing", applied_date: "2025-02-15", salary_range: "₹60,000/mo", notes: "Technical round scheduled" },
  { id: "j2", company: "Top Tech Startup", role: "Generative AI Developer", status: "applied", applied_date: "2025-02-20", salary_range: "₹50,000/mo" },
];

function generateSeedLogs(): HabitLog[] {
  const logs: HabitLog[] = [];
  const today = new Date();
  DEFAULT_HABITS.forEach((habit) => {
    for (let d = 60; d >= 0; d--) {
      const date = format(subDays(today, d), "yyyy-MM-dd");
      if (Math.random() < 0.7) {
        logs.push({ habit_id: habit.id, date, completed: true, logged_at: new Date().toISOString() });
      }
    }
  });
  return logs;
}

export const useODTStore = create<ODTStore>()(
  persist(
    (set, get) => ({
      mission: DEFAULT_MISSION,
      milestones: DEFAULT_MILESTONES,
      updateMission: (m) => set((s) => ({ mission: { ...s.mission, ...m } })),
      addMilestone: (m) => set((s) => ({ milestones: [...s.milestones, { ...m, id: `ms_${Date.now()}`, order: s.milestones.length + 1 }] })),
      completeMilestone: (id) => set((s) => ({ milestones: s.milestones.map((m) => m.id === id ? { ...m, completed_at: m.completed_at ? undefined : new Date().toISOString() } : m) })),
      deleteMilestone: (id) => set((s) => ({ milestones: s.milestones.filter((m) => m.id !== id) })),

      tasks: DEFAULT_TASKS,
      addTask: (t) => set((s) => ({ tasks: [...s.tasks, { ...t, id: `t_${Date.now()}`, created_at: new Date().toISOString(), order: s.tasks.length }] })),
      updateTask: (id, updates) => set((s) => ({ tasks: s.tasks.map((t) => t.id === id ? { ...t, ...updates } : t) })),
      deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
      moveTask: (id, status) => set((s) => ({ tasks: s.tasks.map((t) => t.id === id ? { ...t, status, completed_at: status === "done" ? new Date().toISOString() : undefined } : t) })),

      habits: DEFAULT_HABITS,
      habitLogs: generateSeedLogs(),
      addHabit: (h) => set((s) => ({ habits: [...s.habits, { ...h, id: `h_${Date.now()}`, created_at: new Date().toISOString() }] })),
      toggleHabit: (habit_id, date) => {
        const existing = get().habitLogs.find((l) => l.habit_id === habit_id && l.date === date);
        if (existing) {
          set((s) => ({ habitLogs: s.habitLogs.map((l) => l.habit_id === habit_id && l.date === date ? { ...l, completed: !l.completed } : l) }));
        } else {
          set((s) => ({ habitLogs: [...s.habitLogs, { habit_id, date, completed: true, logged_at: new Date().toISOString() }] }));
        }
      },
      getHeatmapData: (days = 365) => {
        const { habits, habitLogs } = get();
        const activeCount = habits.filter((h) => h.is_active).length;
        const result = [];
        for (let d = days - 1; d >= 0; d--) {
          const date = format(subDays(new Date(), d), "yyyy-MM-dd");
          const completed = habitLogs.filter((l) => l.date === date && l.completed).length;
          const ratio = activeCount > 0 ? completed / activeCount : 0;
          const level = ratio === 0 ? 0 : ratio < 0.25 ? 1 : ratio < 0.5 ? 2 : ratio < 0.75 ? 3 : 4;
          result.push({ date, value: completed, level: level as 0|1|2|3|4 });
        }
        return result;
      },

      dailyEntries: [],
      getTodayEntry: () => {
        const today = format(new Date(), "yyyy-MM-dd");
        const existing = get().dailyEntries.find((e) => e.date === today);
        if (existing) return existing;
        const newEntry: DailyEntry = { date: today, pomodoro_count: 0, created_at: new Date().toISOString() };
        set((s) => ({ dailyEntries: [...s.dailyEntries, newEntry] }));
        return newEntry;
      },
      updateDailyEntry: (date, updates) => set((s) => {
        const exists = s.dailyEntries.find((e) => e.date === date);
        if (exists) {
          return { dailyEntries: s.dailyEntries.map((e) => e.date === date ? { ...e, ...updates } : e) };
        }
        return { dailyEntries: [...s.dailyEntries, { date, pomodoro_count: 0, created_at: new Date().toISOString(), ...updates }] };
      }),

      flashcards: DEFAULT_FLASHCARDS,
      addFlashcard: (f) => set((s) => ({ flashcards: [...s.flashcards, { ...f, id: `fc_${Date.now()}` }] })),
      deleteFlashcard: (id) => set((s) => ({ flashcards: s.flashcards.filter((f) => f.id !== id) })),

      projects: DEFAULT_PROJECTS,
      addProject: (p) => set((s) => ({ projects: [...s.projects, { ...p, id: `proj_${Date.now()}`, created_at: new Date().toISOString() }] })),
      deleteProject: (id) => set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),

      transactions: DEFAULT_TRANSACTIONS,
      addTransaction: (t) => set((s) => ({ transactions: [...s.transactions, { ...t, id: `tr_${Date.now()}` }] })),
      deleteTransaction: (id) => set((s) => ({ transactions: s.transactions.filter((t) => t.id !== id) })),

      workouts: DEFAULT_WORKOUTS,
      addWorkout: (w) => set((s) => ({ workouts: [...s.workouts, { ...w, id: `w_${Date.now()}` }] })),
      deleteWorkout: (id) => set((s) => ({ workouts: s.workouts.filter((w) => w.id !== id) })),

      notes: DEFAULT_NOTES,
      addNote: (n) => set((s) => ({ notes: [...s.notes, { ...n, id: `n_${Date.now()}`, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }] })),
      updateNote: (id, updates) => set((s) => ({ notes: s.notes.map((n) => n.id === id ? { ...n, ...updates, updated_at: new Date().toISOString() } : n) })),
      deleteNote: (id) => set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),

      jobApps: DEFAULT_JOB_APPS,
      addJobApp: (j) => set((s) => ({ jobApps: [...s.jobApps, { ...j, id: `j_${Date.now()}` }] })),
      updateJobAppStatus: (id, status) => set((s) => ({ jobApps: s.jobApps.map((j) => j.id === id ? { ...j, status } : j) })),
      deleteJobApp: (id) => set((s) => ({ jobApps: s.jobApps.filter((j) => j.id !== id) })),

      geminiApiKey: "",
      setGeminiApiKey: (key) => {
        if (typeof window !== "undefined") localStorage.setItem("gemini_api_key", key);
        set({ geminiApiKey: key });
      },
    }),
    {
      name: "odt-store-v2",
    }
  )
);
