import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Flame, Star, Target, Clock, Zap, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PerformanceModalProps {
  open: boolean;
  onClose: () => void;
  type: "quiz" | "timer";
  // Quiz props
  score?: number;
  totalQuestions?: number;
  // Timer props
  sessionsCompleted?: number;
  totalMinutes?: number;
}

const motivationalQuotes = [
  { text: "Success is the sum of small efforts, repeated.", author: "Robert Collier" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Every expert was once a beginner.", author: "Helen Hayes" },
  { text: "The more you learn, the more you earn.", author: "Warren Buffett" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
];

const getRank = (percentage: number) => {
  if (percentage === 100) return { label: "🏆 Legendary", color: "text-[hsl(var(--warning))]" };
  if (percentage >= 90) return { label: "⭐ Outstanding", color: "text-[hsl(var(--warning))]" };
  if (percentage >= 80) return { label: "🔥 Excellent", color: "text-[hsl(var(--primary))]" };
  if (percentage >= 70) return { label: "💪 Great Job", color: "text-[hsl(var(--primary))]" };
  if (percentage >= 50) return { label: "👍 Good Effort", color: "text-[hsl(var(--accent))]" };
  return { label: "📚 Keep Learning", color: "text-muted-foreground" };
};

const getTimerRank = (sessions: number) => {
  if (sessions >= 8) return { label: "🏆 Unstoppable", color: "text-[hsl(var(--warning))]" };
  if (sessions >= 6) return { label: "🔥 On Fire", color: "text-[hsl(var(--warning))]" };
  if (sessions >= 4) return { label: "⭐ Focused", color: "text-[hsl(var(--primary))]" };
  if (sessions >= 2) return { label: "💪 Building Momentum", color: "text-[hsl(var(--primary))]" };
  return { label: "🌱 Great Start", color: "text-[hsl(var(--accent))]" };
};

const confettiColors = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--warning))",
  "hsl(var(--cyan))",
  "hsl(var(--pink))",
];

const ConfettiParticle = ({ index }: { index: number }) => {
  const randomX = Math.random() * 100;
  const randomDelay = Math.random() * 0.5;
  const randomDuration = 1.5 + Math.random() * 1.5;
  const randomRotation = Math.random() * 720 - 360;
  const color = confettiColors[index % confettiColors.length];

  return (
    <motion.div
      className="absolute w-2 h-2 rounded-sm"
      style={{ backgroundColor: color, left: `${randomX}%`, top: "-5%" }}
      initial={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
      animate={{
        y: "120vh",
        rotate: randomRotation,
        opacity: [1, 1, 0],
        scale: [1, 0.8, 0.5],
      }}
      transition={{ duration: randomDuration, delay: randomDelay, ease: "easeIn" }}
    />
  );
};

const PerformanceModal = ({
  open,
  onClose,
  type,
  score = 0,
  totalQuestions = 0,
  sessionsCompleted = 0,
  totalMinutes = 0,
}: PerformanceModalProps) => {
  const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  const quizPercentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const quizRank = getRank(quizPercentage);
  const timerRank = getTimerRank(sessionsCompleted);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-background/80 backdrop-blur-xl"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Confetti */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 30 }).map((_, i) => (
              <ConfettiParticle key={i} index={i} />
            ))}
          </div>

          {/* Modal */}
          <motion.div
            className="relative glass-card max-w-md w-full p-8 overflow-hidden"
            initial={{ scale: 0.6, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 30 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Top gradient line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-accent to-[hsl(var(--cyan))]" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon */}
            <motion.div
              className="flex justify-center mb-6"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <div className="w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center glow-primary">
                {type === "quiz" ? (
                  <Trophy className="w-10 h-10 text-primary-foreground" />
                ) : (
                  <Flame className="w-10 h-10 text-primary-foreground" />
                )}
              </div>
            </motion.div>

            {/* Title */}
            <motion.h2
              className="text-2xl font-display font-extrabold text-center mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {type === "quiz" ? "Quiz Complete!" : "Session Complete!"}
            </motion.h2>

            {/* Rank badge */}
            <motion.div
              className="flex justify-center mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <span className={`text-lg font-display font-bold ${type === "quiz" ? quizRank.color : timerRank.color}`}>
                {type === "quiz" ? quizRank.label : timerRank.label}
              </span>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-2 gap-3 mb-6"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {type === "quiz" ? (
                <>
                  <div className="glass-card p-4 text-center">
                    <Target className="w-5 h-5 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-display font-bold text-gradient">{quizPercentage}%</p>
                    <p className="text-xs text-muted-foreground mt-1">Accuracy</p>
                  </div>
                  <div className="glass-card p-4 text-center">
                    <Star className="w-5 h-5 mx-auto mb-2 text-[hsl(var(--warning))]" />
                    <p className="text-2xl font-display font-bold">{score}/{totalQuestions}</p>
                    <p className="text-xs text-muted-foreground mt-1">Correct</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="glass-card p-4 text-center">
                    <Zap className="w-5 h-5 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-display font-bold text-gradient">{sessionsCompleted}</p>
                    <p className="text-xs text-muted-foreground mt-1">Sessions</p>
                  </div>
                  <div className="glass-card p-4 text-center">
                    <Clock className="w-5 h-5 mx-auto mb-2 text-[hsl(var(--warning))]" />
                    <p className="text-2xl font-display font-bold">{totalMinutes}m</p>
                    <p className="text-xs text-muted-foreground mt-1">Focused</p>
                  </div>
                </>
              )}
            </motion.div>

            {/* Motivational quote */}
            <motion.div
              className="glass-card p-4 mb-6 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-sm italic text-foreground/80 mb-1">"{quote.text}"</p>
              <p className="text-xs text-muted-foreground">— {quote.author}</p>
            </motion.div>

            {/* Action button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                onClick={onClose}
                className="w-full gradient-primary text-primary-foreground rounded-xl h-12 font-semibold glow-primary"
              >
                Continue 🚀
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PerformanceModal;
