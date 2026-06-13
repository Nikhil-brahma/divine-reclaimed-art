import { useEffect, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Package, LogOut, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

interface Order {
  id: string; order_number: string; status: string; total: number;
  created_at: string; tracking_number: string | null;
}

const statusStyle: Record<string, string> = {
  pending: "bg-muted text-muted-foreground",
  paid: "bg-amber-100 text-amber-800",
  shipped: "bg-blue-100 text-blue-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
  refunded: "bg-purple-100 text-purple-800",
};

const Account = () => {
  const [params] = useSearchParams();
  const justOrdered = params.get("order");
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const [o, p] = await Promise.all([
          supabase.from("orders").select("id, order_number, status, total, created_at, tracking_number").eq("user_id", user.id).order("created_at", { ascending: false }),
          supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
        ]);
        setOrders((o.data || []) as Order[]);
        setProfile(p.data);
      }
      setLoading(false);
    })();
  }, []);

  const signOut = async () => { await supabase.auth.signOut(); window.location.href = "/"; };

  if (loading) {
    return <div className="min-h-screen bg-background"><Navbar /><div className="flex justify-center items-center h-[60vh]"><Loader2 className="animate-spin text-primary" /></div></div>;
  }
  if (!user) return <Navigate to="/auth" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          {justOrdered && (
            <div className="mb-6 rounded-2xl glass-card p-5 flex items-start gap-3 border border-primary/30">
              <CheckCircle2 className="text-primary mt-0.5" size={22} />
              <div>
                <h3 className="font-display text-lg">Order {justOrdered} confirmed</h3>
                <p className="font-body text-sm text-muted-foreground">Your blessing is on its way. We'll email tracking once your parcel ships.</p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
            <div>
              <h1 className="font-display text-3xl md:text-4xl">Welcome, {profile?.full_name || user.email?.split("@")[0]}</h1>
              <p className="font-body text-sm text-muted-foreground">Your sacred journey · {orders.length} order{orders.length !== 1 ? "s" : ""}</p>
            </div>
            <button onClick={signOut} className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-wider text-muted-foreground hover:text-destructive border border-border/60 rounded-full px-4 py-2">
              <LogOut size={12} /> Sign out
            </button>
          </div>

          {/* Profile quick edit */}
          <div className="grid md:grid-cols-3 gap-4 mb-10">
            <div className="md:col-span-2 rounded-2xl glass-card p-5">
              <h2 className="font-display text-lg mb-3">Shipping address</h2>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {profile?.address_line1 ? (
                  <>
                    {profile.full_name && <>{profile.full_name}<br /></>}
                    {profile.address_line1}{profile.address_line2 ? `, ${profile.address_line2}` : ""}<br />
                    {profile.city}, {profile.state} {profile.postal_code}<br />
                    {profile.country} · {profile.phone}
                  </>
                ) : "We'll capture your address at checkout."}
              </p>
            </div>
            <div className="rounded-2xl glass-card p-5">
              <h2 className="font-display text-lg mb-2">Account</h2>
              <p className="font-body text-xs text-muted-foreground break-all">{user.email}</p>
            </div>
          </div>

          {/* Orders */}
          <h2 className="font-display text-2xl mb-4">Your orders</h2>
          {orders.length === 0 ? (
            <div className="rounded-2xl glass-card p-10 text-center">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="font-body text-sm text-muted-foreground mb-4">No orders yet</p>
              <Link to="/#collections" className="inline-block font-body text-xs uppercase tracking-wider bg-primary text-primary-foreground rounded-full px-5 py-2.5">
                Browse Collection
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => (
                <div key={o.id} className="rounded-xl glass-card p-4 flex items-center gap-4 flex-wrap">
                  <div className="flex-1 min-w-[150px]">
                    <p className="font-display text-base">{o.order_number}</p>
                    <p className="font-body text-[11px] text-muted-foreground">{new Date(o.created_at).toLocaleString("en-IN")}</p>
                  </div>
                  <span className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full ${statusStyle[o.status]}`}>{o.status}</span>
                  <p className="font-display text-base">₹{o.total.toLocaleString("en-IN")}</p>
                  {o.tracking_number && (
                    <p className="font-body text-[11px] text-primary w-full">Tracking: {o.tracking_number}</p>
                  )}
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

export default Account;
