import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ShieldCheck, Truck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useStoreCart } from "@/stores/storeCart";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

declare global { interface Window { Razorpay?: any } }

const SHIPPING_FREE_THRESHOLD = 1500;
const SHIPPING_FLAT = 99;

const loadRazorpay = () =>
  new Promise<boolean>((resolve) => {
    if (document.querySelector('script[src*="checkout.razorpay.com"]')) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

interface Props { open: boolean; onClose: () => void; }

const CheckoutDialog = ({ open, onClose }: Props) => {
  const navigate = useNavigate();
  const items = useStoreCart((s) => s.items);
  const subtotal = useStoreCart((s) => s.subtotal());
  const clear = useStoreCart((s) => s.clear);

  const shipping = subtotal >= SHIPPING_FREE_THRESHOLD ? 0 : SHIPPING_FLAT;
  const total = subtotal + shipping;

  const [user, setUser] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    full_name: "", email: "", phone: "",
    address_line1: "", address_line2: "", city: "", state: "", postal_code: "", country: "India",
    notes: "",
  });

  useEffect(() => {
    if (!open) return;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        setForm((f) => ({ ...f, email: user.email || "" }));
        const { data: p } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
        if (p) {
          setForm((f) => ({
            ...f,
            full_name: p.full_name || f.full_name,
            phone: p.phone || "",
            address_line1: p.address_line1 || "",
            address_line2: p.address_line2 || "",
            city: p.city || "",
            state: p.state || "",
            postal_code: p.postal_code || "",
            country: p.country || "India",
          }));
        }
      }
      setLoadingProfile(false);
    })();
  }, [open]);

  const validate = () => {
    const required = ["full_name", "email", "phone", "address_line1", "city", "state", "postal_code"];
    for (const k of required) if (!(form as any)[k]?.trim()) return `Please fill in ${k.replace("_", " ")}`;
    if (!/.+@.+\..+/.test(form.email)) return "Enter a valid email";
    if (form.phone.replace(/\D/g, "").length < 10) return "Enter a valid phone number";
    return null;
  };

  const handlePay = async () => {
    if (!user) { toast.error("Please sign in to place an order"); navigate("/auth"); return; }
    if (!items.length) return;
    const err = validate();
    if (err) { toast.error(err); return; }

    setSubmitting(true);
    try {
      const ok = await loadRazorpay();
      if (!ok) throw new Error("Could not load payment script");

      // Persist profile updates (best-effort)
      await supabase.from("profiles").upsert({
        id: user.id, full_name: form.full_name, phone: form.phone,
        address_line1: form.address_line1, address_line2: form.address_line2,
        city: form.city, state: form.state, postal_code: form.postal_code, country: form.country,
      });

      // Create local order in 'pending' state
      const shippingAddress = {
        line1: form.address_line1, line2: form.address_line2,
        city: form.city, state: form.state, postal_code: form.postal_code, country: form.country,
      };
      const { data: order, error: oErr } = await supabase.from("orders").insert({
        user_id: user.id,
        status: "pending",
        subtotal, shipping, total, currency: "INR",
        customer_name: form.full_name, customer_email: form.email, customer_phone: form.phone,
        shipping_address: shippingAddress, notes: form.notes || null,
      }).select().single();
      if (oErr) throw oErr;

      const lineItems = items.map((i) => ({
        order_id: order.id, product_id: i.productId, product_handle: i.handle,
        product_title: i.title, product_image: i.image,
        unit_price: i.price, quantity: i.quantity, line_total: i.price * i.quantity,
      }));
      await supabase.from("order_items").insert(lineItems);

      // Create Razorpay order via edge fn
      const { data: rzpData, error: rzpErr } = await supabase.functions.invoke("razorpay-create-order", {
        body: { amount: total, currency: "INR", notes: { order_number: order.order_number } },
      });
      if (rzpErr) throw rzpErr;
      if (!rzpData?.order) throw new Error(rzpData?.error || "Razorpay order failed");

      await supabase.from("orders").update({ razorpay_order_id: rzpData.order.id }).eq("id", order.id);

      const rzp = new window.Razorpay({
        key: rzpData.key_id,
        amount: rzpData.order.amount,
        currency: rzpData.order.currency,
        order_id: rzpData.order.id,
        name: "Punarvsu",
        description: `Order ${order.order_number}`,
        image: "/lovable-uploads/punarvasu-logo-new.png",
        prefill: { name: form.full_name, email: form.email, contact: form.phone },
        theme: { color: "#c9a84c" },
        handler: async (response: any) => {
          const { data: vData } = await supabase.functions.invoke("razorpay-verify-payment", { body: response });
          if (vData?.verified) {
            await supabase.from("orders").update({
              status: "paid", paid_at: new Date().toISOString(),
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }).eq("id", order.id);
            supabase.functions.invoke("send-order-confirmation", { body: { order_id: order.id } }).catch(() => {});
            toast.success("Payment received — blessings on their way 🪷");
            clear();
            onClose();
            navigate(`/account?order=${order.order_number}`);

          } else {
            toast.error("Payment verification failed. Contact support with your order number.");
          }
        },
        modal: { ondismiss: () => setSubmitting(false) },
      });
      rzp.on("payment.failed", (r: any) => toast.error(r?.error?.description || "Payment failed"));
      rzp.open();
    } catch (e: any) {
      toast.error(e.message || "Checkout failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Complete your order</DialogTitle>
          <DialogDescription className="font-body text-xs">
            {user ? "Confirm your shipping details and pay securely via Razorpay." : "Please sign in to continue."}
          </DialogDescription>
        </DialogHeader>

        {!user && !loadingProfile ? (
          <div className="py-6 text-center space-y-3">
            <p className="font-body text-sm text-muted-foreground">An account lets you track your sacred parcel.</p>
            <button onClick={() => { onClose(); navigate("/auth"); }}
                    className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-body text-xs tracking-wider uppercase">
              Sign in / Create account
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <Input placeholder="Full name *" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
              <Input placeholder="Email *" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <Input placeholder="Phone *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <Input placeholder="Postal code *" value={form.postal_code} onChange={(e) => setForm({ ...form, postal_code: e.target.value })} />
              <Input className="sm:col-span-2" placeholder="Address line 1 *" value={form.address_line1} onChange={(e) => setForm({ ...form, address_line1: e.target.value })} />
              <Input className="sm:col-span-2" placeholder="Address line 2 (optional)" value={form.address_line2} onChange={(e) => setForm({ ...form, address_line2: e.target.value })} />
              <Input placeholder="City *" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              <Input placeholder="State *" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
              <Input className="sm:col-span-2" placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
              <Textarea className="sm:col-span-2" placeholder="Notes for the artisan (optional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>

            <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur p-4 space-y-2 text-sm font-body">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{subtotal.toLocaleString("en-IN")}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "Free" : `₹${shipping}`}</span></div>
              <div className="flex justify-between font-display text-lg pt-2 border-t border-border/40"><span>Total</span><span>₹{total.toLocaleString("en-IN")}</span></div>
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground pt-1">
                <Truck size={11} /> {subtotal >= SHIPPING_FREE_THRESHOLD ? "Free shipping unlocked" : `Free shipping over ₹${SHIPPING_FREE_THRESHOLD}`}
              </div>
            </div>

            <button onClick={handlePay} disabled={submitting || !items.length}
                    className="w-full bg-gradient-saffron text-primary-foreground px-6 py-3.5 rounded-full font-body text-xs tracking-[0.2em] uppercase hover:opacity-90 transition-opacity disabled:opacity-50 inline-flex items-center justify-center gap-2 shadow-sacred">
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={14} />}
              {submitting ? "Processing…" : `Pay ₹${total.toLocaleString("en-IN")} securely`}
            </button>
            <p className="text-center text-[10px] text-muted-foreground">Secured by Razorpay · 100+ payment methods · UPI, cards, netbanking, wallets</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutDialog;
