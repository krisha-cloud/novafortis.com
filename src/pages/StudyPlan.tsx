import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, BookOpen, Clock, Target, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface PlanItem {
  time: string;
  subject: string;
  task: string;
  duration: string;
  type: "study" | "break" | "review";
}

const StudyPlan = () => {
  const [subject, setSubject] = useState("");
  const [goal, setGoal] = useState("");
  const [hours, setHours] = useState("4");
  const [plan, setPlan] = useState<PlanItem[] | null>(null);
  const [generating, setGenerating] = useState(false);

  const generatePlan = () => {
    if (!subject.trim()) return;
    setGenerating(true);

    setTimeout(() => {
      const h = parseInt(hours) || 4;
      const items: PlanItem[] = [];
      let startHour = 9;
      const tasks: Array<{ task: string; type: PlanItem["type"]; dur: string }> = [
        { task: `Review ${subject} fundamentals`, type: "study", dur: "45 min" },
        { task: `Practice ${subject} problems`, type: "study", dur: "45 min" },
        { task: "Refresh & recharge", type: "break", dur: "15 min" },
        { task: `Deep dive: advanced ${subject}`, type: "study", dur: "50 min" },
        { task: `Summarize key ${subject} concepts`, type: "review", dur: "30 min" },
        { task: "Self-test & flashcards", type: "review", dur: "30 min" },
      ];

      for (let i = 0; i < Math.min(h + 1, tasks.length); i++) {
        items.push({
          time: `${startHour.toString().padStart(2, "0")}:00`,
          subject,
          task: tasks[i].task,
          duration: tasks[i].dur,
          type: tasks[i].type,
        });
        startHour += 1;
      }
      setPlan(items);
      setGenerating(false);
    }, 2000);
  };

  const typeColors = {
    study: "border-primary/30 bg-primary/5",
    break: "border-[hsl(38,92%,50%)]/30 bg-[hsl(38,92%,50%)]/5",
    review: "border-accent/30 bg-accent/5",
  };

  const typeBadgeColors = {
    study: "bg-primary/10 text-primary",
    break: "bg-[hsl(38,92%,50%)]/10 text-[hsl(38,92%,50%)]",
    review: "bg-accent/10 text-accent",
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[hsl(185,90%,48%)]/20 bg-[hsl(185,90%,48%)]/5 text-[hsl(185,90%,48%)] text-xs font-medium mb-6">
          <Sparkles className="w-3 h-3" />
          AI-Powered
        </div>
        <h1 className="text-3xl font-display font-extrabold mb-2">AI Study Plan</h1>
        <p className="text-muted-foreground mb-8">Generate a personalized study schedule in seconds.</p>

        <div className="glass-card p-7 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[hsl(185,90%,48%)]/30 to-transparent" />

          <div className="grid gap-5">
            <div>
              <label className="text-sm font-medium mb-2 block text-foreground/80">Subject</label>
              <Input
                placeholder="e.g. Mathematics, Biology, History..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="bg-secondary/50 border-border/30 rounded-xl h-12"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block text-foreground/80">Study Goal <span className="text-muted-foreground">(optional)</span></label>
              <Textarea
                placeholder="e.g. Prepare for final exam covering chapters 5-8..."
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="bg-secondary/50 border-border/30 rounded-xl"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block text-foreground/80">Available Hours</label>
              <Input
                type="number"
                min="1"
                max="12"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="bg-secondary/50 border-border/30 rounded-xl w-28 h-12"
              />
            </div>
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button
                onClick={generatePlan}
                disabled={generating || !subject.trim()}
                className="w-full gradient-primary text-primary-foreground glow-primary rounded-xl h-12 font-semibold text-base"
              >
                {generating ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    >
                      <Wand2 className="w-5 h-5 mr-2" />
                    </motion.div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Study Plan
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </div>

        {plan && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-display font-bold">Your Study Plan</h2>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[52px] top-4 bottom-4 w-[1px] bg-gradient-to-b from-primary/30 via-accent/30 to-transparent" />

              <div className="space-y-3">
                {plan.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.12, duration: 0.5 }}
                    className={`glass-card p-5 flex items-center gap-5 border ${typeColors[item.type]}`}
                  >
                    <div className="flex-shrink-0 w-16 text-center relative">
                      <div className="w-3 h-3 rounded-full bg-card border-2 border-primary absolute -left-[18px] top-1/2 -translate-y-1/2" />
                      <Clock className="w-3.5 h-3.5 text-muted-foreground mx-auto mb-1" />
                      <span className="text-sm font-bold font-display">{item.time}</span>
                    </div>
                    <div className="w-[1px] h-10 bg-border/30" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">{item.task}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md ${typeBadgeColors[item.type]}`}>
                          {item.type}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {item.duration}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="glass-card p-4 mt-6 text-center border border-[hsl(185,90%,48%)]/10">
              <p className="text-xs text-muted-foreground">
                💡 Connect <span className="text-[hsl(185,90%,48%)] font-medium">Lovable Cloud</span> for AI-powered personalized plans
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default StudyPlan;
