import { NavLink, useLocation } from "react-router-dom";
import { Timer, BookOpen, Brain, Shield, Sparkles, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/timer", icon: Timer, label: "Study Timer" },
  { to: "/notes", icon: BookOpen, label: "Notes" },
  { to: "/quiz", icon: Brain, label: "Quiz" },
  { to: "/focus", icon: Shield, label: "Focus Mode" },
  { to: "/study-plan", icon: Sparkles, label: "AI Study Plan" },
];

const AppSidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-card/80 backdrop-blur-xl border-r border-border/50 z-50 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-display font-bold text-gradient">StudyNova</h1>
        <p className="text-xs text-muted-foreground mt-1">Your study companion</p>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink key={item.to} to={item.to}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors relative ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full gradient-primary"
                  />
                )}
                <item.icon className="w-5 h-5" />
                {item.label}
              </motion.div>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 m-3 glass-card">
        <p className="text-xs text-muted-foreground">Stay focused. Stay sharp.</p>
      </div>
    </aside>
  );
};

export default AppSidebar;
