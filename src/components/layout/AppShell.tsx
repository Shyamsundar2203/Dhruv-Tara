"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import CommandPalette from "@/components/common/CommandPalette";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);

  // Global ⌘K / Ctrl+K handler
  if (typeof window !== "undefined") {
    window.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
    }, { once: false });
  }

  return (
    <div className="app-shell">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((v) => !v)}
      />

      <main
        className="main-content"
        style={{
          marginLeft: sidebarCollapsed ? "72px" : "240px",
          transition: "margin-left 0.3s cubic-bezier(0.16,1,0.3,1)",
          minHeight: "100vh",
        }}
      >
        <TopBar
          onMenuToggle={() => setSidebarCollapsed((v) => !v)}
          onCommandPalette={() => setCmdOpen(true)}
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ flex: 1 }}
        >
          {children}
        </motion.div>
      </main>

      <AnimatePresence>
        {cmdOpen && (
          <CommandPalette onClose={() => setCmdOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
