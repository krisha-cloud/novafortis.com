import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Calendar, Tag, RotateCcw, CheckCircle2, Circle, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useXP } from "@/components/XPProvider";

type Priority = "low" | "medium" | "high";
type Category = { id: string; label: string; color: string };

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  categoryId: string;
  dueDate?: string;
  isDaily: boolean;
  createdAt: string;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: "study", label: "Study", color: "hsl(var(--primary))" },
  { id: "review", label: "Review", color: "hsl(var(--accent))" },
  { id: "personal", label: "Personal", color: "hsl(var(--cyan))" },
  { id: "project", label: "Project", color: "hsl(var(--warning))" },
];

const DEFAULT_DAILY_HABITS: Omit<ChecklistItem, "id" | "completed" | "createdAt">[] = [
  { text: "Review yesterday's notes", priority: "medium", categoryId: "review", isDaily: true },
  { text: "Read for 30 minutes", priority: "low", categoryId: "study", isDaily: true },
  { text: "Practice flashcards", priority: "medium", categoryId: "review", isDaily: true },
];

const PRIORITY_CONFIG: Record<Priority, { label: string; icon: string; className: string }> = {
  low: { label: "Low", icon: "🟢", className: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10" },
  medium: { label: "Med", icon: "🟡", className: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10" },
  high: { label: "High", icon: "🔴", className: "text-red-400 border-red-400/30 bg-red-400/10" },
};

const getStoredItems = (): ChecklistItem[] => {
  const stored = localStorage.getItem("nova-checklist");
  return stored ? JSON.parse(stored) : [];
};

const getLastResetDate = (): string => {
  return localStorage.getItem("nova-checklist-reset") || "";
};

const getStoredCategories = (): Category[] => {
  const stored = localStorage.getItem("nova-checklist-categories");
  return stored ? JSON.parse(stored) : DEFAULT_CATEGORIES;
};

const Checklist = () => {
  const { awardXP } = useXP();
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [categories, setCategories] = useState<Category[]>(getStoredCategories);
  const [newText, setNewText] = useState("");
  const [newPriority, setNewPriority] = useState<Priority>("medium");
  const [newCategory, setNewCategory] = useState("study");
  const [newDueDate, setNewDueDate] = useState("");
  const [newIsDaily, setNewIsDaily] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [newCatLabel, setNewCatLabel] = useState("");
  const [newCatColor, setNewCatColor] = useState("hsl(var(--primary))");
  const [activeTab, setActiveTab] = useState<"all" | "daily" | "todo">("all");

  // Initialize + daily reset
  useEffect(() => {
    let stored = getStoredItems();
    const today = new Date().toDateString();
    const lastReset = getLastResetDate();

    if (lastReset !== today) {
      // Reset daily items
      stored = stored.map((item) =>
        item.isDaily ? { ...item, completed: false } : item
      );
      // Add default dailies if none exist
      const hasDailies = stored.some((i) => i.isDaily);
      if (!hasDailies) {
        const defaults: ChecklistItem[] = DEFAULT_DAILY_HABITS.map((h) => ({
          ...h,
          id: crypto.randomUUID(),
          completed: false,
          createdAt: new Date().toISOString(),
        }));
        stored = [...defaults, ...stored];
      }
      localStorage.setItem("nova-checklist-reset", today);
    }

    setItems(stored);
  }, []);

  useEffect(() => {
    if (items.length > 0) localStorage.setItem("nova-checklist", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("nova-checklist-categories", JSON.stringify(categories));
  }, [categories]);

  const addItem = () => {
    if (!newText.trim()) return;
    const item: ChecklistItem = {
      id: crypto.randomUUID(),
      text: newText.trim(),
      completed: false,
      priority: newPriority,
      categoryId: newCategory,
      dueDate: newDueDate || undefined,
      isDaily: newIsDaily,
      createdAt: new Date().toISOString(),
    };
    setItems((prev) => [item, ...prev]);
    setNewText("");
    setNewDueDate("");
    setShowAddForm(false);
    awardXP("streak", 5, "Added a task");
  };

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (!item.completed) addXP(10);
          return { ...item, completed: !item.completed };
        }
        return item;
      })
    );
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const addCategory = () => {
    if (!newCatLabel.trim()) return;
    const cat: Category = {
      id: newCatLabel.toLowerCase().replace(/\s+/g, "-"),
      label: newCatLabel.trim(),
      color: newCatColor,
    };
    setCategories((prev) => [...prev, cat]);
    setNewCatLabel("");
    setShowCategoryManager(false);
  };

  const removeCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const filtered = items.filter((item) => {
    if (activeTab === "daily" && !item.isDaily) return false;
    if (activeTab === "todo" && item.isDaily) return false;
    if (filterCategory !== "all" && item.categoryId !== filterCategory) return false;
    return true;
  });

  const completedCount = filtered.filter((i) => i.completed).length;
  const totalCount = filtered.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const getCategoryById = (id: string) => categories.find((c) => c.id === id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gradient">Checklist</h1>
          <p className="text-muted-foreground text-sm mt-1">Stay on track with daily habits & tasks</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="gap-2 rounded-xl">
          <Plus className="w-4 h-4" /> Add Task
        </Button>
      </div>

      {/* Progress */}
      <Card className="border-border/30 bg-card/50 backdrop-blur-xl">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-foreground">
              {completedCount}/{totalCount} completed
            </span>
            <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs + Filters */}
      <div className="flex flex-wrap gap-2">
        {(["all", "daily", "todo"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab
                ? "bg-primary/15 text-primary border border-primary/20"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
            }`}
          >
            {tab === "all" ? "All" : tab === "daily" ? "🔄 Daily" : "📋 To-do"}
          </button>
        ))}

        <div className="ml-auto flex gap-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 rounded-xl text-sm bg-secondary/50 text-foreground border border-border/30 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>

          <Button variant="ghost" size="sm" onClick={() => setShowCategoryManager(true)} className="rounded-xl">
            <Tag className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Card className="border-primary/20 bg-card/60 backdrop-blur-xl">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">New Task</h3>
                  <button onClick={() => setShowAddForm(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <Input
                  placeholder="What do you need to do?"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addItem()}
                  className="bg-secondary/30 border-border/30"
                />

                <div className="flex flex-wrap gap-3">
                  {/* Priority */}
                  <div className="flex gap-1">
                    {(Object.keys(PRIORITY_CONFIG) as Priority[]).map((p) => (
                      <button
                        key={p}
                        onClick={() => setNewPriority(p)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          newPriority === p ? PRIORITY_CONFIG[p].className : "border-border/30 text-muted-foreground"
                        }`}
                      >
                        {PRIORITY_CONFIG[p].icon} {PRIORITY_CONFIG[p].label}
                      </button>
                    ))}
                  </div>

                  {/* Category */}
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="px-3 py-1.5 rounded-lg text-xs bg-secondary/30 text-foreground border border-border/30"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>

                  {/* Due date */}
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="px-3 py-1.5 rounded-lg text-xs bg-secondary/30 text-foreground border border-border/30"
                  />

                  {/* Daily toggle */}
                  <button
                    onClick={() => setNewIsDaily(!newIsDaily)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
                      newIsDaily ? "bg-primary/10 text-primary border-primary/30" : "border-border/30 text-muted-foreground"
                    }`}
                  >
                    <RotateCcw className="w-3 h-3" /> Daily
                  </button>
                </div>

                <Button onClick={addItem} disabled={!newText.trim()} className="w-full rounded-xl">
                  <Sparkles className="w-4 h-4 mr-2" /> Add Task (+5 XP)
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Manager */}
      <AnimatePresence>
        {showCategoryManager && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Card className="border-accent/20 bg-card/60 backdrop-blur-xl">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">Manage Categories</h3>
                  <button onClick={() => setShowCategoryManager(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <div key={c.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/30 bg-secondary/20">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                      <span className="text-xs font-medium text-foreground">{c.label}</span>
                      {categories.length > 1 && (
                        <button onClick={() => removeCategory(c.id)} className="text-muted-foreground hover:text-destructive">
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="New category name"
                    value={newCatLabel}
                    onChange={(e) => setNewCatLabel(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addCategory()}
                    className="bg-secondary/30 border-border/30 text-sm"
                  />
                  <input
                    type="color"
                    value={newCatColor.startsWith("hsl") ? "#10b981" : newCatColor}
                    onChange={(e) => setNewCatColor(e.target.value)}
                    className="w-10 h-10 rounded-lg border border-border/30 cursor-pointer bg-transparent"
                  />
                  <Button onClick={addCategory} size="sm" className="rounded-xl">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Items list */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <CheckCircle2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No tasks here yet. Add one!</p>
            </motion.div>
          )}

          {filtered.map((item) => {
            const cat = getCategoryById(item.categoryId);
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all group ${
                    item.completed
                      ? "bg-secondary/20 border-border/20 opacity-60"
                      : "bg-card/50 border-border/30 hover:border-primary/20 backdrop-blur-xl"
                  }`}
                >
                  {/* Checkbox */}
                  <button onClick={() => toggleItem(item.id)} className="shrink-0">
                    {item.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                    )}
                  </button>

                  {/* Category dot */}
                  {cat && <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />}

                  {/* Text */}
                  <span className={`flex-1 text-sm font-medium ${item.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {item.text}
                  </span>

                  {/* Badges */}
                  <div className="flex items-center gap-2">
                    {item.isDaily && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
                        Daily
                      </span>
                    )}

                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${PRIORITY_CONFIG[item.priority].className}`}>
                      {PRIORITY_CONFIG[item.priority].label}
                    </span>

                    {item.dueDate && (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    )}

                    <button
                      onClick={() => deleteItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Checklist;
