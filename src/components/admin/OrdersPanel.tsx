import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Package, MapPin, Phone, Mail, ChevronDown, ChevronUp, Truck, CheckCircle2, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";

interface Order {
  id: string; order_number: string; status: string;
  subtotal: number; shipping: number; total: number; currency: string;
  customer_name: string; customer_email: string; customer_phone: string | null;
  shipping_address: any; notes: string | null;
  razorpay_order_id: string | null; razorpay_payment_id: string | null;
  paid_at: string | null; shipped_at: string | null; delivered_at: string | null;
  tracking_number: string | null;
  created_at: string;
}

interface Item {
  id: string; order_id: string; product_title: string; product_image: string | null;
  unit_price: number; quantity: number; line_total: number; product_handle: string;
}

const STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled", "refunded"];
const statusStyle: Record<string, string> = {
  pending: "bg-muted text-muted-foreground",
  paid: "bg-amber-100 text-amber-800",
  shipped: "bg-blue-100 text-blue-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
  refunded: "bg-purple-100 text-purple-800",
};

const statusIcon: Record<string, any> = {
  pending: Clock, paid: CheckCircle2, shipped: Truck, delivered: CheckCircle2, cancelled: XCircle, refunded: XCircle,
};

const OrdersPanel = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [items, setItems] = useState<Record<string, Item[]>>({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [tracking, setTracking] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(200);
    if (error) { toast.error(error.message); setLoading(false); return; }
    setOrders((data || []) as Order[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggle = async (o: Order) => {
    if (expanded === o.id) { setExpanded(null); return; }
    setExpanded(o.id);
    if (!items[o.id]) {
      const { data } = await supabase.from("order_items").select("*").eq("order_id", o.id);
      setItems((m) => ({ ...m, [o.id]: (data || []) as Item[] }));
    }
  };

  const updateStatus = async (o: Order, status: string) => {
    const patch: any = { status };
    if (status === "shipped") { patch.shipped_at = new Date().toISOString(); if (tracking[o.id]) patch.tracking_number = tracking[o.id]; }
    if (status === "delivered") patch.delivered_at = new Date().toISOString();
    if (status === "paid" && !o.paid_at) patch.paid_at = new Date().toISOString();
    const { error } = await supabase.from("orders").update(patch).eq("id", o.id);
    if (error) { toast.error(error.message); return; }
    toast.success(`Order ${o.order_number} → ${status}`);
    setOrders((list) => list.map((x) => x.id === o.id ? { ...x, ...patch } : x));
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);
  const counts = STATUSES.reduce((acc, s) => ({ ...acc, [s]: orders.filter((o) => o.status === s).length }), {} as Record<string, number>);

  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="font-display text-xl">Orders ({orders.length})</h2>
        <div className="flex gap-1.5 flex-wrap">
          <button onClick={() => setFilter("all")}
                  className={`text-[11px] px-3 py-1.5 rounded-full font-body uppercase tracking-wider ${filter === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}>
            All ({orders.length})
          </button>
          {STATUSES.map((s) => (
            <button key={s} onClick={() => setFilter(s)}
                    className={`text-[11px] px-3 py-1.5 rounded-full font-body uppercase tracking-wider ${filter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}>
              {s} ({counts[s] || 0})
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="font-body text-sm text-muted-foreground">No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => {
            const Icon = statusIcon[o.status] || Clock;
            const isOpen = expanded === o.id;
            return (
              <div key={o.id} className="rounded-xl border border-border/50 bg-card overflow-hidden">
                <button onClick={() => toggle(o)} className="w-full text-left p-4 flex items-center gap-4 hover:bg-muted/30">
                  <Icon size={18} className="text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display text-sm">{o.order_number}</span>
                      <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${statusStyle[o.status]}`}>{o.status}</span>
                    </div>
                    <p className="font-body text-xs text-muted-foreground mt-0.5">
                      {o.customer_name} · ₹{o.total.toLocaleString("en-IN")} · {new Date(o.created_at).toLocaleString("en-IN")}
                    </p>
                  </div>
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {isOpen && (
                  <div className="border-t border-border/50 p-4 space-y-4 bg-background/40">
                    <div className="grid sm:grid-cols-2 gap-4 text-xs font-body">
                      <div className="space-y-1">
                        <p className="flex items-center gap-1.5"><Mail size={11} className="text-primary" /> {o.customer_email}</p>
                        {o.customer_phone && <p className="flex items-center gap-1.5"><Phone size={11} className="text-primary" /> {o.customer_phone}</p>}
                        <p className="flex items-start gap-1.5"><MapPin size={11} className="text-primary mt-0.5" />
                          <span>{o.shipping_address?.line1}{o.shipping_address?.line2 ? `, ${o.shipping_address.line2}` : ""}, {o.shipping_address?.city}, {o.shipping_address?.state} {o.shipping_address?.postal_code}, {o.shipping_address?.country}</span>
                        </p>
                        {o.notes && <p className="text-muted-foreground italic">"{o.notes}"</p>}
                      </div>
                      <div className="space-y-1 text-right sm:text-left">
                        <p><span className="text-muted-foreground">Subtotal:</span> ₹{o.subtotal.toLocaleString("en-IN")}</p>
                        <p><span className="text-muted-foreground">Shipping:</span> {o.shipping === 0 ? "Free" : `₹${o.shipping}`}</p>
                        <p className="font-display text-sm"><span className="text-muted-foreground font-body text-xs">Total:</span> ₹{o.total.toLocaleString("en-IN")}</p>
                        {o.razorpay_payment_id && <p className="text-[10px] text-muted-foreground break-all">Payment: {o.razorpay_payment_id}</p>}
                      </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-2">
                      {(items[o.id] || []).map((it) => (
                        <div key={it.id} className="flex items-center gap-3 p-2 rounded-lg bg-card border border-border/40">
                          {it.product_image && <img src={it.product_image} alt={it.product_title} className="w-12 h-12 rounded object-cover" />}
                          <div className="flex-1 min-w-0">
                            <p className="font-body text-xs truncate">{it.product_title}</p>
                            <p className="font-body text-[10px] text-muted-foreground">Qty {it.quantity} × ₹{it.unit_price.toLocaleString("en-IN")}</p>
                          </div>
                          <p className="font-body text-xs">₹{it.line_total.toLocaleString("en-IN")}</p>
                        </div>
                      ))}
                    </div>

                    {/* Status controls */}
                    <div className="flex flex-wrap gap-2 items-center pt-2 border-t border-border/40">
                      <span className="font-body text-[10px] uppercase tracking-wider text-muted-foreground mr-1">Update status:</span>
                      {STATUSES.map((s) => (
                        <button key={s} onClick={() => updateStatus(o, s)} disabled={o.status === s}
                                className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border border-border/60 hover:border-primary hover:text-primary disabled:opacity-30 disabled:hover:border-border/60 disabled:hover:text-foreground">
                          {s}
                        </button>
                      ))}
                      {(o.status === "paid" || o.status === "shipped") && (
                        <div className="flex gap-2 w-full mt-2">
                          <input
                            placeholder={o.tracking_number || "Tracking number"}
                            value={tracking[o.id] ?? ""}
                            onChange={(e) => setTracking({ ...tracking, [o.id]: e.target.value })}
                            className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-border/50 bg-background"
                          />
                          <button onClick={async () => {
                            const t = tracking[o.id]; if (!t) return;
                            const { error } = await supabase.from("orders").update({ tracking_number: t }).eq("id", o.id);
                            if (error) toast.error(error.message); else { toast.success("Tracking saved"); setOrders((l) => l.map((x) => x.id === o.id ? { ...x, tracking_number: t } : x)); }
                          }} className="text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground">Save</button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdersPanel;
