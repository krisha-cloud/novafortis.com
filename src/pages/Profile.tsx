import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Camera, Upload, User, Mail, Star, Trophy, Sparkles, Check } from "lucide-react";
import { useOnboarding } from "@/components/OnboardingProvider";
import { useXP } from "@/components/XPProvider";
import { getBadgeForLevel, getAllUnlockedPerks } from "@/lib/levels";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

import avatarScholar from "@/assets/avatar-scholar.png";
import avatarRobot from "@/assets/avatar-robot.png";
import avatarWizard from "@/assets/avatar-wizard.png";
import avatarAstro from "@/assets/avatar-astro.png";
import avatarFox from "@/assets/avatar-fox.png";
import avatarCat from "@/assets/avatar-cat.png";

const presetAvatars = [
  { id: "scholar", src: avatarScholar, label: "Scholar" },
  { id: "robot", src: avatarRobot, label: "Robot" },
  { id: "wizard", src: avatarWizard, label: "Wizard" },
  { id: "astro", src: avatarAstro, label: "Astronaut" },
  { id: "fox", src: avatarFox, label: "Fox" },
  { id: "cat", src: avatarCat, label: "Cat" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const Profile = () => {
  const { userInfo, updateProfile } = useOnboarding();
  const { level, totalXP, progressPercent, xpForCurrentLevel, xpToNextLevel } = useXP();
  const badge = getBadgeForLevel(level);
  const perks = getAllUnlockedPerks(level);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(userInfo?.name || "");

  const handleAvatarSelect = (src: string) => {
    updateProfile({ avatar: src });
    toast({ title: "Avatar updated!", description: "Your new look is saved." });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "File too large", description: "Please choose an image under 2MB.", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      updateProfile({ avatar: result });
      toast({ title: "Photo uploaded!", description: "Your profile picture is updated." });
    };
    reader.readAsDataURL(file);
  };

  const handleSaveName = () => {
    if (nameValue.trim()) {
      updateProfile({ name: nameValue.trim() });
      setEditingName(false);
      toast({ title: "Name updated!" });
    }
  };

  const currentAvatar = userInfo?.avatar;

  return (
    <div className="max-w-3xl">
      <motion.div variants={container} initial="hidden" animate="show">
        {/* Header */}
        <motion.div variants={item} className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium mb-4">
            <User className="w-3.5 h-3.5" />
            Profile
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold mb-2">
            Your <span className="text-gradient">Profile</span>
          </h1>
          <p className="text-muted-foreground">Customize your look and view your stats.</p>
        </motion.div>

        {/* Profile Card */}
        <motion.div variants={item} className="glass-card p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-primary/20 bg-secondary/50 flex items-center justify-center">
                {currentAvatar ? (
                  <img src={currentAvatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-muted-foreground/40" />
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:opacity-90 transition-opacity"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              {editingName ? (
                <div className="flex items-center gap-2 mb-1">
                  <input
                    value={nameValue}
                    onChange={(e) => setNameValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                    className="text-xl font-display font-bold bg-secondary/50 border border-border/50 rounded-lg px-3 py-1 outline-none focus:border-primary/40"
                    autoFocus
                  />
                  <button onClick={handleSaveName} className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors">
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <h2
                  className="text-xl font-display font-bold mb-1 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => { setNameValue(userInfo?.name || ""); setEditingName(true); }}
                >
                  {userInfo?.name || "Student"} ✏️
                </h2>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3 justify-center sm:justify-start">
                <Clock className="w-3.5 h-3.5" />
                {userInfo?.studyDuration || 25} min study sessions
              </div>

              {/* Badge & Level */}
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold"
                  style={{
                    background: `${badge.color}15`,
                    color: badge.color,
                    border: `1px solid ${badge.color}30`,
                  }}
                >
                  <span>{badge.emoji}</span>
                  <span>Lvl {level} — {badge.title}</span>
                </div>
                <span className="text-xs text-muted-foreground">{totalXP.toLocaleString()} XP</span>
              </div>
            </div>
          </div>

          {/* XP Progress */}
          <div className="mt-5 pt-5 border-t border-border/40">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>Level {level} Progress</span>
              <span>{xpForCurrentLevel} / {xpToNextLevel} XP</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        </motion.div>

        {/* Choose Avatar */}
        <motion.div variants={item} className="mb-8">
          <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground/60 font-semibold mb-4">
            🎨 Choose an Avatar
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {presetAvatars.map((avatar) => {
              const isSelected = currentAvatar === avatar.src;
              return (
                <motion.button
                  key={avatar.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAvatarSelect(avatar.src)}
                  className={`relative rounded-2xl overflow-hidden border-2 transition-all duration-300 aspect-square ${
                    isSelected
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border/30 hover:border-primary/30"
                  }`}
                >
                  <img src={avatar.src} alt={avatar.label} className="w-full h-full object-cover" />
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-1.5">
                    <span className="text-[10px] font-medium text-white">{avatar.label}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Upload option */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-border/50 text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
          >
            <Upload className="w-4 h-4" />
            Upload your own photo
          </button>
        </motion.div>

        {/* Active Perks */}
        {perks.length > 0 && (
          <motion.div variants={item}>
            <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground/60 font-semibold mb-4">
              ⚡ Active Perks
            </p>
            <div className="glass-card p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {perks.map((perk) => (
                  <div
                    key={perk.id}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl text-sm ${
                      perk.type === "functional" ? "bg-primary/5" : "bg-accent/5"
                    }`}
                  >
                    <span className="text-lg">{perk.emoji}</span>
                    <div>
                      <p className="font-medium text-sm">{perk.label}</p>
                      <p className="text-[11px] text-muted-foreground">{perk.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Profile;
