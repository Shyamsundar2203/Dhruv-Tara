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

export default function FitnessPage() {
  const { workouts, addWorkout, deleteWorkout } = useODTStore();
  const [showAddModal, setShowAddModal] = useState(false);

  const [exercise, setExercise] = useState("");
  const [sets, setSets] = useState("4");
  const [reps, setReps] = useState("10");
  const [weight, setWeight] = useState("70");

  const handleAddWorkout = () => {
    if (!exercise.trim()) return;
    addWorkout({
      exercise: exercise.trim(),
      sets: parseInt(sets) || 3,
      reps: parseInt(reps) || 10,
      weight_kg: parseFloat(weight) || 0,
      date: new Date().toISOString().slice(0, 10),
    });
    setExercise("");
    setShowAddModal(false);
  };

  return (
    <>
      <CustomCursor />
      <NeuralBackground />
      <AppShell>
        <div className="page-container" style={{ position: "relative", zIndex: 1 }}>
          {/* Header */}
          <motion.div variants={container} initial="hidden" animate="show" className="mb-6">
            <motion.div variants={item} className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                  Physical Hardware & Stamina
                </p>
                <h1 className="font-display text-3xl font-bold text-gradient-primary">Fitness Tracker</h1>
              </div>
              <button onClick={() => setShowAddModal(true)} className="btn btn-primary btn-sm">
                + Log Workout Set
              </button>
            </motion.div>

            {/* Workout Log Grid */}
            <motion.div variants={item} className="glass rounded-2xl p-6">
              <h2 className="font-display text-sm font-bold mb-4" style={{ color: "var(--success)" }}>
                🏋️ WORKOUT LOG & PROGRESSIVE OVERLOAD
              </h2>

              <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                {workouts.map((w) => (
                  <div key={w.id} className="p-4 rounded-xl flex flex-col justify-between" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-normal)" }}>
                    <div>
                      <h3 className="font-bold text-sm mb-1" style={{ color: "var(--text-primary)" }}>{w.exercise}</h3>
                      <div className="flex items-center gap-3 text-xs font-mono" style={{ color: "var(--primary-300)" }}>
                        <span>{w.sets} Sets</span>
                        <span>•</span>
                        <span>{w.reps} Reps</span>
                        <span>•</span>
                        <span style={{ color: "var(--gold-400)" }}>{w.weight_kg} kg</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 border-t pt-2" style={{ borderColor: "var(--border-subtle)" }}>
                      <span className="text-xs font-mono text-muted">{w.date}</span>
                      <button onClick={() => deleteWorkout(w.id)} className="text-xs text-danger">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Add Workout Modal */}
          <AnimatePresence>
            {showAddModal && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="cmd-backdrop flex items-center justify-center" onClick={() => setShowAddModal(false)}>
                <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="glass rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                  <h3 className="font-display text-lg font-bold text-gradient-primary mb-4">Log Exercise</h3>
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="text-xs font-mono text-muted mb-1 block">Exercise Name</label>
                      <input value={exercise} onChange={(e) => setExercise(e.target.value)} placeholder="e.g. Bench Press / Squats" className="input text-sm" />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-xs font-mono text-muted mb-1 block">Sets</label>
                        <input type="number" value={sets} onChange={(e) => setSets(e.target.value)} className="input text-sm" />
                      </div>
                      <div>
                        <label className="text-xs font-mono text-muted mb-1 block">Reps</label>
                        <input type="number" value={reps} onChange={(e) => setReps(e.target.value)} className="input text-sm" />
                      </div>
                      <div>
                        <label className="text-xs font-mono text-muted mb-1 block">Weight (kg)</label>
                        <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="input text-sm" />
                      </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button onClick={handleAddWorkout} className="btn btn-primary btn-md flex-1">Save Exercise</button>
                      <button onClick={() => setShowAddModal(false)} className="btn btn-ghost btn-md">Cancel</button>
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
