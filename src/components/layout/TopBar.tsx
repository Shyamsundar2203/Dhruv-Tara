"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { format } from "date-fns";

interface TopBarProps {
  onMenuToggle: () => void;
  onCommandPalette: () => void;
}

export default function TopBar({ onMenuToggle, onCommandPalette }: TopBarProps) {
  const [time, setTime] = useState(new Date());
  const [notifications] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hours   = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");

  return (
    <header
      className="topbar glass flex items-center justify-between px-6 border-b"
      style={{
        borderColor: "var(--border-normal)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Left: Menu + Search */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="btn btn-ghost btn-sm"
          style={{ padding: "8px", border: "none" }}
          title="Toggle menu"
        >
          <span style={{ color: "var(--text-secondary)" }}>☰</span>
        </button>

        {/* Search / Command Palette trigger */}
        <motion.button
          onClick={onCommandPalette}
          className="flex items-center gap-3 rounded-lg px-4 py-2"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-normal)",
            color: "var(--text-muted)",
            fontSize: "0.875rem",
            fontFamily: "var(--font-ui)",
            cursor: "pointer",
            minWidth: "220px",
          }}
          whileHover={{
            borderColor: "var(--border-primary)",
            color: "var(--text-secondary)",
          }}
          whileTap={{ scale: 0.98 }}
        >
          <span>🔍</span>
          <span>Search everything...</span>
          <kbd
            className="ml-auto text-xs px-1.5 py-0.5 rounded"
            style={{
              background: "var(--bg-overlay)",
              border: "1px solid var(--border-normal)",
              fontFamily: "var(--font-mono)",
              color: "var(--text-muted)",
            }}
          >
            ⌘K
          </kbd>
        </motion.button>
      </div>

      {/* Right: Clock + Notifications + Profile */}
      <div className="flex items-center gap-4">
        {/* Live Clock */}
        <div
          className="font-mono text-sm hidden sm:flex items-center gap-1"
          style={{ color: "var(--text-secondary)" }}
        >
          <span style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>
            {format(time, "EEE, MMM d")}
          </span>
          <span className="mx-2" style={{ color: "var(--border-strong)" }}>|</span>
          <span style={{ color: "var(--primary-300)", fontFamily: "var(--font-mono)" }}>
            {hours}
          </span>
          <span
            style={{
              color: "var(--text-muted)",
              animation: "pulse-glow 1s ease-in-out infinite",
            }}
          >
            :
          </span>
          <span style={{ color: "var(--primary-300)", fontFamily: "var(--font-mono)" }}>
            {minutes}
          </span>
          <span style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "0.7rem" }}>
            :{seconds}
          </span>
        </div>

        {/* Notifications */}
        <motion.button
          className="relative btn btn-ghost btn-sm"
          style={{ padding: "8px", border: "none" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Notifications"
        >
          <span style={{ fontSize: "1.1rem" }}>🔔</span>
          {notifications > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold"
              style={{
                background: "var(--danger)",
                color: "white",
                fontSize: "0.6rem",
                boxShadow: "0 0 8px var(--danger)",
              }}
            >
              {notifications}
            </motion.span>
          )}
        </motion.button>

        {/* AI Quick Chat */}
        <motion.button
          className="btn btn-primary btn-sm hidden sm:flex"
          style={{ gap: "6px" }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>🤖</span>
          <span>JARVIS</span>
        </motion.button>

        {/* Avatar */}
        <motion.div
          className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer font-bold text-sm"
          style={{
            background: "linear-gradient(135deg, var(--primary-600), var(--accent-400))",
            boxShadow: "0 0 16px rgba(91,77,255,0.4)",
            color: "white",
            fontFamily: "var(--font-ui)",
          }}
          whileHover={{ scale: 1.08, boxShadow: "0 0 24px rgba(91,77,255,0.6)" }}
          whileTap={{ scale: 0.95 }}
        >
          D
        </motion.div>
      </div>
    </header>
  );
}
