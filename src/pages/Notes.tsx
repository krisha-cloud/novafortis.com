import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Search, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  color: string;
}

const COLORS = [
  "from-primary/10 to-primary/5",
  "from-accent/10 to-accent/5",
  "from-[hsl(38,92%,50%)]/10 to-[hsl(38,92%,50%)]/5",
  "from-[hsl(185,90%,48%)]/10 to-[hsl(185,90%,48%)]/5",
  "from-[hsl(330,85%,60%)]/10 to-[hsl(330,85%,60%)]/5",
];

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const addNote = () => {
    const note: Note = {
      id: crypto.randomUUID(),
      title: "Untitled Note",
      content: "",
      createdAt: new Date(),
      color: COLORS[notes.length % COLORS.length],
    };
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
  const filtered = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex gap-6 h-[calc(100vh-5rem)]"
    >
      {/* Sidebar */}
      <div className="w-80 flex flex-col">
        <div className="flex items-center gap-3 mb-5">
          <h1 className="text-2xl font-display font-extrabold flex-1">Notes</h1>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="icon"
              onClick={addNote}
              className="gradient-primary text-primary-foreground rounded-xl glow-primary h-10 w-10"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>

        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-secondary/50 border-border/30 rounded-xl h-11 backdrop-blur-xl"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          <AnimatePresence>
            {filtered.map((note) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onClick={() => setActiveId(note.id)}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border ${
                  activeId === note.id
                    ? "border-primary/30 bg-primary/5 glow-primary"
                    : "border-border/20 glass-card hover:border-border/40"
                }`}
              >
                <div className={`w-full h-1 rounded-full bg-gradient-to-r ${note.color} mb-3`} />
                <h3 className="font-semibold text-sm truncate">{note.title}</h3>
                <p className="text-xs text-muted-foreground truncate mt-1">
                  {note.content || "Empty note"}
                </p>
                <p className="text-[10px] text-muted-foreground/50 mt-2">
                  {note.createdAt.toLocaleDateString()}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <FileText className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm">No notes yet</p>
              <p className="text-xs mt-1">Click + to create one</p>
            </div>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 glass-card p-8 flex flex-col relative overflow-hidden">
        {/* Top gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {active ? (
          <>
            <div className="flex items-center gap-3 mb-6">
              <Input
                value={active.title}
                onChange={(e) => updateNote(active.id, { title: e.target.value })}
                className="text-2xl font-display font-bold bg-transparent border-none p-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/30"
                placeholder="Note title..."
              />
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => deleteNote(active.id)}
                  className="text-muted-foreground hover:text-destructive rounded-xl"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </motion.div>
            </div>
            <div className={`w-16 h-1 rounded-full bg-gradient-to-r ${active.color} mb-6`} />
            <Textarea
              value={active.content}
              onChange={(e) => updateNote(active.id, { content: e.target.value })}
              placeholder="Start writing your notes..."
              className="flex-1 bg-transparent border-none resize-none focus-visible:ring-0 text-foreground/90 text-[15px] leading-relaxed placeholder:text-muted-foreground/20"
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <div className="w-20 h-20 rounded-3xl bg-secondary/50 flex items-center justify-center mb-5">
              <FileText className="w-8 h-8 opacity-30" />
            </div>
            <p className="font-medium">Select a note or create a new one</p>
            <p className="text-sm text-muted-foreground/50 mt-1">Your thoughts, organized.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Notes;
