import { createContext, useContext, useState, ReactNode } from "react";

interface SidebarMobileContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SidebarMobileContext = createContext<SidebarMobileContextType>({
  open: false,
  setOpen: () => {},
});

export const useSidebarMobile = () => useContext(SidebarMobileContext);

export const SidebarMobileProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <SidebarMobileContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarMobileContext.Provider>
  );
};
