import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

declare global {
  interface Window { Razorpay?: any }
}

interface Props {
  amount: number; // in INR rupees
  productName: string;
  description?: string;
  buyer?: { name?: string; email?: string; contact?: string };
  notes?: Record<string, string>;
  className?: string;
  label?: string;
  onSuccess?: (payload: { paymentId: string; orderId: string }) => void;
}

const loadScript = (src: string) =>
  new Promise<boolean>((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

const RazorpayCheckout = ({ amount, productName, description, buyer, notes, className, label, onSuccess }: Props) => {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      const ok = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!ok) throw new Error("Could not load Razorpay");

      const { data, error } = await supabase.functions.invoke("razorpay-create-order", {
        body: { amount, currency: "INR", notes: { product: productName, ...(notes || {}) } },
      });
      if (error) throw error;
      if (!data?.order) throw new Error(data?.error || "Order failed");

      const rzp = new window.Razorpay({
        key: data.key_id,
        amount: data.order.amount,
        currency: data.order.currency,
        order_id: data.order.id,
        name: "Punarvsu",
        description: description || productName,
        image: "/favicon.ico",
        prefill: { name: buyer?.name || "", email: buyer?.email || "", contact: buyer?.contact || "" },
        theme: { color: "#c9a84c" },
        handler: async (response: any) => {
          const { data: vData, error: vErr } = await supabase.functions.invoke("razorpay-verify-payment", {
            body: response,
          });
          if (vErr || !vData?.verified) {
            toast.error("Payment verification failed");
            return;
          }
          toast.success("Payment received — blessings on their way");
          onSuccess?.({ paymentId: response.razorpay_payment_id, orderId: response.razorpay_order_id });
        },
        modal: { ondismiss: () => setLoading(false) },
      });
      rzp.on("payment.failed", (r: any) => toast.error(r?.error?.description || "Payment failed"));
      rzp.open();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      className={className || "inline-flex items-center gap-2 bg-primary text-primary-foreground font-body text-sm tracking-wider uppercase px-6 py-3 rounded-full hover:bg-primary/90 disabled:opacity-50"}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : null}
      {label || `Pay ₹${amount.toLocaleString("en-IN")}`}
    </button>
  );
};

export default RazorpayCheckout;
