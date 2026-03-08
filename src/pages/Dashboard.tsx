import { motion } from "framer-motion";
import { Timer, BookOpen, Brain, Shield, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  { to: "/timer", icon: Timer, title: "Study Timer", desc: "Pomodoro focus sessions", color: "primary" },
  { to: "/notes", icon: BookOpen, title: "Notes", desc: "Write & organize notes", color: "accent" },
  { to: "/quiz", icon: Brain, title: "Quiz", desc: "Test your knowledge", color: "warning" },
  { to: "/focus", icon: Shield, title: "Focus Mode", desc: "Block distractions", color: "destructive" },
  { to: "/study-plan", icon: Sparkles, title: "AI Study Plan", desc: "AI-generated plans", color: "accent" },
];

const Dashboard = () => {
  return (
    <div className="max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-display font-bold mb-2">
          Welcome to <span className="text-gradient">StudyNova</span>
        </h1>
        <p className="text-muted-foreground text-lg mb-10">Your all-in-one study companion. Pick a tool to get started.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f, i) => (
          <motion.div
            key={f.to}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link to={f.to} className="block glass-card p-6 hover:border-primary/30 transition-all group glow-primary hover:glow-primary">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-${f.color}/10`}>
                <f.icon className={`w-6 h-6 text-${f.color}`} />
              </div>
              <h3 className="font-display font-semibold text-lg mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{f.desc}</p>
              <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                Open <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
