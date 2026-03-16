import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Users, Search, Copy, Check, X, Crown, Flame } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Friend {
  id: string;
  name: string;
  avatar: string;
  streak: number;
  xp: number;
  status: "online" | "studying" | "offline";
}

const mockFriends: Friend[] = [
  { id: "1", name: "Alex Chen", avatar: "🧑‍💻", streak: 12, xp: 4200, status: "studying" },
  { id: "2", name: "Priya Sharma", avatar: "👩‍🔬", streak: 7, xp: 3100, status: "online" },
  { id: "3", name: "Marcus Lee", avatar: "🧑‍🎓", streak: 21, xp: 6800, status: "offline" },
];

const statusColors = {
  online: "bg-green-500",
  studying: "bg-amber-500",
  offline: "bg-muted-foreground/40",
};

const statusLabels = {
  online: "Online",
  studying: "Studying",
  offline: "Offline",
};

const Friends = () => {
  const [friends, setFriends] = useState<Friend[]>(mockFriends);
  const [searchQuery, setSearchQuery] = useState("");
  const [friendCode] = useState(() => {
    const stored = localStorage.getItem("nova-friend-code");
    if (stored) return stored;
    const code = `NOVA-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    localStorage.setItem("nova-friend-code", code);
    return code;
  });
  const [addCode, setAddCode] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyCode = () => {
    navigator.clipboard.writeText(friendCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Code copied!", description: "Share it with your friends." });
  };

  const handleAddFriend = () => {
    if (!addCode.trim()) return;
    const newFriend: Friend = {
      id: Date.now().toString(),
      name: `Friend ${friends.length + 1}`,
      avatar: "🤝",
      streak: 0,
      xp: 0,
      status: "online",
    };
    setFriends((prev) => [...prev, newFriend]);
    setAddCode("");
    toast({ title: "Friend added!", description: "You can now see their progress." });
  };

  const removeFriend = (id: string) => {
    setFriends((prev) => prev.filter((f) => f.id !== id));
    toast({ title: "Friend removed" });
  };

  const filtered = friends.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => b.xp - a.xp);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Friends</h1>
        <p className="text-sm text-muted-foreground mt-1">Study together, grow together</p>
      </div>

      {/* Add Friend + Your Code */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Your Code */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-xl p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Your Friend Code</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 px-4 py-2.5 rounded-xl bg-secondary/50 font-mono text-sm text-foreground tracking-wider">
              {friendCode}
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={copyCode}
              className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </motion.button>
          </div>
        </motion.div>

        {/* Add by code */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-xl p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <UserPlus className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Add a Friend</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              value={addCode}
              onChange={(e) => setAddCode(e.target.value)}
              placeholder="Enter friend code..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-secondary/50 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary/30"
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddFriend}
              className="px-4 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium"
            >
              Add
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search friends..."
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-card/50 backdrop-blur-xl border border-border/40 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary/30"
        />
      </div>

      {/* Leaderboard */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Crown className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Leaderboard</span>
          <span className="text-xs text-muted-foreground ml-auto">{sorted.length} friends</span>
        </div>

        <div className="space-y-2">
          <AnimatePresence>
            {sorted.map((friend, i) => (
              <motion.div
                key={friend.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 p-3.5 rounded-xl border border-border/30 bg-card/40 backdrop-blur-xl hover:bg-card/60 transition-colors group"
              >
                {/* Rank */}
                <span className={`w-6 text-center text-xs font-bold ${i === 0 ? "text-amber-500" : i === 1 ? "text-muted-foreground" : i === 2 ? "text-orange-400" : "text-muted-foreground/60"}`}>
                  #{i + 1}
                </span>

                {/* Avatar */}
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-secondary/60 flex items-center justify-center text-lg">
                    {friend.avatar}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${statusColors[friend.status]}`} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{friend.name}</p>
                  <p className="text-xs text-muted-foreground">{statusLabels[friend.status]}</p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                    <span>{friend.streak}d</span>
                  </div>
                  <span className="font-semibold text-primary">{friend.xp.toLocaleString()} XP</span>
                </div>

                {/* Remove */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeFriend(friend.id)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground/0 group-hover:text-muted-foreground hover:!text-destructive hover:bg-destructive/10 transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>

          {sorted.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
              No friends yet. Share your code to get started!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Friends;
