import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Check, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
}

const MessagesPanel = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  useEffect(() => { fetchMessages(); }, []);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error("Failed to load messages");
    else setMessages(data || []);
    setLoading(false);
  };

  const markAsRead = async (id: string) => {
    const { error } = await supabase.from("contact_messages").update({ read: true }).eq("id", id);
    if (error) toast.error("Failed to update");
    else setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
  };

  const filtered = messages.filter((m) => filter === "unread" ? !m.read : filter === "read" ? m.read : true);
  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-xl">Contact Messages</h2>
          <p className="font-body text-xs text-muted-foreground mt-0.5">{unreadCount} unread · {messages.length} total</p>
        </div>
        <div className="flex gap-2">
          {(["all", "unread", "read"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`font-body text-[11px] tracking-wider uppercase px-3 py-1.5 rounded border transition-colors ${filter === f ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16"><Mail className="w-10 h-10 text-muted-foreground mx-auto mb-3" /><p className="font-body text-sm text-muted-foreground">No messages found</p></div>
      ) : (
        <div className="space-y-3">
          {filtered.map((msg) => (
            <div key={msg.id} className={`p-5 rounded-xl border ${msg.read ? "bg-card border-border" : "bg-primary/5 border-primary/20"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display text-base truncate">{msg.name}</h3>
                    {!msg.read && <span className="bg-primary text-primary-foreground text-[10px] tracking-wider uppercase px-2 py-0.5 rounded font-body">New</span>}
                  </div>
                  <a href={`mailto:${msg.email}`} className="font-body text-xs text-primary hover:underline">{msg.email}</a>
                  <p className="font-body text-sm text-muted-foreground mt-2 whitespace-pre-wrap">{msg.message}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="font-body text-[11px] text-muted-foreground">{new Date(msg.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span>
                  </div>
                </div>
                {!msg.read && (
                  <button onClick={() => markAsRead(msg.id)} className="flex items-center gap-1 font-body text-[11px] tracking-wider uppercase text-primary hover:text-accent flex-shrink-0">
                    <Check className="w-3 h-3" /> Mark Read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessagesPanel;
