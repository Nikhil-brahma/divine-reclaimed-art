import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { customOrderSchema, OCCASIONS, type CustomOrderInput } from "@/lib/customOrder";
import { toast } from "sonner";

const empty: CustomOrderInput = { design: "", quantity: "", occasion: "", neededBy: "", name: "", email: "", phone: "", notes: "" };
const field = "w-full bg-card border border-border rounded-sm px-4 py-3 font-body text-foreground focus:outline-none focus:border-primary/50";
const label = "font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2 block";

const CustomOrder = () => {
  const [form, setForm] = useState<CustomOrderInput>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k: keyof CustomOrderInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = customOrderSchema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { errs[String(i.path[0])] ??= i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    setSending(true);
    const d = parsed.data;
    try {
      const { error } = await supabase.from("custom_order_requests").insert({
        design: d.design, quantity: d.quantity, occasion: d.occasion, needed_by: d.neededBy || null,
        name: d.name, email: d.email, phone: d.phone, notes: d.notes || null,
      });
      if (error) throw error;
      setDone(true);
      setForm(empty);
    } catch {
      toast.error("Could not send your request. Please try again or call 09220464425.");
    } finally {
      setSending(false);
    }
  };

  const err = (k: string) => errors[k] && <p className="text-destructive text-xs mt-1 font-body">{errors[k]}</p>;

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEOHead title="Custom & Bulk Potli Orders — Punarvsu" description="Request handcrafted custom or bulk potli bags from sacred temple vastra for weddings, shagun, pooja and corporate gifting." />
      <Navbar />
      <main className="container mx-auto px-6 pt-32 pb-24 max-w-2xl">
        <h1 className="font-display text-4xl md:text-6xl font-light text-foreground text-center mb-3">
          Custom <span className="italic text-gradient-gold">Order</span>
        </h1>
        <p className="font-body text-muted-foreground text-center mb-10">Tell us what you envision — our artisans will reply with design options and pricing.</p>
        {done ? (
          <div className="glass-card rounded-2xl p-10 text-center">
            <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="font-display text-2xl text-foreground mb-2">Request received</h2>
            <p className="font-body text-muted-foreground mb-6">Thank you. Your request has been saved for our team to review.</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button variant="outline" onClick={() => setDone(false)}>Send another</Button>
              <Button asChild><Link to="/">Back to home</Link></Button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="space-y-5">
            <div>
              <label htmlFor="co-design" className={label}>Preferred design</label>
              <textarea id="co-design" rows={4} maxLength={1000} value={form.design} onChange={set("design")} className={`${field} resize-none`} placeholder="Colours, fabric, size, motifs, embroidery, packaging…" />
              {err("design")}
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="co-qty" className={label}>Quantity</label>
                <input id="co-qty" type="number" min={1} max={100000} inputMode="numeric" value={form.quantity} onChange={set("quantity")} className={field} placeholder="e.g. 50" />
                {err("quantity")}
              </div>
              <div>
                <label htmlFor="co-occasion" className={label}>Occasion</label>
                <select id="co-occasion" value={form.occasion} onChange={set("occasion")} className={field}>
                  <option value="">Select occasion</option>
                  {OCCASIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
                {err("occasion")}
              </div>
            </div>
            <div>
              <label htmlFor="co-date" className={label}>Needed by (optional)</label>
              <input id="co-date" type="date" min={new Date().toISOString().slice(0, 10)} value={form.neededBy} onChange={set("neededBy")} className={field} />
              {err("neededBy")}
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="co-name" className={label}>Your name</label>
                <input id="co-name" maxLength={100} value={form.name} onChange={set("name")} className={field} autoComplete="name" />
                {err("name")}
              </div>
              <div>
                <label htmlFor="co-phone" className={label}>Phone / WhatsApp</label>
                <input id="co-phone" type="tel" maxLength={20} value={form.phone} onChange={set("phone")} className={field} autoComplete="tel" />
                {err("phone")}
              </div>
            </div>
            <div>
              <label htmlFor="co-email" className={label}>Email</label>
              <input id="co-email" type="email" maxLength={255} value={form.email} onChange={set("email")} className={field} autoComplete="email" />
              {err("email")}
            </div>
            <div>
              <label htmlFor="co-notes" className={label}>Anything else (optional)</label>
              <textarea id="co-notes" rows={3} maxLength={1000} value={form.notes} onChange={set("notes")} className={`${field} resize-none`} />
              {err("notes")}
            </div>
            <Button type="submit" disabled={sending} className="w-full h-auto whitespace-normal bg-gradient-saffron text-primary-foreground px-8 py-4 rounded-sm font-body text-sm tracking-[0.2em] uppercase shadow-sacred">
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {sending ? "Sending…" : "Request Custom Order"}
            </Button>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CustomOrder;