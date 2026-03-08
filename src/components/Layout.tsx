import { Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import AppSidebar from "./AppSidebar";
import ParticleBackground from "./ParticleBackground";
import { useTheme, type ThemeName } from "./ThemeProvider";
import { useSidebarMobile } from "./SidebarMobileProvider";
import { useLayoutMode } from "./LayoutModeProvider";
import { Menu } from "lucide-react";

import wallpaperDark from "@/assets/wallpaper-dark.jpg";
import wallpaperLight from "@/assets/wallpaper-light.jpg";
import wallpaperPastel from "@/assets/wallpaper-pastel.jpg";
import wallpaperThunder from "@/assets/wallpaper-thunder.jpg";
import wallpaperRain from "@/assets/wallpaper-rain.jpg";
import wallpaperOcean from "@/assets/wallpaper-ocean.jpg";
import wallpaperSunset from "@/assets/wallpaper-sunset.jpg";
import wallpaperForest from "@/assets/wallpaper-forest.jpg";
import wallpaperNeon from "@/assets/wallpaper-neon.jpg";
import wallpaperMidnight from "@/assets/wallpaper-midnight.jpg";
import wallpaperSuperbike from "@/assets/wallpaper-superbike.jpg";
import wallpaperSupercar from "@/assets/wallpaper-supercar.jpg";

const wallpapers: Record<ThemeName, string> = {
  dark: wallpaperDark,
  light: wallpaperLight,
  pastel: wallpaperPastel,
  thunder: wallpaperThunder,
  rain: wallpaperRain,
  ocean: wallpaperOcean,
  sunset: wallpaperSunset,
  forest: wallpaperForest,
  neon: wallpaperNeon,
  midnight: wallpaperMidnight,
  superbike: wallpaperSuperbike,
  supercar: wallpaperSupercar,
};

const Layout = () => {
  const { theme } = useTheme();
  const { open, setOpen } = useSidebarMobile();
  const { layoutMode } = useLayoutMode();

  const layoutClasses = {
    laptop: "",
    tablet: "max-w-[834px] mx-auto",
    phone: "max-w-[390px] mx-auto",
  };
  return (
    <div className="min-h-screen noise relative overflow-hidden">
      {/* Theme wallpaper */}
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-0"
        >
          <img
            src={wallpapers[theme]}
            alt=""
            className="w-full h-full object-cover"
            style={{ opacity: 0.95 }}
          />
          <div className="absolute inset-0 bg-background/30" />
        </motion.div>
      </AnimatePresence>

      <ParticleBackground />

      {/* Mobile overlay backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      <AppSidebar />

      {/* Mobile header */}
      <div className="fixed top-0 left-0 right-0 h-14 z-30 flex items-center px-4 bg-background/60 backdrop-blur-xl border-b border-border/20 lg:hidden">
        <button
          onClick={() => setOpen(true)}
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary/50 text-foreground"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="ml-3 text-lg font-display font-bold text-gradient">Nova Fortis</h1>
      </div>

      <main className="lg:ml-[270px] p-4 pt-18 lg:p-10 lg:pt-10 min-h-screen relative z-10">
        <div className={`transition-all duration-500 ${layoutClasses[layoutMode]}`}>
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <div className="fixed bottom-4 right-4 text-xs text-muted-foreground/60 pointer-events-none">
        <p>developed by nova fortis - kp</p>
      </div>
    </div>
  );
};

export default Layout;
