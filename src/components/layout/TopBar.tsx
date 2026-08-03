"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface TopBarProps {
  onOpenCommandPalette: () => void;
}

export default function TopBar({ onOpenCommandPalette }: TopBarProps) {
  const [time, setTime] = useState<string>("");
  const pathname = usePathname();

  useEffect(() => {
    setTime(format(new Date(), "HH:mm:ss"));
    const interval = setInterval(() => {
      setTime(format(new Date(), "HH:mm:ss"));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const NAV_ITEMS = [
    { label: "Home", href: "/dashboard" },
    { label: "WalkWithMe", href: "/dashboard/daily" },
    { label: "SmartMap", href: "/dashboard/tasks" },
    { label: "Report", href: "/dashboard/analytics" },
    { label: "Mission", href: "/dashboard/mission" },
    { label: "Team", href: "/team" },
  ];

  return (
    <header
      className="topbar glass px-6 flex items-center justify-between"
      style={{
        background: "rgba(13, 6, 20, 0.8)",
        borderBottom: "1px solid rgba(255, 43, 117, 0.15)",
      }}
    >
      {/* Brand Logo matching screenshot */}
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2" style={{ textDecoration: "none" }}>
          <span className="text-xl" style={{ color: "#ff2b75" }}>✦</span>
          <span
            className="font-accent text-lg font-extrabold tracking-tight"
            style={{ color: "white" }}
          >
            Dhruv<span style={{ color: "#ff4d94" }}>Tara</span>
          </span>
        </Link>

        {/* Navigation Links matching screenshot */}
        <nav className="hidden md:flex items-center gap-1 ml-4">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
                <span
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all"
                  style={{
                    color: isActive ? "#ff4d94" : "var(--text-secondary)",
                    background: isActive ? "rgba(255, 43, 117, 0.12)" : "transparent",
                    border: isActive ? "1px solid rgba(255, 43, 117, 0.25)" : "1px solid transparent",
                  }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Command Palette Trigger */}
        <motion.button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid rgba(255, 43, 117, 0.2)",
            color: "var(--text-muted)",
          }}
          whileHover={{ scale: 1.02 }}
        >
          <span>🔍</span>
          <span className="font-mono text-[0.7rem]">⌘K</span>
        </motion.button>

        {/* Live Clock */}
        <div
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono"
          style={{
            background: "rgba(255, 43, 117, 0.08)",
            border: "1px solid rgba(255, 43, 117, 0.2)",
            color: "#ff80ab",
          }}
        >
          <span>⏱</span>
          <span>{time}</span>
        </div>

        {/* Hot Pink Pill Button matching screenshot */}
        <Link href="/dashboard/settings" style={{ textDecoration: "none" }}>
          <motion.button
            className="btn btn-primary btn-sm"
            style={{ borderRadius: "9999px" }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            Settings / Login
          </motion.button>
        </Link>
      </div>
    </header>
  );
}
