import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
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

const AdminMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load messages. Please sign in first.");
      console.error(error);
    } else {
      setMessages(data || []);
    }
    setLoading(false);
  };

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from("contact_messages")
      .update({ read: true })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update");
    } else {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, read: true } : m))
      );
    }
  };

  const filtered = messages.filter((m) => {
    if (filter === "unread") return !m.read;
    if (filter === "read") return m.read;
    return true;
  });

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Messages — Admin" description="View contact form submissions" />
      <Navbar />
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl md:text-4xl text-foreground">
                Contact <span className="text-gradient-gold italic">Messages</span>
              </h1>
              <p className="font-body text-sm text-muted-foreground mt-1">
                {unreadCount} unread · {messages.length} total
              </p>
            </div>
            <div className="flex gap-2">
              {(["all", "unread", "read"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`font-body text-xs tracking-[0.15em] uppercase px-4 py-2 rounded-sm border transition-colors ${
                    filter === f
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="font-body text-muted-foreground">No messages found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-6 rounded-sm border transition-colors ${
                    msg.read
                      ? "bg-card border-border"
                      : "bg-primary/5 border-primary/20"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-display text-lg text-foreground truncate">
                          {msg.name}
                        </h3>
                        {!msg.read && (
                          <span className="bg-primary text-primary-foreground text-[10px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-sm font-body">
                            New
                          </span>
                        )}
                      </div>
                      <a
                        href={`mailto:${msg.email}`}
                        className="font-body text-sm text-primary hover:underline"
                      >
                        {msg.email}
                      </a>
                      <p className="font-body text-sm text-muted-foreground mt-3 whitespace-pre-wrap">
                        {msg.message}
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="font-body text-xs text-muted-foreground">
                          {new Date(msg.created_at).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                      </div>
                    </div>
                    {!msg.read && (
                      <button
                        onClick={() => markAsRead(msg.id)}
                        className="flex items-center gap-1 font-body text-xs tracking-[0.15em] uppercase text-primary hover:text-accent transition-colors flex-shrink-0"
                      >
                        <Check className="w-4 h-4" /> Mark Read
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminMessages;
