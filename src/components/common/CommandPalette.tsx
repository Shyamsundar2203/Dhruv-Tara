"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  category: string;
  href?: string;
  action?: () => void;
  keywords: string[];
  shortcut?: string;
}

const COMMANDS: CommandItem[] = [
  { id: "home",         title: "Mission Control",    icon: "🏠", category: "Navigate", href: "/dashboard",              keywords: ["home", "dashboard"], shortcut: "G H" },
  { id: "mission",      title: "Mission Module",      icon: "🎯", category: "Navigate", href: "/dashboard/mission",      keywords: ["mission", "goal", "vision"] },
  { id: "daily",        title: "Daily Control",       icon: "📅", category: "Navigate", href: "/dashboard/daily",        keywords: ["daily", "journal", "habit", "mood"] },
  { id: "tasks",        title: "Task Management",     icon: "✅", category: "Navigate", href: "/dashboard/tasks",        keywords: ["task", "kanban", "todo", "priority"] },
  { id: "team",         title: "AI Team",             icon: "🤖", category: "Navigate", href: "/team",                   keywords: ["team", "ai", "jarvis", "harvey"] },
  { id: "learning",     title: "Learning Hub",        icon: "📚", category: "Navigate", href: "/dashboard/learning",     keywords: ["learn", "flashcard", "study"] },
  { id: "ai-eng",       title: "AI Engineering",      icon: "⚡", category: "Navigate", href: "/dashboard/ai-engineering",keywords: ["ai", "python", "pytorch", "ml"] },
  { id: "projects",     title: "Projects Hub",        icon: "🗂️", category: "Navigate", href: "/dashboard/projects",     keywords: ["projects", "github", "repo"] },
  { id: "career",       title: "Career Hub",          icon: "💼", category: "Navigate", href: "/dashboard/career",       keywords: ["career", "job", "interview"] },
  { id: "business",     title: "Business Hub",        icon: "🏢", category: "Navigate", href: "/dashboard/business",     keywords: ["business", "lean canvas", "startup"] },
  { id: "finance",      title: "Finance Hub",         icon: "💰", category: "Navigate", href: "/dashboard/finance",      keywords: ["finance", "money", "budget"] },
  { id: "fitness",      title: "Fitness Tracker",     icon: "💪", category: "Navigate", href: "/dashboard/fitness",      keywords: ["fitness", "workout", "gym"] },
  { id: "knowledge",    title: "Knowledge Vault",     icon: "🧠", category: "Navigate", href: "/dashboard/knowledge",    keywords: ["knowledge", "notes", "markdown"] },
  { id: "analytics",    title: "Analytics Engine",    icon: "📊", category: "Navigate", href: "/dashboard/analytics",    keywords: ["analytics", "stats", "heatmap"] },
  { id: "settings",     title: "Settings & Control",  icon: "⚙️", category: "Navigate", href: "/dashboard/settings",     keywords: ["settings", "api key", "export"] },

  // Team members
  { id: "harvey",       title: "Chat with Harvey Specter",  subtitle: "Strategy Architect",   icon: "⚔️", category: "Team", href: "/team/harvey-specter/chat",  keywords: ["harvey", "strategy", "specter"] },
  { id: "drishti",      title: "Chat with Drishti",         subtitle: "Visibility Engineer",  icon: "👁️", category: "Team", href: "/team/drishti/chat",         keywords: ["drishti", "brand", "linkedin"] },
  { id: "agni",         title: "Chat with Agni",            subtitle: "Technical Commander",  icon: "🔥", category: "Team", href: "/team/agni/chat",            keywords: ["agni", "ai", "python", "code"] },
  { id: "arth",         title: "Chat with Arth",            subtitle: "Financial Strategist", icon: "💰", category: "Team", href: "/team/arth/chat",            keywords: ["arth", "finance", "money"] },
  { id: "kawach",       title: "Chat with Kawach",          subtitle: "Health Guardian",      icon: "🛡️", category: "Team", href: "/team/kawach/chat",          keywords: ["kawach", "health", "workout"] },
  { id: "niti",         title: "Chat with Niti",            subtitle: "Discipline Architect", icon: "⏰", category: "Team", href: "/team/niti/chat",            keywords: ["niti", "habits", "routine"] },
  { id: "yugnayak",     title: "Chat with Yugnayak",        subtitle: "Visionary Guide",      icon: "🌟", category: "Team", href: "/team/yugnayak/chat",        keywords: ["yugnayak", "vision", "mindset", "2030"] },
  { id: "sasta",        title: "Chat with Sasta",           subtitle: "Communication",        icon: "🎙️", category: "Team", href: "/team/sasta/chat",           keywords: ["sasta", "communicate", "speak", "write"] },
  { id: "abhishek",     title: "Chat with Abhishek",        subtitle: "Execution",            icon: "🚀", category: "Team", href: "/team/abhishek/chat",        keywords: ["abhishek", "execution", "ship", "build"] },
];

const CATEGORY_ORDER = ["Navigate", "Team", "Actions"];

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const filtered = COMMANDS.filter((cmd) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      cmd.title.toLowerCase().includes(q) ||
      cmd.keywords.some((k) => k.includes(q))
    );
  });

  const execute = (cmd: CommandItem) => {
    onClose();
    if (cmd.href) router.push(cmd.href);
    if (cmd.action) cmd.action();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="cmd-backdrop" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="cmd-box glass"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 border-b" style={{ borderColor: "rgba(255,43,117,0.2)" }}>
          <span className="text-lg mr-3">🔍</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
            placeholder="Type a command or search modules..."
            className="w-full bg-transparent border-none outline-none text-sm font-ui"
          />
          <button onClick={onClose} className="btn btn-ghost btn-sm text-xs">esc</button>
        </div>

        <div className="overflow-y-auto max-h-[380px] p-2">
          {filtered.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => execute(item)}
              onMouseEnter={() => setSelected(idx)}
              className="flex items-center justify-between p-3 rounded-xl cursor-pointer"
              style={{
                background: selected === idx ? "rgba(255,43,117,0.15)" : "transparent",
                border: selected === idx ? "1px solid rgba(255,43,117,0.3)" : "1px solid transparent",
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{item.title}</p>
                  {item.subtitle && <p className="text-xs" style={{ color: "var(--text-muted)" }}>{item.subtitle}</p>}
                </div>
              </div>
              <span className="text-xs font-mono" style={{ color: "#ff80ab" }}>{item.category}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
