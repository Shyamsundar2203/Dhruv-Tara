"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import AppShell from "@/components/layout/AppShell";
import CustomCursor from "@/components/common/CustomCursor";
import { useODTStore } from "@/lib/store/odt.store";

const NeuralBackground = dynamic(() => import("@/components/three/NeuralBackground"), { ssr: false });

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } } };

export default function SettingsPage() {
  const { mission, updateMission, geminiApiKey, setGeminiApiKey, tasks, habits, milestones } = useODTStore();

  // Mission state
  const [name, setName] = useState(mission.name);
  const [tagline, setTagline] = useState(mission.tagline);
  const [vision, setVision] = useState(mission.vision);
  const [purpose, setPurpose] = useState(mission.purpose);
  const [targetDate, setTargetDate] = useState(mission.target_date);

  // AI state
  const [apiKeyInput, setApiKeyInput] = useState(geminiApiKey);

  // UI feedback
  const [savedMission, setSavedMission] = useState(false);
  const [savedAi, setSavedAi] = useState(false);

  useEffect(() => {
    const key = localStorage.getItem("gemini_api_key");
    if (key) setApiKeyInput(key);
  }, []);

  const handleSaveMission = () => {
    updateMission({
      name,
      tagline,
      vision,
      purpose,
      target_date: targetDate,
    });
    setSavedMission(true);
    setTimeout(() => setSavedMission(false), 2000);
  };

  const handleSaveAi = () => {
    setGeminiApiKey(apiKeyInput.trim());
    setSavedAi(true);
    setTimeout(() => setSavedAi(false), 2000);
  };

  const handleExportData = () => {
    const data = {
      mission,
      milestones,
      tasks,
      habits,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `operation-dhruv-tara-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
  };

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
                System Configuration
              </p>
              <h1 className="font-display text-3xl font-bold text-gradient-primary">Control & Settings</h1>
              <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                Full access control to customize your mission, AI providers, and system preferences live.
              </p>
            </motion.div>
          </motion.div>

          <motion.div variants={container} initial="hidden" animate="show" className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {/* 1. Mission Parameters */}
            <motion.div variants={item} className="glass rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "var(--border-normal)" }}>
                <div className="flex items-center gap-2">
                  <span>🎯</span>
                  <h2 className="font-display text-sm font-bold" style={{ color: "var(--primary-300)" }}>
                    MISSION PARAMETERS
                  </h2>
                </div>
                <motion.button
                  onClick={handleSaveMission}
                  className="btn btn-primary btn-sm"
                  whileTap={{ scale: 0.96 }}
                >
                  {savedMission ? "✓ Saved Live!" : "💾 Save Changes"}
                </motion.button>
              </div>

              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-xs font-mono text-muted mb-1 block">Mission Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-muted mb-1 block">Tagline</label>
                  <input
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="input text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-mono text-muted mb-1 block">Target Singularity Date</label>
                    <input
                      type="date"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      className="input text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-muted mb-1 block">Status</label>
                    <div className="input text-sm flex items-center gap-2" style={{ background: "var(--bg-elevated)", color: "var(--success)" }}>
                      <span className="w-2 h-2 rounded-full" style={{ background: "var(--success)" }} />
                      <span>Active Operation</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-muted mb-1 block">Vision Statement</label>
                  <textarea
                    value={vision}
                    onChange={(e) => setVision(e.target.value)}
                    rows={4}
                    className="input text-sm"
                    style={{ lineHeight: 1.6 }}
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-muted mb-1 block">Core Purpose</label>
                  <textarea
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    rows={3}
                    className="input text-sm"
                    style={{ lineHeight: 1.6 }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Right Column: AI Providers & System Controls */}
            <div className="flex flex-col gap-6">
              {/* 2. AI Intelligence Engine */}
              <motion.div variants={item} className="glass rounded-2xl p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "var(--border-normal)" }}>
                  <div className="flex items-center gap-2">
                    <span>🤖</span>
                    <h2 className="font-display text-sm font-bold" style={{ color: "var(--accent-400)" }}>
                      AI ENGINE CONFIGURATION
                    </h2>
                  </div>
                  <motion.button
                    onClick={handleSaveAi}
                    className="btn btn-primary btn-sm"
                    whileTap={{ scale: 0.96 }}
                  >
                    {savedAi ? "✓ Key Saved!" : "🔑 Update Key"}
                  </motion.button>
                </div>

                <p className="text-xs" style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>
                  Operation Dhruv Tara uses Google Gemini 1.5 Flash (100% Free API Tier) for all 9 team member personalities.
                </p>

                <div>
                  <label className="text-xs font-mono text-muted mb-1 block">Gemini API Key</label>
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="AIzaSy..."
                    className="input text-sm"
                  />
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                    Get your key free at{" "}
                    <a href="https://aistudio.google.com" target="_blank" rel="noreferrer" style={{ color: "var(--accent-400)" }}>
                      aistudio.google.com
                    </a>
                  </p>
                </div>
              </motion.div>

              {/* 3. Data Backup & Export */}
              <motion.div variants={item} className="glass rounded-2xl p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b pb-3" style={{ borderColor: "var(--border-normal)" }}>
                  <span>💾</span>
                  <h2 className="font-display text-sm font-bold" style={{ color: "var(--gold-400)" }}>
                    SOVEREIGN DATA BACKUP
                  </h2>
                </div>

                <p className="text-xs" style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>
                  Your system data is 100% sovereign and stored locally. Export full JSON snapshots anytime.
                </p>

                <div className="flex gap-3">
                  <button onClick={handleExportData} className="btn btn-ghost btn-sm" style={{ border: "1px solid var(--border-strong)" }}>
                    📥 Export JSON Backup
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </AppShell>
    </>
  );
}
