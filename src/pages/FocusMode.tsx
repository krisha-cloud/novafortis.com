import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ShieldCheck, Lock, Unlock, Plus, X } from "lucide-react";
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold mb-2">Focus Mode</h1>
        <p className="text-muted-foreground mb-8">Block distracting apps while you study.</p>

        <div className="glass-card p-8 text-center mb-6">
          <motion.div
            animate={{ scale: active ? [1, 1.05, 1] : 1 }}
            transition={{ repeat: active ? Infinity : 0, duration: 2 }}
          >
            {active ? (
              <ShieldCheck className="w-20 h-20 text-primary mx-auto mb-4" />
            ) : (
              <Shield className="w-20 h-20 text-muted-foreground mx-auto mb-4" />
            )}
          </motion.div>

          <h2 className="text-xl font-display font-semibold mb-2">
            {active ? "Focus Mode Active" : "Focus Mode Off"}
          </h2>

          {active && (
            <p className="text-3xl font-display font-bold tabular-nums text-gradient mb-4">
              {hrs}:{mins}:{secs}
            </p>
          )}

          <p className="text-sm text-muted-foreground mb-6">
            {active ? `${blockedApps.length} apps blocked` : "Start focus mode to block distractions"}
          </p>

          <Button onClick={toggle} size="lg" className={active ? "bg-destructive hover:bg-destructive/80 text-destructive-foreground" : "gradient-primary text-primary-foreground glow-primary"}>
            {active ? <><Unlock className="w-5 h-5 mr-2" /> End Focus</> : <><Lock className="w-5 h-5 mr-2" /> Start Focus</>}
          </Button>
        </div>

        <div className="glass-card p-6">
          <h3 className="font-display font-semibold mb-4">Blocked Apps</h3>

          {!active && (
            <div className="flex gap-2 mb-4">
              <Input placeholder="Add app name..." value={newApp} onChange={(e) => setNewApp(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addApp()} className="bg-secondary" />
              <Button onClick={addApp} variant="outline"><Plus className="w-4 h-4" /></Button>
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
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium ${
                    active ? "bg-destructive/10 text-destructive" : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {active && <Lock className="w-3 h-3" />}
                  {app}
                  {!active && (
                    <button onClick={() => removeApp(app)} className="ml-1 text-muted-foreground hover:text-foreground">
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
