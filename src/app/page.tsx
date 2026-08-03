"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import CustomCursor from "@/components/common/CustomCursor";

const NeuralBackground = dynamic(
  () => import("@/components/three/NeuralBackground"),
  { ssr: false }
);

export default function LandingPage() {
  const router = useRouter();

  return (
    <>
      <CustomCursor />
      <NeuralBackground />

      <div
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 text-center"
        style={{ zIndex: 1 }}
      >
        {/* Top Navbar Header matching screenshot */}
        <header
          className="fixed top-0 left-0 right-0 h-16 px-8 flex items-center justify-between z-50 glass"
          style={{ background: "rgba(13, 6, 20, 0.85)", borderBottom: "1px solid rgba(255,43,117,0.15)" }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl" style={{ color: "#ff2b75" }}>✦</span>
            <span className="font-accent text-lg font-extrabold text-white">
              Dhruv<span style={{ color: "#ff4d94" }}>Tara</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
            <button onClick={() => router.push("/dashboard")} className="hover:text-white transition-colors cursor-pointer">Home</button>
            <button onClick={() => router.push("/dashboard/daily")} className="hover:text-white transition-colors cursor-pointer">WalkWithMe</button>
            <button onClick={() => router.push("/dashboard/tasks")} className="hover:text-white transition-colors cursor-pointer">SmartMap</button>
            <button onClick={() => router.push("/dashboard/analytics")} className="hover:text-white transition-colors cursor-pointer">Report</button>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="btn btn-primary btn-sm"
          >
            Login / Access
          </button>
        </header>

        {/* Hero Section matching exact screenshot */}
        <div className="max-w-4xl mx-auto pt-24 pb-12 flex flex-col items-center">
          {/* Badge matching screenshot */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-8"
            style={{
              background: "rgba(255, 43, 117, 0.1)",
              border: "1px solid rgba(255, 43, 117, 0.3)",
              color: "#ff80ab",
              fontFamily: "var(--font-mono)",
            }}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: "#ff2b75" }} />
            <span>OPERATION DHRUV TARA • SOVEREIGN OS</span>
          </motion.div>

          {/* Main Title matching screenshot */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display font-extrabold text-white leading-tight mb-6"
            style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)", letterSpacing: "-0.02em" }}
          >
            Navigate the World With{" "}
            <span style={{ color: "#ff2b75", textShadow: "0 0 30px rgba(255,43,117,0.6)" }}>
              Confidence
            </span>
          </motion.h1>

          {/* Subtitle matching screenshot */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-base sm:text-lg mb-10 max-w-2xl leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            The AI-powered safety and growth companion that guides you through high-impact paths, builds your AI career, and keeps your 2030 mission informed.
          </motion.p>

          {/* CTA Pill Buttons matching screenshot */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-16"
          >
            <button
              onClick={() => router.push("/dashboard")}
              className="btn btn-primary btn-lg"
            >
              Get Started →
            </button>

            <button
              onClick={() => router.push("/dashboard/daily")}
              className="btn btn-ghost btn-lg"
            >
              Walk With Me
            </button>
          </motion.div>

          {/* Card Preview matching screenshot */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="glass rounded-3xl p-6 w-full max-w-md border text-left"
            style={{ borderColor: "rgba(255, 43, 117, 0.2)" }}
          >
            <div className="w-full h-40 rounded-2xl p-4 flex flex-col justify-between mb-4 relative overflow-hidden" style={{ background: "rgba(255, 43, 117, 0.08)", border: "1px dashed rgba(255, 43, 117, 0.3)" }}>
              {/* Route line effect matching screenshot */}
              <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
                <path d="M 30 120 Q 180 20 330 30" fill="none" stroke="#ff2b75" strokeWidth="3" strokeDasharray="6,6" />
                <circle cx="330" cy="30" r="6" fill="#ff2b75" />
                <circle cx="30" cy="120" r="6" fill="#ff2b75" />
              </svg>
              <div className="relative z-10 flex justify-between items-center text-xs font-mono text-muted">
                <span>SYSTEM STATUS</span>
                <span className="text-success font-bold">98% OPTIMAL</span>
              </div>
              <div className="relative z-10">
                <p className="text-sm font-bold text-white">Active Route: Mission 2030 Singularity</p>
                <p className="text-xs text-muted">All 15 Operational Modules Active</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>JARVIS OS • Online</span>
              <button onClick={() => router.push("/team")} className="text-xs text-accent hover:underline">
                🤖 Speak with AI Team →
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
