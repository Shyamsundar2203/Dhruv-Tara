"use client";

import { useState } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { useODTStore, Task, TaskStatus } from "@/lib/store/odt.store";
import { format, parseISO } from "date-fns";

const COLUMNS: { id: TaskStatus; label: string; icon: string; color: string }[] = [
  { id: "backlog",     label: "Backlog",     icon: "📋", color: "var(--text-muted)" },
  { id: "todo",        label: "To Do",       icon: "⭕", color: "var(--accent-400)" },
  { id: "in_progress", label: "In Progress", icon: "⚡", color: "var(--warning)" },
  { id: "review",      label: "Review",      icon: "👀", color: "var(--primary-400)" },
  { id: "done",        label: "Done",        icon: "✅", color: "var(--success)" },
];

const PRIORITY_CONFIG: Record<string, { label: string; color: string }> = {
  p0: { label: "Critical", color: "var(--danger)" },
  p1: { label: "High",     color: "var(--warning)" },
  p2: { label: "Medium",   color: "var(--accent-400)" },
  p3: { label: "Low",      color: "var(--text-muted)" },
};

function TaskCard({ task, onMove }: { task: Task; onMove: (id: string, status: TaskStatus) => void }) {
  const [expanded, setExpanded] = useState(false);
  const { deleteTask, updateTask } = useODTStore();
  const pc = PRIORITY_CONFIG[task.priority];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="rounded-xl p-3"
      style={{
        background: task.status === "done" ? "rgba(0,255,136,0.04)" : "var(--bg-elevated)",
        border: `1px solid ${task.status === "done" ? "rgba(0,255,136,0.15)" : "var(--border-normal)"}`,
        cursor: "grab",
      }}
      whileHover={{
        borderColor: pc.color + "40",
        boxShadow: `0 4px 20px rgba(0,0,0,0.3)`,
      }}
      draggable
    >
      {/* Header */}
      <div className="flex items-start gap-2 mb-2">
        {/* Priority dot */}
        <div
          className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
          style={{ background: pc.color, boxShadow: `0 0 6px ${pc.color}80` }}
        />
        <p
          className="text-sm font-medium flex-1 leading-snug"
          style={{
            color: task.status === "done" ? "var(--text-muted)" : "var(--text-primary)",
            textDecoration: task.status === "done" ? "line-through" : "none",
          }}
        >
          {task.title}
        </p>
        {task.is_mit && (
          <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(255,215,0,0.15)", color: "var(--gold-300)", fontFamily: "var(--font-mono)", flexShrink: 0 }}>
            MIT
          </span>
        )}
      </div>

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-1.5 py-0.5 rounded-full"
              style={{ background: "rgba(91,77,255,0.1)", color: "var(--primary-300)", fontFamily: "var(--font-mono)" }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs" style={{ color: pc.color, fontFamily: "var(--font-mono)" }}>
          {pc.label}
        </span>

        <div className="flex items-center gap-1">
          {/* Move controls */}
          {COLUMNS.filter((c) => c.id !== task.status).slice(0, 2).map((col) => (
            <button
              key={col.id}
              onClick={() => onMove(task.id, col.id)}
              className="text-xs px-2 py-0.5 rounded"
              style={{
                background: "var(--bg-overlay)",
                border: "1px solid var(--border-subtle)",
                color: "var(--text-muted)",
                cursor: "pointer",
                fontFamily: "var(--font-ui)",
              }}
              title={`Move to ${col.label}`}
            >
              → {col.icon}
            </button>
          ))}
          <button
            onClick={() => deleteTask(task.id)}
            className="text-xs px-1.5 py-0.5 rounded"
            style={{ color: "var(--danger)", cursor: "pointer", background: "transparent", border: "none" }}
            title="Delete task"
          >
            ✕
          </button>
        </div>
      </div>
    </motion.div>
  );
}

interface AddTaskFormProps {
  defaultStatus: TaskStatus;
  onClose: () => void;
}

function AddTaskForm({ defaultStatus, onClose }: AddTaskFormProps) {
  const { addTask } = useODTStore();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<"p0"|"p1"|"p2"|"p3">("p1");
  const [isMit, setIsMit] = useState(false);
  const [tags, setTags] = useState("");

  const submit = () => {
    if (!title.trim()) return;
    addTask({
      title: title.trim(),
      status: defaultStatus,
      priority,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      is_mit: isMit,
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="rounded-xl p-3"
      style={{ background: "var(--bg-overlay)", border: "1px solid var(--border-primary)" }}
    >
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") submit(); if (e.key === "Escape") onClose(); }}
        placeholder="Task title..."
        className="input mb-2"
        style={{ background: "transparent", border: "none", boxShadow: "none", padding: "4px 0", fontSize: "0.875rem" }}
      />
      <div className="flex gap-2 flex-wrap">
        {(["p0","p1","p2","p3"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPriority(p)}
            className="text-xs px-2 py-1 rounded"
            style={{
              background: priority === p ? PRIORITY_CONFIG[p].color + "20" : "var(--bg-elevated)",
              color: priority === p ? PRIORITY_CONFIG[p].color : "var(--text-muted)",
              border: `1px solid ${priority === p ? PRIORITY_CONFIG[p].color + "40" : "var(--border-subtle)"}`,
              cursor: "pointer",
            }}
          >
            {p.toUpperCase()}
          </button>
        ))}
        <button
          onClick={() => setIsMit((v) => !v)}
          className="text-xs px-2 py-1 rounded"
          style={{
            background: isMit ? "rgba(255,215,0,0.15)" : "var(--bg-elevated)",
            color: isMit ? "var(--gold-300)" : "var(--text-muted)",
            border: `1px solid ${isMit ? "rgba(255,215,0,0.3)" : "var(--border-subtle)"}`,
            cursor: "pointer",
          }}
        >
          ⭐ MIT
        </button>
      </div>
      <input
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags (comma-separated)..."
        className="input mt-2"
        style={{ background: "transparent", border: "none", borderTop: "1px solid var(--border-subtle)", boxShadow: "none", borderRadius: 0, padding: "6px 0", fontSize: "0.8rem" }}
      />
      <div className="flex gap-2 mt-2">
        <motion.button onClick={submit} className="btn btn-primary btn-sm flex-1" whileTap={{ scale: 0.97 }}>
          Add Task
        </motion.button>
        <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ border: "1px solid var(--border-normal)" }}>
          Cancel
        </button>
      </div>
    </motion.div>
  );
}

export default function KanbanBoard() {
  const { tasks, moveTask } = useODTStore();
  const [adding, setAdding] = useState<TaskStatus | null>(null);

  const getColumnTasks = (status: TaskStatus) =>
    tasks.filter((t) => t.status === status).sort((a, b) => a.order - b.order);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, minmax(220px, 1fr))",
        gap: "16px",
        overflowX: "auto",
        paddingBottom: "8px",
      }}
    >
      {COLUMNS.map((col) => {
        const colTasks = getColumnTasks(col.id);

        return (
          <div key={col.id} className="flex flex-col gap-3" style={{ minWidth: "220px" }}>
            {/* Column header */}
            <div
              className="flex items-center justify-between px-3 py-2 rounded-lg"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-normal)" }}
            >
              <div className="flex items-center gap-2">
                <span style={{ color: col.color }}>{col.icon}</span>
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: col.color, fontFamily: "var(--font-mono)" }}>
                  {col.label}
                </span>
              </div>
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: `${col.color}20`, color: col.color }}
              >
                {colTasks.length}
              </span>
            </div>

            {/* Tasks */}
            <div className="flex flex-col gap-2" style={{ minHeight: "80px" }}>
              <AnimatePresence mode="popLayout">
                {colTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onMove={moveTask} />
                ))}
              </AnimatePresence>

              <AnimatePresence>
                {adding === col.id && (
                  <AddTaskForm
                    key="add-form"
                    defaultStatus={col.id}
                    onClose={() => setAdding(null)}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Add task button */}
            {adding !== col.id && (
              <motion.button
                onClick={() => setAdding(col.id)}
                className="flex items-center justify-center gap-2 py-2 rounded-lg text-sm"
                style={{
                  background: "transparent",
                  border: `1px dashed ${col.color}30`,
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  fontFamily: "var(--font-ui)",
                }}
                whileHover={{ background: `${col.color}08`, color: col.color, borderColor: `${col.color}60` }}
                whileTap={{ scale: 0.98 }}
              >
                + Add task
              </motion.button>
            )}
          </div>
        );
      })}
    </div>
  );
}
