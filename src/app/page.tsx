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
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{ zIndex: 1 }}
      >
        {/* Scan line effect */}
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0,
            height: "2px",
            background: "linear-gradient(90deg, transparent, rgba(91,77,255,0.8), transparent)",
            animation: "scan-line 4s linear infinite",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        {/* Center Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-8"
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: "var(--success)",
                boxShadow: "0 0 8px var(--success)",
                animation: "pulse-glow 2s infinite",
              }}
            />
            <span
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: "var(--success)", fontFamily: "var(--font-mono)" }}
            >
              System Online • All Systems Operational
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-4"
          >
            <h1
              className="font-display font-black leading-none mb-2"
              style={{
                fontSize: "clamp(3rem, 10vw, 7rem)",
                background: "linear-gradient(135deg, #f0f0ff 0%, #a5a0ff 40%, #00d4ff 70%, #5b4dff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: "none",
                letterSpacing: "-0.03em",
              }}
            >
              DHRUV
            </h1>
            <h1
              className="font-display font-black leading-none"
              style={{
                fontSize: "clamp(3rem, 10vw, 7rem)",
                background: "linear-gradient(135deg, #5b4dff 0%, #00d4ff 50%, #ffd700 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.03em",
              }}
            >
              TARA
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="text-xl mb-2 font-accent"
            style={{ color: "var(--text-secondary)", letterSpacing: "0.3em" }}
          >
            MISSION CONTROL OPERATING SYSTEM
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="text-sm mb-12 font-mono"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
          >
            v1.0.0 • SPRINT 0 • AI-POWERED PERSONAL OS
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <motion.button
              onClick={() => router.push("/dashboard")}
              className="btn btn-primary btn-xl"
              style={{
                fontSize: "1rem",
                fontFamily: "var(--font-display)",
                letterSpacing: "0.05em",
                background: "linear-gradient(135deg, var(--primary-700), var(--primary-500), var(--accent-400))",
                boxShadow: "0 8px 40px rgba(91,77,255,0.4), 0 0 60px rgba(91,77,255,0.2)",
                border: "1px solid rgba(91,77,255,0.5)",
              }}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 12px 60px rgba(91,77,255,0.6), 0 0 80px rgba(91,77,255,0.3)",
              }}
              whileTap={{ scale: 0.97 }}
            >
              ⚡ ENTER MISSION CONTROL
            </motion.button>

            <motion.button
              onClick={() => router.push("/team")}
              className="btn btn-ghost btn-xl"
              style={{ fontSize: "1rem", fontFamily: "var(--font-display)", letterSpacing: "0.05em" }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              🤖 MEET THE TEAM
            </motion.button>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.5 }}
            className="mt-16 flex flex-wrap justify-center gap-8"
          >
            {[
              { label: "Modules",    value: "15+",  icon: "🗂️" },
              { label: "AI Members", value: "9",    icon: "🤖" },
              { label: "Days to 2030", value: `${Math.floor((new Date("2030-01-01").getTime() - Date.now()) / 86400000).toLocaleString()}`, icon: "⏳" },
              { label: "Mission",    value: "Active", icon: "🎯" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div
                  className="font-display font-bold text-lg"
                  style={{
                    color: "var(--primary-400)",
                    fontFamily: "var(--font-mono)",
                    textShadow: "0 0 16px rgba(91,77,255,0.4)",
                  }}
                >
                  {stat.value}
                </div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom Grid Lines */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{
            background: "linear-gradient(0deg, rgba(91,77,255,0.05) 0%, transparent 100%)",
            backgroundImage: `
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent calc(100%/12 - 1px),
                rgba(91,77,255,0.08) calc(100%/12 - 1px),
                rgba(91,77,255,0.08) calc(100%/12)
              )
            `,
          }}
        />
      </div>
    </>
  );
}
