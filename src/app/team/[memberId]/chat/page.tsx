"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppShell from "@/components/layout/AppShell";
import CustomCursor from "@/components/common/CustomCursor";
import dynamic from "next/dynamic";
import { GoogleGenerativeAI } from "@google/generative-ai";

const NeuralBackground = dynamic(() => import("@/components/three/NeuralBackground"), { ssr: false });

// ── Team member config (subset for chat) ────────────────────
const TEAM_CONFIGS: Record<string, {
  name: string;
  role: string;
  emoji: string;
  color: string;
  systemPrompt: string;
  greeting: string;
}> = {
  "harvey-specter": {
    name: "Harvey Specter",
    role: "Strategy Architect",
    emoji: "⚔️",
    color: "#5b4dff",
    greeting: "I'm not here to motivate you. I'm here to make you win. What's the problem?",
    systemPrompt: `You are Harvey Specter — the world's best strategic advisor inside Operation Dhruv Tara.
You are cold, calculated, brilliant, and never sugarcoat the truth. You speak like a top 0.1% strategist.
Your job: turn Dhruv's goals into winning strategies. You don't do fluff. You don't do motivation.
You give direct, actionable, elite-level strategic guidance.
Always end with: one clear next move.
Never say "I think" or "maybe". You know. Always.
Keep responses focused and under 200 words unless deep analysis is needed.`,
  },
  "drishti": {
    name: "Drishti",
    role: "Visibility Engineer",
    emoji: "👁️",
    color: "#ff6b9d",
    greeting: "Your online presence is your 24/7 resume. Let's make it impossible to ignore.",
    systemPrompt: `You are Drishti — personal branding and visibility strategist for Dhruv inside Operation Dhruv Tara.
Specialize in: LinkedIn growth, Instagram strategy, content creation, personal branding, internship hunting.
Voice: sharp, trend-aware, Gen-Z savvy but professional.
Give specific, platform-native advice. Reference current trends.
Always give actionable content ideas, posting schedules, or outreach templates.`,
  },
  "agni": {
    name: "Agni",
    role: "Technical Commander",
    emoji: "🔥",
    color: "#ff6b2b",
    greeting: "The gap between you and the top 1% is pure technical depth. Let's close it.",
    systemPrompt: `You are Agni — the AI engineering and technical skills mentor inside Operation Dhruv Tara.
Specialize in: Python, Machine Learning, Deep Learning, LLMs, MLOps, Generative AI, Projects.
Voice: precise, direct, energizing. You know the exact technical path to top 1%.
Give concrete learning paths, code strategies, project ideas, and skill-building plans.
Always prioritize depth over breadth.`,
  },
  "arth": {
    name: "Arth",
    role: "Financial Strategist",
    emoji: "💰",
    color: "#00d4ff",
    greeting: "Every rupee has a job. Let's make sure yours are working for you.",
    systemPrompt: `You are Arth — financial intelligence inside Operation Dhruv Tara.
Specialize in: personal finance, budgeting, saving, investing, student finance strategy.
Voice: analytical, clear, always numbers-backed.
Give practical financial advice for a student building toward financial independence.
Always connect financial decisions to Mission 2030.`,
  },
  "kawach": {
    name: "Kawach",
    role: "Health Guardian",
    emoji: "🛡️",
    color: "#00ff88",
    greeting: "Your body is the hardware your ambitions run on. Time to upgrade it.",
    systemPrompt: `You are Kawach — health and fitness guardian inside Operation Dhruv Tara.
Specialize in: workout programming, nutrition for weight gain, sleep optimization, energy management.
Voice: science-backed, motivating, zero tolerance for excuses.
Dhruv's goal: gain lean muscle mass, maximize daily energy, build stamina.
Give specific workout plans, meal structures, recovery protocols.`,
  },
  "niti": {
    name: "Niti",
    role: "Discipline Architect",
    emoji: "⏰",
    color: "#a855f7",
    greeting: "Discipline is doing the right thing when you don't feel like it. Let's build that.",
    systemPrompt: `You are Niti — discipline and systems architect inside Operation Dhruv Tara.
Specialize in: habit design, routine optimization, time blocking, consistency systems.
Voice: structured, direct, systems-thinking first.
Help Dhruv build unbreakable daily routines. Design habit stacks.
Always give specific time-blocked schedules and implementation intentions.`,
  },
  "yugnayak": {
    name: "Yugnayak",
    role: "Visionary Guide",
    emoji: "🌟",
    color: "#ffd700",
    greeting: "Every great achievement starts with a clear vision. Let's sharpen yours.",
    systemPrompt: `You are Yugnayak — the visionary guide inside Operation Dhruv Tara.
Specialize in: long-term vision alignment, mindset shifts, purpose clarity, inner evolution.
Voice: philosophical yet practical, inspiring without being fluffy.
Help Dhruv maintain connection to Mission 2030. Remove self-doubt with logic + perspective.
Always zoom out to the 10-year view, then zoom back to today's single next step.`,
  },
  "sasta": {
    name: "Sasta",
    role: "Communication Chief",
    emoji: "🎙️",
    color: "#f97316",
    greeting: "The best idea in the room means nothing if you can't express it. Let's fix that.",
    systemPrompt: `You are Sasta — communication and leadership coach inside Operation Dhruv Tara.
Specialize in: public speaking, professional writing, leadership presence, networking, influence.
Voice: persuasive, warm, always human-centered.
Help Dhruv communicate ideas clearly and develop leadership presence.
Give frameworks for presentations, emails, conversations, and networking strategies.`,
  },
  "abhishek": {
    name: "Abhishek",
    role: "Execution Engine",
    emoji: "🚀",
    color: "#ec4899",
    greeting: "Planning is not execution. Talking is not building. What are you shipping today?",
    systemPrompt: `You are Abhishek — the execution engine inside Operation Dhruv Tara.
Specialize in: project execution, accountability, breaking tasks down, removing blockers.
Voice: action-oriented, no patience for overthinking, results-first.
Help Dhruv actually ship things. Break big projects into 25-minute executable chunks.
Always end every conversation with: the ONE thing to do RIGHT NOW.`,
  },
};

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function TeamMemberChatPage({ params }: { params: { memberId: string } }) {
  const member = TEAM_CONFIGS[params.memberId];
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Add greeting on mount
  useEffect(() => {
    if (member) {
      setMessages([{
        id: "greeting",
        role: "assistant",
        content: member.greeting,
        timestamp: new Date(),
      }]);
    }
    // Load API key from localStorage
    const stored = localStorage.getItem("gemini_api_key");
    if (stored) setApiKey(stored);
    else setShowApiKeyInput(true);
  }, [member]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!member) {
    return (
      <AppShell>
        <div className="page-container flex items-center justify-center min-h-64">
          <p style={{ color: "var(--text-muted)" }}>Team member not found.</p>
        </div>
      </AppShell>
    );
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      if (!apiKey) {
        throw new Error("NO_API_KEY");
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Build conversation history for context
      const history = messages
        .filter((m) => m.id !== "greeting")
        .map((m) => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.content }],
        }));

      const chat = model.startChat({
        history,
        systemInstruction: member.systemPrompt,
      });

      const result = await chat.sendMessage(input.trim());
      const response = await result.response;
      const text = response.text();

      setMessages((m) => [...m, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: text,
        timestamp: new Date(),
      }]);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error && err.message === "NO_API_KEY"
        ? "⚠️ Please add your Gemini API key to enable AI responses. Get yours free at aistudio.google.com"
        : `⚠️ Error: ${err instanceof Error ? err.message : "Something went wrong. Please check your API key and try again."}`;

      setMessages((m) => [...m, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: errorMsg,
        timestamp: new Date(),
      }]);
      if (err instanceof Error && err.message === "NO_API_KEY") {
        setShowApiKeyInput(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const saveApiKey = (key: string) => {
    localStorage.setItem("gemini_api_key", key);
    setApiKey(key);
    setShowApiKeyInput(false);
  };

  return (
    <>
      <CustomCursor />
      <NeuralBackground />

      <AppShell>
        <div
          className="page-container"
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            height: "calc(100vh - var(--topbar-height))",
            gap: "16px",
          }}
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-4 flex items-center gap-4"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{
                background: `${member.color}15`,
                border: `2px solid ${member.color}30`,
                boxShadow: `0 0 20px ${member.color}20`,
              }}
            >
              {member.emoji}
            </div>
            <div className="flex-1">
              <h1
                className="font-accent font-bold text-lg"
                style={{ color: "var(--text-primary)" }}
              >
                {member.name}
              </h1>
              <div className="flex items-center gap-2">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: "var(--success)",
                    boxShadow: "0 0 6px var(--success)",
                    animation: "pulse-glow 2s infinite",
                  }}
                />
                <span className="text-xs" style={{ color: member.color, fontFamily: "var(--font-mono)" }}>
                  {member.role} • Online
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowApiKeyInput(true)}
              className="btn btn-ghost btn-sm"
              title="Configure API key"
            >
              ⚙️
            </button>
          </motion.div>

          {/* API Key Input */}
          <AnimatePresence>
            {showApiKeyInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="glass-gold rounded-xl p-4"
              >
                <p className="text-sm mb-2 font-medium" style={{ color: "var(--gold-300)" }}>
                  🔑 Gemini API Key Required
                </p>
                <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
                  Get your free API key at{" "}
                  <a href="https://aistudio.google.com" target="_blank" rel="noreferrer"
                     style={{ color: "var(--accent-400)" }}>
                    aistudio.google.com
                  </a>
                </p>
                <div className="flex gap-2">
                  <input
                    type="password"
                    placeholder="AIza..."
                    defaultValue={apiKey}
                    className="input flex-1 text-sm"
                    id="api-key-input"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        saveApiKey((e.target as HTMLInputElement).value);
                      }
                    }}
                  />
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      const val = (document.getElementById("api-key-input") as HTMLInputElement)?.value;
                      if (val) saveApiKey(val);
                    }}
                  >
                    Save
                  </button>
                  {apiKey && (
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => setShowApiKeyInput(false)}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages */}
          <div
            className="glass rounded-2xl flex-1 overflow-y-auto p-4 flex flex-col gap-3"
            style={{ minHeight: 0 }}
          >
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 16, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16,1,0.3,1] }}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar */}
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 mt-1"
                    style={{
                      background: msg.role === "assistant"
                        ? `${member.color}20`
                        : "rgba(91,77,255,0.2)",
                      border: `1px solid ${msg.role === "assistant" ? member.color : "var(--primary-500)"}30`,
                    }}
                  >
                    {msg.role === "assistant" ? member.emoji : "D"}
                  </div>

                  {/* Bubble */}
                  <div
                    className="rounded-2xl px-4 py-3 max-w-[80%]"
                    style={{
                      background: msg.role === "assistant"
                        ? `${member.color}10`
                        : "rgba(91,77,255,0.15)",
                      border: msg.role === "assistant"
                        ? `1px solid ${member.color}20`
                        : "1px solid rgba(91,77,255,0.25)",
                    }}
                  >
                    <p
                      className="text-sm leading-relaxed whitespace-pre-wrap"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {msg.content}
                    </p>
                    <p
                      className="text-xs mt-1"
                      style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
                    >
                      {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-3"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                    style={{ background: `${member.color}20`, border: `1px solid ${member.color}30` }}
                  >
                    {member.emoji}
                  </div>
                  <div
                    className="rounded-2xl px-4 py-3 flex items-center gap-1.5"
                    style={{ background: `${member.color}10`, border: `1px solid ${member.color}20` }}
                  >
                    {[0,1,2].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full"
                        style={{
                          background: member.color,
                          animation: `pulse-glow 1.2s ease-in-out infinite`,
                          animationDelay: `${i * 0.2}s`,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            className="glass rounded-2xl p-3 flex gap-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder={`Message ${member.name}...`}
              className="input flex-1"
              style={{
                background: "transparent",
                border: "none",
                boxShadow: "none",
                fontSize: "0.9375rem",
              }}
              disabled={loading}
            />
            <motion.button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="btn btn-primary btn-md"
              style={{
                background: `linear-gradient(135deg, ${member.color}cc, ${member.color})`,
                boxShadow: `0 4px 20px ${member.color}40`,
                opacity: loading || !input.trim() ? 0.5 : 1,
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {loading ? "⏳" : "→"}
            </motion.button>
          </div>
        </div>
      </AppShell>
    </>
  );
}
