import { motion } from "framer-motion";
import { Lock, Check, Sparkles, Zap } from "lucide-react";
import { useXP } from "@/components/XPProvider";
import { LEVEL_BADGES, getAllUnlockedPerks } from "@/lib/levels";
import { Progress } from "@/components/ui/progress";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const Achievements = () => {
  const { level, totalXP, progressPercent, xpForCurrentLevel, xpToNextLevel } = useXP();
  const unlockedPerks = getAllUnlockedPerks(level);
  const functionalPerks = unlockedPerks.filter((p) => p.type === "functional");
  const cosmeticPerks = unlockedPerks.filter((p) => p.type === "cosmetic");

  return (
    <div className="max-w-4xl">
      <motion.div variants={container} initial="hidden" animate="show">
        {/* Header */}
        <motion.div variants={item} className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Achievements
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold mb-2">
            Badges & <span className="text-gradient">Perks</span>
          </h1>
          <p className="text-muted-foreground">
            Level up to unlock new badges, titles, and powerful perks.
          </p>
        </motion.div>

        {/* Active Perks Summary */}
        {unlockedPerks.length > 0 && (
          <motion.div variants={item} className="mb-8">
            <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground/60 font-semibold mb-3">
              🎯 Active Perks ({unlockedPerks.length})
            </p>
            <div className="glass-card p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {functionalPerks.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-primary mb-2 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" /> Functional
                    </p>
                    <div className="space-y-2">
                      {functionalPerks.map((p) => (
                        <div key={p.id} className="flex items-center gap-2 text-sm">
                          <span>{p.emoji}</span>
                          <span className="font-medium">{p.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {cosmeticPerks.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-accent mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Cosmetic
                    </p>
                    <div className="space-y-2">
                      {cosmeticPerks.map((p) => (
                        <div key={p.id} className="flex items-center gap-2 text-sm">
                          <span>{p.emoji}</span>
                          <span className="font-medium">{p.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* All Levels */}
        <motion.div variants={item}>
          <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground/60 font-semibold mb-4">
            🏅 All Badges
          </p>
        </motion.div>

        <div className="space-y-3">
          {LEVEL_BADGES.map((badge) => {
            const unlocked = level >= badge.level;
            const isCurrent = level === badge.level;

            return (
              <motion.div key={badge.level} variants={item}>
                <div
                  className={`glass-card p-5 transition-all duration-300 ${
                    isCurrent
                      ? "border-primary/30 ring-1 ring-primary/10"
                      : unlocked
                      ? "border-border/40"
                      : "opacity-60"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Badge Icon */}
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-2xl"
                      style={{
                        background: unlocked
                          ? `linear-gradient(135deg, ${badge.color}22, ${badge.color}08)`
                          : undefined,
                        border: unlocked ? `1px solid ${badge.color}33` : undefined,
                      }}
                    >
                      {unlocked ? (
                        badge.emoji
                      ) : (
                        <Lock className="w-5 h-5 text-muted-foreground/40" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-display font-bold text-base">
                          Lvl {badge.level} — {badge.title}
                        </h3>
                        {isCurrent && (
                          <span className="text-[10px] uppercase tracking-wider font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            Current
                          </span>
                        )}
                        {unlocked && !isCurrent && (
                          <Check className="w-4 h-4 text-primary" />
                        )}
                      </div>

                      {/* Current level progress */}
                      {isCurrent && (
                        <div className="mb-3">
                          <Progress value={progressPercent} className="h-2 mb-1" />
                          <p className="text-[11px] text-muted-foreground">
                            {xpForCurrentLevel} / {xpToNextLevel} XP to next level
                          </p>
                        </div>
                      )}

                      {/* Perks */}
                      <div className="flex flex-wrap gap-2">
                        {badge.perks.map((perk) => (
                          <div
                            key={perk.id}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                              unlocked
                                ? perk.type === "functional"
                                  ? "bg-primary/10 text-primary"
                                  : "bg-accent/10 text-accent"
                                : "bg-secondary/50 text-muted-foreground/50"
                            }`}
                            title={perk.description}
                          >
                            <span>{perk.emoji}</span>
                            <span>{perk.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default Achievements;
