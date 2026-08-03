"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const FOCUS_DURATION = 25 * 60; // 25 min
const SHORT_BREAK = 5 * 60;
const LONG_BREAK = 15 * 60;

type SessionType = "focus" | "short" | "long";

const SESSION_CONFIG = {
  focus: { label: "Deep Focus", duration: FOCUS_DURATION, color: "var(--primary-500)", glow: "rgba(91,77,255,0.4)" },
  short: { label: "Short Break", duration: SHORT_BREAK,   color: "var(--success)",       glow: "rgba(0,255,136,0.4)" },
  long:  { label: "Long Break",  duration: LONG_BREAK,    color: "var(--accent-400)",    glow: "rgba(0,212,255,0.4)" },
};

export default function PomodoroTimer() {
  const [session, setSession] = useState<SessionType>("focus");
  const [timeLeft, setTimeLeft] = useState(FOCUS_DURATION);
  const [running, setRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  const config = SESSION_CONFIG[session];
  const progress = 1 - timeLeft / config.duration;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    setTimeLeft(config.duration);
    setRunning(false);
  }, [session, config.duration]);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setRunning(false);
          if (session === "focus") setSessionCount((c) => c + 1);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running, session]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const reset = () => {
    setRunning(false);
    setTimeLeft(config.duration);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Session Type Selector */}
      <div
        className="flex rounded-lg p-1 gap-1"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-normal)" }}
      >
        {(Object.keys(SESSION_CONFIG) as SessionType[]).map((type) => (
          <button
            key={type}
            onClick={() => setSession(type)}
            className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
            style={{
              background: session === type ? config.color + "20" : "transparent",
              color: session === type ? config.color : "var(--text-muted)",
              border: session === type ? `1px solid ${config.color}40` : "1px solid transparent",
              fontFamily: "var(--font-ui)",
              cursor: "pointer",
            }}
          >
            {SESSION_CONFIG[type].label}
          </button>
        ))}
      </div>

      {/* Timer Ring */}
      <div className="relative" style={{ width: 160, height: 160 }}>
        <svg
          viewBox="0 0 160 160"
          className="pomodoro-ring"
          style={{
            width: "100%",
            height: "100%",
            transform: "rotate(-90deg)",
            filter: `drop-shadow(0 0 12px ${config.glow})`,
          }}
        >
          <circle cx="80" cy="80" r={radius}
            fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          <motion.circle
            cx="80" cy="80" r={radius}
            fill="none"
            stroke={config.color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress * circumference}
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-mono text-2xl font-bold"
            style={{ color: config.color, fontFamily: "var(--font-mono)" }}
          >
            {formatTime(timeLeft)}
          </span>
          <span className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            {running ? "focusing..." : "paused"}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="btn btn-ghost btn-sm"
          style={{ padding: "8px 12px", fontSize: "1rem" }}
        >
          ↺
        </button>
        <motion.button
          onClick={() => setRunning((r) => !r)}
          className="btn btn-primary btn-md"
          style={{
            background: `linear-gradient(135deg, ${config.color}cc, ${config.color})`,
            boxShadow: `0 4px 20px ${config.glow}`,
            minWidth: "80px",
          }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          {running ? "⏸ Pause" : "▶ Start"}
        </motion.button>
      </div>

      {/* Session dots */}
      <div className="flex gap-2">
        {[0,1,2,3].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full transition-all"
            style={{
              background: i < sessionCount % 4
                ? config.color
                : "var(--bg-elevated)",
              border: `1px solid ${config.color}40`,
              boxShadow: i < sessionCount % 4 ? `0 0 6px ${config.glow}` : "none",
            }}
          />
        ))}
        <span className="text-xs ml-1" style={{ color: "var(--text-muted)" }}>
          {sessionCount} completed
        </span>
      </div>
    </div>
  );
}
