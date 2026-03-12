import { NavLink, useLocation } from "react-router-dom";
import { Timer, BookOpen, Brain, Shield, Sparkles, LayoutDashboard, Zap, Palette, Check, X, Monitor, Tablet, Smartphone, Trophy, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useTheme, themes } from "./ThemeProvider";
import { useSidebarMobile } from "./SidebarMobileProvider";
import { useLayoutMode, type LayoutMode } from "./LayoutModeProvider";

const layoutModes: Array<{ id: LayoutMode; label: string; icon: typeof Monitor }> = [
  { id: "laptop", label: "Laptop", icon: Monitor },
  { id: "tablet", label: "iPad", icon: Tablet },
  { id: "phone", label: "Phone", icon: Smartphone },
];

const LayoutToggle = () => {
  const { layoutMode, setLayoutMode } = useLayoutMode();
  return (
    <div className="px-2 flex gap-1.5">
      {layoutModes.map((m) => {
        const isActive = layoutMode === m.id;
        return (
          <motion.button
            key={m.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setLayoutMode(m.id)}
            className={`flex-1 flex flex-col items-center gap-1.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-300 ${
              isActive
                ? "bg-primary/10 text-primary border border-primary/20"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
            }`}
          >
            <m.icon className="w-4 h-4" />
            <span>{m.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
};

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/timer", icon: Timer, label: "Study Timer" },
  { to: "/notes", icon: BookOpen, label: "Notes" },
  { to: "/quiz", icon: Brain, label: "Quiz" },
  { to: "/focus", icon: Shield, label: "Focus Mode" },
  { to: "/study-plan", icon: Sparkles, label: "AI Planner" },
  { to: "/achievements", icon: Trophy, label: "Achievements" },
];

const AppSidebar = () => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [themesOpen, setThemesOpen] = useState(false);
  const { open, setOpen } = useSidebarMobile();

  const handleNavClick = () => {
    setOpen(false);
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-full w-[270px] z-50 flex flex-col bg-card/30 backdrop-blur-3xl border-r border-border/30 transition-transform duration-300 ease-in-out ${
        open ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      {/* Decorative gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      {/* Logo + Close button on mobile */}
      <div className="p-7 pb-2">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center glow-primary"
          >
            <Zap className="w-5 h-5 text-primary-foreground" />
          </motion.div>
          <div className="flex-1">
            <h1 className="text-xl font-display font-bold tracking-tight text-gradient">Nova Fortis</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">Study Companion</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors lg:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Separator */}
      <div className="mx-5 my-3 h-[1px] bg-gradient-to-r from-border/60 via-border/20 to-transparent" />

      {/* Nav */}
      <nav className="flex-1 px-4 space-y-1 mt-1 overflow-y-auto">
        <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 font-semibold px-3 mb-3">Navigation</p>
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink key={item.to} to={item.to} onClick={handleNavClick}>
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

        {/* Themes section */}
        <div className="mt-4 pt-3">
          <div className="mx-5 mb-3 h-[1px] bg-gradient-to-r from-border/60 via-border/20 to-transparent" />
          <button
            onClick={() => setThemesOpen(!themesOpen)}
            className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 w-full relative overflow-hidden group"
          >
            <div className="absolute inset-0 rounded-xl bg-transparent group-hover:bg-secondary/30 transition-colors duration-300" />
            <Palette className="w-[18px] h-[18px] relative z-10" />
            <span className="relative z-10 flex-1 text-left">Themes</span>
            <motion.div
              animate={{ rotate: themesOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="relative z-10"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </motion.div>
          </button>

          <AnimatePresence>
            {themesOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-2 py-2 space-y-1">
                  {themes.map((t) => {
                    const isActive = theme === t.id;
                    return (
                      <motion.button
                        key={t.id}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setTheme(t.id)}
                        className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                          isActive
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                        }`}
                      >
                        {/* Color preview dots */}
                        <div className="flex -space-x-1">
                          {t.colors.map((color, i) => (
                            <div
                              key={i}
                              className="w-3.5 h-3.5 rounded-full border border-border/50"
                              style={{ backgroundColor: color, zIndex: 3 - i }}
                            />
                          ))}
                        </div>
                        <span className="flex-1 text-left">{t.emoji} {t.label}</span>
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                          >
                            <Check className="w-3 h-3 text-primary-foreground" />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Layout mode section */}
        <div className="mt-2 pt-3">
          <div className="mx-5 mb-3 h-[1px] bg-gradient-to-r from-border/60 via-border/20 to-transparent" />
          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 font-semibold px-3 mb-3">Layout</p>
          <LayoutToggle />
        </div>
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
