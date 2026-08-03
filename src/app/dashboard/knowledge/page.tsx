"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import AppShell from "@/components/layout/AppShell";
import CustomCursor from "@/components/common/CustomCursor";
import { useODTStore, NoteItem } from "@/lib/store/odt.store";

const NeuralBackground = dynamic(() => import("@/components/three/NeuralBackground"), { ssr: false });

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } } };

export default function KnowledgePage() {
  const { notes, addNote, updateNote, deleteNote } = useODTStore();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(notes[0]?.id ?? null);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  const selectedNote = notes.find((n) => n.id === selectedNoteId);

  const filteredNotes = notes.filter((n) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return n.title.toLowerCase().includes(q) || n.content_md.toLowerCase().includes(q) || n.tags.some((t) => t.toLowerCase().includes(q));
  });

  const handleCreateNote = () => {
    if (!title.trim()) return;
    addNote({
      title: title.trim(),
      content_md: content.trim(),
      tags: tags.split(",").map((s) => s.trim()).filter(Boolean),
    });
    setTitle("");
    setContent("");
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
            <motion.div variants={item} className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                  Second Brain Vault
                </p>
                <h1 className="font-display text-3xl font-bold text-gradient-primary">Knowledge Vault</h1>
              </div>
              <button onClick={() => setShowAddModal(true)} className="btn btn-primary btn-sm">
                + New Note
              </button>
            </motion.div>

            {/* Split Screen Note Viewer */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
              {/* Left Column: Note List */}
              <motion.div variants={item} className="glass rounded-2xl p-4 flex flex-col gap-3">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="🔍 Search notes & tags..."
                  className="input text-xs"
                />

                <div className="flex flex-col gap-2 overflow-y-auto max-h-[500px]">
                  {filteredNotes.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => setSelectedNoteId(n.id)}
                      className="p-3 rounded-xl text-left transition-all"
                      style={{
                        background: selectedNoteId === n.id ? "rgba(91,77,255,0.15)" : "var(--bg-elevated)",
                        border: `1px solid ${selectedNoteId === n.id ? "var(--primary-400)" : "var(--border-normal)"}`,
                        cursor: "pointer",
                      }}
                    >
                      <h3 className="font-bold text-sm mb-1" style={{ color: "var(--text-primary)" }}>{n.title}</h3>
                      <p className="text-xs line-clamp-2" style={{ color: "var(--text-muted)" }}>{n.content_md.slice(0, 80)}...</p>
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Right 2 Columns: Selected Note Editor / Reader */}
              <motion.div variants={item} className="glass rounded-2xl p-6 md:col-span-2">
                {selectedNote ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "var(--border-normal)" }}>
                      <input
                        value={selectedNote.title}
                        onChange={(e) => updateNote(selectedNote.id, { title: e.target.value })}
                        className="input text-lg font-bold font-display"
                        style={{ background: "transparent", border: "none", boxShadow: "none", padding: 0 }}
                      />
                      <button onClick={() => deleteNote(selectedNote.id)} className="text-xs text-danger">Delete Note</button>
                    </div>

                    <textarea
                      value={selectedNote.content_md}
                      onChange={(e) => updateNote(selectedNote.id, { content_md: e.target.value })}
                      rows={14}
                      className="input text-sm"
                      style={{ lineHeight: 1.7, fontFamily: "var(--font-mono)", background: "var(--bg-overlay)" }}
                    />
                  </div>
                ) : (
                  <div className="text-center py-20 text-muted">Select or create a note to begin</div>
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Add Note Modal */}
          <AnimatePresence>
            {showAddModal && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="cmd-backdrop flex items-center justify-center" onClick={() => setShowAddModal(false)}>
                <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="glass rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                  <h3 className="font-display text-lg font-bold text-gradient-primary mb-4">Create Note</h3>
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="text-xs font-mono text-muted mb-1 block">Title</label>
                      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Note title..." className="input text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-mono text-muted mb-1 block">Content (Markdown supported)</label>
                      <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} className="input text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-mono text-muted mb-1 block">Tags (comma-separated)</label>
                      <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="ai, architecture" className="input text-sm" />
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button onClick={handleCreateNote} className="btn btn-primary btn-md flex-1">Save Note</button>
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
