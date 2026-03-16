import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, ShoppingBag, Mic, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Message = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/customer-chat`;

const SacredAIOrb = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Namaste! 🙏 I am the Punarvsu Sacred Guide — your personal AI companion for discovering divine handcrafted bags. Ask me anything about our collection, the sacred journey of temple textiles, or let me help you find the perfect piece.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pulseIntensity, setPulseIntensity] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  // Ambient pulse animation
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIntensity(Math.sin(Date.now() / 1000) * 0.5 + 0.5);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const streamChat = useCallback(async (allMessages: Message[]) => {
    setIsLoading(true);
    let assistantSoFar = "";

    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && prev.length > 1) {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: allMessages }),
      });

      if (!resp.ok || !resp.body) {
        let errorMsg = "Something went wrong. Please try again! 🙏";
        try { const errData = await resp.json(); errorMsg = errData.error || errorMsg; } catch {}
        setMessages((prev) => [...prev, { role: "assistant", content: errorMsg }]);
        setIsLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let done = false;

      while (!done) {
        const { done: streamDone, value } = await reader.read();
        if (streamDone) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIdx: number;
        while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIdx);
          buffer = buffer.slice(newlineIdx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) upsert(content);
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      if (buffer.trim()) {
        for (let raw of buffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (!raw.startsWith("data: ")) continue;
          const json = raw.slice(6).trim();
          if (json === "[DONE]") continue;
          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) upsert(content);
          } catch {}
        }
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I'm having trouble connecting. Please email us at punarvsu.com@gmail.com 🙏" },
      ]);
    }
    setIsLoading(false);
  }, []);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    const userMsg: Message = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    await streamChat(newMessages);
  };

  const renderContent = (content: string) => {
    let formatted = content.replace(
      /\/product\/([\w-]+)/g,
      '<a href="/product/$1" class="text-accent underline underline-offset-2 font-medium hover:text-primary transition-colors">View Product →</a>'
    );
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    return formatted;
  };

  const handleContentClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "A" && target.getAttribute("href")?.startsWith("/product/")) {
      e.preventDefault();
      navigate(target.getAttribute("href")!);
      setIsOpen(false);
    }
  };

  const quickActions = [
    { icon: ShoppingBag, label: "Show me your bags", msg: "What bags do you have in stock right now?" },
    { icon: Sparkles, label: "Sacred story", msg: "Tell me about the sacred journey of your textiles" },
    { icon: Zap, label: "Best gift", msg: "I need the perfect gift under ₹2000" },
  ];

  return (
    <>
      {/* Sacred AI Orb - Floating */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-20 right-4 z-40"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Outer rings */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(circle, hsla(42, 85%, 55%, ${0.1 + pulseIntensity * 0.15}) 0%, transparent 70%)`,
                transform: `scale(${2.5 + pulseIntensity * 0.5})`,
              }}
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-3 rounded-full border border-accent/20"
              style={{
                borderImage: "linear-gradient(135deg, hsla(42, 85%, 55%, 0.4), transparent, hsla(30, 80%, 48%, 0.4), transparent) 1",
              }}
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-5 rounded-full border border-primary/10"
            />

            {/* Orb button */}
            <motion.button
              onClick={() => setIsOpen(true)}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-16 h-16 rounded-full flex items-center justify-center overflow-hidden"
              style={{
                background: "radial-gradient(circle at 35% 35%, hsl(42 85% 65%), hsl(30 80% 48%), hsl(345 60% 28%))",
                boxShadow: `0 0 ${20 + pulseIntensity * 20}px hsla(42, 85%, 55%, ${0.3 + pulseIntensity * 0.3}), 0 0 ${40 + pulseIntensity * 30}px hsla(30, 80%, 48%, 0.15)`,
              }}
              aria-label="Open Sacred AI Guide"
            >
              {/* Inner glow */}
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-1 rounded-full"
                style={{
                  background: "radial-gradient(circle at 40% 40%, hsla(42, 85%, 75%, 0.6), transparent 60%)",
                }}
              />
              <Sparkles className="relative z-10 text-ivory" size={22} />
            </motion.button>

            {/* Hover label */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, x: 10, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 10, scale: 0.9 }}
                  className="absolute right-20 top-1/2 -translate-y-1/2 whitespace-nowrap bg-temple-dark/90 backdrop-blur-md text-ivory px-4 py-2 rounded-lg font-body text-sm shadow-xl border border-accent/20"
                >
                  <span className="text-accent font-semibold">✦</span> Ask Punarvsu AI
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Immersive Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 60 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 60 }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed bottom-4 right-4 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden rounded-2xl"
            style={{
              background: "linear-gradient(160deg, hsl(20 12% 10% / 0.97), hsl(345 60% 15% / 0.95), hsl(20 12% 8% / 0.98))",
              backdropFilter: "blur(30px)",
              border: "1px solid hsla(42, 85%, 55%, 0.15)",
              boxShadow: "0 25px 80px -20px hsla(0, 0%, 0%, 0.6), 0 0 60px -30px hsla(42, 85%, 55%, 0.2), inset 0 1px 0 hsla(42, 85%, 55%, 0.1)",
            }}
          >
            {/* Header with holographic effect */}
            <div className="relative px-5 py-4 flex items-center gap-3 border-b border-accent/10">
              {/* Animated gradient bar */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-[1px]"
                style={{
                  background: "linear-gradient(90deg, transparent, hsl(42 85% 55%), hsl(30 80% 48%), transparent)",
                }}
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              {/* AI Avatar */}
              <div className="relative">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: "radial-gradient(circle at 35% 35%, hsl(42 85% 60%), hsl(30 80% 45%))",
                    boxShadow: "0 0 15px hsla(42, 85%, 55%, 0.3)",
                  }}
                >
                  <Sparkles size={18} className="text-ivory" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full border border-accent/30"
                />
              </div>

              <div className="flex-1">
                <p className="font-display text-sm font-semibold text-ivory">Punarvsu AI</p>
                <p className="text-[10px] text-accent/70 font-body flex items-center gap-1">
                  <motion.span
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="inline-block w-1.5 h-1.5 rounded-full bg-accent"
                  />
                  Sacred Intelligence • Always Here
                </p>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-ivory/60 hover:text-ivory hover:bg-ivory/10 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3" onClick={handleContentClick}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed font-body ${
                      msg.role === "user"
                        ? "rounded-br-sm text-ivory"
                        : "rounded-bl-sm text-ivory/90"
                    }`}
                    style={
                      msg.role === "user"
                        ? {
                            background: "linear-gradient(135deg, hsl(30 80% 48%), hsl(42 85% 45%))",
                            boxShadow: "0 4px 15px hsla(30, 80%, 48%, 0.2)",
                          }
                        : {
                            background: "hsla(0, 0%, 100%, 0.06)",
                            border: "1px solid hsla(42, 85%, 55%, 0.08)",
                          }
                    }
                    dangerouslySetInnerHTML={{ __html: renderContent(msg.content) }}
                  />
                </motion.div>
              ))}

              {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex justify-start">
                  <div
                    className="px-4 py-3 rounded-2xl rounded-bl-sm text-sm"
                    style={{ background: "hsla(0, 0%, 100%, 0.06)", border: "1px solid hsla(42, 85%, 55%, 0.08)" }}
                  >
                    <motion.div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                          className="w-2 h-2 rounded-full bg-accent"
                        />
                      ))}
                    </motion.div>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              {messages.length <= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-2 pt-2"
                >
                  <p className="text-[10px] text-ivory/30 font-body uppercase tracking-[0.3em]">Quick Actions</p>
                  {quickActions.map((q) => (
                    <button
                      key={q.label}
                      onClick={() => {
                        const userMsg: Message = { role: "user", content: q.msg };
                        const newMsgs = [...messages, userMsg];
                        setMessages(newMsgs);
                        streamChat(newMsgs);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-body text-xs text-ivory/80 hover:text-ivory transition-all duration-300 group"
                      style={{
                        background: "hsla(0, 0%, 100%, 0.03)",
                        border: "1px solid hsla(42, 85%, 55%, 0.06)",
                      }}
                    >
                      <q.icon
                        size={14}
                        className="text-accent/60 group-hover:text-accent transition-colors shrink-0"
                      />
                      {q.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-accent/10">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask the sacred guide..."
                  className="flex-1 bg-ivory/5 rounded-xl px-4 py-3 text-sm font-body text-ivory placeholder:text-ivory/25 outline-none border border-accent/10 focus:border-accent/30 transition-colors"
                  disabled={isLoading}
                />
                <motion.button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-30 transition-colors"
                  style={{
                    background: input.trim()
                      ? "linear-gradient(135deg, hsl(30 80% 48%), hsl(42 85% 50%))"
                      : "hsla(0, 0%, 100%, 0.05)",
                    boxShadow: input.trim() ? "0 4px 15px hsla(30, 80%, 48%, 0.3)" : "none",
                  }}
                >
                  <Send size={15} className="text-ivory" />
                </motion.button>
              </div>
              <p className="text-[8px] text-ivory/20 text-center mt-2 font-body tracking-wider">
                PUNARVSU SACRED AI • DIVINE INTELLIGENCE
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SacredAIOrb;
