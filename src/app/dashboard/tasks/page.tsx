"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import AppShell from "@/components/layout/AppShell";
import CustomCursor from "@/components/common/CustomCursor";
import KanbanBoard from "@/components/tasks/KanbanBoard";
import { useODTStore, TaskPriority, TaskStatus } from "@/lib/store/odt.store";

const NeuralBackground = dynamic(() => import("@/components/three/NeuralBackground"), { ssr: false });

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } } };

type TaskView = "kanban" | "list";

export default function TasksPage() {
  const { tasks, deleteTask, moveTask, addTask } = useODTStore();
  const [view, setView] = useState<TaskView>("kanban");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<TaskPriority>("p1");
  const [newStatus, setNewStatus] = useState<TaskStatus>("todo");
  const [newCategory, setNewCategory] = useState("General");
  const [newTags, setNewTags] = useState("");
  const [newIsMit, setNewIsMit] = useState(false);

  // Computed stats
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === "done").length;
  const mitTasks = tasks.filter((t) => t.is_mit);
  const mitDone = mitTasks.filter((t) => t.status === "done").length;
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length;

  const categories = Array.from(new Set(tasks.map((t) => t.category).filter(Boolean)));

  const filteredTasks = tasks.filter((t) => {
    if (filterPriority !== "all" && t.priority !== filterPriority) return false;
    if (filterCategory !== "all" && t.category !== filterCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchTag = t.tags.some((tag) => tag.toLowerCase().includes(q));
      if (!matchTitle && !matchTag) return false;
    }
    return true;
  });

  const handleCreateTask = () => {
    if (!newTitle.trim()) return;
    addTask({
      title: newTitle.trim(),
      priority: newPriority,
      status: newStatus,
      category: newCategory,
      tags: newTags.split(",").map((s) => s.trim()).filter(Boolean),
      is_mit: newIsMit,
    });
    setNewTitle("");
    setNewTags("");
    setNewIsMit(false);
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
            <motion.div variants={item} className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                  Task Operations Center
                </p>
                <h1 className="font-display text-3xl font-bold text-gradient-primary">Task Management</h1>
              </div>

              <div className="flex items-center gap-3">
                {/* View Switcher */}
                <div className="flex rounded-xl p-1" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-normal)" }}>
                  <button
                    onClick={() => setView("kanban")}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: view === "kanban" ? "rgba(91,77,255,0.2)" : "transparent",
                      color: view === "kanban" ? "var(--primary-300)" : "var(--text-muted)",
                      border: view === "kanban" ? "1px solid rgba(91,77,255,0.3)" : "1px solid transparent",
                      cursor: "pointer",
                    }}
                  >
                    📊 Kanban
                  </button>
                  <button
                    onClick={() => setView("list")}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: view === "list" ? "rgba(91,77,255,0.2)" : "transparent",
                      color: view === "list" ? "var(--primary-300)" : "var(--text-muted)",
                      border: view === "list" ? "1px solid rgba(91,77,255,0.3)" : "1px solid transparent",
                      cursor: "pointer",
                    }}
                  >
                    📋 List
                  </button>
                </div>

                <motion.button
                  onClick={() => setShowAddModal(true)}
                  className="btn btn-primary btn-sm"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  + Create Task
                </motion.button>
              </div>
            </motion.div>

            {/* Stats Summary Bar */}
            <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { label: "Total Tasks", value: totalTasks, color: "var(--primary-400)", icon: "📌" },
                { label: "In Progress", value: inProgressTasks, color: "var(--warning)", icon: "⚡" },
                { label: "MIT Progress", value: `${mitDone}/${mitTasks.length}`, color: "var(--gold-400)", icon: "⭐" },
                { label: "Completed", value: `${doneTasks}/${totalTasks}`, color: "var(--success)", icon: "✅" },
              ].map((stat) => (
                <div key={stat.label} className="glass rounded-xl p-3 flex items-center gap-3">
                  <span style={{ fontSize: "1.3rem" }}>{stat.icon}</span>
                  <div>
                    <div className="font-mono font-bold text-lg" style={{ color: stat.color, fontFamily: "var(--font-mono)" }}>
                      {stat.value}
                    </div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>{stat.label}</div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Filter Bar */}
            <motion.div variants={item} className="flex flex-wrap items-center justify-between gap-3 mb-6 p-3 glass rounded-xl">
              <div className="flex flex-wrap items-center gap-3 flex-1">
                {/* Search */}
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="🔍 Search tasks..."
                  className="input text-xs"
                  style={{ width: "200px", padding: "6px 12px" }}
                />

                {/* Priority filter */}
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="input text-xs"
                  style={{ width: "130px", padding: "6px 12px", background: "var(--bg-elevated)", cursor: "pointer" }}
                >
                  <option value="all">All Priorities</option>
                  <option value="p0">P0 - Critical</option>
                  <option value="p1">P1 - High</option>
                  <option value="p2">P2 - Medium</option>
                  <option value="p3">P3 - Low</option>
                </select>

                {/* Category filter */}
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="input text-xs"
                  style={{ width: "130px", padding: "6px 12px", background: "var(--bg-elevated)", cursor: "pointer" }}
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                Showing {filteredTasks.length} tasks
              </div>
            </motion.div>
          </motion.div>

          {/* View Content */}
          <AnimatePresence mode="wait">
            {view === "kanban" ? (
              <motion.div key="kanban" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <KanbanBoard />
              </motion.div>
            ) : (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass rounded-2xl p-6">
                <div className="flex flex-col gap-2">
                  {filteredTasks.length === 0 ? (
                    <div className="text-center py-12" style={{ color: "var(--text-muted)" }}>
                      <span style={{ fontSize: "2rem" }}>📭</span>
                      <p className="mt-2 text-sm">No tasks match your filters.</p>
                    </div>
                  ) : (
                    filteredTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-3 rounded-xl gap-4"
                        style={{
                          background: task.status === "done" ? "rgba(0,255,136,0.03)" : "var(--bg-elevated)",
                          border: "1px solid var(--border-normal)",
                        }}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <button
                            onClick={() => moveTask(task.id, task.status === "done" ? "todo" : "done")}
                            className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                            style={{
                              background: task.status === "done" ? "var(--success)" : "transparent",
                              border: `2px solid ${task.status === "done" ? "var(--success)" : "var(--border-strong)"}`,
                              cursor: "pointer",
                            }}
                          >
                            {task.status === "done" && "✓"}
                          </button>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium" style={{ color: task.status === "done" ? "var(--text-muted)" : "var(--text-primary)", textDecoration: task.status === "done" ? "line-through" : "none" }}>
                                {task.title}
                              </p>
                              {task.is_mit && (
                                <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(255,215,0,0.15)", color: "var(--gold-300)" }}>⭐ MIT</span>
                              )}
                            </div>
                            {task.tags.length > 0 && (
                              <div className="flex gap-1 mt-1">
                                {task.tags.map((tag) => (
                                  <span key={tag} className="text-xs" style={{ color: "var(--text-muted)" }}>#{tag}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--bg-overlay)", color: "var(--text-secondary)" }}>
                            {task.category ?? "General"}
                          </span>
                          <span className="text-xs font-mono font-bold" style={{ color: task.priority === "p0" ? "var(--danger)" : task.priority === "p1" ? "var(--warning)" : "var(--accent-400)" }}>
                            {task.priority.toUpperCase()}
                          </span>
                          <button onClick={() => deleteTask(task.id)} className="text-xs text-danger hover:opacity-80">✕</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Add Task Modal */}
          <AnimatePresence>
            {showAddModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="cmd-backdrop flex items-center justify-center"
                onClick={() => setShowAddModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.95, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 10 }}
                  className="glass rounded-2xl p-6 w-full max-w-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="font-display text-lg font-bold text-gradient-primary mb-4">Create New Task</h3>

                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="text-xs font-mono text-muted mb-1 block">Title</label>
                      <input
                        autoFocus
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Task title..."
                        className="input text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-mono text-muted mb-1 block">Priority</label>
                        <select
                          value={newPriority}
                          onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                          className="input text-sm"
                        >
                          <option value="p0">P0 - Critical</option>
                          <option value="p1">P1 - High</option>
                          <option value="p2">P2 - Medium</option>
                          <option value="p3">P3 - Low</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-mono text-muted mb-1 block">Column</label>
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value as TaskStatus)}
                          className="input text-sm"
                        >
                          <option value="backlog">Backlog</option>
                          <option value="todo">To Do</option>
                          <option value="in_progress">In Progress</option>
                          <option value="review">Review</option>
                          <option value="done">Done</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-mono text-muted mb-1 block">Category</label>
                      <input
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Learning, Projects, Health..."
                        className="input text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono text-muted mb-1 block">Tags (comma-separated)</label>
                      <input
                        value={newTags}
                        onChange={(e) => setNewTags(e.target.value)}
                        placeholder="python, ml, github"
                        className="input text-sm"
                      />
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="checkbox"
                        id="mit-checkbox"
                        checked={newIsMit}
                        onChange={(e) => setNewIsMit(e.target.checked)}
                        style={{ accentColor: "var(--primary-500)", cursor: "pointer" }}
                      />
                      <label htmlFor="mit-checkbox" className="text-sm font-medium cursor-pointer" style={{ color: "var(--gold-300)" }}>
                        Mark as Most Important Task (MIT) ⭐
                      </label>
                    </div>

                    <div className="flex gap-3 mt-4">
                      <motion.button onClick={handleCreateTask} className="btn btn-primary btn-md flex-1" whileTap={{ scale: 0.96 }}>
                        Create Task
                      </motion.button>
                      <button onClick={() => setShowAddModal(false)} className="btn btn-ghost btn-md">
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
