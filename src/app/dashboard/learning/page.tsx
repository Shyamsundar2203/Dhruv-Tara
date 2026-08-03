"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import AppShell from "@/components/layout/AppShell";
import CustomCursor from "@/components/common/CustomCursor";
import { useODTStore } from "@/lib/store/odt.store";

const NeuralBackground = dynamic(() => import("@/components/three/NeuralBackground"), { ssr: false });

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } } };

export default function LearningPage() {
  const { flashcards, addFlashcard, deleteFlashcard } = useODTStore();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);

  // New flashcard form
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [deck, setDeck] = useState("Machine Learning");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");

  const currentCard = flashcards[currentIdx];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIdx((i) => (i + 1) % flashcards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIdx((i) => (i - 1 + flashcards.length) % flashcards.length);
  };

  const handleCreateCard = () => {
    if (!front.trim() || !back.trim()) return;
    addFlashcard({ front: front.trim(), back: back.trim(), deck: deck.trim(), difficulty });
    setFront("");
    setBack("");
    setShowAddCardModal(false);
  };

  return (
    <>
      <CustomCursor />
      <NeuralBackground />
      <AppShell>
        <div className="page-container" style={{ position: "relative", zIndex: 1 }}>
          {/* Header */}
          <motion.div variants={container} initial="hidden" animate="show" className="mb-6">
            <motion.div variants={item} className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                  Continuous Intelligence
                </p>
                <h1 className="font-display text-3xl font-bold text-gradient-primary">Learning Hub</h1>
              </div>
              <button onClick={() => setShowAddCardModal(true)} className="btn btn-primary btn-sm">
                + Create Flashcard
              </button>
            </motion.div>

            {/* Flashcard Spaced Repetition Player */}
            {flashcards.length > 0 && currentCard && (
              <motion.div variants={item} className="glass rounded-2xl p-8 flex flex-col items-center justify-center min-h-[300px] mb-6 relative">
                <div className="flex items-center justify-between w-full mb-4">
                  <span className="text-xs px-2.5 py-1 rounded-full font-mono" style={{ background: "rgba(91,77,255,0.15)", color: "var(--primary-300)" }}>
                    🎴 Deck: {currentCard.deck}
                  </span>
                  <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                    Card {currentIdx + 1} of {flashcards.length}
                  </span>
                </div>

                {/* Flip Card Container */}
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="w-full max-w-xl p-8 rounded-2xl cursor-pointer flex flex-col items-center justify-center text-center min-h-[180px] transition-all"
                  style={{
                    background: isFlipped ? "rgba(0,212,255,0.08)" : "var(--bg-elevated)",
                    border: `1px solid ${isFlipped ? "var(--accent-400)" : "var(--border-strong)"}`,
                    boxShadow: isFlipped ? "0 0 30px rgba(0,212,255,0.15)" : "none",
                  }}
                >
                  <p className="text-xs font-mono uppercase tracking-wider mb-2" style={{ color: isFlipped ? "var(--accent-400)" : "var(--primary-300)" }}>
                    {isFlipped ? "ANSWER" : "QUESTION (Click to Flip)"}
                  </p>
                  <p className="text-lg font-medium leading-relaxed" style={{ color: "var(--text-primary)" }}>
                    {isFlipped ? currentCard.back : currentCard.front}
                  </p>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4 mt-6">
                  <button onClick={handlePrev} className="btn btn-ghost btn-sm">← Previous</button>
                  <button onClick={() => setIsFlipped(!isFlipped)} className="btn btn-ghost btn-sm">🔄 Flip</button>
                  <button onClick={handleNext} className="btn btn-primary btn-sm">Next →</button>
                </div>
              </motion.div>
            )}

            {/* Deck List & All Cards */}
            <motion.div variants={item} className="glass rounded-2xl p-6">
              <h2 className="font-display text-sm font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                FLASHCARD VAULT ({flashcards.length} CARDS)
              </h2>

              <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
                {flashcards.map((card) => (
                  <div key={card.id} className="p-4 rounded-xl flex flex-col justify-between" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-normal)" }}>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-muted">{card.deck}</span>
                        <span className="text-xs font-mono uppercase" style={{ color: card.difficulty === "easy" ? "var(--success)" : card.difficulty === "medium" ? "var(--warning)" : "var(--danger)" }}>
                          {card.difficulty}
                        </span>
                      </div>
                      <p className="text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>Q: {card.front}</p>
                      <p className="text-xs" style={{ color: "var(--text-secondary)" }}>A: {card.back}</p>
                    </div>
                    <div className="flex justify-end mt-3">
                      <button onClick={() => deleteFlashcard(card.id)} className="text-xs text-danger hover:opacity-80">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Add Flashcard Modal */}
          <AnimatePresence>
            {showAddCardModal && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="cmd-backdrop flex items-center justify-center" onClick={() => setShowAddCardModal(false)}>
                <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="glass rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                  <h3 className="font-display text-lg font-bold text-gradient-primary mb-4">Create New Flashcard</h3>
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="text-xs font-mono text-muted mb-1 block">Deck Name</label>
                      <input value={deck} onChange={(e) => setDeck(e.target.value)} className="input text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-mono text-muted mb-1 block">Front (Question)</label>
                      <textarea value={front} onChange={(e) => setFront(e.target.value)} rows={3} className="input text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-mono text-muted mb-1 block">Back (Answer)</label>
                      <textarea value={back} onChange={(e) => setBack(e.target.value)} rows={3} className="input text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-mono text-muted mb-1 block">Difficulty</label>
                      <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as any)} className="input text-sm">
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button onClick={handleCreateCard} className="btn btn-primary btn-md flex-1">Save Flashcard</button>
                      <button onClick={() => setShowAddCardModal(false)} className="btn btn-ghost btn-md">Cancel</button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </AppShell>
    </>
  );
}
