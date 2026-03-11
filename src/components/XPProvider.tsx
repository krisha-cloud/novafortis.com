import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

interface XPEvent {
  id: string;
  source: "quiz" | "timer" | "battle" | "streak";
  amount: number;
  label: string;
  timestamp: number;
}

interface XPState {
  totalXP: number;
  level: number;
  xpForCurrentLevel: number;
  xpToNextLevel: number;
  progressPercent: number;
  history: XPEvent[];
}

interface XPContextType extends XPState {
  awardXP: (source: XPEvent["source"], amount: number, label: string) => void;
}

const XP_PER_LEVEL_BASE = 100;
const XP_SCALE = 1.4;

function getLevelFromXP(totalXP: number) {
  let level = 1;
  let xpNeeded = XP_PER_LEVEL_BASE;
  let remaining = totalXP;

  while (remaining >= xpNeeded) {
    remaining -= xpNeeded;
    level++;
    xpNeeded = Math.floor(XP_PER_LEVEL_BASE * Math.pow(XP_SCALE, level - 1));
  }

  return {
    level,
    xpForCurrentLevel: remaining,
    xpToNextLevel: xpNeeded,
    progressPercent: Math.round((remaining / xpNeeded) * 100),
  };
}

const STORAGE_KEY = "nova-fortis-xp";

function loadXP(): { totalXP: number; history: XPEvent[] } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { totalXP: 0, history: [] };
}

const XPContext = createContext<XPContextType | null>(null);

export const useXP = () => {
  const ctx = useContext(XPContext);
  if (!ctx) throw new Error("useXP must be used within XPProvider");
  return ctx;
};

export const XPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState(loadXP);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const awardXP = useCallback((source: XPEvent["source"], amount: number, label: string) => {
    const event: XPEvent = {
      id: crypto.randomUUID(),
      source,
      amount,
      label,
      timestamp: Date.now(),
    };
    setData((prev) => ({
      totalXP: prev.totalXP + amount,
      history: [event, ...prev.history].slice(0, 50),
    }));
  }, []);

  const levelInfo = getLevelFromXP(data.totalXP);

  return (
    <XPContext.Provider
      value={{
        totalXP: data.totalXP,
        ...levelInfo,
        history: data.history,
        awardXP,
      }}
    >
      {children}
    </XPContext.Provider>
  );
};
