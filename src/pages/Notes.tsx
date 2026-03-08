import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const addNote = () => {
    const note: Note = { id: crypto.randomUUID(), title: "Untitled Note", content: "", createdAt: new Date() };
    setNotes((prev) => [note, ...prev]);
    setActiveId(note.id);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...updates } : n)));
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (activeId === id) setActiveId(null);
  };

  const active = notes.find((n) => n.id === activeId);
  const filtered = notes.filter((n) => n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex gap-6 h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="w-72 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-2xl font-display font-bold flex-1">Notes</h1>
          <Button size="icon" onClick={addNote} className="gradient-primary text-primary-foreground">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search notes..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-secondary border-border" />
        </div>

        <div className="flex-1 overflow-y-auto space-y-2">
          <AnimatePresence>
            {filtered.map((note) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onClick={() => setActiveId(note.id)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  activeId === note.id ? "bg-primary/10 border border-primary/30" : "glass-card hover:bg-secondary/60"
                }`}
              >
                <h3 className="font-medium text-sm truncate">{note.title}</h3>
                <p className="text-xs text-muted-foreground truncate mt-1">{note.content || "Empty note"}</p>
              </motion.div>
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">No notes yet. Click + to create one.</p>
          )}
        </div>
      </motion.div>

      {/* Editor */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 glass-card p-6 flex flex-col">
        {active ? (
          <>
            <div className="flex items-center gap-2 mb-4">
              <Input
                value={active.title}
                onChange={(e) => updateNote(active.id, { title: e.target.value })}
                className="text-xl font-display font-bold bg-transparent border-none p-0 h-auto focus-visible:ring-0"
                placeholder="Note title..."
              />
              <Button size="icon" variant="ghost" onClick={() => deleteNote(active.id)} className="text-destructive hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <Textarea
              value={active.content}
              onChange={(e) => updateNote(active.id, { content: e.target.value })}
              placeholder="Start writing..."
              className="flex-1 bg-transparent border-none resize-none focus-visible:ring-0 text-foreground/90"
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <p>Select a note or create a new one</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Notes;
