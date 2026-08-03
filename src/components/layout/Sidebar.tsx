"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  badge?: string | number;
}

const NAV_ITEMS: NavItem[] = [
  { id: "home",         label: "Mission Control", icon: "🏠", href: "/dashboard" },
  { id: "mission",      label: "Mission",          icon: "🎯", href: "/dashboard/mission" },
  { id: "daily",        label: "Daily",            icon: "📅", href: "/dashboard/daily" },
  { id: "tasks",        label: "Tasks",            icon: "✅", href: "/dashboard/tasks" },
  { id: "team",         label: "AI Team",          icon: "🤖", href: "/team" },
  { id: "learning",     label: "Learning",         icon: "📚", href: "/dashboard/learning" },
  { id: "ai-eng",       label: "AI Engineering",   icon: "⚡", href: "/dashboard/ai-engineering" },
  { id: "projects",     label: "Projects",         icon: "🗂️", href: "/dashboard/projects" },
  { id: "career",       label: "Career",           icon: "💼", href: "/dashboard/career" },
  { id: "business",     label: "Business",         icon: "🏢", href: "/dashboard/business" },
  { id: "finance",      label: "Finance",          icon: "💰", href: "/dashboard/finance" },
  { id: "fitness",      label: "Fitness",          icon: "💪", href: "/dashboard/fitness" },
  { id: "knowledge",    label: "Knowledge",        icon: "🧠", href: "/dashboard/knowledge" },
  { id: "analytics",    label: "Analytics",        icon: "📊", href: "/dashboard/analytics" },
];

const BOTTOM_ITEMS: NavItem[] = [
  { id: "settings", label: "Settings", icon: "⚙️", href: "/dashboard/settings" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <motion.aside
      className="sidebar glass"
      animate={{ width: collapsed ? "72px" : "240px" }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{ overflow: "hidden" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b"
           style={{ borderColor: "var(--border-normal)", minHeight: "60px" }}>
        <motion.div
          className="relative flex-shrink-0"
          whileHover={{ scale: 1.05 }}
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-lg"
            style={{
              background: "linear-gradient(135deg, var(--primary-600), var(--accent-400))",
              boxShadow: "0 0 20px rgba(91,77,255,0.4)",
            }}
          >
            ⭐
          </div>
          {/* Ping ring */}
          <div
            className="absolute inset-0 rounded-lg"
            style={{
              background: "linear-gradient(135deg, var(--primary-600), var(--accent-400))",
              opacity: 0.3,
              animation: "ping-ring 2s cubic-bezier(0,0,0.2,1) infinite",
            }}
          />
        </motion.div>

        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              style={{ overflow: "hidden", whiteSpace: "nowrap" }}
            >
              <div className="font-display text-xs font-bold text-gradient-primary">
                DHRUV TARA
              </div>
              <div className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                Mission Control
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-2" style={{ scrollbarWidth: "none" }}>
        <div className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link key={item.id} href={item.href}>
                <motion.div
                  className="relative flex items-center gap-3 rounded-lg px-3 py-2.5 cursor-pointer group"
                  style={{
                    background: isActive
                      ? "rgba(91,77,255,0.15)"
                      : "transparent",
                    border: isActive
                      ? "1px solid rgba(91,77,255,0.3)"
                      : "1px solid transparent",
                    transition: "all 0.2s ease",
                  }}
                  whileHover={{
                    background: isActive
                      ? "rgba(91,77,255,0.2)"
                      : "rgba(255,255,255,0.04)",
                    borderColor: isActive
                      ? "rgba(91,77,255,0.4)"
                      : "rgba(255,255,255,0.06)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-full"
                      style={{ background: "var(--primary-400)", boxShadow: "0 0 10px var(--primary-500)" }}
                    />
                  )}

                  <span className="text-base flex-shrink-0 w-6 text-center">
                    {item.icon}
                  </span>

                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-sm font-medium flex-1"
                        style={{
                          color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                        }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {item.badge && !collapsed && (
                    <span className="badge badge-primary text-xs px-2 py-0.5">
                      {item.badge}
                    </span>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom */}
      <div className="py-3 px-2 border-t" style={{ borderColor: "var(--border-normal)" }}>
        {BOTTOM_ITEMS.map((item) => (
          <Link key={item.id} href={item.href}>
            <motion.div
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 cursor-pointer"
              style={{ color: "var(--text-secondary)" }}
              whileHover={{ background: "rgba(255,255,255,0.04)", color: "var(--text-primary)" }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-base flex-shrink-0 w-6 text-center">{item.icon}</span>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-medium"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </Link>
        ))}

        {/* Collapse toggle */}
        <motion.button
          onClick={onToggle}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 mt-1 btn-ghost"
          whileHover={{ background: "rgba(255,255,255,0.04)" }}
          whileTap={{ scale: 0.98 }}
          style={{ border: "none" }}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <span className="text-base flex-shrink-0 w-6 text-center" style={{ color: "var(--text-muted)" }}>
            {collapsed ? "→" : "←"}
          </span>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs"
                style={{ color: "var(--text-muted)", whiteSpace: "nowrap" }}
              >
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.aside>
  );
}
