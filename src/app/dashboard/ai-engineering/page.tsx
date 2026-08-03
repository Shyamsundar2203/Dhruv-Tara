"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import AppShell from "@/components/layout/AppShell";
import CustomCursor from "@/components/common/CustomCursor";

const NeuralBackground = dynamic(() => import("@/components/three/NeuralBackground"), { ssr: false });

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } } };

const SKILL_TREE = [
  {
    stage: "Level 1: Core Foundation",
    icon: "🐍",
    skills: [
      { name: "Advanced Python", status: "completed", desc: "Generators, Decorators, AsyncIO, Typing" },
      { name: "Linear Algebra & Calculus", status: "completed", desc: "Matrices, Eigenvalues, Derivatives, Gradients" },
      { name: "Data Manipulation", status: "completed", desc: "NumPy, Pandas, Vectorization" },
    ],
  },
  {
    stage: "Level 2: Classical Machine Learning",
    icon: "📊",
    skills: [
      { name: "Supervised Learning", status: "completed", desc: "Regression, Decision Trees, SVMs, XGBoost" },
      { name: "Unsupervised Learning", status: "in_progress", desc: "K-Means, PCA, T-SNE, Clustering" },
      { name: "Model Evaluation", status: "completed", desc: "Precision, Recall, ROC-AUC, Cross-Validation" },
    ],
  },
  {
    stage: "Level 3: Deep Learning & PyTorch",
    icon: "🔥",
    skills: [
      { name: "PyTorch Core", status: "in_progress", desc: "Tensors, Autograd, Custom Loss & Modules" },
      { name: "Computer Vision (CNNs)", status: "unlocked", desc: "ResNet, YOLO, OpenCV Image Processing" },
      { name: "Sequence Models (RNNs/LSTMs)", status: "unlocked", desc: "Embeddings, Attention Mechanisms" },
    ],
  },
  {
    stage: "Level 4: Generative AI & LLMs",
    icon: "⚡",
    skills: [
      { name: "Transformer Architecture", status: "in_progress", desc: "Self-Attention, KV-Cache, Positional Encoding" },
      { name: "Vector Databases & RAG", status: "completed", desc: "Qdrant, Pinecone, Embeddings, Reranking" },
      { name: "LLM Fine-Tuning", status: "unlocked", desc: "LoRA, QLoRA, PEFT, HuggingFace Transformers" },
    ],
  },
  {
    stage: "Level 5: AI Agents & MLOps",
    icon: "🌐",
    skills: [
      { name: "Autonomous AI Agents", status: "in_progress", desc: "LangChain, AutoGen, CrewAI, Tool Calling" },
      { name: "MLOps & Deployment", status: "unlocked", desc: "FastAPI, Docker, Triton, vLLM, TensorRT" },
    ],
  },
];

export default function AIEngineeringPage() {
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
                0.1% Technical Mastery
              </p>
              <h1 className="font-display text-3xl font-bold text-gradient-primary">AI Engineering Hub</h1>
              <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                Skill tree roadmap from Python fundamentals to Autonomous Agents & Production MLOps.
              </p>
            </motion.div>

            {/* Skill Tree Stages */}
            <div className="flex flex-col gap-6">
              {SKILL_TREE.map((stage) => (
                <motion.div key={stage.stage} variants={item} className="glass rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4 border-b pb-3" style={{ borderColor: "var(--border-normal)" }}>
                    <span style={{ fontSize: "1.5rem" }}>{stage.icon}</span>
                    <h2 className="font-display text-base font-bold" style={{ color: "var(--primary-300)" }}>
                      {stage.stage}
                    </h2>
                  </div>

                  <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                    {stage.skills.map((skill) => (
                      <div
                        key={skill.name}
                        className="p-4 rounded-xl flex flex-col justify-between"
                        style={{
                          background: skill.status === "completed" ? "rgba(0,255,136,0.05)" : skill.status === "in_progress" ? "rgba(91,77,255,0.08)" : "var(--bg-elevated)",
                          border: `1px solid ${skill.status === "completed" ? "rgba(0,255,136,0.25)" : skill.status === "in_progress" ? "var(--primary-500)" : "var(--border-normal)"}`,
                        }}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{skill.name}</h3>
                            <span
                              className="text-xs font-mono uppercase px-2 py-0.5 rounded-full"
                              style={{
                                background: skill.status === "completed" ? "rgba(0,255,136,0.15)" : skill.status === "in_progress" ? "rgba(91,77,255,0.2)" : "var(--bg-overlay)",
                                color: skill.status === "completed" ? "var(--success)" : skill.status === "in_progress" ? "var(--primary-300)" : "var(--text-muted)",
                              }}
                            >
                              {skill.status.replace("_", " ")}
                            </span>
                          </div>
                          <p className="text-xs" style={{ color: "var(--text-muted)" }}>{skill.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </AppShell>
    </>
  );
}
