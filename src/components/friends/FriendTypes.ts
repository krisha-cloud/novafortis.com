export interface Friend {
  id: string;
  name: string;
  avatar: string;
  streak: number;
  xp: number;
  status: "online" | "studying" | "offline";
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: number;
}

export const statusColors = {
  online: "bg-green-500",
  studying: "bg-amber-500",
  offline: "bg-muted-foreground/40",
};

export const statusLabels = {
  online: "Online",
  studying: "Studying",
  offline: "Offline",
};

export const mockFriends: Friend[] = [
  { id: "1", name: "Alex Chen", avatar: "🧑‍💻", streak: 12, xp: 4200, status: "studying" },
  { id: "2", name: "Priya Sharma", avatar: "👩‍🔬", streak: 7, xp: 3100, status: "online" },
  { id: "3", name: "Marcus Lee", avatar: "🧑‍🎓", streak: 21, xp: 6800, status: "offline" },
];
