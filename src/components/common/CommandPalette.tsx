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
  // Navigation
  { id: "home",         title: "Mission Control",    icon: "🏠", category: "Navigate", href: "/dashboard",              keywords: ["home", "dashboard"], shortcut: "G H" },
  { id: "mission",      title: "Mission Module",      icon: "🎯", category: "Navigate", href: "/dashboard/mission",      keywords: ["mission", "goal", "vision"] },
  { id: "daily",        title: "Daily Control",       icon: "📅", category: "Navigate", href: "/dashboard/daily",        keywords: ["daily", "journal", "habit", "mood"] },
  { id: "tasks",        title: "Task Management",     icon: "✅", category: "Navigate", href: "/dashboard/tasks",        keywords: ["task", "kanban", "todo", "priority"] },
  { id: "team",         title: "AI Team",             icon: "🤖", category: "Navigate", href: "/team",                   keywords: ["team", "ai", "jarvis", "harvey"] },
  { id: "learning",     title: "Learning Hub",        icon: "📚", category: "Navigate", href: "/dashboard/learning",     keywords: ["learn", "course", "book", "roadmap"] },
  { id: "finance",      title: "Finance",             icon: "💰", category: "Navigate", href: "/dashboard/finance",      keywords: ["money", "finance", "budget", "expense"] },
  { id: "fitness",      title: "Fitness Tracker",     icon: "💪", category: "Navigate", href: "/dashboard/fitness",      keywords: ["fitness", "workout", "health", "gym"] },
  { id: "knowledge",    title: "Knowledge Vault",     icon: "🧠", category: "Navigate", href: "/dashboard/knowledge",    keywords: ["notes", "knowledge", "markdown", "docs"] },
  { id: "analytics",   title: "Analytics",            icon: "📊", category: "Navigate", href: "/dashboard/analytics",    keywords: ["analytics", "charts", "data", "stats"] },
  { id: "settings",    title: "Settings",             icon: "⚙️", category: "Navigate", href: "/dashboard/settings",     keywords: ["settings", "theme", "preferences"] },

  // Team Members
  { id: "harvey",       title: "Chat with Harvey Specter",  subtitle: "Strategy & Decisions",  icon: "⚔️", category: "Team", href: "/team/harvey-specter/chat",  keywords: ["harvey", "strategy", "decision"] },
  { id: "drishti",      title: "Chat with Drishti",         subtitle: "Social & Branding",     icon: "👁️", category: "Team", href: "/team/drishti/chat",         keywords: ["drishti", "social", "brand", "linkedin"] },
  { id: "agni",         title: "Chat with Agni",            subtitle: "AI Engineering",        icon: "🔥", category: "Team", href: "/team/agni/chat",            keywords: ["agni", "ai", "ml", "code", "technical"] },
  { id: "arth",         title: "Chat with Arth",            subtitle: "Finance",               icon: "💰", category: "Team", href: "/team/arth/chat",            keywords: ["arth", "finance", "money"] },
  { id: "kawach",       title: "Chat with Kawach",          subtitle: "Health & Fitness",      icon: "🛡️", category: "Team", href: "/team/kawach/chat",          keywords: ["kawach", "health", "fitness", "workout"] },
  { id: "niti",         title: "Chat with Niti",            subtitle: "Discipline & Routine",  icon: "⏰", category: "Team", href: "/team/niti/chat",            keywords: ["niti", "discipline", "routine", "habit"] },
  { id: "yugnayak",     title: "Chat with Yugnayak",        subtitle: "Vision & Mindset",      icon: "🌟", category: "Team", href: "/team/yugnayak/chat",        keywords: ["yugnayak", "vision", "mindset", "2030"] },
  { id: "sasta",        title: "Chat with Sasta",           subtitle: "Communication",         icon: "🎙️", category: "Team", href: "/team/sasta/chat",           keywords: ["sasta", "communicate", "speak", "write"] },
  { id: "abhishek",     title: "Chat with Abhishek",        subtitle: "Execution",             icon: "🚀", category: "Team", href: "/team/abhishek/chat",        keywords: ["abhishek", "execution", "ship", "build"] },
];

const CATEGORY_ORDER = ["Navigate", "Team", "Actions"];

interface CommandPaletteProps {
  onClose: () => void;
}

export default function CommandPalette({ onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((s) => Math.min(s + 1, filtered.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((s) => Math.max(s - 1, 0));
      }
      if (e.key === "Enter") {
        const item = filtered[selected];
        if (item) execute(item);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  const filtered = COMMANDS.filter((cmd) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      cmd.title.toLowerCase().includes(q) ||
      cmd.subtitle?.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q) ||
      cmd.keywords.some((k) => k.includes(q))
    );
  });

  const execute = (item: CommandItem) => {
    if (item.href) router.push(item.href);
    if (item.action) item.action();
    onClose();
  };

  const grouped = CATEGORY_ORDER.reduce<Record<string, CommandItem[]>>((acc, cat) => {
    const items = filtered.filter((c) => c.category === cat);
    if (items.length) acc[cat] = items;
    return acc;
  }, {});

  return (
    <AnimatePresence>
      <motion.div
        className="cmd-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="cmd-box glass"
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{ display: "flex", flexDirection: "column" }}
      >
        {/* Search Input */}
        <div
          className="flex items-center gap-3 px-4 py-3 border-b"
          style={{ borderColor: "var(--border-normal)" }}
        >
          <span style={{ color: "var(--text-muted)", fontSize: "1rem" }}>🔍</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
            placeholder="Search commands, pages, team members..."
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--text-primary)",
              fontFamily: "var(--font-ui)",
              fontSize: "0.9375rem",
            }}
          />
          <kbd
            className="text-xs px-2 py-1 rounded"
            style={{
              background: "var(--bg-overlay)",
              border: "1px solid var(--border-normal)",
              color: "var(--text-muted)",
              fontFamily: "var(--font-mono)",
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div style={{ overflowY: "auto", maxHeight: "400px" }}>
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <div
                className="px-4 py-2 text-xs font-semibold tracking-widest uppercase"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
              >
                {category}
              </div>
              {items.map((item, idx) => {
                const globalIdx = filtered.indexOf(item);
                const isSelected = globalIdx === selected;
                return (
                  <motion.div
                    key={item.id}
                    className="flex items-center gap-3 px-4 py-2.5 cursor-pointer mx-2 rounded-lg mb-0.5"
                    style={{
                      background: isSelected ? "rgba(91,77,255,0.15)" : "transparent",
                      border: isSelected ? "1px solid rgba(91,77,255,0.25)" : "1px solid transparent",
                    }}
                    onMouseEnter={() => setSelected(globalIdx)}
                    onClick={() => execute(item)}
                    whileTap={{ scale: 0.99 }}
                  >
                    <span style={{ fontSize: "1.1rem", width: "24px", textAlign: "center" }}>
                      {item.icon}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        className="text-sm font-medium"
                        style={{ color: isSelected ? "var(--text-primary)" : "var(--text-secondary)" }}
                      >
                        {item.title}
                      </div>
                      {item.subtitle && (
                        <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                          {item.subtitle}
                        </div>
                      )}
                    </div>
                    {item.shortcut && (
                      <div className="flex gap-1">
                        {item.shortcut.split(" ").map((key) => (
                          <kbd
                            key={key}
                            className="text-xs px-1.5 py-0.5 rounded"
                            style={{
                              background: "var(--bg-overlay)",
                              border: "1px solid var(--border-normal)",
                              color: "var(--text-muted)",
                              fontFamily: "var(--font-mono)",
                            }}
                          >
                            {key}
                          </kbd>
                        ))}
                      </div>
                    )}
                    <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                      {item.category === "Team" ? "→ Chat" : "→"}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          ))}

          {filtered.length === 0 && (
            <div
              className="flex flex-col items-center justify-center py-12 gap-3"
              style={{ color: "var(--text-muted)" }}
            >
              <span style={{ fontSize: "2rem" }}>🔭</span>
              <p className="text-sm">No results for &ldquo;{query}&rdquo;</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-4 py-2 border-t text-xs"
          style={{ borderColor: "var(--border-normal)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
        >
          <div className="flex gap-3">
            <span>↑↓ navigate</span>
            <span>↵ select</span>
            <span>esc close</span>
          </div>
          <span>{filtered.length} results</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
