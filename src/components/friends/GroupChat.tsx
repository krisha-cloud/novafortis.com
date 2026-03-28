import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle } from "lucide-react";
import type { ChatMessage, Friend } from "./FriendTypes";

interface GroupChatProps {
  friends: Friend[];
}

const STORAGE_KEY = "nova-group-chat";

const GroupChat = ({ friends }: GroupChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const msg: ChatMessage = {
      id: Date.now().toString(),
      senderId: "me",
      senderName: "You",
      senderAvatar: "😊",
      text: input.trim(),
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, msg]);
    setInput("");

    // Simulate a random friend reply after a short delay
    const onlineFriends = friends.filter((f) => f.status !== "offline");
    if (onlineFriends.length > 0) {
      const responder = onlineFriends[Math.floor(Math.random() * onlineFriends.length)];
      const replies = [
        "That's awesome! 🔥",
        "Keep it up! 💪",
        "Nice, I just finished studying too!",
        "Let's do a study session together!",
        "Haha, same here 😄",
        "Good luck with your revision!",
        "How's your streak going?",
        "I'm grinding through flashcards rn 📚",
      ];
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            senderId: responder.id,
            senderName: responder.name,
            senderAvatar: responder.avatar,
            text: replies[Math.floor(Math.random() * replies.length)],
            timestamp: Date.now(),
          },
        ]);
      }, 800 + Math.random() * 1500);
    }
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col h-[60vh] rounded-2xl border border-border/40 bg-card/50 backdrop-blur-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-border/30 bg-card/60">
        <MessageCircle className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">Group Chat</span>
        <span className="text-xs text-muted-foreground ml-auto">
          {friends.filter((f) => f.status !== "offline").length} online
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm gap-2">
            <MessageCircle className="w-8 h-8 opacity-40" />
            <p>No messages yet. Say hi to your friends!</p>
          </div>
        )}
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isMe = msg.senderId === "me";
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : ""}`}
              >
                <div className="w-7 h-7 rounded-full bg-secondary/60 flex items-center justify-center text-sm shrink-0">
                  {msg.senderAvatar}
                </div>
                <div
                  className={`max-w-[70%] px-3.5 py-2 rounded-2xl text-sm ${
                    isMe
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-secondary/50 text-foreground rounded-bl-md"
                  }`}
                >
                  {!isMe && (
                    <p className="text-[10px] font-semibold text-muted-foreground mb-0.5">
                      {msg.senderName}
                    </p>
                  )}
                  <p>{msg.text}</p>
                  <p className={`text-[10px] mt-1 ${isMe ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border/30 bg-card/60">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-secondary/50 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary/30"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={sendMessage}
            disabled={!input.trim()}
            className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 transition-opacity"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default GroupChat;
