import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

interface UserInfo {
  name: string;
  email: string;
  avatar?: string; // URL or base64 data URI
}

interface OnboardingContextType {
  userInfo: UserInfo | null;
  isOnboarded: boolean;
  completeOnboarding: (info: UserInfo) => void;
  updateProfile: (updates: Partial<UserInfo>) => void;
}

const OnboardingContext = createContext<OnboardingContextType>({
  userInfo: null,
  isOnboarded: false,
  completeOnboarding: () => {},
  updateProfile: () => {},
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

  return (
    <OnboardingContext.Provider value={{ userInfo, isOnboarded, completeOnboarding, updateProfile }}>
      {children}
    </OnboardingContext.Provider>
  );
};
