"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import AppShell from "@/components/layout/AppShell";
import CustomCursor from "@/components/common/CustomCursor";

const NeuralBackground = dynamic(() => import("@/components/three/NeuralBackground"), { ssr: false });

const TEAM_PROFILES: Record<string, {
  id: string;
  name: string;
  role: string;
  specialty: string;
  description: string;
  color: string;
  emoji: string;
  domains: string[];
}> = {
  "harvey-specter": { id: "harvey-specter", name: "Harvey Specter", role: "Strategy Architect", specialty: "Strategy & Decision Making", description: "Cold, calculated, always 10 moves ahead. Harvey turns chaos into strategic domination.", color: "#5b4dff", emoji: "⚔️", domains: ["Strategy", "Decisions", "Negotiation", "Business"] },
  "drishti": { id: "drishti", name: "Drishti", role: "Visibility Engineer", specialty: "Social Media & Branding", description: "Your brand is your weapon. Drishti makes your online presence impossible to ignore.", color: "#ff6b9d", emoji: "👁️", domains: ["Social Media", "Branding", "LinkedIn", "Visibility"] },
  "agni": { id: "agni", name: "Agni", role: "Technical Commander", specialty: "AI Engineering & Coding", description: "The fire that forges technical skill. Agni builds deep mastery in ML, PyTorch, and Agents.", color: "#ff6b2b", emoji: "🔥", domains: ["AI/ML", "Python", "LLMs", "PyTorch"] },
  "arth": { id: "arth", name: "Arth", role: "Financial Strategist", specialty: "Finance & Wealth", description: "Money is a tool. Arth ensures every rupee is working toward financial independence.", color: "#00d4ff", emoji: "💰", domains: ["Finance", "Budgeting", "Investments", "Wealth"] },
  "kawach": { id: "kawach", name: "Kawach", role: "Health Guardian", specialty: "Fitness & Energy", description: "A weak body kills strong ambitions. Kawach keeps your physical hardware at 100%.", color: "#00ff88", emoji: "🛡️", domains: ["Fitness", "Nutrition", "Sleep", "Energy"] },
  "niti": { id: "niti", name: "Niti", role: "Discipline Architect", specialty: "Habits & Routine", description: "Motivation is temporary. Niti builds unbreakable systems for relentless consistency.", color: "#a855f7", emoji: "⏰", domains: ["Habits", "Routines", "Discipline", "Systems"] },
  "yugnayak": { id: "yugnayak", name: "Yugnayak", role: "Visionary Guide", specialty: "Mindset & Purpose", description: "The compass to 2030 and beyond. Yugnayak keeps your long-term fire burning bright.", color: "#ffd700", emoji: "🌟", domains: ["Vision", "Mindset", "Purpose", "2030 Goal"] },
  "sasta": { id: "sasta", name: "Sasta", role: "Communication Chief", specialty: "Speaking & Leadership", description: "Ideas without expression die quietly. Sasta makes your voice clear, persuasive, and bold.", color: "#f97316", emoji: "🎙️", domains: ["Public Speaking", "Writing", "Leadership", "Influence"] },
  "abhishek": { id: "abhishek", name: "Abhishek", role: "Execution Engine", specialty: "Project Shipping", description: "Planning is not execution. Abhishek turns ideas into deployed, working products.", color: "#ec4899", emoji: "🚀", domains: ["Execution", "Project Shipping", "Productivity"] },
};

export default function TeamMemberProfilePage({ params }: { params: { memberId: string } }) {
  const member = TEAM_PROFILES[params.memberId] ?? TEAM_PROFILES["harvey-specter"];
  const [notes, setNotes] = useState(`Private notes for ${member.name}...\n- Strategic alignment review\n- Action items & deliverables`);

  return (
    <>
      <CustomCursor />
      <NeuralBackground />
      <AppShell>
        <div className="page-container" style={{ position: "relative", zIndex: 1 }}>
          {/* Header Profile Card */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                  style={{
                    background: `${member.color}15`,
                    border: `2px solid ${member.color}30`,
                    boxShadow: `0 0 30px ${member.color}25`,
                  }}
                >
                  {member.emoji}
                </div>
                <div>
                  <h1 className="font-accent text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{member.name}</h1>
                  <p className="font-mono text-sm font-semibold" style={{ color: member.color }}>{member.role}</p>
                  <p className="text-xs text-muted mt-0.5">{member.specialty}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Link href={`/team/${member.id}/chat`}>
                  <button className="btn btn-primary btn-md" style={{ background: member.color }}>
                    💬 Chat with {member.name.split(" ")[0]}
                  </button>
                </Link>
                <Link href="/team">
                  <button className="btn btn-ghost btn-md">← All Team</button>
                </Link>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            {/* System Persona & Responsibilities */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6 flex flex-col gap-4">
              <h2 className="font-display text-sm font-bold" style={{ color: member.color }}>
                SYSTEM PERSONA & PHILOSOPHY
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {member.description}
              </p>

              <div className="border-t pt-3" style={{ borderColor: "var(--border-normal)" }}>
                <h3 className="font-display text-xs font-bold uppercase text-muted mb-2">Core Domains</h3>
                <div className="flex flex-wrap gap-2">
                  {member.domains.map((d: string) => (
                    <span key={d} className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: `${member.color}15`, color: member.color }}>
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Member Private Notes */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-6 flex flex-col gap-3">
              <h2 className="font-display text-sm font-bold" style={{ color: "var(--primary-300)" }}>
                PRIVATE NOTES & MEMORY LOG
              </h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={8}
                className="input text-sm"
                style={{ lineHeight: 1.6, background: "var(--bg-overlay)" }}
              />
            </motion.div>
          </div>
        </div>
      </AppShell>
    </>
  );
}
