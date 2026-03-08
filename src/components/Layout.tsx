import { Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import AppSidebar from "./AppSidebar";
import ParticleBackground from "./ParticleBackground";
import { useTheme, type ThemeName } from "./ThemeProvider";

import wallpaperDark from "@/assets/wallpaper-dark.jpg";
import wallpaperLight from "@/assets/wallpaper-light.jpg";
import wallpaperPastel from "@/assets/wallpaper-pastel.jpg";
import wallpaperThunder from "@/assets/wallpaper-thunder.jpg";
import wallpaperRain from "@/assets/wallpaper-rain.jpg";
import wallpaperOcean from "@/assets/wallpaper-ocean.jpg";

const wallpapers: Record<ThemeName, string> = {
  dark: wallpaperDark,
  light: wallpaperLight,
  pastel: wallpaperPastel,
  thunder: wallpaperThunder,
  rain: wallpaperRain,
  ocean: wallpaperOcean,
};

const Layout = () => {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-background noise relative overflow-hidden">
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
            style={{ opacity: 0.15 }}
          />
          {/* Overlay to blend wallpaper with background color */}
          <div
            className="absolute inset-0 bg-background/70"
          />
        </motion.div>
      </AnimatePresence>

      <ParticleBackground />
      <AppSidebar />
      <main className="ml-[270px] p-10 min-h-screen relative z-10">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
