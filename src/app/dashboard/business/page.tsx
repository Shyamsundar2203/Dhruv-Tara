"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import AppShell from "@/components/layout/AppShell";
import CustomCursor from "@/components/common/CustomCursor";

const NeuralBackground = dynamic(() => import("@/components/three/NeuralBackground"), { ssr: false });

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } } };

export default function BusinessPage() {
  const [problem, setProblem] = useState("High demand for specialized AI agents but complex setup.");
  const [solution, setSolution] = useState("One-click specialized AI assistant suite for personal growth & automation.");
  const [targetMarket, setTargetMarket] = useState("Students, AI Enthusiasts, Tech Professionals, Founders.");
  const [revenueModel, setRevenueModel] = useState("Freemium SaaS (Free tier + $19/mo Pro tier).");

  return (
    <>
      <CustomCursor />
      <NeuralBackground />
      <AppShell>
        <div className="page-container" style={{ position: "relative", zIndex: 1 }}>
          {/* Header */}
          <motion.div variants={container} initial="hidden" animate="show" className="mb-6">
            <motion.div variants={item} className="mb-4">
              <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                Entrepreneurship & Monetization
              </p>
              <h1 className="font-display text-3xl font-bold text-gradient-primary">Business Hub</h1>
              <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                Startup Lean Canvas, Market Validation, & Product Revenue Projections.
              </p>
            </motion.div>

            {/* Lean Canvas Grid */}
            <motion.div variants={item} className="glass rounded-2xl p-6 mb-6">
              <h2 className="font-display text-sm font-bold mb-4" style={{ color: "var(--gold-300)" }}>
                🚀 STARTUP LEAN CANVAS — PRODUCT DHRUV TARA
              </h2>

              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <div className="p-4 rounded-xl" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-normal)" }}>
                  <label className="text-xs font-mono font-bold text-muted mb-2 block uppercase">Problem</label>
                  <textarea value={problem} onChange={(e) => setProblem(e.target.value)} rows={3} className="input text-sm" />
                </div>

                <div className="p-4 rounded-xl" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-normal)" }}>
                  <label className="text-xs font-mono font-bold text-muted mb-2 block uppercase">Solution</label>
                  <textarea value={solution} onChange={(e) => setSolution(e.target.value)} rows={3} className="input text-sm" />
                </div>

                <div className="p-4 rounded-xl" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-normal)" }}>
                  <label className="text-xs font-mono font-bold text-muted mb-2 block uppercase">Target Market</label>
                  <textarea value={targetMarket} onChange={(e) => setTargetMarket(e.target.value)} rows={3} className="input text-sm" />
                </div>

                <div className="p-4 rounded-xl" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-normal)" }}>
                  <label className="text-xs font-mono font-bold text-muted mb-2 block uppercase">Revenue Model</label>
                  <textarea value={revenueModel} onChange={(e) => setRevenueModel(e.target.value)} rows={3} className="input text-sm" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </AppShell>
    </>
  );
}
