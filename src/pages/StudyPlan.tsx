import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, BookOpen, Clock, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface PlanItem {
  time: string;
  subject: string;
  task: string;
  duration: string;
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

    // Simulated AI plan generation (connect Cloud for real AI)
    setTimeout(() => {
      const h = parseInt(hours) || 4;
      const items: PlanItem[] = [];
      let startHour = 9;
      const tasks = [
        `Review ${subject} fundamentals`,
        `Practice ${subject} problems`,
        "Take a short break",
        `Study ${subject} advanced topics`,
        `Summarize key ${subject} concepts`,
        "Review and self-test",
      ];

      for (let i = 0; i < Math.min(h, tasks.length); i++) {
        items.push({
          time: `${startHour.toString().padStart(2, "0")}:00`,
          subject,
          task: tasks[i],
          duration: i === 2 ? "15 min" : "45 min",
        });
        startHour += 1;
      }
      setPlan(items);
      setGenerating(false);
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold mb-2">AI Study Plan</h1>
        <p className="text-muted-foreground mb-8">Generate a personalized study schedule.</p>

        <div className="glass-card p-6 mb-6">
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Subject</label>
              <Input placeholder="e.g. Mathematics, Biology, History" value={subject} onChange={(e) => setSubject(e.target.value)} className="bg-secondary" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Study Goal (optional)</label>
              <Textarea placeholder="e.g. Prepare for final exam chapter 5-8" value={goal} onChange={(e) => setGoal(e.target.value)} className="bg-secondary" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Available Hours</label>
              <Input type="number" min="1" max="12" value={hours} onChange={(e) => setHours(e.target.value)} className="bg-secondary w-24" />
            </div>
            <Button onClick={generatePlan} disabled={generating || !subject.trim()} className="gradient-primary text-primary-foreground glow-primary">
              <Sparkles className="w-4 h-4 mr-2" />
              {generating ? "Generating..." : "Generate Plan"}
            </Button>
          </div>
        </div>

        {plan && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-xl font-display font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" /> Your Study Plan
            </h2>
            <div className="space-y-3">
              {plan.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-4 flex items-center gap-4"
                >
                  <div className="flex-shrink-0 w-16 text-center">
                    <Clock className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                    <span className="text-sm font-medium">{item.time}</span>
                  </div>
                  <div className="w-px h-10 bg-border" />
                  <div className="flex-1">
                    <p className="font-medium">{item.task}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <BookOpen className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{item.duration}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              💡 Connect Lovable Cloud for AI-powered personalized plans
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default StudyPlan;
