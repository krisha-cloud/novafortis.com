import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";

const MODES = [
  { label: "Focus", minutes: 25, color: "primary" },
  { label: "Short Break", minutes: 5, color: "accent" },
  { label: "Long Break", minutes: 15, color: "warning" },
];

const StudyTimer = () => {
  const [modeIndex, setModeIndex] = useState(0);
  const [seconds, setSeconds] = useState(MODES[0].minutes * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);

  const mode = MODES[modeIndex];
  const total = mode.minutes * 60;
  const progress = ((total - seconds) / total) * 100;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          setRunning(false);
          if (modeIndex === 0) setSessions((p) => p + 1);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, modeIndex]);

  const switchMode = useCallback((i: number) => {
    setModeIndex(i);
    setSeconds(MODES[i].minutes * 60);
    setRunning(false);
  }, []);

  const reset = () => {
    setSeconds(mode.minutes * 60);
    setRunning(false);
  };

  const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");

  return (
    <div className="max-w-2xl mx-auto text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold mb-8">Study Timer</h1>

        <div className="flex justify-center gap-2 mb-10">
          {MODES.map((m, i) => (
            <button
              key={m.label}
              onClick={() => switchMode(i)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                modeIndex === i ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="glass-card p-12 mb-8 relative overflow-hidden">
          <svg className="w-56 h-56 mx-auto -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--secondary))" strokeWidth="4" />
            <circle
              cx="50" cy="50" r="45" fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-6xl font-display font-bold tabular-nums">{mins}:{secs}</span>
            <span className="text-muted-foreground text-sm mt-2">{mode.label}</span>
          </div>
        </div>

        <div className="flex justify-center gap-3 mb-8">
          <Button size="lg" variant="outline" onClick={reset}>
            <RotateCcw className="w-5 h-5" />
          </Button>
          <Button size="lg" onClick={() => setRunning(!running)} className="gradient-primary text-primary-foreground px-8 glow-primary">
            {running ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Coffee className="w-4 h-4" />
          <span className="text-sm">{sessions} sessions completed today</span>
        </div>
      </motion.div>
    </div>
  );
};

export default StudyTimer;
