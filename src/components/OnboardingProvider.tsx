import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface UserInfo {
  name: string;
  studyDuration: number; // in minutes
  avatar?: string; // URL or base64 data URI
}

interface OnboardingContextType {
  userInfo: UserInfo | null;
  isOnboarded: boolean;
  completeOnboarding: (info: UserInfo) => void;
  updateProfile: (updates: Partial<UserInfo>) => void;
  logout: () => void;
}

const OnboardingContext = createContext<OnboardingContextType>({
  userInfo: null,
  isOnboarded: false,
  completeOnboarding: () => {},
  updateProfile: () => {},
  logout: () => {},
});

export const useOnboarding = () => useContext(OnboardingContext);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(() => {
    const stored = localStorage.getItem("novafortis-user");
    return stored ? JSON.parse(stored) : null;
  });

  const isOnboarded = !!userInfo;

  const completeOnboarding = (info: UserInfo) => {
    setUserInfo(info);
    localStorage.setItem("novafortis-user", JSON.stringify(info));
  };

  const updateProfile = useCallback((updates: Partial<UserInfo>) => {
    setUserInfo((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      localStorage.setItem("novafortis-user", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const logout = useCallback(() => {
    setUserInfo(null);
    localStorage.removeItem("novafortis-user");
  }, []);

  return (
    <OnboardingContext.Provider value={{ userInfo, isOnboarded, completeOnboarding, updateProfile, logout }}>
      {children}
    </OnboardingContext.Provider>
  );
};
