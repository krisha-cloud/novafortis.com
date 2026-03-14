import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ArrowRight, User, Clock, Sparkles } from "lucide-react";
import { useOnboarding } from "./OnboardingProvider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const DURATION_OPTIONS = [
  { label: "25 min", value: 25, desc: "Classic Pomodoro" },
  { label: "45 min", value: 45, desc: "Deep focus" },
  { label: "60 min", value: 60, desc: "Long session" },
  { label: "90 min", value: 90, desc: "Ultra marathon" },
];

const OnboardingScreen = () => {
  const { completeOnboarding } = useOnboarding();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [exiting, setExiting] = useState(false);

  const handleFinish = () => {
    if (!selectedDuration) return;
    setExiting(true);
    setTimeout(() => {
      completeOnboarding({ name: name.trim(), studyDuration: selectedDuration });
    }, 800);
  };

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-background" />
          
          <motion.div
            animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-20 blur-[120px]"
            style={{ background: "hsl(var(--primary))" }}
          />
          <motion.div
            animate={{ x: [0, -30, 20, 0], y: [0, 30, -20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-15 blur-[100px]"
            style={{ background: "hsl(var(--accent))" }}
          />

          <div className="relative z-10 w-full max-w-md px-6">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                    className="w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center mx-auto mb-8 glow-primary"
                  >
                    <Zap className="w-10 h-10 text-primary-foreground" />
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-4xl font-display font-extrabold mb-3"
                  >
                    Welcome to{" "}
                    <span className="text-gradient">Nova Fortis</span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                    className="text-muted-foreground text-lg mb-10"
                  >
                    Your all-in-one study companion
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-muted-foreground/65 text-xs"
                  >
                    developed and published by nova fortis - kp
                  </motion.p>

                  <div className="mb-10" />

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div className="flex justify-center gap-6 mb-12">
                      {[
                        { icon: "⏱", label: "Timer" },
                        { icon: "📝", label: "Notes" },
                        { icon: "🧠", label: "Quiz" },
                        { icon: "🛡", label: "Focus" },
                      ].map((f, i) => (
                        <motion.div
                          key={f.label}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.8 + i * 0.1, type: "spring" }}
                          className="flex flex-col items-center gap-2"
                        >
                          <div className="w-12 h-12 rounded-2xl bg-secondary/50 border border-border/30 flex items-center justify-center text-lg">
                            {f.icon}
                          </div>
                          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                            {f.label}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={() => setStep(1)}
                        className="gradient-primary text-primary-foreground rounded-2xl h-14 px-10 font-semibold text-base glow-primary"
                      >
                        Get Started
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                    className="w-16 h-16 rounded-2xl bg-secondary/50 border border-border/30 flex items-center justify-center mx-auto mb-6"
                  >
                    <User className="w-7 h-7 text-primary" />
                  </motion.div>

                  <h2 className="text-2xl font-display font-bold mb-2">What's your name?</h2>
                  <p className="text-muted-foreground text-sm mb-8">Let's personalize your experience</p>

                  <Input
                    placeholder="Enter your name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && name.trim() && setStep(2)}
                    autoFocus
                    className="bg-secondary/50 border-border/30 rounded-xl h-14 text-center text-lg font-medium mb-6 backdrop-blur-xl"
                  />

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => name.trim() && setStep(2)}
                      disabled={!name.trim()}
                      className="gradient-primary text-primary-foreground rounded-2xl h-12 px-8 font-semibold glow-primary w-full"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>

                  <div className="flex justify-center gap-2 mt-8">
                    <div className="w-8 h-1.5 rounded-full bg-primary" />
                    <div className="w-8 h-1.5 rounded-full bg-secondary/50" />
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="duration"
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                    className="w-16 h-16 rounded-2xl bg-secondary/50 border border-border/30 flex items-center justify-center mx-auto mb-6"
                  >
                    <Clock className="w-7 h-7 text-primary" />
                  </motion.div>

                  <h2 className="text-2xl font-display font-bold mb-2">
                    Hey {name}! <Sparkles className="w-5 h-5 inline text-primary" />
                  </h2>
                  <p className="text-muted-foreground text-sm mb-8">How long should your study sessions be?</p>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {DURATION_OPTIONS.map((opt) => (
                      <motion.button
                        key={opt.value}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSelectedDuration(opt.value)}
                        className={`p-4 rounded-2xl border transition-all text-left ${
                          selectedDuration === opt.value
                            ? "border-primary bg-primary/10 shadow-md"
                            : "border-border/30 bg-secondary/50 hover:border-border/60"
                        }`}
                      >
                        <div className="text-lg font-bold">{opt.label}</div>
                        <div className="text-xs text-muted-foreground">{opt.desc}</div>
                      </motion.button>
                    ))}
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={handleFinish}
                      disabled={!selectedDuration}
                      className="gradient-primary text-primary-foreground rounded-2xl h-12 px-8 font-semibold glow-primary w-full"
                    >
                      Start Studying
                      <Sparkles className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>

                  <div className="flex justify-center gap-2 mt-8">
                    <div className="w-8 h-1.5 rounded-full bg-primary" />
                    <div className="w-8 h-1.5 rounded-full bg-primary" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OnboardingScreen;
