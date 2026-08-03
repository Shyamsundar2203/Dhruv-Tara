"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface LifeScoreGaugeProps {
  score: number;
  label?: string;
}

export default function LifeScoreGauge({ score, label = "Life Score" }: LifeScoreGaugeProps) {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(score), 400);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animated / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return "#00ff88";
    if (s >= 60) return "#ffd700";
    if (s >= 40) return "#00d4ff";
    return "#ff3864";
  };

  const getGrade = (s: number) => {
    if (s >= 90) return "S+";
    if (s >= 80) return "S";
    if (s >= 70) return "A+";
    if (s >= 60) return "A";
    if (s >= 50) return "B";
    return "C";
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: 180, height: 180 }}>
        {/* Background glow */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${getColor(score)}15 0%, transparent 70%)`,
            animation: "pulse-glow 3s ease-in-out infinite",
          }}
        />

        {/* SVG Gauge */}
        <svg
          viewBox="0 0 180 180"
          style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}
        >
          {/* Track */}
          <circle
            cx="90" cy="90" r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="10"
          />
          {/* Progress */}
          <motion.circle
            cx="90" cy="90" r={radius}
            fill="none"
            stroke={getColor(score)}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: "stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)",
              filter: `drop-shadow(0 0 8px ${getColor(score)})`,
            }}
          />
        </svg>

        {/* Center content */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-1"
        >
          <span className="life-score-number">{Math.round(animated)}</span>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{
              background: `${getColor(score)}20`,
              color: getColor(score),
              fontFamily: "var(--font-mono)",
              border: `1px solid ${getColor(score)}40`,
            }}
          >
            {getGrade(score)}
          </span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
          {label}
        </p>
      </div>
    </div>
  );
}
