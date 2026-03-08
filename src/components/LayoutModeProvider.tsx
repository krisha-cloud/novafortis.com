import { createContext, useContext, useState, ReactNode } from "react";

export type LayoutMode = "laptop" | "tablet" | "phone";

interface LayoutModeContextType {
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
}

const LayoutModeContext = createContext<LayoutModeContextType>({
  layoutMode: "laptop",
  setLayoutMode: () => {},
});

export const useLayoutMode = () => useContext(LayoutModeContext);

export const LayoutModeProvider = ({ children }: { children: ReactNode }) => {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("laptop");

  return (
    <LayoutModeContext.Provider value={{ layoutMode, setLayoutMode }}>
      {children}
    </LayoutModeContext.Provider>
  );
};
