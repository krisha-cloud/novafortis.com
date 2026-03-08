import { NavLink, useLocation } from "react-router-dom";
import { Timer, BookOpen, Brain, Shield, Sparkles, LayoutDashboard, Zap } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/timer", icon: Timer, label: "Study Timer" },
  { to: "/notes", icon: BookOpen, label: "Notes" },
  { to: "/quiz", icon: Brain, label: "Quiz" },
  { to: "/focus", icon: Shield, label: "Focus Mode" },
  { to: "/study-plan", icon: Sparkles, label: "AI Planner" },
];

const AppSidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-full w-[270px] z-50 flex flex-col bg-card/30 backdrop-blur-3xl border-r border-border/30">
      {/* Decorative gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      {/* Logo */}
      <div className="p-7 pb-2">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center glow-primary"
          >
            <Zap className="w-5 h-5 text-primary-foreground" />
          </motion.div>
          <div>
            <h1 className="text-xl font-display font-bold tracking-tight text-gradient">StudyNova</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">Study Companion</p>
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="mx-5 my-3 h-[1px] bg-gradient-to-r from-border/60 via-border/20 to-transparent" />

      {/* Nav */}
      <nav className="flex-1 px-4 space-y-1 mt-1">
        <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 font-semibold px-3 mb-3">Navigation</p>
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink key={item.to} to={item.to}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden ${
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-bg"
                    className="absolute inset-0 gradient-primary rounded-xl glow-primary"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                {!isActive && (
                  <div className="absolute inset-0 rounded-xl bg-transparent hover:bg-secondary/30 transition-colors duration-300" />
                )}
                <item.icon className="w-[18px] h-[18px] relative z-10" />
                <span className="relative z-10">{item.label}</span>

                {isActive && (
                  <motion.div
                    layoutId="sidebar-dot"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-foreground/80 relative z-10"
                  />
                )}
              </motion.div>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom card */}
      <div className="p-4 mx-4 mb-5 rounded-2xl border border-primary/10 bg-primary/5 backdrop-blur-xl">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-primary pulse-glow" />
          <span className="text-xs font-semibold text-primary">Pro Tip</span>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Use Focus Mode + Timer together for maximum productivity.
        </p>
      </div>
    </aside>
  );
};

export default AppSidebar;
