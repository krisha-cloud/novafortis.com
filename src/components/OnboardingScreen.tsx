import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ArrowRight, User, Clock, Sparkles, GraduationCap, Target, BookOpen, Megaphone } from "lucide-react";
import { useOnboarding } from "./OnboardingProvider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const DURATION_OPTIONS = [
  { label: "25 min", value: 25, desc: "Classic Pomodoro" },
  { label: "45 min", value: 45, desc: "Deep focus" },
  { label: "60 min", value: 60, desc: "Long session" },
  { label: "90 min", value: 90, desc: "Ultra marathon" },
];

const HEARD_FROM_OPTIONS = [
  "Friend / Word of mouth",
  "Social media",
  "Google search",
  "YouTube",
  "School / College",
  "Just stumbled upon it",
];

const USER_TYPE_OPTIONS = [
  { label: "🎒 School Student", value: "school", desc: "Middle or high school" },
  { label: "🎓 College Student", value: "college", desc: "University / degree" },
  { label: "💼 Working Professional", value: "professional", desc: "Learning on the side" },
  { label: "🧘 Just here to focus", value: "focus", desc: "Productivity seeker" },
];

const GOAL_OPTIONS = [
  "Ace my exams",
  "Build better study habits",
  "Stay focused & avoid distractions",
  "Learn something new every day",
  "Manage my time better",
  "Prepare for competitive exams",
];

const SUBJECT_OPTIONS = [
  "Mathematics", "Physics", "Chemistry", "Biology",
  "Computer Science", "English / Literature", "History",
  "Economics", "Psychology", "Business / Finance",
  "Art & Design", "Foreign Languages", "Music",
  "Engineering", "Medicine", "Law",
];

const TOTAL_STEPS = 7; // 0=welcome, 1=name, 2=heardFrom, 3=userType, 4=goals, 5=subjects, 6=duration

const StepIndicator = ({ current, total }: { current: number; total: number }) => (
  <div className="flex justify-center gap-1.5 mt-8">
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        className={`h-1.5 rounded-full transition-all duration-300 ${
          i <= current ? "w-8 bg-primary" : "w-4 bg-secondary/50"
        }`}
      />
    ))}
  </div>
);

const OptionButton = ({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    className={`p-3 rounded-xl border text-left text-sm font-medium transition-all ${
      selected
        ? "border-primary bg-primary/10 shadow-md"
        : "border-border/30 bg-secondary/50 hover:border-border/60"
    }`}
  >
    {children}
  </motion.button>
);

const OnboardingScreen = () => {
  const { completeOnboarding } = useOnboarding();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [heardFrom, setHeardFrom] = useState("");
  const [userType, setUserType] = useState("");
  const [goals, setGoals] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [exiting, setExiting] = useState(false);

  const toggleGoal = (g: string) =>
    setGoals((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));
  const toggleSubject = (s: string) =>
    setSubjects((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const handleFinish = () => {
    if (!selectedDuration) return;
    setExiting(true);
    setTimeout(() => {
      completeOnboarding({
        name: name.trim(),
        studyDuration: selectedDuration,
        heardFrom,
        userType,
        goals,
        subjects,
      });
    }, 800);
  };

  const nextStep = () => setStep((s) => s + 1);

  // survey step index for indicator (excluding welcome step)
  const surveyStepIndex = step > 0 ? step - 1 : 0;

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-background" />
          <motion.div
            animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-20 blur-[120px]"
            style={{ background: "hsl(var(--primary))" }}
          />
          <motion.div
            animate={{ x: [0, -30, 20, 0], y: [0, 30, -20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-15 blur-[100px]"
            style={{ background: "hsl(var(--accent))" }}
          />

          <div className="relative z-10 w-full max-w-md px-6 max-h-[90vh] overflow-y-auto">
            <AnimatePresence mode="wait">

              {/* Step 0: Welcome */}
              {step === 0 && (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                    className="w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center mx-auto mb-8 glow-primary"
                  >
                    <Zap className="w-10 h-10 text-primary-foreground" />
                  </motion.div>
                  <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="text-4xl font-display font-extrabold mb-3">
                    Welcome to <span className="text-gradient">Nova Fortis</span>
                  </motion.h1>
                  <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
                    className="text-muted-foreground text-lg mb-10">
                    Your all-in-one study companion
                  </motion.p>
                  <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                    className="text-muted-foreground/65 text-xs mb-10">
                    developed and published by nova fortis - kp
                  </motion.p>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                    <div className="flex justify-center gap-6 mb-12">
                      {[
                        { icon: "⏱", label: "Timer" },
                        { icon: "📝", label: "Notes" },
                        { icon: "🧠", label: "Quiz" },
                        { icon: "🛡", label: "Focus" },
                      ].map((f, i) => (
                        <motion.div key={f.label} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.8 + i * 0.1, type: "spring" }} className="flex flex-col items-center gap-2">
                          <div className="w-12 h-12 rounded-2xl bg-secondary/50 border border-border/30 flex items-center justify-center text-lg">
                            {f.icon}
                          </div>
                          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{f.label}</span>
                        </motion.div>
                      ))}
                    </div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button onClick={() => setStep(1)}
                        className="gradient-primary text-primary-foreground rounded-2xl h-14 px-10 font-semibold text-base glow-primary">
                        Get Started <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}

              {/* Step 1: Name */}
              {step === 1 && (
                <motion.div key="name" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.4 }} className="text-center">
                  <StepIcon icon={User} />
                  <h2 className="text-2xl font-display font-bold mb-2">What's your name?</h2>
                  <p className="text-muted-foreground text-sm mb-8">Let's personalize your experience</p>
                  <Input placeholder="Enter your name..." value={name} onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && name.trim() && nextStep()} autoFocus
                    className="bg-secondary/50 border-border/30 rounded-xl h-14 text-center text-lg font-medium mb-6 backdrop-blur-xl" />
                  <NavButton onClick={() => name.trim() && nextStep()} disabled={!name.trim()} label="Continue" />
                  <StepIndicator current={surveyStepIndex} total={TOTAL_STEPS - 1} />
                </motion.div>
              )}

              {/* Step 2: Where did you hear about us */}
              {step === 2 && (
                <motion.div key="heard" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.4 }} className="text-center">
                  <StepIcon icon={Megaphone} />
                  <h2 className="text-2xl font-display font-bold mb-2">How'd you find us?</h2>
                  <p className="text-muted-foreground text-sm mb-6">We're curious! 👀</p>
                  <div className="grid grid-cols-2 gap-2.5 mb-6">
                    {HEARD_FROM_OPTIONS.map((opt) => (
                      <OptionButton key={opt} selected={heardFrom === opt} onClick={() => setHeardFrom(opt)}>
                        {opt}
                      </OptionButton>
                    ))}
                  </div>
                  <NavButton onClick={() => heardFrom && nextStep()} disabled={!heardFrom} label="Continue" />
                  <StepIndicator current={surveyStepIndex} total={TOTAL_STEPS - 1} />
                </motion.div>
              )}

              {/* Step 3: User type */}
              {step === 3 && (
                <motion.div key="usertype" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.4 }} className="text-center">
                  <StepIcon icon={GraduationCap} />
                  <h2 className="text-2xl font-display font-bold mb-2">What describes you best?</h2>
                  <p className="text-muted-foreground text-sm mb-6">So we can tailor things for you</p>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {USER_TYPE_OPTIONS.map((opt) => (
                      <motion.button key={opt.value} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        onClick={() => setUserType(opt.value)}
                        className={`p-4 rounded-2xl border transition-all text-left ${
                          userType === opt.value
                            ? "border-primary bg-primary/10 shadow-md"
                            : "border-border/30 bg-secondary/50 hover:border-border/60"
                        }`}>
                        <div className="text-base font-bold">{opt.label}</div>
                        <div className="text-xs text-muted-foreground">{opt.desc}</div>
                      </motion.button>
                    ))}
                  </div>
                  <NavButton onClick={() => userType && nextStep()} disabled={!userType} label="Continue" />
                  <StepIndicator current={surveyStepIndex} total={TOTAL_STEPS - 1} />
                </motion.div>
              )}

              {/* Step 4: Goals */}
              {step === 4 && (
                <motion.div key="goals" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.4 }} className="text-center">
                  <StepIcon icon={Target} />
                  <h2 className="text-2xl font-display font-bold mb-2">What are your goals?</h2>
                  <p className="text-muted-foreground text-sm mb-6">Pick all that apply ✨</p>
                  <div className="grid grid-cols-1 gap-2.5 mb-6">
                    {GOAL_OPTIONS.map((g) => (
                      <OptionButton key={g} selected={goals.includes(g)} onClick={() => toggleGoal(g)}>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                            goals.includes(g) ? "border-primary bg-primary" : "border-border"
                          }`}>
                            {goals.includes(g) && <span className="text-[10px] text-primary-foreground">✓</span>}
                          </div>
                          {g}
                        </div>
                      </OptionButton>
                    ))}
                  </div>
                  <NavButton onClick={() => goals.length > 0 && nextStep()} disabled={goals.length === 0} label="Continue" />
                  <StepIndicator current={surveyStepIndex} total={TOTAL_STEPS - 1} />
                </motion.div>
              )}

              {/* Step 5: Subjects */}
              {step === 5 && (
                <motion.div key="subjects" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.4 }} className="text-center">
                  <StepIcon icon={BookOpen} />
                  <h2 className="text-2xl font-display font-bold mb-2">What do you study?</h2>
                  <p className="text-muted-foreground text-sm mb-6">Select your subjects 📚</p>
                  <div className="grid grid-cols-2 gap-2 mb-6 max-h-[40vh] overflow-y-auto pr-1">
                    {SUBJECT_OPTIONS.map((s) => (
                      <OptionButton key={s} selected={subjects.includes(s)} onClick={() => toggleSubject(s)}>
                        <div className="flex items-center gap-2">
                          <div className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center transition-all ${
                            subjects.includes(s) ? "border-primary bg-primary" : "border-border"
                          }`}>
                            {subjects.includes(s) && <span className="text-[8px] text-primary-foreground">✓</span>}
                          </div>
                          <span className="text-xs">{s}</span>
                        </div>
                      </OptionButton>
                    ))}
                  </div>
                  <NavButton onClick={() => subjects.length > 0 && nextStep()} disabled={subjects.length === 0} label="Almost done!" />
                  <StepIndicator current={surveyStepIndex} total={TOTAL_STEPS - 1} />
                </motion.div>
              )}

              {/* Step 6: Study Duration */}
              {step === 6 && (
                <motion.div key="duration" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.4 }} className="text-center">
                  <StepIcon icon={Clock} />
                  <h2 className="text-2xl font-display font-bold mb-2">
                    Last one, {name}! <Sparkles className="w-5 h-5 inline text-primary" />
                  </h2>
                  <p className="text-muted-foreground text-sm mb-6">How long should your study sessions be?</p>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {DURATION_OPTIONS.map((opt) => (
                      <motion.button key={opt.value} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        onClick={() => setSelectedDuration(opt.value)}
                        className={`p-4 rounded-2xl border transition-all text-left ${
                          selectedDuration === opt.value
                            ? "border-primary bg-primary/10 shadow-md"
                            : "border-border/30 bg-secondary/50 hover:border-border/60"
                        }`}>
                        <div className="text-lg font-bold">{opt.label}</div>
                        <div className="text-xs text-muted-foreground">{opt.desc}</div>
                      </motion.button>
                    ))}
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button onClick={handleFinish} disabled={!selectedDuration}
                      className="gradient-primary text-primary-foreground rounded-2xl h-12 px-8 font-semibold glow-primary w-full">
                      Let's Go! <Sparkles className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>
                  <StepIndicator current={surveyStepIndex} total={TOTAL_STEPS - 1} />
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ─── Reusable sub-components ─── */

const StepIcon = ({ icon: Icon }: { icon: React.ElementType }) => (
  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
    className="w-16 h-16 rounded-2xl bg-secondary/50 border border-border/30 flex items-center justify-center mx-auto mb-6">
    <Icon className="w-7 h-7 text-primary" />
  </motion.div>
);

const NavButton = ({ onClick, disabled, label }: { onClick: () => void; disabled: boolean; label: string }) => (
  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
    <Button onClick={onClick} disabled={disabled}
      className="gradient-primary text-primary-foreground rounded-2xl h-12 px-8 font-semibold glow-primary w-full">
      {label} <ArrowRight className="w-4 h-4 ml-2" />
    </Button>
  </motion.div>
);

export default OnboardingScreen;
