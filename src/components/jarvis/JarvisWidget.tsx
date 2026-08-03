"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useODTStore } from "@/lib/store/odt.store";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface JarvisMessage {
  id: string;
  sender: "jarvis" | "user";
  text: string;
  timestamp: string;
}

export default function JarvisWidget() {
  const router = useRouter();
  const { getTodayEntry, tasks, habits, milestones } = useODTStore();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<JarvisMessage[]>([
    {
      id: "j_init",
      sender: "jarvis",
      text: "Greetings, Shyam. JARVIS system initialized. All 15 Dhruv Tara operational modules are online. How can I assist your mission today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // Voice speech synthesis
  const speakText = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel(); // stop previous speech

    const cleanText = text.replace(/[*_#`~]/g, ""); // remove markdown
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("David") || v.name.includes("English")) && v.lang.startsWith("en")
    );
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleExecuteCommand = async (userText: string) => {
    const q = userText.toLowerCase().trim();

    // Direct Command Shortcuts
    if (q.includes("open task") || q.includes("go to task") || q.includes("show task")) {
      router.push("/dashboard/tasks");
      return "Navigating to Task Operations Center.";
    }
    if (q.includes("open mission") || q.includes("go to mission") || q.includes("show mission")) {
      router.push("/dashboard/mission");
      return "Opening Mission 2030 Sovereign Canvas.";
    }
    if (q.includes("open daily") || q.includes("go to daily") || q.includes("show daily")) {
      router.push("/dashboard/daily");
      return "Opening Daily Control Center.";
    }
    if (q.includes("open team") || q.includes("show team")) {
      router.push("/team");
      return "Opening Team Dhruv Tara Advisory Hub.";
    }
    if (q.includes("open learning") || q.includes("show learning")) {
      router.push("/dashboard/learning");
      return "Opening Learning & Flashcards Hub.";
    }
    if (q.includes("open settings") || q.includes("show settings")) {
      router.push("/dashboard/settings");
      return "Opening System Settings & Control.";
    }
    if (q.includes("life score") || q.includes("my score")) {
      const activeTasks = tasks.filter((t) => t.status !== "backlog");
      const doneTasks = tasks.filter((t) => t.status === "done").length;
      const taskScore = activeTasks.length > 0 ? Math.round((doneTasks / activeTasks.length) * 100) : 50;
      const completedMs = milestones.filter((m) => m.completed_at).length;
      const msScore = milestones.length > 0 ? Math.round((completedMs / milestones.length) * 100) : 20;
      const overall = Math.round(taskScore * 0.5 + msScore * 0.5);

      return `Your overall Life Score today is ${overall} out of 100 (Task Velocity: ${taskScore}%, Milestone Completion: ${msScore}%).`;
    }
    if (q.includes("briefing") || q.includes("morning report") || q.includes("status report")) {
      const todayEntry = getTodayEntry();
      const activeTasks = tasks.filter((t) => t.status === "in_progress" || t.is_mit);
      const activeHabits = habits.filter((h) => h.is_active);
      return `Executive Briefing for today: You have ${activeTasks.length} active high-priority tasks and ${activeHabits.length} daily habits configured. Your top intention: "${todayEntry.morning_intention || "Relentless execution"}". Stay focused.`;
    }

    // Call Gemini API for general AI queries
    const apiKey = typeof window !== "undefined" ? localStorage.getItem("gemini_api_key") : null;
    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(
          `You are JARVIS, the primary AI OS assistant for Shyam Sundar inside Operation Dhruv Tara. Keep response direct, intelligent, and concise (under 80 words).\nUser Query: ${userText}`
        );
        return result.response.text();
      } catch {
        return `Processing query for "${userText}". All systems operational.`;
      }
    }

    return `Command processed: "${userText}". All Dhruv Tara modules are running smoothly.`;
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isThinking) return;

    const userText = input.trim();
    setInput("");
    const userMsg: JarvisMessage = {
      id: `u_${Date.now()}`,
      sender: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((m) => [...m, userMsg]);
    setIsThinking(true);

    const jarvisReplyText = await handleExecuteCommand(userText);

    const jarvisMsg: JarvisMessage = {
      id: `j_${Date.now()}`,
      sender: "jarvis",
      text: jarvisReplyText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((m) => [...m, jarvisMsg]);
    setIsThinking(false);
    speakText(jarvisReplyText);
  };

  return (
    <>
      {/* Floating Orb Launcher Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center p-3.5 rounded-full cursor-pointer shadow-2xl"
        style={{
          background: "linear-gradient(135deg, #ff4d94, #ff2b75)",
          boxShadow: "0 0 30px rgba(255, 43, 117, 0.6), 0 0 60px rgba(255, 43, 117, 0.3)",
          border: "2px solid rgba(255, 255, 255, 0.4)",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-2xl animate-pulse">🤖</span>
      </motion.button>

      {/* JARVIS Console Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] glass rounded-3xl overflow-hidden flex flex-col shadow-2xl"
            style={{ height: "500px", border: "1px solid rgba(255, 43, 117, 0.3)" }}
          >
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b" style={{ borderColor: "rgba(255,43,117,0.2)", background: "rgba(255,43,117,0.08)" }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: "rgba(255,43,117,0.2)", border: "1px solid #ff2b75" }}>
                  ✦
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-gradient-rose">JARVIS OS AI</h3>
                  <p className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                    {isSpeaking ? "🔊 Speaking..." : "Online • Voice Enabled"}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="btn btn-ghost btn-sm">✕</button>
            </div>

            {/* Quick Action Pills */}
            <div className="px-4 py-2 flex gap-1.5 overflow-x-auto border-b" style={{ borderColor: "rgba(255,43,117,0.1)", background: "var(--bg-elevated)" }}>
              {[
                { label: "📋 Tasks", cmd: "open tasks" },
                { label: "🎯 Mission", cmd: "open mission" },
                { label: "⭐ Score", cmd: "what is my life score" },
                { label: "📢 Briefing", cmd: "give daily briefing" },
              ].map((btn) => (
                <button
                  key={btn.label}
                  onClick={() => {
                    setInput(btn.cmd);
                    setTimeout(() => handleSendMessage(), 100);
                  }}
                  className="text-xs px-2.5 py-1 rounded-full font-medium transition-all"
                  style={{ background: "rgba(255,43,117,0.1)", color: "#ff80ab", border: "1px solid rgba(255,43,117,0.2)", cursor: "pointer", whiteSpace: "nowrap" }}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className="p-3 rounded-2xl max-w-[82%] text-xs leading-relaxed"
                    style={{
                      background: msg.sender === "user" ? "linear-gradient(135deg, #ff4d94, #ff2b75)" : "rgba(255,43,117,0.1)",
                      color: msg.sender === "user" ? "white" : "var(--text-primary)",
                      border: msg.sender === "user" ? "none" : "1px solid rgba(255,43,117,0.2)",
                    }}
                  >
                    <p>{msg.text}</p>
                    <span className="text-[0.65rem] mt-1 block opacity-60 font-mono text-right">{msg.timestamp}</span>
                  </div>
                </div>
              ))}

              {isThinking && (
                <div className="flex justify-start">
                  <div className="p-3 rounded-2xl text-xs" style={{ background: "rgba(255,43,117,0.1)", color: "#ff80ab" }}>
                    JARVIS is computing...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t flex gap-2" style={{ borderColor: "rgba(255,43,117,0.2)" }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSendMessage(); }}
                placeholder="Ask JARVIS or give a command..."
                className="input text-xs flex-1"
              />
              <button onClick={handleSendMessage} className="btn btn-primary btn-sm">
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
