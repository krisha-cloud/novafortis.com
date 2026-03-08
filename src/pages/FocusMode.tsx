import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ShieldCheck, Lock, Unlock, Plus, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const defaultApps = ["Instagram", "TikTok", "Twitter", "YouTube", "Reddit", "Netflix"];

const FocusMode = () => {
  const [active, setActive] = useState(false);
  const [blockedApps, setBlockedApps] = useState<string[]>(defaultApps);
  const [newApp, setNewApp] = useState("");
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [active]);

  const toggle = () => {
    if (active) setElapsed(0);
    setActive(!active);
  };

  const addApp = () => {
    if (!newApp.trim() || blockedApps.includes(newApp.trim())) return;
    setBlockedApps((prev) => [...prev, newApp.trim()]);
    setNewApp("");
  };

  const removeApp = (app: string) => {
    if (active) return;
    setBlockedApps((prev) => prev.filter((a) => a !== app));
  };

  const hrs = Math.floor(elapsed / 3600).toString().padStart(2, "0");
  const mins = Math.floor((elapsed % 3600) / 60).toString().padStart(2, "0");
  const secs = (elapsed % 60).toString().padStart(2, "0");

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[hsl(330,85%,60%)]/20 bg-[hsl(330,85%,60%)]/5 text-[hsl(330,85%,60%)] text-xs font-medium mb-6">
          <Shield className="w-3 h-3" />
          Distraction Blocker
        </div>
        <h1 className="text-3xl font-display font-extrabold mb-2">Focus Mode</h1>
        <p className="text-muted-foreground mb-8">Block distracting apps while you study.</p>

        {/* Main card */}
        <div className="glass-card p-10 text-center mb-6 relative overflow-hidden">
          {/* Animated background when active */}
          {active && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0"
              style={{
                background: "radial-gradient(circle at 50% 50%, hsl(160, 84%, 39%, 0.06), transparent 70%)",
              }}
            />
          )}

          <div className="relative">
            <motion.div
              animate={active ? { scale: [1, 1.08, 1], rotate: [0, 2, -2, 0] } : {}}
              transition={{ repeat: active ? Infinity : 0, duration: 3, ease: "easeInOut" }}
              className="inline-block mb-6"
            >
              {active ? (
                <div className="w-24 h-24 rounded-3xl gradient-primary flex items-center justify-center glow-primary">
                  <ShieldCheck className="w-12 h-12 text-primary-foreground" />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-3xl bg-secondary/50 flex items-center justify-center">
                  <Shield className="w-12 h-12 text-muted-foreground/40" />
                </div>
              )}
            </motion.div>

            <h2 className="text-xl font-display font-bold mb-2">
              {active ? (
                <span className="text-gradient">Focus Mode Active</span>
              ) : (
                "Focus Mode Off"
              )}
            </h2>

            {active && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-display font-bold tabular-nums text-gradient my-4"
              >
                {hrs}:{mins}:{secs}
              </motion.p>
            )}

            <p className="text-sm text-muted-foreground mb-8">
              {active
                ? `${blockedApps.length} apps blocked · Stay focused!`
                : "Start focus mode to block distractions"}
            </p>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                onClick={toggle}
                size="lg"
                className={`rounded-2xl h-14 px-10 font-semibold text-base ${
                  active
                    ? "bg-destructive hover:bg-destructive/80 text-destructive-foreground"
                    : "gradient-primary text-primary-foreground glow-primary"
                }`}
              >
                {active ? (
                  <><Unlock className="w-5 h-5 mr-2" /> End Focus</>
                ) : (
                  <><Zap className="w-5 h-5 mr-2" /> Start Focus</>
                )}
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Blocked apps */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold">Blocked Apps</h3>
            <span className="text-xs text-muted-foreground glass-card px-2 py-1 rounded-lg">
              {blockedApps.length} apps
            </span>
          </div>

          {!active && (
            <div className="flex gap-2 mb-5">
              <Input
                placeholder="Add app name..."
                value={newApp}
                onChange={(e) => setNewApp(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addApp()}
                className="bg-secondary/50 border-border/30 rounded-xl"
              />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={addApp} variant="outline" className="rounded-xl">
                  <Plus className="w-4 h-4" />
                </Button>
              </motion.div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {blockedApps.map((app) => (
                <motion.span
                  key={app}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    active
                      ? "bg-destructive/10 text-destructive border border-destructive/20"
                      : "bg-secondary/60 text-secondary-foreground border border-border/20 hover:border-border/40"
                  }`}
                >
                  {active && <Lock className="w-3 h-3" />}
                  {app}
                  {!active && (
                    <button
                      onClick={() => removeApp(app)}
                      className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FocusMode;
