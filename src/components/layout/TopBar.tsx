"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Link from "next/link";

interface TopBarProps {
  onOpenCommandPalette: () => void;
}

export default function TopBar({ onOpenCommandPalette }: TopBarProps) {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    setTime(format(new Date(), "HH:mm:ss"));
    const interval = setInterval(() => {
      setTime(format(new Date(), "HH:mm:ss"));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      className="topbar glass px-6 flex items-center justify-between"
      style={{
        background: "rgba(8, 8, 15, 0.7)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Search / Command trigger */}
      <div className="flex items-center gap-3">
        <motion.button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg text-xs transition-all"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-normal)",
            color: "var(--text-muted)",
            cursor: "pointer",
          }}
          whileHover={{
            borderColor: "var(--primary-500)",
            color: "var(--text-secondary)",
            boxShadow: "0 0 16px rgba(91,77,255,0.2)",
          }}
          whileTap={{ scale: 0.98 }}
        >
          <span style={{ fontSize: "0.85rem" }}>🔍</span>
          <span style={{ fontFamily: "var(--font-ui)" }}>Search modules & commands...</span>
          <kbd
            className="px-1.5 py-0.5 rounded text-xs font-mono ml-2"
            style={{
              background: "var(--bg-overlay)",
              border: "1px solid var(--border-subtle)",
              color: "var(--primary-300)",
              fontSize: "0.65rem",
            }}
          >
            ⌘K
          </kbd>
        </motion.button>

        {/* Live Clock */}
        <div
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-subtle)",
            color: "var(--text-secondary)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span>{time}</span>
          <span style={{ color: "var(--text-muted)", fontSize: "0.65rem" }}>IST</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* JARVIS Quick Action Button */}
        <Link href="/team/harvey-specter/chat" style={{ textDecoration: "none" }}>
          <motion.button
            className="btn btn-primary btn-sm flex items-center gap-2"
            style={{
              background: "linear-gradient(135deg, var(--primary-600), var(--primary-500))",
              boxShadow: "0 4px 16px rgba(91,77,255,0.3)",
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span>🤖</span>
            <span>JARVIS Online</span>
          </motion.button>
        </Link>
      </div>
    </header>
  );
}
