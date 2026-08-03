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

export default function FinancePage() {
  const { transactions, addTransaction, deleteTransaction } = useODTStore();
  const [showAddModal, setShowAddModal] = useState(false);

  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState("Learning");

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((a, b) => a + b.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((a, b) => a + b.amount, 0);
  const netSavings = totalIncome - totalExpense;

  const handleAddTx = () => {
    if (!desc.trim() || !amount) return;
    addTransaction({
      description: desc.trim(),
      amount: parseFloat(amount),
      type,
      category,
      date: new Date().toISOString().slice(0, 10),
    });
    setDesc("");
    setAmount("");
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
                  Sovereign Wealth Management
                </p>
                <h1 className="font-display text-3xl font-bold text-gradient-primary">Finance & Budget</h1>
              </div>
              <button onClick={() => setShowAddModal(true)} className="btn btn-primary btn-sm">
                + Add Transaction
              </button>
            </motion.div>

            {/* Financial Summary Cards */}
            <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="glass rounded-2xl p-5 border-l-4" style={{ borderLeftColor: "var(--success)" }}>
                <p className="text-xs font-mono uppercase text-muted mb-1">Total Income</p>
                <p className="font-display text-2xl font-bold" style={{ color: "var(--success)" }}>
                  ₹{totalIncome.toLocaleString()}
                </p>
              </div>

              <div className="glass rounded-2xl p-5 border-l-4" style={{ borderLeftColor: "var(--danger)" }}>
                <p className="text-xs font-mono uppercase text-muted mb-1">Total Expenses</p>
                <p className="font-display text-2xl font-bold" style={{ color: "var(--danger)" }}>
                  ₹{totalExpense.toLocaleString()}
                </p>
              </div>

              <div className="glass rounded-2xl p-5 border-l-4" style={{ borderLeftColor: "var(--accent-400)" }}>
                <p className="text-xs font-mono uppercase text-muted mb-1">Net Balance / Savings</p>
                <p className="font-display text-2xl font-bold" style={{ color: "var(--accent-400)" }}>
                  ₹{netSavings.toLocaleString()}
                </p>
              </div>
            </motion.div>

            {/* Ledger List */}
            <motion.div variants={item} className="glass rounded-2xl p-6">
              <h2 className="font-display text-sm font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                TRANSACTION LEDGER
              </h2>

              <div className="flex flex-col gap-2">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3.5 rounded-xl" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-normal)" }}>
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{tx.type === "income" ? "📈" : "💸"}</span>
                      <div>
                        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{tx.description}</p>
                        <span className="text-xs font-mono text-muted">{tx.category} • {tx.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-mono font-bold text-sm" style={{ color: tx.type === "income" ? "var(--success)" : "var(--danger)" }}>
                        {tx.type === "income" ? "+" : "-"}₹{tx.amount.toLocaleString()}
                      </span>
                      <button onClick={() => deleteTransaction(tx.id)} className="text-xs text-danger">✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Add Transaction Modal */}
          <AnimatePresence>
            {showAddModal && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="cmd-backdrop flex items-center justify-center" onClick={() => setShowAddModal(false)}>
                <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="glass rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                  <h3 className="font-display text-lg font-bold text-gradient-primary mb-4">Log Transaction</h3>
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="text-xs font-mono text-muted mb-1 block">Description</label>
                      <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="e.g. AI Book / Freelance Income" className="input text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-mono text-muted mb-1 block">Amount (₹)</label>
                      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="1500" className="input text-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-mono text-muted mb-1 block">Type</label>
                        <select value={type} onChange={(e) => setType(e.target.value as any)} className="input text-sm">
                          <option value="expense">Expense</option>
                          <option value="income">Income</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-mono text-muted mb-1 block">Category</label>
                        <input value={category} onChange={(e) => setCategory(e.target.value)} className="input text-sm" />
                      </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button onClick={handleAddTx} className="btn btn-primary btn-md flex-1">Save Transaction</button>
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
