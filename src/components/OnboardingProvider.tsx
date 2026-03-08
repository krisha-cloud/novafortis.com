import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UserInfo {
  name: string;
  email: string;
}

interface OnboardingContextType {
  userInfo: UserInfo | null;
  isOnboarded: boolean;
  completeOnboarding: (info: UserInfo) => void;
}

const OnboardingContext = createContext<OnboardingContextType>({
  userInfo: null,
  isOnboarded: false,
  completeOnboarding: () => {},
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

  return (
    <OnboardingContext.Provider value={{ userInfo, isOnboarded, completeOnboarding }}>
      {children}
    </OnboardingContext.Provider>
  );
};
