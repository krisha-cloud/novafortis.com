import { motion } from "framer-motion";
import { Timer, BookOpen, Brain, Shield, Sparkles, ArrowRight, TrendingUp, Flame, Clock, Trophy, Medal, Crown, Swords, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useOnboarding } from "@/components/OnboardingProvider";

const features = [
  { to: "/timer", icon: Timer, title: "Study Timer", desc: "Pomodoro focus sessions with visual tracking", gradient: "from-primary/20 to-primary/5", iconColor: "text-primary", borderHover: "hover:border-primary/30" },
  { to: "/notes", icon: BookOpen, title: "Notes", desc: "Write, organize & search your study notes", gradient: "from-accent/20 to-accent/5", iconColor: "text-accent", borderHover: "hover:border-accent/30" },
  { to: "/quiz", icon: Brain, title: "Quiz", desc: "Create quizzes to test your knowledge", gradient: "from-[hsl(38,92%,50%)]/20 to-[hsl(38,92%,50%)]/5", iconColor: "text-[hsl(38,92%,50%)]", borderHover: "hover:border-[hsl(38,92%,50%)]/30" },
  { to: "/focus", icon: Shield, title: "Focus Mode", desc: "Block distractions & stay on track", gradient: "from-[hsl(330,85%,60%)]/20 to-[hsl(330,85%,60%)]/5", iconColor: "text-[hsl(330,85%,60%)]", borderHover: "hover:border-[hsl(330,85%,60%)]/30" },
  { to: "/study-plan", icon: Sparkles, title: "AI Planner", desc: "AI-generated personalized study plans", gradient: "from-[hsl(185,90%,48%)]/20 to-[hsl(185,90%,48%)]/5", iconColor: "text-[hsl(185,90%,48%)]", borderHover: "hover:border-[hsl(185,90%,48%)]/30" },
];

const stats = [
  { icon: Flame, label: "Study Streak", value: "0 days", color: "text-[hsl(38,92%,50%)]" },
  { icon: Clock, label: "Hours Today", value: "0h 0m", color: "text-primary" },
  { icon: TrendingUp, label: "Quizzes Done", value: "0", color: "text-accent" },
];

const leaderboard = [
  { rank: 1, name: "Alex M.", streak: 42, icon: Crown },
  { rank: 2, name: "Priya S.", streak: 38, icon: Medal },
  { rank: 3, name: "Jordan K.", streak: 31, icon: Medal },
  { rank: 4, name: "Sam W.", streak: 27, icon: Trophy },
  { rank: 5, name: "Riley T.", streak: 22, icon: Trophy },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const Dashboard = () => {
  const { userInfo } = useOnboarding();
  const firstName = userInfo?.name?.split(" ")[0] || "Student";

  return (
    <div className="max-w-6xl">
      <motion.div variants={container} initial="hidden" animate="show">
        {/* Hero */}
        <motion.div variants={item} className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium mb-5">
            <div className="w-1.5 h-1.5 rounded-full bg-primary pulse-glow" />
            Ready to study
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold mb-3 leading-tight">
            Hey {firstName}! 👋 <br />
            <span className="text-gradient">Let's Study</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-lg">
            Your all-in-one study companion. Pick a tool below to get started.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-10">
          {stats.map((s) => (
            <div key={s.label} className="glass-card p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-secondary/80 flex items-center justify-center">
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-display font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Streak Leaderboard */}
        <motion.div variants={item} className="mb-10">
          <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground/60 font-semibold mb-4">🔥 Streak Leaderboard</p>
          <div className="glass-card p-5 space-y-3">
            {leaderboard.map((entry) => {
              const rankColors = entry.rank === 1
                ? "text-[hsl(38,92%,50%)] bg-[hsl(38,92%,50%)]/10"
                : entry.rank <= 3
                ? "text-muted-foreground bg-secondary/80"
                : "text-muted-foreground bg-secondary/50";
              return (
                <div
                  key={entry.rank}
                  className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${entry.rank === 1 ? "bg-[hsl(38,92%,50%)]/5 border border-[hsl(38,92%,50%)]/10" : "hover:bg-secondary/30"}`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold ${rankColors}`}>
                    {entry.rank}
                  </div>
                  <entry.icon className={`w-4 h-4 ${entry.rank === 1 ? "text-[hsl(38,92%,50%)]" : "text-muted-foreground/40"}`} />
                  <span className="font-medium flex-1">{entry.name}</span>
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-[hsl(38,92%,50%)]" />
                    <span className="text-sm font-semibold">{entry.streak} days</span>
                  </div>
                </div>
              );
            })}
            <div className="flex items-center gap-4 p-3 rounded-xl border border-dashed border-border/40 mt-2">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold text-primary bg-primary/10">
                —
              </div>
              <Trophy className="w-4 h-4 text-primary/40" />
              <span className="font-medium flex-1 text-muted-foreground">You</span>
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[hsl(38,92%,50%)]" />
                <span className="text-sm font-semibold">0 days</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Study Battle */}
        <motion.div variants={item} className="mb-10">
          <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground/60 font-semibold mb-4">⚔️ Study Battle</p>
          <div className="glass-card p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-destructive/20 to-destructive/5 flex items-center justify-center shrink-0">
                <Swords className="w-8 h-8 text-destructive" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-display font-bold text-xl mb-1">Challenge a Friend</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Go head-to-head in a timed quiz battle. Answer faster, score higher, claim victory!
                </p>
                <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/60 px-3 py-1.5 rounded-full">
                    <Users className="w-3.5 h-3.5" />
                    <span>1v1 Mode</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/60 px-3 py-1.5 rounded-full">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Speed Bonus</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/60 px-3 py-1.5 rounded-full">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Earn XP</span>
                  </div>
                </div>
              </div>
              <button className="shrink-0 px-6 py-3 rounded-xl bg-gradient-to-r from-destructive to-destructive/80 text-destructive-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
                Start Battle
              </button>
            </div>
          </div>
        </motion.div>
        <motion.div variants={item}>
          <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground/60 font-semibold mb-4">Tools</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <motion.div key={f.to} variants={item}>
              <Link
                to={f.to}
                className={`block glass-card-hover p-6 group ${f.borderHover}`}
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500`}>
                  <f.icon className={`w-6 h-6 ${f.iconColor}`} />
                </div>
                <h3 className="font-display font-semibold text-lg mb-1.5">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{f.desc}</p>
                <div className="flex items-center text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors duration-300">
                  Open
                  <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
