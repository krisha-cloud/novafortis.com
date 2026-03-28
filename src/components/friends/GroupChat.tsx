import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle, Smile, Plus, X, Users, Image } from "lucide-react";
import type { Friend } from "./FriendTypes";
import { statusColors } from "./FriendTypes";

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: number;
}

interface GroupChatProps {
  friends: Friend[];
}

const EMOJI_LIST = ["😀","😂","🔥","💪","📚","🎯","✅","❤️","👏","🤔","😎","🙌","💡","⭐","🚀","😊","👍","🎉","😭","💀"];

const GIF_LIST = [
  { label: "Thumbs Up", url: "https://media.giphy.com/media/111ebonMs90YLu/giphy.gif" },
  { label: "Dancing", url: "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif" },
  { label: "Celebrate", url: "https://media.giphy.com/media/g9582DNuQppxC/giphy.gif" },
  { label: "Study Hard", url: "https://media.giphy.com/media/IPbS5R4fSUl5S/giphy.gif" },
  { label: "High Five", url: "https://media.giphy.com/media/3oEjHV0z8S7WM4MwnK/giphy.gif" },
  { label: "Mind Blown", url: "https://media.giphy.com/media/xT0xeJpnrWC3xWRBKw/giphy.gif" },
];

const STORAGE_KEY = "nova-group-chat-v2";
const MEMBERS_KEY = "nova-group-chat-members";

const GroupChat = ({ friends }: GroupChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [memberIds, setMemberIds] = useState<string[]>(() => {
    const stored = localStorage.getItem(MEMBERS_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const members = friends.filter((f) => memberIds.includes(f.id));
  const nonMembers = friends.filter((f) => !memberIds.includes(f.id));

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(memberIds));
  }, [memberIds]);

  const addMember = (id: string) => {
    setMemberIds((prev) => [...prev, id]);
    setShowAddMember(false);
  };

  const removeMember = (id: string) => {
    setMemberIds((prev) => prev.filter((mid) => mid !== id));
  };

  const sendMessage = (text?: string, isGif?: boolean) => {
    const content = text || input.trim();
    if (!content) return;
    const msg: ChatMessage = {
      id: Date.now().toString(),
      senderId: "me",
      senderName: "You",
      senderAvatar: "😊",
      text: isGif ? `[gif]${content}` : content,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, msg]);
    setInput("");
    setShowEmojiPicker(false);
    setShowGifPicker(false);

    // Simulate reply from an online member
    const onlineMembers = members.filter((f) => f.status !== "offline");
    if (onlineMembers.length > 0 && !isGif) {
      const responder = onlineMembers[Math.floor(Math.random() * onlineMembers.length)];
      const replies = [
        "That's awesome! 🔥", "Keep it up! 💪", "Nice, I just finished studying too!",
        "Let's do a study session together!", "Haha, same here 😄",
        "Good luck with your revision!", "How's your streak going?",
        "I'm grinding through flashcards rn 📚", "Lol 😂", "Totally agree!",
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

  const renderMessageContent = (text: string) => {
    if (text.startsWith("[gif]")) {
      return (
        <img
          src={text.replace("[gif]", "")}
          alt="GIF"
          className="rounded-lg max-w-[200px] max-h-[150px] object-cover"
        />
      );
    }
    return <p>{text}</p>;
  };

  return (
    <div className="flex gap-4 h-[65vh]">
      {/* Main chat area */}
      <div className="flex-1 flex flex-col rounded-2xl border border-border/40 bg-card/50 backdrop-blur-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-border/30 bg-card/60">
          <MessageCircle className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Group Chat</span>
          <span className="text-xs text-muted-foreground ml-auto">
            {members.length} members
          </span>
        </div>

        {members.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground text-sm gap-3 px-4">
            <Users className="w-10 h-10 opacity-30" />
            <p className="text-center">Add friends to this chat to start messaging!</p>
            <button
              onClick={() => setShowAddMember(true)}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
            >
              Add Members
            </button>
          </div>
        ) : (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm gap-2">
                  <MessageCircle className="w-8 h-8 opacity-40" />
                  <p>No messages yet. Say hi!</p>
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
                        {renderMessageContent(msg.text)}
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

            {/* Emoji picker */}
            <AnimatePresence>
              {showEmojiPicker && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="px-4 py-2 border-t border-border/20 bg-card/70"
                >
                  <div className="flex flex-wrap gap-1.5">
                    {EMOJI_LIST.map((e) => (
                      <button
                        key={e}
                        onClick={() => setInput((prev) => prev + e)}
                        className="w-8 h-8 rounded-lg hover:bg-secondary/60 flex items-center justify-center text-lg transition-colors"
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* GIF picker */}
            <AnimatePresence>
              {showGifPicker && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="px-4 py-2 border-t border-border/20 bg-card/70"
                >
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {GIF_LIST.map((gif) => (
                      <button
                        key={gif.label}
                        onClick={() => sendMessage(gif.url, true)}
                        className="shrink-0 rounded-lg overflow-hidden border border-border/30 hover:border-primary/50 transition-colors"
                      >
                        <img src={gif.url} alt={gif.label} className="w-20 h-16 object-cover" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <div className="px-4 py-3 border-t border-border/30 bg-card/60">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setShowEmojiPicker(!showEmojiPicker); setShowGifPicker(false); }}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${showEmojiPicker ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`}
                >
                  <Smile className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { setShowGifPicker(!showGifPicker); setShowEmojiPicker(false); }}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-colors ${showGifPicker ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`}
                >
                  GIF
                </button>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-secondary/50 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary/30"
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => sendMessage()}
                  disabled={!input.trim()}
                  className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 transition-opacity"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Right sidebar — Online members */}
      <div className="hidden md:flex flex-col w-56 rounded-2xl border border-border/40 bg-card/50 backdrop-blur-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/30 bg-card/60">
          <span className="text-xs font-semibold text-foreground">Members</span>
          <button
            onClick={() => setShowAddMember(!showAddMember)}
            className="w-6 h-6 rounded-md bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Add member dropdown */}
        <AnimatePresence>
          {showAddMember && nonMembers.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-b border-border/20 overflow-hidden"
            >
              <div className="p-2 space-y-1">
                <p className="text-[10px] text-muted-foreground px-2 mb-1">Add to chat</p>
                {nonMembers.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => addMember(f.id)}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-secondary/50 text-left transition-colors"
                  >
                    <span className="text-sm">{f.avatar}</span>
                    <span className="text-xs text-foreground truncate">{f.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {members.length === 0 && (
            <p className="text-[11px] text-muted-foreground text-center py-4">No members yet</p>
          )}

          {/* Online first, then studying, then offline */}
          {["online", "studying", "offline"].map((status) => {
            const group = members.filter((m) => m.status === status);
            if (group.length === 0) return null;
            return (
              <div key={status} className="mb-2">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground px-2 py-1">
                  {status} — {group.length}
                </p>
                {group.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-secondary/30 group transition-colors"
                  >
                    <div className="relative">
                      <span className="text-sm">{m.avatar}</span>
                      <div className={`absolute -bottom-0.5 -right-1 w-2 h-2 rounded-full border border-card ${statusColors[m.status]}`} />
                    </div>
                    <span className="text-xs text-foreground truncate flex-1">{m.name}</span>
                    <button
                      onClick={() => removeMember(m.id)}
                      className="w-5 h-5 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GroupChat;
