export interface LevelBadge {
  level: number;
  title: string;
  emoji: string;
  color: string; // tailwind-safe HSL token
  perks: Perk[];
}

export interface Perk {
  id: string;
  label: string;
  description: string;
  type: "cosmetic" | "functional";
  emoji: string;
}

export const LEVEL_BADGES: LevelBadge[] = [
  {
    level: 1,
    title: "Rookie",
    emoji: "🌱",
    color: "hsl(142,60%,45%)",
    perks: [
      { id: "basic-profile", label: "Student Profile", description: "Your journey begins — basic profile badge unlocked", type: "cosmetic", emoji: "🪪" },
    ],
  },
  {
    level: 2,
    title: "Apprentice",
    emoji: "📖",
    color: "hsl(200,70%,50%)",
    perks: [
      { id: "xp-boost-5", label: "+5% XP Boost", description: "Earn 5% more XP from all activities", type: "functional", emoji: "⚡" },
    ],
  },
  {
    level: 3,
    title: "Scholar",
    emoji: "🎓",
    color: "hsl(260,60%,55%)",
    perks: [
      { id: "quiz-hint", label: "Quiz Hints", description: "Unlock one free hint per quiz session", type: "functional", emoji: "💡" },
      { id: "scholar-badge", label: "Scholar Badge", description: "A distinguished badge displayed on your profile", type: "cosmetic", emoji: "🏅" },
    ],
  },
  {
    level: 4,
    title: "Strategist",
    emoji: "🧭",
    color: "hsl(38,85%,50%)",
    perks: [
      { id: "timer-extended", label: "Extended Timer", description: "Unlock 60-minute focus timer sessions", type: "functional", emoji: "⏰" },
    ],
  },
  {
    level: 5,
    title: "Warrior",
    emoji: "⚔️",
    color: "hsl(0,75%,55%)",
    perks: [
      { id: "xp-boost-10", label: "+10% XP Boost", description: "Earn 10% more XP from all activities", type: "functional", emoji: "🔥" },
      { id: "warrior-flair", label: "Warrior Flair", description: "Fiery border effect on your level badge", type: "cosmetic", emoji: "🛡️" },
    ],
  },
  {
    level: 6,
    title: "Sage",
    emoji: "🔮",
    color: "hsl(280,70%,60%)",
    perks: [
      { id: "streak-shield", label: "Streak Shield", description: "Protect your streak — one free miss per week", type: "functional", emoji: "🛡️" },
    ],
  },
  {
    level: 7,
    title: "Master",
    emoji: "👑",
    color: "hsl(45,95%,55%)",
    perks: [
      { id: "xp-boost-15", label: "+15% XP Boost", description: "Earn 15% more XP from all activities", type: "functional", emoji: "💎" },
      { id: "master-crown", label: "Golden Crown", description: "A golden crown icon next to your name", type: "cosmetic", emoji: "👑" },
    ],
  },
  {
    level: 8,
    title: "Grandmaster",
    emoji: "🌟",
    color: "hsl(330,80%,55%)",
    perks: [
      { id: "battle-bonus", label: "Battle Bonus", description: "Earn double XP from Study Battles", type: "functional", emoji: "⚔️" },
    ],
  },
  {
    level: 9,
    title: "Legend",
    emoji: "🏆",
    color: "hsl(15,90%,55%)",
    perks: [
      { id: "xp-boost-20", label: "+20% XP Boost", description: "Earn 20% more XP from all activities", type: "functional", emoji: "🚀" },
      { id: "legend-aura", label: "Legendary Aura", description: "Animated glow effect on your dashboard badge", type: "cosmetic", emoji: "✨" },
    ],
  },
  {
    level: 10,
    title: "Titan",
    emoji: "⚡",
    color: "hsl(185,90%,48%)",
    perks: [
      { id: "titan-title", label: "Titan Title", description: "The ultimate title — displayed everywhere", type: "cosmetic", emoji: "⚡" },
      { id: "xp-boost-25", label: "+25% XP Boost", description: "Maximum XP boost from all activities", type: "functional", emoji: "💥" },
      { id: "infinite-hints", label: "Unlimited Hints", description: "Unlimited quiz hints forever", type: "functional", emoji: "🧠" },
    ],
  },
];

export function getBadgeForLevel(level: number): LevelBadge {
  // Clamp to max defined level
  const clamped = Math.min(level, LEVEL_BADGES.length);
  return LEVEL_BADGES[clamped - 1];
}

export function getAllUnlockedPerks(level: number): Perk[] {
  const perks: Perk[] = [];
  for (const badge of LEVEL_BADGES) {
    if (badge.level <= level) {
      perks.push(...badge.perks);
    }
  }
  return perks;
}
