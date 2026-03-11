import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Coffee, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import PerformanceModal from "@/components/PerformanceModal";
import { useXP } from "@/components/XPProvider";

const MODES = [
  { label: "Focus", minutes: 25 },
  { label: "Short Break", minutes: 5 },
  { label: "Long Break", minutes: 15 },
];

const StudyTimer = () => {
  const { awardXP } = useXP();
  const [modeIndex, setModeIndex] = useState(0);
  const [seconds, setSeconds] = useState(MODES[0].minutes * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [showPerformance, setShowPerformance] = useState(false);

  const mode = MODES[modeIndex];
  const total = mode.minutes * 60;
  const progress = ((total - seconds) / total) * 100;
  const circumference = 2 * Math.PI * 45;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          setRunning(false);
          if (modeIndex === 0) {
            setSessions((p) => p + 1);
            setShowPerformance(true);
          }
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
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium mb-6">
          <Zap className="w-3 h-3" />
          Pomodoro Timer
        </div>
        <h1 className="text-4xl font-display font-extrabold mb-8">Study Timer</h1>

        {/* Mode selector */}
        <div className="inline-flex p-1 rounded-2xl bg-secondary/50 backdrop-blur-xl mb-10 border border-border/30">
          {MODES.map((m, i) => (
            <button
              key={m.label}
              onClick={() => switchMode(i)}
              className={`relative px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                modeIndex === i ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {modeIndex === i && (
                <motion.div
                  layoutId="timer-mode"
                  className="absolute inset-0 gradient-primary rounded-xl glow-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{m.label}</span>
            </button>
          ))}
        </div>

        {/* Timer ring */}
        <div className="glass-card p-16 mb-8 relative overflow-hidden">
          {/* Background decorative rings */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <div className="w-[400px] h-[400px] rounded-full border border-primary" />
            <div className="absolute w-[350px] h-[350px] rounded-full border border-accent" />
          </div>

          <div className="relative">
            <svg className="w-64 h-64 mx-auto -rotate-90" viewBox="0 0 100 100">
              {/* Track */}
              <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(230, 20%, 13%)" strokeWidth="3" />
              {/* Glow behind progress */}
              <circle
                cx="50" cy="50" r="45" fill="none"
                stroke="hsl(160, 84%, 39%)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - progress / 100)}
                className="transition-all duration-1000"
                style={{ filter: "blur(4px)" }}
                opacity="0.3"
              />
              {/* Progress */}
              <circle
                cx="50" cy="50" r="45" fill="none"
                stroke="url(#timer-gradient)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - progress / 100)}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="timer-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(160, 84%, 45%)" />
                  <stop offset="100%" stopColor="hsl(185, 90%, 50%)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={`${mins}:${secs}`}
                  initial={{ opacity: 0.5, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-7xl font-display font-bold tabular-nums tracking-tight"
                >
                  {mins}:{secs}
                </motion.span>
              </AnimatePresence>
              <span className="text-muted-foreground text-sm mt-3 uppercase tracking-wider">{mode.label}</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-10">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="lg" variant="outline" onClick={reset} className="rounded-2xl h-14 w-14 border-border/50">
              <RotateCcw className="w-5 h-5" />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              onClick={() => setRunning(!running)}
              className="rounded-2xl h-14 px-12 gradient-primary text-primary-foreground glow-primary font-semibold text-base"
            >
              {running ? <><Pause className="w-5 h-5 mr-2" /> Pause</> : <><Play className="w-5 h-5 mr-2" /> Start</>}
            </Button>
          </motion.div>
        </div>

        {/* Session counter */}
        <div className="glass-card inline-flex items-center gap-3 px-5 py-3">
          <Coffee className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{sessions} sessions completed</span>
          {sessions > 0 && <span className="text-xs">🔥</span>}
        </div>
      </motion.div>

      <PerformanceModal
        open={showPerformance}
        onClose={() => setShowPerformance(false)}
        type="timer"
        sessionsCompleted={sessions}
        totalMinutes={sessions * MODES[0].minutes}
      />
    </div>
  );
};

export default StudyTimer;
