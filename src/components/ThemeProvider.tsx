import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type ThemeName = "dark" | "light" | "pastel" | "thunder" | "rain" | "ocean" | "sunset" | "forest" | "neon" | "midnight" | "superbike" | "supercar";

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const themes: Array<{
  id: ThemeName;
  label: string;
  emoji: string;
  colors: string[]; // preview swatch colors
}> = [
  { id: "dark", label: "Dark", emoji: "🌙", colors: ["#0d1117", "#0fa968", "#7c3aed"] },
  { id: "light", label: "Light", emoji: "☀️", colors: ["#fafafa", "#0f9960", "#7c3aed"] },
  { id: "pastel", label: "Pastel", emoji: "🌸", colors: ["#f7f0f5", "#db6b97", "#66cccc"] },
  { id: "thunder", label: "Thunder", emoji: "⚡", colors: ["#0c0a18", "#f5c518", "#aa00ff"] },
  { id: "rain", label: "Rain", emoji: "🌧️", colors: ["#0f1925", "#3da8e0", "#5b6abf"] },
  { id: "ocean", label: "Ocean", emoji: "🌊", colors: ["#0a1a1f", "#15b8a6", "#3b82f6"] },
  { id: "sunset", label: "Sunset", emoji: "🌅", colors: ["#1a0f0a", "#e8652b", "#d4a017"] },
  { id: "forest", label: "Forest", emoji: "🌿", colors: ["#0a1a0f", "#2d8a4e", "#8b6914"] },
  { id: "neon", label: "Neon", emoji: "💜", colors: ["#0a0a12", "#ff2d95", "#00e5ff"] },
  { id: "midnight", label: "Midnight", emoji: "🔮", colors: ["#0d0520", "#9333ea", "#d946ef"] },
];

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    const stored = localStorage.getItem("novafortis-theme");
    return (stored as ThemeName) || "dark";
  });

  const setTheme = (t: ThemeName) => {
    setThemeState(t);
    localStorage.setItem("novafortis-theme", t);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
