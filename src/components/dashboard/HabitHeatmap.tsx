"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { format, subDays, parseISO } from "date-fns";
import { useODTStore } from "@/lib/store/odt.store";

interface HeatmapProps {
  habitId?: string; // if provided, shows single habit; otherwise shows all habits aggregate
  weeks?: number;
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS   = ["","Mon","","Wed","","Fri",""];

export default function HabitHeatmap({ habitId, weeks = 52 }: HeatmapProps) {
  const { getHeatmapData, habits, habitLogs } = useODTStore();

  const data = useMemo(() => {
    if (habitId) {
      // Single habit heatmap
      const days = weeks * 7;
      const result = [];
      for (let d = days - 1; d >= 0; d--) {
        const date = format(subDays(new Date(), d), "yyyy-MM-dd");
        const log = habitLogs.find((l) => l.habit_id === habitId && l.date === date);
        const completed = log?.completed ? 1 : 0;
        result.push({ date, value: completed, level: completed ? 4 : 0 as 0|1|2|3|4 });
      }
      return result;
    }
    return getHeatmapData(weeks * 7);
  }, [habitId, weeks, getHeatmapData, habitLogs]);

  // Group data into weeks for grid display
  const grid = useMemo(() => {
    const totalDays = weeks * 7;
    const startDay = new Date();
    startDay.setDate(startDay.getDate() - totalDays + 1);
    const dayOfWeek = startDay.getDay(); // 0 = Sun

    // Pad start with empty cells
    const padded = Array(dayOfWeek).fill(null).concat(data);

    // Split into weeks
    const result: (typeof data[0] | null)[][] = [];
    for (let w = 0; w < Math.ceil(padded.length / 7); w++) {
      result.push(padded.slice(w * 7, w * 7 + 7));
    }
    return result;
  }, [data, weeks]);

  // Get month labels
  const monthLabels = useMemo(() => {
    const labels: { label: string; col: number }[] = [];
    let lastMonth = -1;
    grid.forEach((week, colIdx) => {
      const firstCell = week.find((c) => c !== null);
      if (!firstCell) return;
      const month = parseISO(firstCell.date).getMonth();
      if (month !== lastMonth) {
        labels.push({ label: MONTHS[month], col: colIdx });
        lastMonth = month;
      }
    });
    return labels;
  }, [grid]);

  const totalCompleted = data.filter((d) => d.value > 0).length;
  const currentStreak = useMemo(() => {
    let streak = 0;
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i].value > 0) streak++;
      else if (streak === 0) continue;
      else break;
    }
    return streak;
  }, [data]);

  return (
    <div className="flex flex-col gap-3">
      {/* Stats row */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔥</span>
          <div>
            <span className="font-mono font-bold text-base" style={{ color: "var(--primary-400)" }}>
              {currentStreak}
            </span>
            <span className="text-xs ml-1" style={{ color: "var(--text-muted)" }}>day streak</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">✅</span>
          <div>
            <span className="font-mono font-bold text-base" style={{ color: "var(--success)" }}>
              {totalCompleted}
            </span>
            <span className="text-xs ml-1" style={{ color: "var(--text-muted)" }}>total days</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">📅</span>
          <div>
            <span className="font-mono font-bold text-base" style={{ color: "var(--accent-400)" }}>
              {Math.round((totalCompleted / (weeks * 7)) * 100)}%
            </span>
            <span className="text-xs ml-1" style={{ color: "var(--text-muted)" }}>consistency</span>
          </div>
        </div>
      </div>

      {/* Heatmap grid */}
      <div style={{ overflowX: "auto" }}>
        <div style={{ minWidth: `${grid.length * 16}px` }}>
          {/* Month labels */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${grid.length}, 12px)`,
              gap: "3px",
              marginBottom: "4px",
              paddingLeft: "20px",
            }}
          >
            {grid.map((_, colIdx) => {
              const label = monthLabels.find((m) => m.col === colIdx);
              return (
                <div key={colIdx} style={{ gridColumn: colIdx + 1 }}>
                  {label && (
                    <span
                      className="text-xs"
                      style={{ color: "var(--text-muted)", fontSize: "0.65rem", fontFamily: "var(--font-mono)", whiteSpace: "nowrap" }}
                    >
                      {label.label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Grid */}
          <div style={{ display: "flex", gap: "3px" }}>
            {/* Day labels */}
            <div style={{ display: "flex", flexDirection: "column", gap: "3px", marginRight: "4px" }}>
              {DAYS.map((d, i) => (
                <div
                  key={i}
                  style={{
                    height: "12px",
                    width: "16px",
                    fontSize: "0.6rem",
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-mono)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Columns (weeks) */}
            {grid.map((week, colIdx) => (
              <div key={colIdx} style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                {week.map((cell, rowIdx) => (
                  <motion.div
                    key={rowIdx}
                    title={cell ? `${cell.date}: ${cell.value} completed` : ""}
                    className={`heatmap-cell heatmap-${cell?.level ?? 0}`}
                    whileHover={{ scale: 1.5, zIndex: 10 }}
                    style={{ cursor: cell ? "pointer" : "default" }}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 mt-3 justify-end">
            <span className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>Less</span>
            {([0,1,2,3,4] as const).map((l) => (
              <div key={l} className={`heatmap-cell heatmap-${l}`} style={{ width: "12px", height: "12px" }} />
            ))}
            <span className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
