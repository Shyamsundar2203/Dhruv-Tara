"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import AppShell from "@/components/layout/AppShell";
import CustomCursor from "@/components/common/CustomCursor";

const NeuralBackground = dynamic(() => import("@/components/three/NeuralBackground"), { ssr: false });

const TEAM = [
  { id: "harvey-specter", name: "Harvey Specter", role: "Strategy Architect",    emoji: "⚔️", color: "#5b4dff", domains: ["Strategy","Decisions","Business"], desc: "Cold, calculated, always 10 moves ahead." },
  { id: "drishti",        name: "Drishti",         role: "Visibility Engineer",   emoji: "👁️", color: "#ff6b9d", domains: ["Social Media","Branding","LinkedIn"], desc: "Your brand is your weapon." },
  { id: "agni",           name: "Agni",            role: "Technical Commander",   emoji: "🔥", color: "#ff6b2b", domains: ["AI/ML","Python","LLMs"], desc: "The fire that forges elite skills." },
  { id: "arth",           name: "Arth",            role: "Financial Strategist",  emoji: "💰", color: "#00d4ff", domains: ["Finance","Investments","Wealth"], desc: "Money is a tool. Use it right." },
  { id: "kawach",         name: "Kawach",          role: "Health Guardian",       emoji: "🛡️", color: "#00ff88", domains: ["Fitness","Nutrition","Energy"], desc: "A weak body kills strong ambitions." },
  { id: "niti",           name: "Niti",            role: "Discipline Architect",  emoji: "⏰", color: "#a855f7", domains: ["Habits","Routine","Systems"], desc: "Systems make success inevitable." },
  { id: "yugnayak",       name: "Yugnayak",        role: "Visionary Guide",       emoji: "🌟", color: "#ffd700", domains: ["Vision","Mindset","2030"], desc: "The compass to 2030 and beyond." },
  { id: "sasta",          name: "Sasta",           role: "Communication Chief",   emoji: "🎙️", color: "#f97316", domains: ["Speaking","Leadership","Writing"], desc: "Ideas without expression die quietly." },
  { id: "abhishek",       name: "Abhishek",        role: "Execution Engine",      emoji: "🚀", color: "#ec4899", domains: ["Execution","Projects","Shipping"], desc: "Planning is not execution." },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function TeamPage() {
  return (
    <>
      <CustomCursor />
      <NeuralBackground />

      <AppShell>
        <div className="page-container" style={{ position: "relative", zIndex: 1 }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-3"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
            >
              Operation Dhruv Tara
            </p>
            <h1
              className="font-display font-black text-gradient-primary mb-3"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.02em" }}
            >
              TEAM DHRUV TARA
            </h1>
            <p style={{ color: "var(--text-secondary)", maxWidth: "500px", margin: "0 auto" }}>
              9 specialized AI advisors. Each a world-class expert in their domain.
              Each remembers your journey. Each has one mission — your 2030 goal.
            </p>
          </motion.div>

          {/* Team Grid */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-5"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}
          >
            {TEAM.map((member) => (
              <motion.div
                key={member.id}
                variants={item}
              >
                <Link href={`/team/${member.id}`} style={{ textDecoration: "none" }}>
                  <motion.div
                    className="relative rounded-2xl p-6 h-full"
                    style={{
                      background: `${member.color}08`,
                      border: `1px solid ${member.color}20`,
                      cursor: "pointer",
                    }}
                    whileHover={{
                      scale: 1.02,
                      background: `${member.color}12`,
                      borderColor: `${member.color}40`,
                      boxShadow: `0 12px 40px ${member.color}25`,
                    }}
                    whileTap={{ scale: 0.99 }}
                  >
                    {/* Glow on hover */}
                    <div
                      className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500"
                      style={{
                        background: `radial-gradient(circle at 50% 0%, ${member.color}15 0%, transparent 70%)`,
                      }}
                    />

                    {/* Avatar */}
                    <div className="relative flex items-center gap-4 mb-4">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                        style={{
                          background: `${member.color}15`,
                          border: `2px solid ${member.color}30`,
                          boxShadow: `0 0 20px ${member.color}20`,
                        }}
                      >
                        {member.emoji}
                      </div>
                      <div>
                        <h3
                          className="font-accent font-bold text-base"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {member.name}
                        </h3>
                        <p
                          className="text-xs font-semibold"
                          style={{ color: member.color, fontFamily: "var(--font-mono)" }}
                        >
                          {member.role}
                        </p>
                      </div>

                      {/* Online indicator */}
                      <div
                        className="absolute top-0 right-0 flex items-center gap-1"
                      >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{
                            background: "var(--success)",
                            boxShadow: "0 0 6px var(--success)",
                            animation: "pulse-glow 2s infinite",
                          }}
                        />
                        <span className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                          Online
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm mb-4" style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
                      {member.desc}
                    </p>

                    {/* Domains */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {member.domains.map((d) => (
                        <span
                          key={d}
                          className="text-xs px-2.5 py-1 rounded-full font-medium"
                          style={{
                            background: `${member.color}15`,
                            color: member.color,
                            border: `1px solid ${member.color}25`,
                            fontFamily: "var(--font-ui)",
                          }}
                        >
                          {d}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="flex gap-2 mt-auto">
                      <Link
                        href={`/team/${member.id}/chat`}
                        onClick={(e) => e.stopPropagation()}
                        style={{ flex: 1, textDecoration: "none" }}
                      >
                        <motion.div
                          className="w-full py-2 rounded-lg text-center text-sm font-semibold"
                          style={{
                            background: `${member.color}20`,
                            color: member.color,
                            border: `1px solid ${member.color}30`,
                          }}
                          whileHover={{ background: `${member.color}30` }}
                        >
                          💬 Chat
                        </motion.div>
                      </Link>
                      <Link
                        href={`/team/${member.id}`}
                        onClick={(e) => e.stopPropagation()}
                        style={{ flex: 1, textDecoration: "none" }}
                      >
                        <motion.div
                          className="w-full py-2 rounded-lg text-center text-sm font-semibold"
                          style={{
                            background: "var(--bg-elevated)",
                            color: "var(--text-secondary)",
                            border: "1px solid var(--border-normal)",
                          }}
                          whileHover={{ background: "var(--bg-overlay)", color: "var(--text-primary)" }}
                        >
                          📊 Profile
                        </motion.div>
                      </Link>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AppShell>
    </>
  );
}
